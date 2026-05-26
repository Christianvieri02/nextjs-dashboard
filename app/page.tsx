import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col bg-[#05050A] text-white font-poppins selection:bg-[#D977F9]/30">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-32 px-16 flex flex-col items-center text-center overflow-hidden">
        
        {/* Latar belakang Grid halus agar terasa hi-tech */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#110C1D] via-[#05050A] to-[#05050A]"></div>

        {/* Tagline Atas: System Online */}
        <div className="relative z-10 mb-8 animate-bounce">
          <div className="border border-[#00E5FF]/50 bg-[#00E5FF]/10 px-4 py-1.5 rounded flex items-center gap-3">
            <span className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse shadow-[0_0_8px_#00E5FF]"></span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#00E5FF] uppercase">
              // SYSTEM ONLINE : GLOBAL FLEET ACTIVE
            </span>
          </div>
        </div>

        {/* Headline Utama */}
        <div className="relative z-10 mb-8">
          <h1 className="text-[100px] font-black leading-none tracking-tighter italic">
            NEXT-GEN
          </h1>
          <h1 className="text-[100px] font-black leading-none tracking-tighter text-[#D977F9] shadow-inner italic">
            LOGISTICS
          </h1>
        </div>

        {/* Deskripsi */}
        <p className="relative z-10 text-gray-400 text-sm max-w-xl leading-relaxed tracking-wide mb-12">
          Command the oceans with our high-tech fleet management and real-time cargo monitoring system. 
          Sea Parcel delivers the future of maritime freight.
        </p>

        {/* Gambar Utama (KAPAL KARGO) */}
        <div className="relative z-10 w-full max-w-5xl group">
          {/* Label Model di pojok gambar */}
          <div className="absolute -top-4 right-10 z-20 bg-[#151822] border border-gray-800 px-3 py-1 text-[9px] font-mono text-gray-400">
             // VESSEL CLASS: MEGALITH
          </div>
          
          <div className="rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(217,119,249,0.15)] transition-all duration-700 group-hover:shadow-[0_0_70px_rgba(0,229,255,0.15)]">
            {/* Link gambar sudah diganti dengan gambar kapal kontainer asli */}
            <img 
              src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2070&auto=format&fit=crop" 
              alt="Massive Cargo Ship" 
              className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="px-16 py-20 grid grid-cols-2 gap-20 max-w-7xl mx-auto">
        
        {/* Feature 1 */}
        <div className="flex gap-6">
          <div className="w-14 h-14 bg-[#151822] border border-gray-800 rounded flex items-center justify-center text-[#D977F9] text-2xl">
            🚢
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Autonomous Fleet</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our next-generation container ships are equipped with AI navigation and real-time structural monitoring, ensuring 99.9% uptime.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex gap-6">
          <div className="w-14 h-14 bg-[#151822] border border-gray-800 rounded flex items-center justify-center text-[#00E5FF] text-2xl">
            🛡️
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Quantum Security</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Military-grade encryption protects all cargo manifests and client data nodes against zero-day vulnerabilities.
            </p>
          </div>
        </div>

        {/* Feature 3 (Baris Baru) */}
        <div className="flex gap-6">
          <div className="w-14 h-14 bg-[#151822] border border-gray-800 rounded flex items-center justify-center text-[#D977F9] text-2xl">
            📡
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Global Uplink</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Persistent satellite constellation tracking provides second-by-second location updates for every container.
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATS BAR ================= */}
      <section className="px-16 py-12 border-t border-b border-gray-900 bg-[#0A0C12]">
        <div className="max-w-7xl mx-auto grid grid-cols-4 text-center">
          <div>
            <h4 className="text-3xl font-black text-white">99.9%</h4>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1">UPTIME</p>
          </div>
          <div>
            <h4 className="text-3xl font-black text-[#D977F9]">450+</h4>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1">VESSELS</p>
          </div>
          <div>
            <h4 className="text-3xl font-black text-white">12M</h4>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1">TONNAGE</p>
          </div>
          <div>
            <h4 className="text-3xl font-black text-[#00E5FF]">ZERO</h4>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] mt-1">DATA LOSS</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#05050A] pt-24 pb-12 px-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D977F9" strokeWidth="2">
                <path d="M4 14L6 18H18L20 14M4 14L2 10H22L20 14M4 14H20" />
                <path d="M7 10V6H17V10" />
                <path d="M10 6V4H14V6" />
              </svg>
              <span className="text-xl font-bold tracking-widest text-white">SEA PARCEL</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              © 2026 Sea Parcel Logistics. All Rights Reserved. Precise Maritime Navigation Systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.2em] text-white mb-6 uppercase">Quick Links</h5>
            <ul className="text-gray-500 text-xs space-y-4 font-medium">
              <li><Link href="/" className="hover:text-[#D977F9]">Home</Link></li>
              <li><Link href="/about" className="hover:text-[#D977F9]">About Us</Link></li>
              <li><Link href="/services" className="hover:text-[#D977F9]">Our Services</Link></li>
              <li><Link href="/contact" className="hover:text-[#D977F9]">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.2em] text-white mb-6 uppercase">Services</h5>
            <ul className="text-gray-500 text-xs space-y-4 font-medium">
              <li>Sea Parcel Economy</li>
              <li>Sea Parcel Standard</li>
              <li>Sea Parcel Heavy</li>
              <li>Sea Parcel Express</li>
              <li>Sea Parcel Premium</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-[10px] font-bold tracking-[0.2em] text-white mb-6 uppercase">Contact</h5>
            <ul className="text-gray-500 text-xs space-y-4 font-medium">
              <li className="flex gap-3">📍 <span>Pelabuhan Tanjung Priok, Jakarta Utara, Indonesia</span></li>
              <li className="flex gap-3">📞 <span>+62 21 455-7788</span></li>
              <li className="flex gap-3">📧 <span>info@seaparcel.id</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Slogan */}
        <div className="text-center border-t border-gray-900 pt-10">
           <p className="text-[9px] font-bold tracking-[0.5em] text-gray-700 uppercase">
             NAVIGATING THE FUTURE : MARITIME FREIGHT SYSTEM
           </p>
        </div>
      </footer>
    </main>
  );
}