'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ================= CRUD TAGIHAN / INVOICE =================

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

    // Hindari tabrakan nomor invoice
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

// ================= CRUD KAPAL / ARMADA =================

export async function createVesselAction(
  vesselCode: string,
  name: string,
  type: 'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Cargo',
  captainName: string,
  status: 'En Route' | 'In Port' | 'Delayed' | 'Maintenance' | 'Active' | 'Inactive',
  originPort: string,
  destinationPort: string,
  eta: string,
  isActive: boolean,
  capacityMuatan: string = '1000 Ton'
) {
  try {
    await sql.begin(async (sql: any) => {
      // Simpan data kapal baru
      const insertedVessel = await sql`
        INSERT INTO vessels (vessel_code, name, type, captain_name, status, capacity_muatan)
        VALUES (${vesselCode}, ${name}, ${type}, ${captainName}, ${status}, ${capacityMuatan})
        RETURNING id
      `;
      const vesselId = insertedVessel[0].id;
      
      // Simpan data pelayaran
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
  isActive: boolean,
  capacityMuatan: string = '1000 Ton'
) {
  try {
    await sql.begin(async (sql: any) => {
      // Perbarui data kapal
      await sql`
        UPDATE vessels
        SET vessel_code = ${vesselCode}, name = ${name}, type = ${type}, captain_name = ${captainName}, status = ${status}, capacity_muatan = ${capacityMuatan}
        WHERE id = ${id}
      `;
      
      // Perbarui atau simpan data pelayaran
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

// ================= OPERASI PENGGUNA =================

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
    // Cari pengguna berdasarkan email
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

export async function registerUserAction(fullName: string, email: string, phone: string, passwordPlain: string) {
  try {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // 1. Periksa apakah email pengguna sudah terdaftar di database
    const existing = await sql`SELECT id FROM users WHERE email = ${trimmedEmail}`;
    if (existing.length > 0) {
      return { success: false, error: 'Email sudah terdaftar.' };
    }

    // 2. Buat akun di sistem auth Supabase dengan konfirmasi email otomatis
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
      password: passwordPlain,
      email_confirm: true
    });

    if (authError) {
      console.error('Supabase Auth error during registration:', authError);
      return { success: false, error: authError.message };
    }

    // 3. Enkripsi password menggunakan bcrypt dan simpan data ke tabel pengguna
    const hashedPass = await bcrypt.hash(passwordPlain, 10);
    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: 'Gagal mendapatkan ID User dari sistem auth.' };
    }

    await sql`
      INSERT INTO users (id, full_name, email, password, phone)
      VALUES (${userId}, ${fullName}, ${trimmedEmail}, ${hashedPass}, ${trimmedPhone})
    `;

    await sql`
      INSERT INTO "user" (id, username, password, role, full_name, email, phone)
      VALUES (${userId}, ${trimmedEmail}, ${hashedPass}, 'User', ${fullName}, ${trimmedEmail}, ${trimmedPhone})
    `;

    return { success: true };
  } catch (error: any) {
    console.error('Failed to register user:', error);
    return { success: false, error: error.message || 'Gagal mendaftarkan akun.' };
  }
}

export async function loginUserAction(usernamePlain: string, passwordPlain: string, role: 'user' | 'admin') {
  try {
    const normalizedUsername = usernamePlain.trim().toLowerCase();
    const result = await sql`
      SELECT * FROM "user" 
      WHERE username = ${normalizedUsername} OR email = ${normalizedUsername}
    `;
    if (result.length === 0) {
      return { success: false, error: 'Akses ditolak! Periksa kembali kredensial Anda.' };
    }
    const user = result[0];
    const passwordMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!passwordMatch) {
      return { success: false, error: 'Akses ditolak! Periksa kembali kredensial Anda.' };
    }
    const normalizedRole = role.toLowerCase();
    const userRole = (user.role || '').toLowerCase();
    if (normalizedRole === 'admin') {
      if (userRole !== 'admin' && userRole !== 'supervisor' && userRole !== 'operator') {
        return { success: false, error: 'Akses ditolak! Akun Anda tidak memiliki role Admin/Supervisor/Operator.' };
      }
    } else {
      if (userRole !== 'user') {
        return { success: false, error: 'Silakan gunakan tab ADMIN untuk masuk ke sistem manajemen.' };
      }
    }
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        fullName: user.full_name || user.username,
        phone: user.phone || ''
      }
    };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan saat masuk.' };
  }
}

export async function fetchUsersAction(includeAdmin: boolean = true) {
  try {
    let users;
    if (includeAdmin) {
      users = await sql`
        SELECT id, full_name, email, phone, username, company_name, company_address, role, status 
        FROM "user" 
        ORDER BY full_name ASC
      `;
    } else {
      users = await sql`
        SELECT id, full_name, email, phone, username, company_name, company_address, role, status 
        FROM "user" 
        WHERE email != 'admin@seaparcel.com'
        ORDER BY full_name ASC
      `;
    }
    return { success: true, data: users };
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    return { success: false, error: error.message || 'Failed to fetch users.' };
  }
}

export async function fetchShipmentsAction() {
  try {
    const shipments = await sql`
      SELECT s.*, u.full_name as user_name, u.email as user_email
      FROM shipments s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `;
    return { success: true, data: shipments };
  } catch (error: any) {
    console.error('Failed to fetch shipments:', error);
    return { success: false, error: error.message || 'Failed to fetch shipments.' };
  }
}

export async function createShipmentAction(formData: {
  userId: string;
  senderName: string;
  receiverName: string;
  phone: string;
  originCity: string;
  destinationCity: string;
  itemType: string;
  weightKg: number;
  totalCost: number;
  vehicleType: string;
  shipmentType: string;
  status: string;
  description: string;
  shipmentDate: string;
  statusBarang?: string;
  statusTransaksi?: string;
}) {
  try {
    let trackingNumber = '';
    while (true) {
      const randNum = Math.floor(1000000000 + Math.random() * 9000000000);
      trackingNumber = `SP-${randNum}`;
      const existing = await sql`SELECT id FROM shipments WHERE tracking_number = ${trackingNumber}`;
      if (existing.length === 0) break;
    }

    const {
      userId,
      senderName,
      receiverName,
      phone,
      originCity,
      destinationCity,
      itemType,
      weightKg,
      totalCost,
      vehicleType,
      shipmentType,
      status,
      description,
      shipmentDate,
      statusBarang,
      statusTransaksi
    } = formData;

    await sql`
      INSERT INTO shipments (
        tracking_number,
        user_id,
        sender_name,
        receiver_name,
        phone,
        origin_city,
        destination_city,
        item_type,
        weight_kg,
        total_cost,
        vehicle_type,
        shipment_type,
        status,
        description,
        shipment_date,
        status_barang,
        status_transaksi
      ) VALUES (
        ${trackingNumber},
        ${userId},
        ${senderName},
        ${receiverName},
        ${phone},
        ${originCity},
        ${destinationCity},
        ${itemType},
        ${weightKg},
        ${totalCost},
        ${vehicleType},
        ${shipmentType},
        ${status || 'Diproses'},
        ${description},
        ${shipmentDate || new Date().toISOString().split('T')[0]},
        ${statusBarang || 'Diproses'},
        ${statusTransaksi || 'Diproses'}
      )
    `;

    const newShipment = await sql`SELECT id FROM shipments WHERE tracking_number = ${trackingNumber}`;
    const shipmentId = newShipment[0].id;
    
    await sql`
      INSERT INTO shipment_steps_new (shipment_id, status, location, step_date, completed, step_order)
      VALUES (
        ${shipmentId},
        ${status || 'Diproses'},
        ${originCity || 'Origin Port'},
        ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })},
        true,
        1
      )
    `;

    revalidatePath('/dashboard/shipments');
    return { success: true, trackingNumber };
  } catch (error: any) {
    console.error('Failed to create shipment:', error);
    return { success: false, error: error.message || 'Failed to create shipment.' };
  }
}

export async function updateShipmentStatusAction(id: string, status: string) {
  try {
    await sql`
      UPDATE shipments
      SET status = ${status}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/shipments');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update shipment status:', error);
    return { success: false, error: error.message || 'Failed to update status.' };
  }
}

export async function updateShipmentDetailsAction(
  id: string,
  data: {
    status: string;
    status_barang: string;
    status_transaksi: string;
    total_cost: number;
  }
) {
  try {
    await sql`
      UPDATE shipments
      SET 
        status = ${data.status},
        status_barang = ${data.status_barang},
        status_transaksi = ${data.status_transaksi},
        total_cost = ${data.total_cost}
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/shipments');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update shipment details:', error);
    return { success: false, error: error.message || 'Gagal memperbarui data pengiriman.' };
  }
}

export async function deleteShipmentAction(id: string) {
  try {
    await sql`
      DELETE FROM shipments
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/shipments');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete shipment:', error);
    return { success: false, error: error.message || 'Failed to delete shipment.' };
  }
}
