import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="flex flex-col bg-[#05050A] text-white font-poppins min-h-screen selection:bg-[#D977F9]/30 relative">
      
      {/* Efek Cahaya Ungu Halus di Latar Belakang Atas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D977F9]/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-24 px-16 flex flex-col items-center text-center z-10">
        <p className="text-[#D977F9] text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
          CORE IDENTITY
        </p>
        <h1 className="text-[56px] md:text-[72px] font-black leading-[1.1] tracking-tighter uppercase">
          THE <span className="text-[#D977F9]">ARCHITECTS</span><br />
          OF GLOBAL TRADE
        </h1>
      </section>

      {/* ================= VISION & MISSION CARDS ================= */}
      <section className="px-16 pb-24 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Primary Vision Card */}
          <div className="bg-[#0A0C12]/80 border border-[#2C1935] p-12 rounded-xl relative overflow-hidden group hover:border-[#D977F9]/50 transition-colors duration-500">
            {/* Watermark Icon (Mata) */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="absolute -right-8 -top-8 w-64 h-64 text-[#D977F9] opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            
            <div className="relative z-10">
              <div className="text-[#D977F9] mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-widest uppercase mb-6 text-white">
                PRIMARY VISION
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                To construct a flawless, interconnected logistical matrix across the globe, utilizing cutting-edge AI and automation to eliminate supply chain inefficiencies entirely.
              </p>
            </div>
          </div>

          {/* Execution Mission Card */}
          <div className="bg-[#0A0C12]/80 border border-[#2C1935] p-12 rounded-xl relative overflow-hidden group hover:border-[#D977F9]/50 transition-colors duration-500">
            {/* Watermark Icon (Target) */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="absolute -right-8 -top-8 w-64 h-64 text-[#D977F9] opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
            </svg>
            
            <div className="relative z-10">
              <div className="text-[#D977F9] mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-widest uppercase mb-6 text-white">
                EXECUTION MISSION
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Deploy autonomous routing protocols and next-generation vessel frameworks to secure, transport, and verify cargo across international waters with zero data loss.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= INFRASTRUCTURAL BACKBONE ================= */}
      <section className="px-16 pt-16 pb-32 z-10">
        <div className="text-center mb-16">
          <h2 className="text-[28px] font-bold tracking-widest uppercase mb-3 text-white">
            INFRASTRUCTURAL BACKBONE
          </h2>
          <p className="text-[#D977F9] text-[10px] tracking-[0.2em] font-bold uppercase">
            POWERED BY ADVANCED NETWORK PROTOCOLS
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Item 1 */}
          <div className="bg-[#0A0C12]/80 border border-[#2C1935] p-8 rounded-xl hover:border-[#D977F9]/40 transition-colors group">
            <div className="text-[#D977F9] mb-6 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <h3 className="text-[13px] font-bold text-white tracking-widest mb-3">Data Synthesis</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Real-time ledger processing for all manifests.
            </p>
          </div>

          {/* Item 2 */}
          <div className="bg-[#0A0C12]/80 border border-[#2C1935] p-8 rounded-xl hover:border-[#D977F9]/40 transition-colors group">
            <div className="text-[#D977F9] mb-6 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
              </svg>
            </div>
            <h3 className="text-[13px] font-bold text-white tracking-widest mb-3">AI Routing</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Neural networks mapping out fuel-efficient paths.
            </p>
          </div>

          {/* Item 3 */}
          <div className="bg-[#0A0C12]/80 border border-[#2C1935] p-8 rounded-xl hover:border-[#D977F9]/40 transition-colors group">
            <div className="text-[#D977F9] mb-6 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="19" r="3"/><line x1="10.5" y1="7.5" x2="7.5" y2="16.5"/><line x1="13.5" y1="7.5" x2="16.5" y2="16.5"/><line x1="9" y1="19" x2="15" y2="19"/>
              </svg>
            </div>
            <h3 className="text-[13px] font-bold text-white tracking-widest mb-3">Mesh Network</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Satellite relay nodes keeping vessels connected.
            </p>
          </div>

          {/* Item 4 */}
          <div className="bg-[#0A0C12]/80 border border-[#2C1935] p-8 rounded-xl hover:border-[#D977F9]/40 transition-colors group">
            <div className="text-[#D977F9] mb-6 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="text-[13px] font-bold text-white tracking-widest mb-3">Human oversight</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Elite commanders monitoring autonomous operations.
            </p>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#05050A] pt-16 pb-12 px-16 border-t border-gray-900 z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D977F9" strokeWidth="2">
                <path d="M4 14L6 18H18L20 14M4 14L2 10H22L20 14M4 14H20" />
                <path d="M7 10V6H17V10" />
                <path d="M10 6V4H14V6" />
              </svg>
              <span className="text-lg font-bold tracking-widest text-white">SEA PARCEL</span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed mb-4">
              © 2026 Sea Parcel. All rights reserved.
            </p>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              PrimeLog Fleet System
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-[11px] font-bold tracking-widest text-white mb-6 uppercase">QUICK LINKS</h5>
            <ul className="text-gray-500 text-[11px] space-y-4">
              <li><Link href="/" className="hover:text-[#D977F9] transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#D977F9] transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-[#D977F9] transition-colors">Our Services</Link></li>
              <li><Link href="/contact" className="hover:text-[#D977F9] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-[11px] font-bold tracking-widest text-white mb-6 uppercase">SERVICES</h5>
            <ul className="text-gray-500 text-[11px] space-y-4">
              <li>Sea Parcel Economy</li>
              <li>Sea Parcel Standard</li>
              <li>Sea Parcel Heavy</li>
              <li>Sea Parcel Express</li>
              <li>Sea Parcel Premium</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-[11px] font-bold tracking-widest text-white mb-6 uppercase">CONTACT</h5>
            <ul className="text-gray-500 text-[11px] space-y-4">
              <li className="flex gap-3">
                <span className="text-[#D977F9]">📍</span> 
                <span>Pelabuhan Tanjung Priok,<br/>Jakarta Utara, Indonesia</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D977F9]">📞</span> 
                <span>+62 21 4366-7890</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#D977F9]">📧</span> 
                <span>info@seaparcel.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="text-center pt-8">
           <p className="text-[9px] font-bold tracking-[0.3em] text-gray-700 uppercase">
             NAVIGATING THE FUTURE - PRIMELOG FLEET SYSTEM
           </p>
        </div>
      </footer>
    </main>
  );
}