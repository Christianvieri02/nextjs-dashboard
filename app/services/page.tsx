import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      id: 'S-01',
      title: 'Ocean Freight Matrix',
      description: 'End-to-end maritime transportation utilizing automated vessels and dynamic weather-routing algorithms.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" /><path d="M12 12v-6" /><path d="M8 6h8" />
        </svg>
      )
    },
    {
      id: 'S-02',
      title: 'Bulk Container Protocol',
      description: 'Massive capacity load balancing for industrial-scale cargo, protected by reinforced titanium casing.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: 'S-03',
      title: 'High-Value Escort',
      description: 'Classified transport for sensitive materials with constant armed drone surveillance and geofencing.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      id: 'S-04',
      title: 'Express Node Transfer',
      description: 'Priority docking and expedited processing at all global ports for critical time-sensitive shipments.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      id: 'S-05',
      title: 'Air/Sea Uplink',
      description: 'Seamless handover between oceanic vessels and aerial cargo transports for true global reach.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1 2.5L10 13l-4 4-3-1-2 2 5 2 2 5 2-2-1-3 4-4 3.8 7.3c.3.2.7.2 1.1-.1l2.5-1c.4-.2.6-.6.5-1.1z" />
        </svg>
      )
    },
    {
      id: 'S-06',
      title: 'Predictive Tracking',
      description: 'Provide clients with precise ETA calculations based on multi-variable AI climate and traffic models.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    }
  ];

  return (
    <main className="flex flex-col bg-[#05050A] text-white font-poppins min-h-screen selection:bg-[#D977F9]/30">
      
      {/* ================= HEADER SECTION ================= */}
      <section className="px-16 pt-24 pb-16 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-[56px] font-black leading-[1.1] tracking-tighter uppercase mb-4">
            OPERATIONAL<br />
            <span className="text-[#D977F9]">SERVICES</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Access our suite of advanced logistics protocols. All systems are currently online and ready for deployment.
          </p>
        </div>

        {/* Network Status Badge */}
        <div className="flex flex-col items-end">
          <p className="text-[#D977F9] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
            NETWORK STATUS
          </p>
          <div className="border border-gray-800 bg-[#0A0C12] px-4 py-2 flex items-center gap-3 rounded-md">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span className="text-xs font-bold text-gray-300 tracking-wider">All Nodes Optimal</span>
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-[#0A0C12]/80 border border-[#2C1935] p-10 flex flex-col group hover:border-[#D977F9]/50 transition-colors duration-500 rounded-lg relative overflow-hidden"
            >
              {/* Header Card (Icon & Badge) */}
              <div className="flex justify-between items-start mb-10">
                <div className="text-[#D977F9] group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                <div className="bg-[#11131A] border border-gray-800 px-2 py-1 rounded text-[9px] font-bold text-gray-500 tracking-widest">
                  {service.id}
                </div>
              </div>

              {/* Content Card */}
              <div>
                <h3 className="text-lg font-bold tracking-widest mb-4 text-white">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Subtle Gradient Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D977F9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#05050A] pt-16 pb-12 px-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12 mb-16">
          
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