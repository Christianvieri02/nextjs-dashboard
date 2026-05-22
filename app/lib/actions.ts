'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createInvoiceAction(
  customerId: string,
  amountInCents: number,
  status: 'paid' | 'pending',
  date: string,
) {
  try {
    const countResult = await sql`SELECT COUNT(*) FROM invoices`;
    let nextNum = Number(countResult[0].count) + 1;
    let invoiceNumber = `INV-${String(nextNum).padStart(3, '0')}`;

    // Avoid collision
    while (true) {
      const existing = await sql`SELECT id FROM invoices WHERE invoice_number = ${invoiceNumber}`;
      if (existing.length === 0) break;
      nextNum++;
      invoiceNumber = `INV-${String(nextNum).padStart(3, '0')}`;
    }

    const amountInDollars = amountInCents / 100;

    await sql`
      INSERT INTO invoices (invoice_number, user_id, amount, status, issued_date)
      VALUES (${invoiceNumber}, ${customerId}, ${amountInDollars}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return { success: false, error: 'Failed to create invoice.' };
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
      UPDATE invoices
      SET 
        user_id = ${customerId},
        amount = ${amountInDollars},
        status = ${status},
        issued_date = ${date}
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return { success: false, error: 'Failed to update invoice.' };
  }
}

export async function deleteInvoiceAction(id: string) {
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    return { success: false, error: 'Failed to delete invoice.' };
  }
}
