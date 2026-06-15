import { Metadata } from 'next';
import InvoicesClient from './invoices-client';
import { fetchAllInvoices, fetchCustomers } from '../../lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tagihan & Invoices',
  description: 'Kelola tagihan pelanggan.',
};

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([
    fetchAllInvoices(),
    fetchCustomers(),
  ]);

  return <InvoicesClient initialInvoices={invoices} customers={customers} />;
}
