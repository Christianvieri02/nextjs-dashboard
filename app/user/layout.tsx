import { Metadata } from 'next';
import UserLayoutClient from './user-layout-client';

export const metadata: Metadata = {
  title: 'Pelacakan Kargo | Sea Parcel',
  description: 'Sea Parcel customer shipping portal.',
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserLayoutClient>{children}</UserLayoutClient>;
}