'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ================= INVOICE CRUD =================

export async function createInvoiceAction(
  customerId: string,
  amountInCents: number,
  status: 'paid' | 'pending',
  date: string,
) {
  try {
    const countResult = await sql`SELECT COUNT(*) FROM invoices_new`;
    let nextNum = Number(countResult[0].count) + 1;
    let invoiceNumber = `INV-${String(nextNum).padStart(3, '0')}`;

    // Avoid collision
    while (true) {
      const existing = await sql`SELECT id FROM invoices_new WHERE invoice_number = ${invoiceNumber}`;
      if (existing.length === 0) break;
      nextNum++;
      invoiceNumber = `INV-${String(nextNum).padStart(3, '0')}`;
    }

    const amountInDollars = amountInCents / 100;

    await sql`
      INSERT INTO invoices_new (invoice_number, user_id, amount, status, issued_date)
      VALUES (${invoiceNumber}, ${customerId}, ${amountInDollars}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create invoice:', error);
    return { success: false, error: error.message || 'Failed to create invoice.' };
  }
}

export async function updateInvoiceAction(
  id: string,
  customerId: string,
  amountInCents: number,
  status: 'paid' | 'pending',
  date: string,
) {
  try {
    const amountInDollars = amountInCents / 100;

    await sql`
      UPDATE invoices_new
      SET 
        user_id = ${customerId},
        amount = ${amountInDollars},
        status = ${status},
        issued_date = ${date}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update invoice:', error);
    return { success: false, error: error.message || 'Failed to update invoice.' };
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    await sql`
      DELETE FROM invoices_new
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete invoice:', error);
    return { success: false, error: error.message || 'Failed to delete invoice.' };
  }
}

// ================= VESSEL CRUD =================

export async function createVesselAction(
  vesselCode: string,
  name: string,
  type: 'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Cargo',
  captainName: string,
  status: 'En Route' | 'In Port' | 'Delayed' | 'Maintenance' | 'Active' | 'Inactive',
  originPort: string,
  destinationPort: string,
  eta: string,
  isActive: boolean
) {
  try {
    await sql.begin(async (sql: any) => {
      // Insert vessel
      const insertedVessel = await sql`
        INSERT INTO vessels (vessel_code, name, type, captain_name, status)
        VALUES (${vesselCode}, ${name}, ${type}, ${captainName}, ${status})
        RETURNING id
      `;
      const vesselId = insertedVessel[0].id;
      
      // Insert voyage
      await sql`
        INSERT INTO voyages (vessel_id, origin_port, destination_port, eta, is_active)
        VALUES (${vesselId}, ${originPort}, ${destinationPort}, ${eta}, ${isActive})
      `;
    });
    revalidatePath('/dashboard/fleet');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to create vessel:', err);
    return { success: false, error: err.message || 'Failed to create vessel.' };
  }
}

export async function updateVesselAction(
  id: string,
  vesselCode: string,
  name: string,
  type: 'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Cargo',
  captainName: string,
  status: 'En Route' | 'In Port' | 'Delayed' | 'Maintenance' | 'Active' | 'Inactive',
  originPort: string,
  destinationPort: string,
  eta: string,
  isActive: boolean
) {
  try {
    await sql.begin(async (sql: any) => {
      // Update vessel
      await sql`
        UPDATE vessels
        SET vessel_code = ${vesselCode}, name = ${name}, type = ${type}, captain_name = ${captainName}, status = ${status}
        WHERE id = ${id}
      `;
      
      // Update or insert voyage
      const existingVoyage = await sql`SELECT vessel_id FROM voyages WHERE vessel_id = ${id}`;
      if (existingVoyage.length > 0) {
        await sql`
          UPDATE voyages
          SET origin_port = ${originPort}, destination_port = ${destinationPort}, eta = ${eta}, is_active = ${isActive}
          WHERE vessel_id = ${id}
        `;
      } else {
        await sql`
          INSERT INTO voyages (vessel_id, origin_port, destination_port, eta, is_active)
          VALUES (${id}, ${originPort}, ${destinationPort}, ${eta}, ${isActive})
        `;
      }
    });
    revalidatePath('/dashboard/fleet');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Failed to update vessel:', err);
    return { success: false, error: err.message || 'Failed to update vessel.' };
  }
}

export async function deleteVesselAction(id: string) {
  try {
    await sql`
      DELETE FROM vessels
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/fleet');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Failed to delete vessel:', err);
    return { success: false, error: 'Failed to delete vessel.' };
  }
}

// ================= USER OPERATIONS =================

export async function trackShipmentAction(trackingNumber: string) {
  try {
    const shipments = await sql<any[]>`
      SELECT s.*, v.name as vessel_name, voy.origin_port, voy.destination_port
      FROM shipments s
      LEFT JOIN vessels v ON s.vessel_id = v.id
      LEFT JOIN voyages voy ON v.id = voy.vessel_id
      WHERE s.tracking_number = ${trackingNumber}
    `;

    if (shipments.length === 0) {
      return { success: false, error: 'Shipment not found' };
    }

    const steps = await sql<any[]>`
      SELECT status, location, step_date, completed, warning
      FROM shipment_steps_new
      WHERE shipment_id = ${shipments[0].id}
      ORDER BY step_order ASC
    `;

    const shipment = shipments[0];

    return {
      success: true,
      data: {
        status: shipment.status,
        origin: shipment.origin_port ? `${shipment.origin_port} Port, ID` : 'Origin Port',
        destination: shipment.destination_port ? `${shipment.destination_port} Port` : 'Destination Port',
        estArrival: shipment.est_arrival || 'TBD',
        vessel: shipment.vessel_name || 'TBD',
        steps: steps.map(step => ({
          status: step.status,
          location: step.location,
          date: step.step_date,
          completed: step.completed,
          warning: step.warning
        }))
      }
    };
  } catch (err) {
    console.error('Error tracking shipment:', err);
    return { success: false, error: 'Failed to track shipment' };
  }
}

export async function fetchUserInvoicesAction(userEmail: string) {
  try {
    // Find user by email
    const users = await sql`SELECT id FROM users WHERE email = ${userEmail}`;
    if (users.length === 0) {
      return { success: false, error: 'User not found' };
    }
    const userId = users[0].id;
    
    const invoices = await sql`
      SELECT * FROM invoices_new
      WHERE user_id = ${userId}
      ORDER BY issued_date DESC
    `;
    
    return {
      success: true,
      data: invoices.map(inv => ({
        id: inv.invoice_number,
        description: inv.description || 'Shipping invoice',
        date: new Date(inv.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `$${Number(inv.amount).toFixed(2)}`,
        status: inv.status === 'paid' ? 'Paid' : 'Pending',
        hasDownload: true
      }))
    };
  } catch (err) {
    console.error('Error fetching user invoices:', err);
    return { success: false, error: 'Failed to fetch invoices' };
  }
}

export async function fetchShippingRatesAction() {
  try {
    const rates = await sql`
      SELECT * FROM shipping_rates
      ORDER BY destination_city ASC
    `;
    return {
      success: true,
      data: rates.map(rate => ({
        name: rate.destination_city,
        country: rate.country,
        rate: Number(rate.rate_per_kg),
        delivery: `${rate.est_delivery_min_days} - ${rate.est_delivery_max_days} days`
      }))
    };
  } catch (err) {
    console.error('Error fetching shipping rates:', err);
    return { success: false, error: 'Failed to fetch shipping rates.' };
  }
}
