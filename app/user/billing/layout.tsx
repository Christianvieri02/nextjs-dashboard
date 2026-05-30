import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Invoices',
  description: 'View and download invoices and payments.',
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
