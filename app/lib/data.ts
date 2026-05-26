import postgres from 'postgres';
import {
  User,
  Vessel,
  ShippingRate,
  Shipment,
  Invoice,
  InvoicesTable,
  InvoiceForm,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ================= VESSEL QUERIES =================

export async function fetchVessels() {
  try {
    await delay(1500);
    const data = await sql<any[]>`
      SELECT 
        v.*,
        vs.origin_port,
        vs.destination_port,
        vs.eta,
        vs.is_active
      FROM vessels v
      LEFT JOIN voyages vs ON v.id = vs.vessel_id
      ORDER BY v.name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch vessels.');
  }
}

// ================= INVOICE QUERIES =================

export async function fetchLatestInvoices() {
  try {
    await delay(1500);
    const data = await sql<any[]>`
      SELECT invoices.amount, users.full_name AS name, users.email, invoices.id, invoices.invoice_number
      FROM invoices_new invoices
      JOIN users ON invoices.user_id = users.id
      ORDER BY invoices.issued_date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      image_url: '/customers/evil-rabbit.png', // fallback customer image
      amount: formatCurrency(Number(invoice.amount)),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    await delay(1500);
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices_new`;
    const vesselCountPromise = sql`SELECT COUNT(*) FROM vessels`;
    const invoiceStatusPromise = sql`
      SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
      FROM invoices_new invoices
    `;

    const data = await Promise.all([
      invoiceCountPromise,
      vesselCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfVessels = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(Number(data[2][0].paid ?? 0));
    const totalPendingInvoices = formatCurrency(Number(data[2][0].pending ?? 0));

    return {
      numberOfCustomers: numberOfVessels, // mapped to vessels for UI compatibility
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    await delay(1500);
    const data = await sql<any[]>`
      SELECT
        invoices.id,
        invoices.user_id AS customer_id,
        invoices.amount,
        invoices.issued_date AS date,
        invoices.status,
        invoices.invoice_number,
        invoices.description,
        users.full_name AS name,
        users.email
      FROM invoices_new invoices
      JOIN users ON invoices.user_id = users.id
      WHERE
        users.full_name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        invoices.invoice_number ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.issued_date::text ILIKE ${`%${query}%`} OR
        invoices.status::text ILIKE ${`%${query}%`}
      ORDER BY invoices.issued_date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const invoices = data.map((inv) => ({
      ...inv,
      image_url: '/customers/evil-rabbit.png', // fallback
    }));

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    await delay(1500);
    const data = await sql`
      SELECT COUNT(*)
      FROM invoices_new invoices
      JOIN users ON invoices.user_id = users.id
      WHERE
        users.full_name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        invoices.invoice_number ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.issued_date::text ILIKE ${`%${query}%`} OR
        invoices.status::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<any[]>`
      SELECT
        invoices.id,
        invoices.user_id AS customer_id,
        invoices.amount,
        invoices.status,
        invoices.invoice_number,
        invoices.shipment_id,
        invoices.description,
        invoices.issued_date
      FROM invoices_new invoices
      WHERE invoices.id = ${id};
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

// ================= USER QUERIES =================

export async function fetchUsers() {
  try {
    const usersList = await sql<User[]>`
      SELECT
          id,
          full_name AS name,
          email
        FROM users
        ORDER BY full_name ASC
    `;

    return usersList;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all users.');
  }
}

// Compatibility alias for old customer endpoints
export { fetchUsers as fetchCustomers };

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<any[]>`
      SELECT
        users.id,
        users.full_name AS name,
        users.email,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM users
      LEFT JOIN invoices_new invoices ON users.id = invoices.user_id
      WHERE
        users.full_name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`}
      GROUP BY users.id, users.full_name, users.email
      ORDER BY users.full_name ASC
    `;

    const formattedUsers = data.map((user) => ({
      ...user,
      image_url: '/customers/evil-rabbit.png', // fallback
      total_pending: formatCurrency(Number(user.total_pending)),
      total_paid: formatCurrency(Number(user.total_paid)),
    }));

    return formattedUsers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchAllInvoices() {
  try {
    await delay(1500);
    const data = await sql<any[]>`
      SELECT
        invoices.id,
        invoices.user_id AS customer_id,
        invoices.amount,
        invoices.issued_date AS date,
        invoices.status,
        invoices.invoice_number,
        invoices.description,
        users.full_name AS name,
        users.email
      FROM invoices_new invoices
      JOIN users ON invoices.user_id = users.id
      ORDER BY invoices.issued_date DESC
    `;

    const invoices = data.map((inv) => ({
      id: inv.id,
      customerId: inv.customer_id,
      customerName: inv.name.toUpperCase(),
      customerEmail: inv.email,
      customerImage: '/customers/evil-rabbit.png', // fallback
      amount: Math.round(Number(inv.amount) * 100), // convert to cents
      status: inv.status,
      date: new Date(inv.date).toISOString().split('T')[0],
      invoice_number: inv.invoice_number,
      description: inv.description,
    }));

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all invoices.');
  }
}
