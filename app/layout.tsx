import { Metadata } from 'next';
import "./globals.css";
import Navbar from './ui/navbar';

export const metadata: Metadata = {
  title: {
    template: '%s | Sea Parcel',
    default: 'Sea Parcel - Express Shipping & Cargo Management',
  },
  description: 'Express shipping portal and cargo management system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}