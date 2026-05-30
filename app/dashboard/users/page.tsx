import { Metadata } from 'next';
import UsersClient from './users-client';
import { fetchUsersAction } from '../../lib/actions';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Kelola data pengguna sistem.',
};

export default async function UsersPage() {
  const res = await fetchUsersAction(true);
  const users = res.success && res.data ? res.data : [];

  return <UsersClient initialUsers={users as any[]} />;
}
