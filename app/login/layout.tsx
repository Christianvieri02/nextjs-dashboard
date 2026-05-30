import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to the Sea Parcel express shipping portal.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
