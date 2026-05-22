import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col pb-20 bg-[#0B0D14]">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[650px] flex items-center px-16 overflow-hidden">
        
        {/* Gambar Latar Belakang (Menggunakan metode yang sama dengan halaman About Us) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=2070')] bg-cover bg-center opacity-50 mix-blend-luminosity"></div>
        
        {/* Gradasi Hitam untuk teks */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14] via-[#0B0D14]/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent z-10"></div>
        
        {/* Teks Hero */}
        <div className="relative z-20 max-w-2xl mt-12">
          <h1 className="text-[56px] font-extrabold text-white leading-[1.1] mb-1">
            Sea Parcel:
          </h1>
          <h1 className="text-[56px] font-extrabold text-[#D977F9] leading-[1.1] mb-6">
            Delivering the World
          </h1>
          <p className="text-gray-400 text-[13px] leading-relaxed max-w-[480px] mb-10">
            Navigating the technological deep-sea. We blend high-precision logistics with oceanic authority to ensure your cargo arrives with unparalleled accuracy.
          </p>
          <div className="flex space-x-4">
            <button className="bg-[#D977F9] text-[#1D0C24] px-7 py-3 text-sm font-bold rounded hover:bg-[#cf62f2] transition shadow-lg shadow-[#D977F9]/20">
              Get Started Today
            </button>
            <button className="border border-gray-600 text-white px-7 py-3 text-sm font-bold rounded hover:bg-white/10 transition flex items-center gap-2">
              Explore Us <span className="font-normal">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="px-16 grid grid-cols-3 gap-6 relative z-30 -mt-24">
        
        <div className="bg-[#151822] p-8 border border-gray-800/80 rounded flex flex-col justify-center shadow-2xl">
          <svg className="w-6 h-6 text-[#D977F9] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
          </svg>
          <h3 className="text-[32px] font-bold text-white mb-1">150+</h3>
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.15em] uppercase">Ports Reached</p>
        </div>

        <div className="bg-[#151822] p-8 border border-gray-800/80 rounded flex flex-col justify-center shadow-2xl">
          <svg className="w-6 h-6 text-[#D977F9] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h3 className="text-[32px] font-bold text-white mb-1">12M+</h3>
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.15em] uppercase">Tons Cargo Volume</p>
        </div>

        <div className="bg-[#151822] p-8 border border-gray-800/80 rounded flex flex-col justify-center shadow-2xl">
          <svg className="w-6 h-6 text-[#D977F9] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path><path d="M12 12v-6"></path><path d="M8 6h8"></path>
          </svg>
          <h3 className="text-[32px] font-bold text-white mb-1">320</h3>
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.15em] uppercase">Active Vessels</p>
        </div>

      </section>

      {/* ================= GLOBAL CARGO OPERATIONS ================= */}
      <section className="px-16 py-24">
        
        <div className="mb-12">
          <h2 className="text-[36px] font-bold text-white leading-none mb-1">Global Cargo</h2>
          <h2 className="text-[36px] font-bold text-[#D977F9] leading-none mb-6">Operations</h2>
          <div className="flex justify-between items-end">
            <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
              Precision engineering meets deep-sea logistics. Our operational framework is designed for maximum efficiency and global scale.
            </p>
            <Link href="/services" className="text-[#D977F9] text-xs font-bold tracking-wider hover:text-white transition flex items-center gap-2">
              View All Operations ↗
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          
          {/* Card Kiri: Gambar Freight */}
          <div className="relative h-[340px] bg-[#151822] rounded flex flex-col justify-end p-8 overflow-hidden group border border-gray-800/80">
            {/* Background Image CSS */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070')] bg-cover bg-center grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#151822] via-[#151822]/80 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="w-10 h-10 bg-[#2C1935] rounded flex items-center justify-center mb-5 text-[#D977F9]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1 2.5L10 13l-4 4-3-1-2 2 5 2 2 5 2-2-1-3 4-4 3.8 7.3c.3.2.7.2 1.1-.1l2.5-1c.4-.2.6-.6.5-1.1z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Global Freight Forwarding</h4>
              <p className="text-gray-400 text-sm mb-8 max-w-md leading-relaxed">
                Seamless integration across air, sea, and land. We coordinate complex logistical ballets with data-driven precision.
              </p>
              <span className="text-[#6B7280] text-[10px] font-bold tracking-[0.2em] uppercase group-hover:text-white transition">
                Explore Protocol
              </span>
            </div>
          </div>

          {/* Card Kanan: Gambar Bulk Cargo */}
          <div className="relative h-[340px] bg-[#151822] rounded flex flex-col justify-end p-8 overflow-hidden group border border-gray-800/80">
             {/* Background Image CSS */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7a?q=80&w=2070')] bg-cover bg-center grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#151822] via-[#151822]/80 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="w-10 h-10 bg-[#2C1935] rounded flex items-center justify-center mb-5 text-[#D977F9]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4v4h-4z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Bulk Cargo Handling</h4>
              <p className="text-gray-400 text-sm mb-8 max-w-md leading-relaxed">
                Heavy-duty operations require heavy-duty technology. Automated systems ensure rapid loading and unloading times.
              </p>
              <span className="text-[#6B7280] text-[10px] font-bold tracking-[0.2em] uppercase group-hover:text-white transition">
                Explore Protocol
              </span>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}