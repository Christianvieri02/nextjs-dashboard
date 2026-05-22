'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname(); 

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/about' },
    { name: 'OUR SERVICES', href: '/services' },
    { name: 'CONTACT US', href: '/contact' },
  ];

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/user')
  ) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-16 py-5 bg-[#05050A] border-b border-gray-800/80 sticky top-0 z-50">
      
      <div className="flex items-center space-x-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D977F9]">
          <path d="M4 14L6 18H18L20 14M4 14L2 10H22L20 14M4 14H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 10V6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 6V4H14V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 21C2 21 3.5 19.5 6 19.5C8.5 19.5 10 21 12 21C14 21 15.5 19.5 18 19.5C20.5 19.5 22 21 22 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-xl font-bold tracking-widest text-white">SEA PARCEL</span>
      </div>

      <div className="flex space-x-10 text-xs font-semibold tracking-wide">
        {navLinks.map((link) => {
          const isActive = pathname === link.href; 
          return (
            <Link key={link.name} href={link.href} className={`pb-1 border-b-2 transition-all duration-300 ease-in-out ${isActive ? 'text-[#D977F9] border-[#D977F9]' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'}`}>
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Ini perubahannya: Mengubah <button> menjadi <Link> */}
      <Link href="/login" className="bg-[#D977F9] text-[#250F2D] px-8 py-2.5 text-xs font-bold rounded hover:bg-[#c75be9] hover:shadow-[0_0_15px_rgba(217,119,249,0.3)] transition-all duration-300 active:scale-95">
        LOGIN
      </Link>
      
    </nav>
  );
}