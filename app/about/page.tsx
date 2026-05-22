export default function About() {
  return (
    <div className="flex flex-col pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[450px] flex items-center px-12 overflow-hidden border-b border-gray-900">
        {/* Placeholder untuk background gambar kapal */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2070')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/90 to-transparent z-10"></div>
        
        <div className="relative z-20 max-w-3xl mt-10">
          <h1 className="text-5xl font-bold mb-4 tracking-wide uppercase text-white">
            Bridging the Oceans
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xl">
            We engineer the logistics of tomorrow. Sea Parcel isn't just a shipping company; it's a global nervous system of maritime telemetry, heavy lifting, and unyielding precision.
          </p>
          <button className="bg-[#11131A] border border-gray-700 text-white text-[10px] font-bold tracking-[0.2em] px-6 py-3 rounded hover:bg-gray-800 transition flex items-center gap-3">
            EXPLORE OUR FLEET <span className="text-[#00E5FF] text-lg leading-none">→</span>
          </button>
        </div>
      </section>

      {/* 2. Vision & Operations Cards */}
      <section className="px-12 py-16 grid grid-cols-2 gap-8 relative z-30 -mt-10">
        {/* Our Vision Card */}
        <div className="bg-[#11131A] p-10 border-l-[3px] border-[#D977F9] rounded shadow-2xl relative overflow-hidden group hover:border-[#e99bff] transition-colors">
          <div className="mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D977F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            To redefine oceanic freight through data-driven navigation and industrial-scale efficiency. We see the ocean not as a barrier, but as the ultimate conduit for global progress, navigated with the sharpest technological tools available.
          </p>
        </div>

        {/* Global Operations Card */}
        <div className="bg-[#11131A] p-10 rounded shadow-2xl relative overflow-hidden">
          <div className="mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Global Operations</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-8">
            Operating across 150+ international ports, our operations center orchestrates a symphony of heavy cargo movements 24/7. Precision scheduling meets sheer mechanical power.
          </p>
          <button className="text-[#00E5FF] text-[10px] font-bold tracking-[0.1em] hover:underline flex items-center gap-2">
            View Port Network <span className="text-lg leading-none">↗</span>
          </button>
        </div>
      </section>

      {/* 3. Telemetry / Numbers That Deliver */}
      <section className="px-12 py-16 text-center">
        <h5 className="text-[#00E5FF] text-[9px] font-bold tracking-[0.3em] uppercase mb-3">Telemetry</h5>
        <h2 className="text-3xl font-bold tracking-widest uppercase mb-12">Numbers That Deliver</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {[
            { value: '320+', label: 'ACTIVE VESSELS' },
            { value: '12M+', label: 'TONS DELIVERED' },
            { value: '150+', label: 'GLOBAL PORTS' },
            { value: '24/7', label: 'FREIGHT OPS' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#11131A] py-12 px-6 rounded border border-gray-800 shadow-lg">
              <h3 className="text-4xl font-bold text-[#D977F9] mb-3">{stat.value}</h3>
              <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Heavy Logistics Core */}
      <section className="px-12 py-10">
        <h2 className="text-2xl font-bold mb-2">Heavy Logistics Core</h2>
        <p className="text-gray-400 text-xs mb-8">The pillars of our oceanic infrastructure.</p>

        {/* 2 Image Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="relative h-[250px] bg-gray-800 rounded overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7a?q=80&w=2070')] bg-cover bg-center grayscale mix-blend-multiply opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/60 to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-8">
              <h4 className="text-lg font-bold mb-2">Mega-Vessel Capacity</h4>
              <p className="text-xs text-gray-400">Our fleet handles the largest structural loads on the open water.</p>
            </div>
          </div>

          <div className="relative h-[250px] bg-gray-800 rounded overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507206130118-b5907f817163?q=80&w=2070')] bg-cover bg-center grayscale mix-blend-multiply opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/60 to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
              <div>
                <h4 className="text-lg font-bold mb-2">Industrial Scale</h4>
                <p className="text-xs text-gray-400">Infrastructure built to scale with global demands seamlessly.</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1A1A24] border border-[#D977F9] flex items-center justify-center text-[#D977F9]">
                ↓
              </div>
            </div>
          </div>
        </div>

        {/* Secure Handling Protocol */}
        <div className="bg-[#11131A] p-10 rounded border border-gray-800 relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10 max-w-xl">
            <h4 className="text-xl font-bold mb-3">Secure Handling Protocol</h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Every parcel, from raw materials to high-tech components, is monitored via advanced telemetry, ensuring secure transit from dock to destination.
            </p>
            <button className="text-[#00E5FF] text-[10px] font-bold tracking-[0.1em] hover:underline flex items-center gap-2">
              Read Security Specs <span className="text-lg leading-none">↗</span>
            </button>
          </div>
          {/* Watermark Icon */}
          <div className="absolute right-[-20px] bottom-[-40px] opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
          </div>
        </div>
      </section>

    </div>
  );
}