'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { fetchUsersAction } from '../lib/actions';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [adminName, setAdminName] = useState<string>('Admin');

  // Fetch users for the invoices mega menu
  useEffect(() => {
    async function loadUsers() {
      const res = await fetchUsersAction();
      if (res.success && res.data) {
        setUsers(res.data as any as User[]);
      }
    }
    loadUsers();

    try {
      const sessionStr = localStorage.getItem('user_session');
      if (!sessionStr) {
        router.push('/login');
        return;
      }
      const sess = JSON.parse(sessionStr);
      const role = (sess.role || '').toLowerCase();
      if (role !== 'admin' && role !== 'supervisor' && role !== 'operator') {
        router.push('/user'); // Redirect normal user to tracking portal
        return;
      }
      setAdminName(sess.fullName || sess.username || 'Admin');
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  }, [pathname, router]);

  return (
    <div className="flex flex-col h-screen bg-[#0B0D14] text-white font-sans overflow-hidden">
      <header className="h-20 bg-[#06070C] border-b border-gray-900/60 px-8 flex items-center justify-between z-50 shrink-0">
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
        
        {/* Navigation Bar with Hoverable Mega Menus */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          
          {/* 1. HOME DROPDOWN */}
          <div className="relative h-full flex items-center group">
            <button 
              suppressHydrationWarning
              className={`relative flex items-center gap-1.5 h-full text-xs font-semibold tracking-wider transition-colors hover:text-white px-1 ${
                pathname === '/dashboard' || pathname.startsWith('/dashboard/shipments') || pathname.startsWith('/dashboard/analytics') || pathname.startsWith('/dashboard/map') ? 'text-white' : 'text-gray-400'
              }`}
            >
              Home
              <svg className="w-3 h-3 text-gray-500 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              {(pathname === '/dashboard' || pathname.startsWith('/dashboard/shipments') || pathname.startsWith('/dashboard/analytics') || pathname.startsWith('/dashboard/map')) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D977F9] rounded-full shadow-[0_0_8px_#D977F9]"></span>
              )}
            </button>
            
            {/* Dropdown Card */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[280px] bg-[#121622]/98 border border-gray-800/80 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] p-2.5 hidden group-hover:block z-50 border-t-2 border-t-[#D977F9] backdrop-blur-md">
              <div className="space-y-0.5">
                <Link href="/dashboard" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#D977F9] group-hover/item:bg-[#D977F9]/10 group-hover/item:border-[#D977F9]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v12a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18V6z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#D977F9] transition-colors">Overview</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Statistik armada & ringkasan operasional</p>
                  </div>
                </Link>

                <Link href="/dashboard/shipments" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#D977F9] group-hover/item:bg-[#D977F9]/10 group-hover/item:border-[#D977F9]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#D977F9] transition-colors">Pengiriman</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Kelola kargo baru & manifest status</p>
                  </div>
                </Link>

                <Link href="/dashboard/analytics" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#D977F9] group-hover/item:bg-[#D977F9]/10 group-hover/item:border-[#D977F9]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#D977F9] transition-colors">Analitik</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Grafik pendapatan & performa kontainer</p>
                  </div>
                </Link>

                <Link href="/dashboard/map" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#D977F9] group-hover/item:bg-[#D977F9]/10 group-hover/item:border-[#D977F9]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.446l-6.002-3.001a1.125 1.125 0 00-1.006 0L3.003 19.5a.75.75 0 01-1.003-.689V5.625c0-.29.172-.556.44-.67l6.002-3.001a1.125 1.125 0 011.006 0l6.002 3.001a1.125 1.125 0 001.006 0l3.003-1.5a.75.75 0 011.003.689v13.186c0 .29-.172.556-.44.67l-6.002 3.001a1.125 1.125 0 01-1.006 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#D977F9] transition-colors">Live Map</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Pemantauan lokasi kapal real-time</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. FLEET DROPDOWN */}
          <div className="relative h-full flex items-center group">
            <button 
              suppressHydrationWarning
              className={`relative flex items-center gap-1.5 h-full text-xs font-semibold tracking-wider transition-colors hover:text-white px-1 ${
                pathname.startsWith('/dashboard/fleet') ? 'text-white' : 'text-gray-400'
              }`}
            >
              Fleet
              <svg className="w-3 h-3 text-gray-500 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              {pathname.startsWith('/dashboard/fleet') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E5FF] rounded-full shadow-[0_0_8px_#00E5FF]"></span>
              )}
            </button>
            
            {/* Dropdown Card */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[280px] bg-[#121622]/98 border border-gray-800/80 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] p-2.5 hidden group-hover:block z-50 border-t-2 border-t-[#00E5FF] backdrop-blur-md">
              <div className="space-y-0.5">
                <Link href="/dashboard/fleet" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#00E5FF] group-hover/item:bg-[#00E5FF]/10 group-hover/item:border-[#00E5FF]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 7.5h.008v.008h-.008V7.5zm0 2.25h.008v.008h-.008V9.75zm0 2.25h.008v.008h-.008V12zm0 2.25h.008v.008h-.008v-.008zm-5.25-6h.008v.008H7.5V8.25zm0 2.25h.008v.008H7.5V10.5zm0 2.25h.008v.008H7.5V12.75zM3 21h18M3 21V10.5a1.5 1.5 0 011.5-1.5h3.75" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#00E5FF] transition-colors">Armada Kapal</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Registrasi & status aktif kapal kargo</p>
                  </div>
                </Link>

                <Link href="/dashboard/map" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#00E5FF] group-hover/item:bg-[#00E5FF]/10 group-hover/item:border-[#00E5FF]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#00E5FF] transition-colors">Pelacakan Rute</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Pantau rute pelayaran aktif & ETA</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. INVOICES DROPDOWN (Includes billing invoice and Kelola Pengguna links) */}
          <div className="relative h-full flex items-center group">
            <button 
              suppressHydrationWarning
              className={`relative flex items-center gap-1.5 h-full text-xs font-semibold tracking-wider transition-colors hover:text-white px-1 ${
                pathname.startsWith('/dashboard/invoices') || pathname.startsWith('/dashboard/users') ? 'text-white' : 'text-gray-400'
              }`}
            >
              Invoices
              <svg className="w-3 h-3 text-gray-500 group-hover:text-white transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              {(pathname.startsWith('/dashboard/invoices') || pathname.startsWith('/dashboard/users')) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5CF6] rounded-full shadow-[0_0_8px_#8B5CF6]"></span>
              )}
            </button>
            
            {/* Dropdown Card */}
            <div className="absolute top-[80%] right-0 w-[280px] bg-[#121622]/98 border border-gray-800/80 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] p-2.5 hidden group-hover:block z-50 border-t-2 border-t-[#8B5CF6] backdrop-blur-md">
              <div className="space-y-0.5">
                <Link href="/dashboard/invoices" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#8B5CF6] group-hover/item:bg-[#8B5CF6]/10 group-hover/item:border-[#8B5CF6]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#8B5CF6] transition-colors">Invoice</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Kelola tagihan & status pembayaran</p>
                  </div>
                </Link>

                <Link href="/dashboard/users" className="flex items-center gap-3.5 hover:bg-[#1E2335] p-2.5 rounded-lg transition-all duration-200 group/item text-left">
                  <div className="w-8 h-8 rounded-lg bg-[#181D2E] border border-gray-800 flex items-center justify-center text-[#8B5CF6] group-hover/item:bg-[#8B5CF6]/10 group-hover/item:border-[#8B5CF6]/30 transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white group-hover/item:text-[#8B5CF6] transition-colors">Users</div>
                    <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed truncate">Manajemen akun pengguna sistem</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </nav>

        {/* User Info Bar */}
        <div className="flex items-center gap-6">
          <button 
            suppressHydrationWarning
            className="relative p-1.5 text-gray-400 hover:text-white transition-colors"
          >
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
              <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">{adminName}</p>
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
