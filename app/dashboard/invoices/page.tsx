import InvoicesClient from './invoices-client';
import { fetchAllInvoices, fetchCustomers } from '../../lib/data';

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([
    fetchAllInvoices(),
    fetchCustomers(),
  ]);

  return <InvoicesClient initialInvoices={invoices} customers={customers} />;
}
