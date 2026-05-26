'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'Track Shipment',
      href: '/user',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
    },
    {
      name: 'Billing & Invoices',
      href: '/user/billing',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      name: 'Price Calculator',
      href: '/user/calculator',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="16" y1="14" x2="16" y2="18" />
          <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0B0D14] text-white font-sans overflow-hidden">
      <header className="h-16 bg-[#05050A] border-b border-gray-900 flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D977F9]/10 border border-[#D977F9]/30 flex items-center justify-center text-[#D977F9]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14L6 18H18L20 14M4 14L2 10H22L20 14M4 14H20" />
              <path d="M7 10V6H17V10" />
              <path d="M10 6V4H14V6" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-widest uppercase">Sea Parcel</span>
        </div>
        <nav className="flex items-center gap-1 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 h-full border-b-2 text-xs font-bold tracking-wide transition relative group ${
                  isActive
                    ? 'border-[#D977F9] text-[#D977F9]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
                {!isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D977F9]/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer group">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#05050A]">
              4
            </span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-900">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight">User</p>
              <p className="text-[9px] text-gray-500 font-medium">User Access</p>
            </div>
            <div className="w-8 h-8 bg-[#11131A] border border-gray-800 rounded-full flex items-center justify-center text-xs text-gray-400">
              👤
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
            title="Sign Out"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </Link>
        </div>

      </header>
      <main className="flex-1 overflow-y-auto bg-[#0B0D14]">
        {children}
      </main>
    </div>
  );
}