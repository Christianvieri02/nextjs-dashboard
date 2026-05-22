import { fetchVessels } from '../lib/data';

function getStatusColorHome(status: string) {
  switch (status) {
    case 'En Route':
      return 'text-[#00E5FF] border-[#00E5FF]';
    case 'In Port':
      return 'text-green-400 border-green-400';
    case 'Delayed':
      return 'text-red-400 border-red-400';
    case 'Maintenance':
      return 'text-orange-400 border-orange-400';
    default:
      return 'text-gray-400 border-gray-400';
  }
}

function formatETA(eta: string | Date | null | undefined): string {
  if (!eta) return '-';
  const date = new Date(eta);
  if (isNaN(date.getTime())) return '-';
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
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

export default async function AdminDashboard() {
  const vessels = await fetchVessels();

  const countStatus = (statusName: string) => vessels.filter(v => v.status === statusName).length;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-sm text-gray-400">Fleet statistics and vessel monitoring</p>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-10">
        {[
          { title: 'TOTAL VESSELS', value: vessels.length, color: 'text-[#D977F9]', icon: '🚢' },
          { title: 'EN ROUTE', value: countStatus('En Route'), color: 'text-[#00E5FF]', icon: '🧭' },
          { title: 'IN PORT', value: countStatus('In Port'), color: 'text-green-400', icon: '⚓' },
          { title: 'DELAYED', value: countStatus('Delayed'), color: 'text-red-400', icon: '⚠️' },
          { title: 'MAINTENANCE', value: countStatus('Maintenance'), color: 'text-orange-400', icon: '🔧' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#11131A] p-6 rounded-lg border border-gray-900 shadow-lg relative overflow-hidden">
            <h3 className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${stat.color}`}>{stat.title}</h3>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
            <div className={`absolute top-6 right-6 opacity-50 ${stat.color} text-xl`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#11131A] rounded-lg border border-gray-900 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-900">
          <h2 className="text-lg font-bold text-white">Vessel List</h2>
          <p className="text-xs text-gray-500">Current fleet status and routes</p>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A0C10] text-[10px] text-gray-500 uppercase tracking-widest">
              <th className="p-4 font-bold">VESSEL ID</th>
              <th className="p-4 font-bold">NAME</th>
              <th className="p-4 font-bold">STATUS</th>
              <th className="p-4 font-bold">ROUTE</th>
              <th className="p-4 font-bold">ETA</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {vessels.map((vessel, idx) => {
              const statusColor = getStatusColorHome(vessel.status);
              const route = formatRoute(vessel.status, vessel.origin_port, vessel.destination_port);
              const eta = formatETA(vessel.eta);

              return (
                <tr key={idx} className="border-b border-gray-900 hover:bg-[#1A1C24] transition">
                  <td className="p-4 font-mono text-[#D977F9]">{vessel.vessel_code}</td>
                  <td className="p-4 font-bold text-white">{vessel.name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] border bg-black/50 ${statusColor}`}>
                      ● {vessel.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{route}</td>
                  <td className="p-4 font-mono text-gray-500">{eta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}