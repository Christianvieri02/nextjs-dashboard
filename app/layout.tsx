import "./globals.css";
import Navbar from './ui/navbar';

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