'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Fleet', href: '/dashboard/fleet' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Map', href: '/dashboard/map' },
    { name: 'Invoices', href: '/dashboard/invoices' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0B0D14] text-white font-sans overflow-hidden">
      <header className="h-20 bg-[#06070C] border-b border-gray-900/60 px-8 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#D977F9] to-[#7C3AED] rounded-md flex items-center justify-center shadow-[0_0_12px_rgba(217,119,249,0.2)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14L6 18H18L20 14M4 14L2 10H22L20 14M4 14H20" />
              <path d="M7 10V6H17V10" />
              <path d="M10 6V4H14V6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-widest uppercase">Sea Parcel</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive = 
              link.href === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname.startsWith(link.href);

            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative flex items-center h-full text-xs font-semibold tracking-wider transition-colors hover:text-white px-1 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D977F9] rounded-full shadow-[0_0_8px_#D977F9]"></span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-6">
          <button className="relative p-1.5 text-gray-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              4
            </span>
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-gray-900">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Admin</p>
              <p className="text-xs text-white font-medium">Admin Access</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#171923] border border-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold hover:border-gray-700 cursor-pointer transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <Link 
            href="/login" 
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
            title="Sign Out"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-10 bg-[#0B0D14]">
        {children}
      </main>
    </div>
  );
}