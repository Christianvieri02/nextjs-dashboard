export default function Contact() {
  const contacts = [
    { name: 'Vrenzhen', role: 'HEAD OF OPERATIONS', phone: '+62 821-8408-4455', email: 'vrenzhen@seaparcel.id' },
    { name: 'Chrsitian', role: 'SYSTEMS INTEGRATOR', phone: '+62 812-2899-5056', email: 'vieri@seaparcel.id' },
    { name: 'Jonathan', role: 'SYSTEMS INTEGRATOR', phone: '+62 821-7403-6710', email: 'depo@seaparcel.id' },
  ];

  return (
    <div className="px-12 py-20 flex justify-between gap-16">
      {/* Form Section */}
      <div className="flex-1">
        <h1 className="text-7xl font-bold mb-2 italic">Initiate</h1>
        <h1 className="text-7xl font-bold text-[#D977F9] mb-8">Comms.</h1>
        <p className="text-gray-400 text-sm mb-12 tracking-wide">Secure line to central command. Enter credentials and objective parameters below.</p>
        
        <form className="bg-[#151822]/50 p-12 border border-gray-800 rounded-lg backdrop-blur-sm">
          <div className="mb-8">
            <label className="block text-[#D977F9] text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Company Name</label>
            <input type="text" placeholder="e.g. Oceanic Logistics Corp" className="w-full bg-[#0B0D14] border border-gray-800 rounded p-4 text-sm focus:outline-none focus:border-[#D977F9] transition" />
          </div>
          <div className="mb-8">
            <label className="block text-[#D977F9] text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Email Address</label>
            <input type="email" placeholder="comms@domain.com" className="w-full bg-[#0B0D14] border border-gray-800 rounded p-4 text-sm focus:outline-none focus:border-[#D977F9] transition" />
          </div>
          <div className="mb-10">
            <label className="block text-[#D977F9] text-[10px] font-bold tracking-[0.2em] mb-3 uppercase">Message</label>
            <textarea placeholder="Detail your operational requirements..." rows={4} className="w-full bg-[#0B0D14] border border-gray-800 rounded p-4 text-sm focus:outline-none focus:border-[#D977F9] transition resize-none"></textarea>
          </div>
          <button className="w-full bg-[#D977F9] text-black font-bold py-4 rounded text-xs tracking-widest hover:bg-opacity-80 flex items-center justify-center gap-2">
            SUBMIT MESSAGE <span className="text-lg">➤</span>
          </button>
        </form>
      </div>

      {/* Contacts Section */}
      <div className="w-[450px]">
        <h3 className="text-xl font-bold mb-8 tracking-tight">Direct Contacts</h3>
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.name} className="bg-[#151822] p-8 border border-gray-800 rounded hover:border-gray-600 transition group">
              <h4 className="text-2xl font-bold mb-1 tracking-tight">{c.name}</h4>
              <p className="text-[#D977F9] text-[9px] font-bold tracking-[0.3em] mb-6">{c.role}</p>
              <div className="space-y-2 text-gray-400 text-sm">
                <p className="flex items-center gap-3">
                  <span className="text-[#D977F9] opacity-60">📞</span> {c.phone}
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-[#D977F9] opacity-60">✉</span> {c.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}