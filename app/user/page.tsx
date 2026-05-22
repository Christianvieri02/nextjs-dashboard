'use client';

import { useState } from 'react';
import { ShipmentTrackerSkeleton } from '../ui/skeletons';

type TrackingStep = {
  status: string;
  location: string;
  date: string;
  completed: boolean;
  warning?: boolean;
};

type TrackingData = {
  status: string;
  origin: string;
  destination: string;
  estArrival: string;
  vessel: string;
  steps: TrackingStep[];
};

const DUMMY_DATA: Record<string, TrackingData> = {
  'OL2026041301': {
    status: 'In Transit',
    origin: 'Jakarta Port, ID',
    destination: 'Singapore Port, SG',
    estArrival: 'April 22, 2026',
    vessel: 'Oceanic Horizon',
    steps: [
      { status: 'Order Processed', location: 'Jakarta, ID', date: 'April 13, 2026 08:30 AM', completed: true },
      { status: 'Cargo Loaded', location: 'Jakarta Port, ID', date: 'April 14, 2026 14:15 PM', completed: true },
      { status: 'Departed from Origin Port', location: 'Jakarta Port, ID', date: 'April 15, 2026 09:00 AM', completed: true },
      { status: 'Arrived at Transit Port', location: 'Batam Port, ID', date: 'April 17, 2026 11:45 AM', completed: true },
      { status: 'In Transit to Destination', location: 'Batam Port, ID' , date: 'April 18, 2026 08:00 AM', completed: true },
      { status: 'Arriving at Destination', location: 'Singapore Port, SG', date: 'Pending', completed: false }
    ]
  },
  'OL2026041302': {
    status: 'Delivered',
    origin: 'Surabaya Port, ID',
    destination: 'Tokyo Port, JP',
    estArrival: 'April 15, 2026',
    vessel: 'Pacific Voyager',
    steps: [
      { status: 'Order Processed', location: 'Surabaya, ID', date: 'April 05, 2026 09:10 AM', completed: true },
      { status: 'Cargo Loaded', location: 'Surabaya Port, ID', date: 'April 06, 2026 16:20 PM', completed: true },
      { status: 'Departed from Origin Port', location: 'Surabaya Port, ID', date: 'April 07, 2026 10:00 AM', completed: true },
      { status: 'Arrived at Destination Port', location: 'Tokyo Port, JP', date: 'April 14, 2026 14:00 PM', completed: true },
      { status: 'Cargo Unloaded', location: 'Tokyo Port, JP', date: 'April 15, 2026 08:30 AM', completed: true },
      { status: 'Delivered', location: 'Tokyo Customer Center', date: 'April 15, 2026 13:45 PM', completed: true }
    ]
  },
  'OL2026041303': {
    status: 'Delayed',
    origin: 'Belawan Port, ID',
    destination: 'Shanghai Port, CN',
    estArrival: 'May 02, 2026',
    vessel: 'Red Dragon',
    steps: [
      { status: 'Order Processed', location: 'Medan, ID', date: 'April 16, 2026 10:00 AM', completed: true },
      { status: 'Cargo Loaded', location: 'Belawan Port, ID', date: 'April 17, 2026 13:00 PM', completed: true },
      { status: 'Customs Clearance Delay', location: 'Belawan Port, ID', date: 'April 18, 2026 09:00 AM', completed: true, warning: true },
      { status: 'Departed from Origin Port', location: 'Pending', date: 'Pending', completed: false }
    ]
  }
};

export default function UserDashboard() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const performTracking = (num: string) => {
    const trimmed = num.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a tracking number.');
      setTrackingData(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setTrackingData(null);

    setTimeout(() => {
      const data = DUMMY_DATA[trimmed];
      if (data) {
        setTrackingData(data);
        setErrorMsg('');
      } else {
        setTrackingData(null);
        setErrorMsg('Tracking number not found. Try one of the sample numbers.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleTrack = () => {
    performTracking(trackingNumber);
  };

  const handleSampleClick = (num: string) => {
    setTrackingNumber(num);
    performTracking(num);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen flex flex-col justify-start">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Track Your Shipment</h1>
        <p className="text-gray-400 text-sm">Enter your tracking number to view shipment status</p>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-4 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </span>
          <input 
            type="text" 
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="Enter tracking number (e.g. OL2026041301)" 
            className="w-full bg-[#1A1C24] border border-transparent text-white text-sm p-4 pl-12 rounded focus:border-[#D977F9] focus:outline-none placeholder-gray-600 transition" 
          />
        </div>
        <button 
          onClick={handleTrack}
          className="bg-[#D977F9] text-[#250F2D] px-8 py-4 text-xs font-bold tracking-widest rounded hover:bg-[#c75be9] active:scale-95 transition flex items-center gap-2"
        >
          TRACK 
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <div className="text-[11px] text-gray-400 mb-12">
        Try these sample tracking numbers: &nbsp;
        <button onClick={() => handleSampleClick('OL2026041301')} className="text-[#D977F9] hover:underline underline-offset-2">OL2026041301</button> &nbsp;|&nbsp; 
        <button onClick={() => handleSampleClick('OL2026041302')} className="text-[#D977F9] hover:underline underline-offset-2">OL2026041302</button> &nbsp;|&nbsp; 
        <button onClick={() => handleSampleClick('OL2026041303')} className="text-[#D977F9] hover:underline underline-offset-2">OL2026041303</button>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      {isLoading && <ShipmentTrackerSkeleton />}

      {!trackingData && !errorMsg && !isLoading && (
        <div className="bg-gradient-to-b from-[#151822] to-[#0A0C10] rounded-lg border border-gray-800/50 shadow-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#1A1C24] rounded-lg border border-gray-800 flex items-center justify-center mb-6 text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"></polyline>
              <rect x="1" y="3" width="22" height="5"></rect>
              <line x1="10" y1="12" x2="14" y2="12"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No Shipment Tracked Yet</h3>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            Enter a tracking number above to view real-time telemetry, location history, and estimated arrival details for your maritime cargo.
          </p>
        </div>
      )}

      {trackingData && !isLoading && (
        <div className="bg-[#151822] rounded-lg border border-gray-800/50 shadow-2xl p-8 flex flex-col">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Shipment Status: <span className={trackingData.status === 'Delivered' ? 'text-green-400' : trackingData.status === 'Delayed' ? 'text-red-400' : 'text-[#D977F9]'}>{trackingData.status}</span></h2>
              <p className="text-sm text-gray-400">Vessel: {trackingData.vessel}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Estimated Arrival</p>
              <p className="text-lg font-bold text-white">{trackingData.estArrival}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-12 relative px-4 mx-4">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-800 -z-10 translate-y-[-50%]"></div>
            <div className="absolute top-1/2 left-0 h-[2px] bg-[#D977F9] -z-10 translate-y-[-50%] transition-all duration-1000" style={{ width: trackingData.status === 'Delivered' ? '100%' : trackingData.status === 'Delayed' ? '50%' : '75%' }}></div>
            
            <div className="bg-[#151822] p-2">
              <div className="w-4 h-4 rounded-full bg-[#D977F9] ring-4 ring-[#D977F9]/20"></div>
              <p className="absolute mt-3 text-xs font-semibold text-white -translate-x-1/4">{trackingData.origin}</p>
            </div>
            
            <div className="bg-[#151822] p-2">
              <div className="w-8 h-8 rounded-full bg-[#1A1C24] border-2 border-[#D977F9] flex items-center justify-center text-[#D977F9]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
            </div>
            
            <div className="bg-[#151822] p-2">
              <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${trackingData.status === 'Delivered' ? 'bg-[#D977F9] ring-4 ring-[#D977F9]/20' : 'bg-gray-700'}`}></div>
              <p className="absolute mt-3 text-xs font-semibold text-white -translate-x-1/2">{trackingData.destination}</p>
            </div>
          </div>
          
          <div className="space-y-6 pl-2">
            {trackingData.steps.map((step, idx) => (
              <div key={idx} className="relative pl-8">
                {idx !== trackingData.steps.length - 1 && (
                  <div className={`absolute top-6 left-[11px] w-[2px] h-full ${step.completed ? 'bg-[#D977F9]/50' : 'bg-gray-800'}`}></div>
                )}
                
                <div className={`absolute top-1 left-0 w-6 h-6 rounded-full flex items-center justify-center ${step.warning ? 'bg-red-500/20 text-red-500' : step.completed ? 'bg-[#D977F9]/20 text-[#D977F9]' : 'bg-[#1A1C24] border border-gray-700 text-gray-500'}`}>
                  {step.completed ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}
                </div>
                
                <div>
                  <h4 className={`text-sm font-bold ${step.warning ? 'text-red-400' : step.completed ? 'text-white' : 'text-gray-500'} mb-1`}>{step.status}</h4>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {step.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {step.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}