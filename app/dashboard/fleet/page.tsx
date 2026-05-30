import { Metadata } from 'next';
import { fetchVessels } from '../../lib/data';
import FleetClient from './fleet-client';

export const metadata: Metadata = {
  title: 'Fleet Management',
  description: 'Kelola armada kapal kargo.',
};

export default async function FleetManagement() {
  const vessels = await fetchVessels();

  return <FleetClient initialVessels={vessels as any} />;
}