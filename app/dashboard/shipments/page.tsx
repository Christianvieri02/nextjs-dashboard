import { Metadata } from 'next';
import { fetchUsersAction } from '../../lib/actions';
import postgres from 'postgres';
import ShipmentsClient from './shipments-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pengiriman Cargo',
  description: 'Kelola data pengiriman kargo.',
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function ShipmentsPage() {
  const usersRes = await fetchUsersAction(true);
  const users = usersRes.success && usersRes.data ? usersRes.data.map((u: any) => ({
    id: u.id,
    name: u.full_name,
    email: u.email
  })) : [];
  
  // Fetch shipments
  const shipments = await sql`
    SELECT s.*, u.full_name as user_name, u.email as user_email
    FROM shipments s
    JOIN "user" u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `;

  return <ShipmentsClient initialShipments={shipments as any} users={users as any} />;
}
