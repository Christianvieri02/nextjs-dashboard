export const dynamic = 'force-dynamic';

export default async function FleetMap() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const telemetryData = [
    { id: 'V-7742-ALPHA', name: 'OCEAN NAVIGATOR', status: 'EN ROUTE', color: 'text-[#D977F9]', bg: 'bg-[#D977F9]/10', border: 'border-[#D977F9]', routeLabel: 'ROUTE', route: 'Jakarta ➔ Singapore', etaLabel: 'ETA', eta: '02:45 AM' },
    { id: 'V-9182-DELTA', name: 'MARITIME EXPLORER', status: 'DOCKED', color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10', border: 'border-[#00E5FF]', routeLabel: 'LOCATION', route: 'Terminal 4, Port Klang', etaLabel: 'STATUS', eta: 'Loading' },
    { id: 'V-1248-GAMMA', name: 'COASTAL VOYAGER', status: 'DELAYED', color: 'text-[#EAB308]', bg: 'bg-[#EAB308]/10', border: 'border-[#EAB308]', routeLabel: 'ROUTE', route: 'Manila ➔ Hong Kong', etaLabel: 'DELAY', eta: '+1.5 Hours' },
    { id: 'V-8822-SIGMA', name: 'PACIFIC TITAN', status: 'EN ROUTE', color: 'text-[#D977F9]', bg: 'bg-[#D977F9]/10', border: 'border-gray-800', routeLabel: 'ROUTE', route: 'Busan ➔ Tokyo', etaLabel: 'ETA', eta: 'Tomorrow' },
    { id: 'V-0812-KAPPA', name: 'GLOBAL CARRIER', status: 'EN ROUTE', color: 'text-[#D977F9]', bg: 'bg-[#D977F9]/10', border: 'border-gray-800', routeLabel: 'ROUTE', route: 'Shanghai ➔ Incheon', etaLabel: 'ETA', eta: '05:15 PM' },
  ];

  return (
    <div className="font-mono text-white h-[calc(100vh-80px)] flex gap-8">
      
      <div className="flex-1 flex flex-col h-full">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1 tracking-wide">Fleet Map</h1>
          <p className="text-[10px] text-[#00E5FF] tracking-[0.2em] font-bold">LIVE TRACKING & MONITORING</p>
        </div>

        <div className="relative flex-1 bg-[#0A0C10] rounded-xl border border-gray-800/80 overflow-hidden shadow-2xl">
          
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Dark Globe Satellite" 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0C10]/50 to-[#0A0C10]"></div>

          <div className="absolute top-[30%] left-[35%] flex flex-col items-center group cursor-pointer">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D977F9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D977F9] shadow-[0_0_10px_#D977F9]"></span>
            </div>
            <div className="mt-2 px-2 py-1 bg-[#0A0C10]/80 border border-[#D977F9]/50 rounded text-[8px] text-[#D977F9] tracking-wider backdrop-blur-sm">
              OCEAN NAVIGATOR
            </div>
          </div>

          <div className="absolute top-[55%] left-[65%] flex flex-col items-center group cursor-pointer">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"></span>
            </div>
            <div className="mt-2 px-2 py-1 bg-[#0A0C10]/80 border border-[#00E5FF]/50 rounded text-[8px] text-[#00E5FF] tracking-wider backdrop-blur-sm">
              MARITIME EXPLORER
            </div>
          </div>

          <div className="absolute top-[75%] left-[55%] flex flex-col items-center group cursor-pointer">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EAB308] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EAB308] shadow-[0_0_10px_#EAB308]"></span>
            </div>
            <div className="mt-2 px-2 py-1 bg-[#0A0C10]/80 border border-[#EAB308]/50 rounded text-[8px] text-[#EAB308] tracking-wider backdrop-blur-sm">
              COASTAL VOYAGER
            </div>
          </div>

          <div className="absolute bottom-6 left-6 bg-[#11131A]/90 backdrop-blur-md border border-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-[8px] text-gray-500 font-bold tracking-[0.2em] mb-4 uppercase">Operational Legend</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[10px]">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D977F9] shadow-[0_0_5px_#D977F9]"></div> En Route</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_5px_#00E5FF]"></div> In Port</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_5px_#EAB308]"></div> Delayed</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_5px_#F97316]"></div> Maintenance</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[380px] bg-[#0A0C10] border border-gray-800/80 rounded-xl flex flex-col overflow-hidden shadow-2xl h-full">
        
        <div className="p-6 border-b border-gray-800/80 flex justify-between items-center bg-[#11131A]">
          <h2 className="font-bold text-lg">Fleet Telemetry</h2>
          <button className="text-gray-400 hover:text-white transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {telemetryData.map((ship, idx) => (
            <div key={idx} className={`bg-[#11131A] border-l-[3px] ${ship.border} border-t border-r border-b border-gray-800/50 p-4 rounded-r-lg hover:bg-[#1A1C24] transition-colors cursor-pointer`}>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-sm text-white">{ship.name}</h4>
                  <p className="text-[9px] text-gray-500 tracking-widest mt-1">ID: {ship.id}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[8px] font-bold tracking-widest ${ship.bg} ${ship.color}`}>
                  {ship.status}
                </span>
              </div>

              <div className="flex justify-between items-end text-xs text-gray-400">
                <div>
                  <p className="text-[9px] text-gray-600 tracking-widest mb-1">{ship.routeLabel}</p>
                  <p>{ship.route}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-600 tracking-widest mb-1">{ship.etaLabel}</p>
                  <p className={`font-bold ${ship.color}`}>{ship.eta}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="p-5 border-t border-gray-800/80 bg-[#11131A] flex justify-between items-center text-[10px] font-bold tracking-widest">
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span> SYSTEM ONLINE
          </div>
          <div className="text-gray-500">
            5 ACTIVE VESSELS
          </div>
        </div>

      </div>

    </div>
  );
}