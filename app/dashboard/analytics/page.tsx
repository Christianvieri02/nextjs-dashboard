import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analitik Operasional',
  description: 'Analitik operasional dan performa armada kapal.',
};

export default async function AnalyticsDashboard() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div className="font-mono text-white pb-10">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">Analytics & Reports</h1>
        <p className="text-[11px] text-gray-500 tracking-widest">OPERATIONAL PERFORMANCE METRICS AND FLEET ANALYTICS</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        {[
          { icon: '$', title: 'TOTAL REVENUE', value: '$328K', growth: '+12.5%' },
          { icon: '📦', title: 'ACTIVE SHIPMENTS', value: '2,310', growth: '+8.3%' },
          { icon: '🚢', title: 'FLEET UTILIZATION', value: '87%', growth: '+3.2%' },
          { icon: '📈', title: 'ON-TIME RATE', value: '94.2%', growth: '+1.8%' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 shadow-[0_0_15px_rgba(217,119,249,0.1)] hover:border-[#D977F9]/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl text-[#D977F9]">{stat.icon}</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[9px] font-bold tracking-widest">
                {stat.growth}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        
        <div className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 shadow-[0_0_15px_rgba(217,119,249,0.05)] flex flex-col">
          <h3 className="text-sm font-bold tracking-widest mb-6 flex items-center gap-2">
            <span className="text-[#D977F9]">📊</span> Revenue & Shipments
          </h3>
          
          <div className="relative flex-1 flex items-end">
             <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-600 pb-6 pr-2">
               <div className="border-b border-gray-800/50 w-full flex justify-start"><span className="-mt-3 pr-2">80000</span></div>
               <div className="border-b border-gray-800/50 w-full flex justify-start"><span className="-mt-3 pr-2">60000</span></div>
               <div className="border-b border-gray-800/50 w-full flex justify-start"><span className="-mt-3 pr-2">40000</span></div>
               <div className="border-b border-gray-800/50 w-full flex justify-start"><span className="-mt-3 pr-2">20000</span></div>
               <div className="border-b border-gray-500 w-full flex justify-start"><span className="-mt-3 pr-2">0</span></div>
             </div>

             <div className="relative w-full h-[200px] ml-10 mb-6 border-l border-b border-gray-500">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <polyline 
                    points="0,60 20,50 40,55 60,40 80,48 100,25" 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <circle cx="0" cy="60" r="2" fill="#10B981" />
                  <circle cx="20" cy="50" r="2" fill="#10B981" />
                  <circle cx="40" cy="55" r="2" fill="#10B981" />
                  <circle cx="60" cy="40" r="2" fill="#10B981" />
                  <circle cx="80" cy="48" r="2" fill="#10B981" />
                  <circle cx="100" cy="25" r="2" fill="#10B981" />
                </svg>
             </div>
          </div>
          
          <div className="flex justify-between text-[10px] text-gray-500 ml-10 mb-4 px-1">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>

          <div className="flex justify-center gap-6 text-[10px] font-bold tracking-widest text-gray-400">
            <span className="flex items-center gap-2"><div className="w-3 h-1 bg-[#D977F9]"></div> REVENUE</span>
            <span className="flex items-center gap-2 text-emerald-400"><div className="w-3 h-1 bg-emerald-400"></div> SHIPMENTS</span>
          </div>
        </div>

        <div className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 shadow-[0_0_15px_rgba(217,119,249,0.05)]">
          <h3 className="text-sm font-bold tracking-widest mb-10 flex items-center gap-2">
            <span className="text-[#D977F9]">📉</span> Fleet Utilization
          </h3>
          
          <div className="flex justify-center items-center relative h-[250px]">
            <div 
              className="w-48 h-48 rounded-full border border-gray-800"
              style={{
                background: 'conic-gradient(#a855f7 0% 45%, #22c55e 45% 70%, #f97316 70% 85%, #eab308 85% 100%)'
              }}
            ></div>
            
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <span className="absolute top-4 right-16 text-[10px] text-[#a855f7]">En Route: 45%</span>
              <span className="absolute bottom-16 left-6 text-[10px] text-[#22c55e]">In Port: 25%</span>
              <span className="absolute bottom-4 right-20 text-[10px] text-[#f97316]">Maintenance: 15%</span>
              <span className="absolute top-[40%] right-10 text-[10px] text-[#eab308]">Delayed: 15%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#11131A] p-6 rounded-lg border border-[#D977F9]/20 shadow-[0_0_15px_rgba(217,119,249,0.05)] mb-6">
        <h3 className="text-sm font-bold tracking-widest mb-8 flex items-center gap-2">
          <span className="text-[#D977F9]">📈</span> Route Performance
        </h3>
        
        <div className="flex h-48 items-end gap-16 px-10 border-b border-gray-500 relative">
          
          <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-600 pb-0 w-full">
            <div className="border-b border-gray-800/30 border-dashed w-full h-0 mb-[3.8rem]"><span className="-ml-6 -mt-2 block">100</span></div>
            <div className="border-b border-gray-800/30 border-dashed w-full h-0 mb-[3.8rem]"><span className="-ml-6 -mt-2 block">75</span></div>
            <div className="border-b border-gray-800/30 border-dashed w-full h-0 mb-[3.8rem]"><span className="-ml-6 -mt-2 block">50</span></div>
            <div className="border-b border-gray-800/30 border-dashed w-full h-0 mb-0"><span className="-ml-6 -mt-2 block">25</span></div>
          </div>

          <div className="relative flex flex-col items-center w-full z-10 group">
            <div className="w-12 bg-emerald-400 h-24 rounded-t hover:bg-emerald-300 transition-colors"></div>
            <span className="text-[8px] text-gray-500 mt-3 absolute -bottom-6 w-32 text-center rotate-[-10deg]">Jakarta-Singapore</span>
          </div>
          <div className="relative flex flex-col items-center w-full z-10 group">
            <div className="w-12 bg-emerald-400 h-16 rounded-t hover:bg-emerald-300 transition-colors"></div>
            <span className="text-[8px] text-gray-500 mt-3 absolute -bottom-6 w-32 text-center rotate-[-10deg]">Jakarta-Manila</span>
          </div>
          <div className="relative flex flex-col items-center w-full z-10 group">
            <div className="w-12 bg-emerald-400 h-14 rounded-t hover:bg-emerald-300 transition-colors"></div>
            <span className="text-[8px] text-gray-500 mt-3 absolute -bottom-6 w-32 text-center rotate-[-10deg]">Surabaya-Bangkok</span>
          </div>
          <div className="relative flex flex-col items-center w-full z-10 group">
            <div className="w-12 bg-emerald-400 h-20 rounded-t hover:bg-emerald-300 transition-colors"></div>
            <span className="text-[8px] text-gray-500 mt-3 absolute -bottom-6 w-32 text-center rotate-[-10deg]">Jakarta-Hong Kong</span>
          </div>
          <div className="relative flex flex-col items-center w-full z-10 group">
            <div className="w-12 bg-emerald-400 h-12 rounded-t hover:bg-emerald-300 transition-colors"></div>
            <span className="text-[8px] text-gray-500 mt-3 absolute -bottom-6 w-32 text-center rotate-[-10deg]">Jakarta-KL</span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12 text-[10px] font-bold tracking-widest text-gray-400">
            <span className="flex items-center gap-2 text-[#D977F9]"><div className="w-3 h-3 bg-[#D977F9]"></div> Total Trips</span>
            <span className="flex items-center gap-2 text-emerald-400"><div className="w-3 h-3 bg-emerald-400"></div> On-Time %</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#11131A] p-6 rounded-lg border border-gray-800/80 shadow">
          <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">TOTAL DISTANCE COVERED</p>
          <h3 className="text-3xl font-bold mb-1">1.2M NM</h3>
          <p className="text-[10px] text-gray-600">Nautical Miles this year</p>
        </div>
        <div className="bg-[#11131A] p-6 rounded-lg border border-gray-800/80 shadow">
          <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">FUEL EFFICIENCY</p>
          <h3 className="text-3xl font-bold mb-1">12.5 L/NM</h3>
          <p className="text-[10px] text-gray-600">Average consumption rate</p>
        </div>
        <div className="bg-[#11131A] p-6 rounded-lg border border-gray-800/80 shadow">
          <p className="text-[9px] text-gray-500 tracking-[0.2em] uppercase mb-4">CUSTOMER SATISFACTION</p>
          <h3 className="text-3xl font-bold mb-1">4.8/5.0</h3>
          <p className="text-[10px] text-[#D977F9]">Based on 1,400+ reviews</p>
        </div>
      </div>

    </div>
  );
}