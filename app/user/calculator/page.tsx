'use client';

import { useState, useEffect } from 'react';
import { CalculatorSkeleton } from '../../ui/skeletons';
import { fetchShippingRatesAction } from '../../lib/actions';

type DestinationRate = {
  name: string;
  country: string;
  rate: number;
  delivery: string;
};

type PriceBreakdown = {
  destination: string;
  weight: number;
  ratePerKg: number;
  baseCost: number;
  insuranceCost: number;
  handlingCost: number;
  totalCost: number;
};

export default function PriceCalculator() {
  const [destinations, setDestinations] = useState<DestinationRate[]>([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [weight, setWeight] = useState('');
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const res = await fetchShippingRatesAction();
        if (res.success && res.data) {
          setDestinations(res.data);
        } else {
          setErrorMsg(res.error || 'Failed to load shipping rates.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to fetch shipping rates from server.');
      } finally {
        setIsLoading(false);
      }
    };
    loadRates();
  }, []);

  const handleCalculate = () => {
    if (!selectedDest) {
      setErrorMsg('Please select a destination port.');
      setBreakdown(null);
      return;
    }

    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      setErrorMsg('Please enter a valid package weight greater than 0.');
      setBreakdown(null);
      return;
    }

    setErrorMsg('');
    setBreakdown(null);

    const destinationData = destinations.find((d) => d.name === selectedDest);
    if (!destinationData) {
      setErrorMsg('Destination not found.');
      setBreakdown(null);
      return;
    }

    const baseCost = numWeight * destinationData.rate;
    const insuranceCost = baseCost * 0.02;
    const handlingCost = 5.00;
    const totalCost = baseCost + insuranceCost + handlingCost;

    setBreakdown({
      destination: destinationData.name,
      weight: numWeight,
      ratePerKg: destinationData.rate,
      baseCost,
      insuranceCost,
      handlingCost,
      totalCost,
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen flex flex-col justify-start gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Shipping Price Calculator</h1>
        <p className="text-gray-400 text-sm">Calculate your shipping costs based on destination and weight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#151822]/40 rounded-lg border border-gray-800/80 p-6 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800/50 pb-3">
              <svg className="w-5 h-5 text-[#D977F9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="16" y1="2" x2="16" y2="4" />
                <line x1="8" y1="2" x2="8" y2="4" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Calculate Shipping Cost</h2>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-bold mb-4">
                {errorMsg}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[10px] font-black text-gray-500 tracking-wider uppercase mb-2">
                Destination Port
              </label>
              <div className="relative">
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full bg-[#151822] border border-gray-800 text-gray-300 text-xs p-3.5 pr-10 rounded-lg focus:border-[#D977F9]/70 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select a destination</option>
                  {destinations.map((dest) => (
                    <option key={dest.name} value={dest.name}>
                      {dest.name} ({dest.country})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-500 tracking-wider uppercase mb-2">
                Package Weight (KG)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter weight in kilograms"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#151822] border border-gray-800 text-white text-xs p-3.5 rounded-lg focus:border-[#D977F9]/70 focus:outline-none placeholder-gray-600 transition"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-[#9333EA] hover:bg-[#A855F7] active:scale-[0.98] text-white py-3.5 rounded-lg text-xs font-bold tracking-widest uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="16" y1="14" x2="16" y2="18" />
                <path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01" />
              </svg>
              Calculate Price
            </button>
          </div>

          <div className="mt-8 bg-[#1C1F2B]/40 border border-gray-800 rounded-lg p-4 flex gap-3 text-[11px] text-gray-400">
            <div className="w-5 h-5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5 font-bold">
              i
            </div>
            <div>
              <p className="font-bold text-gray-300 mb-1">Prices include:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-405">
                <li>Base shipping rate per kg</li>
                <li>2% insurance fee</li>
                <li>$5 handling fee</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-[#151822]/40 rounded-lg border border-gray-800/80 p-6 flex flex-col justify-center items-center backdrop-blur-sm min-h-[350px]">
          {isLoading && (
            <div className="w-full h-full">
              <CalculatorSkeleton />
            </div>
          )}

          {!isLoading && breakdown && (
            <div className="w-full h-full flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-gray-800/50 pb-3">
                  <svg className="w-5 h-5 text-[#D977F9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Calculation Breakdown</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs border-b border-gray-800/20 pb-2">
                    <span className="text-gray-500">Destination</span>
                    <span className="text-white font-bold">{breakdown.destination}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-gray-800/20 pb-2">
                    <span className="text-gray-500">Weight</span>
                    <span className="text-white font-bold">{breakdown.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-gray-800/20 pb-2">
                    <span className="text-gray-500">Rate per KG</span>
                    <span className="text-white font-bold">${breakdown.ratePerKg} / kg</span>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Base Cost</span>
                      <span className="text-gray-300 font-medium">${breakdown.baseCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Insurance Fee (2%)</span>
                      <span className="text-gray-300 font-medium">${breakdown.insuranceCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Handling Fee</span>
                      <span className="text-gray-300 font-medium">${breakdown.handlingCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-800/80 pt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Est. Price</span>
                  <span className="text-2xl font-black text-[#D977F9] tracking-tight drop-shadow-[0_0_8px_rgba(217,119,249,0.15)]">
                    ${breakdown.totalCost.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 text-right">Includes taxes and port handling fees.</p>
              </div>
            </div>
          )}

          {!isLoading && !breakdown && (
            <div className="text-center flex flex-col items-center max-w-xs p-6">
              <span className="text-6xl text-gray-800 font-light mb-6 select-none">$</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Calculate Your Price</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Select destination and enter weight to see estimated shipping cost
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#151822]/40 rounded-lg border border-gray-800/80 shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="flex items-center gap-2 p-6 border-b border-gray-800/50 bg-[#05050A]/20">
          <svg className="w-4 h-4 text-[#D977F9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Available Destinations & Rates</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] font-black tracking-widest text-gray-500 uppercase bg-[#05050A]/40">
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Country</th>
                <th className="py-4 px-6">Rate Per KG</th>
                <th className="py-4 px-6">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {destinations.map((dest) => (
                <tr key={dest.name} className="text-xs text-gray-300 hover:bg-[#151822]/75 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">{dest.name}</td>
                  <td className="py-3.5 px-6 text-gray-400">{dest.country}</td>
                  <td className="py-3.5 px-6 font-bold text-[#D977F9]">${dest.rate}</td>
                  <td className="py-3.5 px-6 text-gray-400">{dest.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
