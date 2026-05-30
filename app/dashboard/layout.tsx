import { Metadata } from 'next';
import DashboardLayoutClient from './dashboard-layout-client';

export const metadata: Metadata = {
  title: 'Dashboard Overview | Sea Parcel',
  description: 'Sea Parcel dashboard management portal.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}