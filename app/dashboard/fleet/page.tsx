export const dynamic = 'force-dynamic';

import { fetchVessels } from '../../lib/data';
import FleetClient from './fleet-client';

export default async function FleetManagement() {
  const vessels = await fetchVessels();

  return <FleetClient initialVessels={vessels as any} />;
}