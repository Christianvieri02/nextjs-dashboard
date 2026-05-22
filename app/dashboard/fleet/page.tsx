import { fetchVessels } from '../../lib/data';

function getStatusColor(status: string) {
  switch (status) {
    case 'En Route':
      return 'text-[#D977F9] border-[#D977F9]/30 bg-[#D977F9]/10';
    case 'In Port':
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    case 'Delayed':
      return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    case 'Maintenance':
      return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    default:
      return 'text-gray-400 border-gray-800 bg-gray-900/10';
  }
}

function formatETA(eta: string | Date | null | undefined): string {
  if (!eta) return '-';
  const date = new Date(eta);
  if (isNaN(date.getTime())) return '-';
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}`;
}

function formatRoute(status: string, origin: string | null, destination: string | null): string {
  if (!origin && !destination) return '-';
  if (status === 'In Port' && origin) {
    return origin.toLowerCase().includes('port') ? origin : `${origin} Port`;
  }
  if (origin && destination) {
    return `${origin} → ${destination}`;
  }
  return origin || destination || '-';
}

export default async function FleetManagement() {
  const vessels = await fetchVessels();

  const countStatus = (statusName: string) => vessels.filter(v => v.status === statusName).length;

  return (
    <div className="font-mono">
      <div className="mb-8">
        <h1 className="text-2xl text-white mb-2 tracking-wide">Fleet Management</h1>
        <p className="text-[10px] text-gray-500 tracking-widest">COMPLETE LIST OF ALL VESSELS IN THE SEA PARCEL FLEET</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { title: 'TOTAL VESSELS', value: vessels.length, iconColor: 'text-gray-400' },
          { title: 'EN ROUTE', value: countStatus('En Route'), iconColor: 'text-blue-500' },
          { title: 'IN PORT', value: countStatus('In Port'), iconColor: 'text-emerald-400' },
          { title: 'MAINTENANCE', value: countStatus('Maintenance'), iconColor: 'text-orange-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#11131A] p-6 rounded border border-gray-800/80 shadow flex flex-col justify-between h-28 relative">
            <div className="flex justify-between items-start">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={stat.iconColor}>
                <path d="M2 12h20"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path><path d="M12 12v-6"></path><path d="M8 6h8"></path>
              </svg>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#11131A] rounded border border-gray-800/80 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800/80 text-[9px] text-gray-500 uppercase tracking-widest">
              <th className="p-5 font-normal">VESSEL ID</th>
              <th className="p-5 font-normal">NAME</th>
              <th className="p-5 font-normal">TYPE</th>
              <th className="p-5 font-normal">CAPTAIN</th>
              <th className="p-5 font-normal">STATUS</th>
              <th className="p-5 font-normal">ROUTE</th>
              <th className="p-5 font-normal">ETA</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-400">
            {vessels.map((vessel, idx) => {
              const statusColor = getStatusColor(vessel.status);
              const route = formatRoute(vessel.status, vessel.origin_port, vessel.destination_port);
              const eta = formatETA(vessel.eta);

              return (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-[#1A1C24] transition-colors">
                  <td className="p-5 text-gray-500">{vessel.vessel_code}</td>
                  
                  <td className="p-5 font-bold text-white flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D977F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12h20"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path><path d="M12 12v-6"></path>
                    </svg>
                    {vessel.name}
                  </td>
                  
                  <td className="p-5">{vessel.type}</td>
                  
                  <td className="p-5 flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {vessel.captain_name}
                  </td>
                  
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] border ${statusColor}`}>
                      {vessel.status}
                    </span>
                  </td>
                  
                  <td className="p-5 flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {route}
                  </td>
                  
                  <td className="p-5 text-gray-500">{eta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}