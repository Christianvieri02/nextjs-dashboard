'use client';

import { useState, useEffect } from 'react';
import { BillingSkeleton } from '../../ui/skeletons';

type Invoice = {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  hasDownload: boolean;
};

const INVOICES_DATA: Invoice[] = [
  {
    id: 'INV-2026-001',
    description: 'Express Shipping to Singapore (OL2026041301)',
    date: 'Apr 13, 2026',
    amount: '$150.00',
    status: 'Paid',
    hasDownload: false,
  },
  {
    id: 'INV-2026-002',
    description: 'Standard Shipping to Manila (OL2026041303)',
    date: 'Apr 14, 2026',
    amount: '$85.50',
    status: 'Pending',
    hasDownload: true,
  },
  {
    id: 'INV-2026-003',
    description: 'Freight Shipping to Kuala Lumpur',
    date: 'Apr 1, 2026',
    amount: '$450.00',
    status: 'Overdue',
    hasDownload: true,
  },
  {
    id: 'INV-2026-004',
    description: 'Express Shipping to Sydney',
    date: 'Apr 16, 2026',
    amount: '$220.00',
    status: 'Pending',
    hasDownload: true,
  },
  {
    id: 'INV-2026-005',
    description: 'Standard Shipping to Bangkok',
    date: 'Mar 25, 2026',
    amount: '$65.00',
    status: 'Paid',
    hasDownload: false,
  },
];

export default function BillingInvoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleDownload = (id: string) => {
    setToastMessage(`Downloading receipt for ${id}...`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredInvoices = INVOICES_DATA.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen flex flex-col justify-start relative">
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-[#D977F9] text-[#250F2D] font-bold text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 border border-[#D977F9]/30 transition-all z-50 animate-bounce">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25"></circle>
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
          </svg>
          {toastMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Billing & Invoices</h1>
        <p className="text-gray-400 text-sm">Manage your shipping payments and download receipts</p>
      </div>

      <div className="flex gap-4 mb-6 relative">
        <div className="relative flex-1">
          <span className="absolute left-4 top-3.5 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search tracking number or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151822] border border-gray-800 text-white text-sm p-3.5 pl-12 rounded-lg focus:border-[#D977F9]/70 focus:outline-none placeholder-gray-600 transition"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`bg-[#151822] border border-gray-800 hover:bg-[#1A1C24] text-gray-300 px-6 h-full text-xs font-bold tracking-widest uppercase rounded-lg transition flex items-center gap-2 ${
              statusFilter !== 'all' ? 'border-[#D977F9] text-[#D977F9] bg-[#D977F9]/5' : ''
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
            {statusFilter !== 'all' && (
              <span className="bg-[#D977F9] text-[#250F2D] text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                ✓
              </span>
            )}
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-[#151822] border border-gray-800 rounded-lg shadow-2xl z-20 overflow-hidden animate-fadeIn">
                {['all', 'paid', 'pending', 'overdue'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-bold tracking-wider uppercase transition ${
                      statusFilter === status
                        ? 'bg-[#D977F9] text-[#250F2D]'
                        : 'text-gray-400 hover:bg-[#1C1F2B] hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-[#151822]/40 rounded-lg border border-gray-800/80 shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/80 text-[10px] font-black tracking-widest text-gray-500 uppercase bg-[#05050A]/40">
                <th className="py-4 px-6">Invoice</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {isLoading ? (
                <>
                  <BillingSkeleton />
                  <BillingSkeleton />
                  <BillingSkeleton />
                  <BillingSkeleton />
                  <BillingSkeleton />
                </>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="text-xs text-gray-300 hover:bg-[#151822]/75 transition-colors group">
                    <td className="py-4.5 px-6 font-bold text-white whitespace-nowrap flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-[#1C1F2B] flex items-center justify-center text-[#D977F9] group-hover:scale-105 transition-transform">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      {invoice.id}
                    </td>

                    <td className="py-4.5 px-6 font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                      {invoice.description}
                    </td>

                    <td className="py-4.5 px-6 text-gray-400 whitespace-nowrap">
                      {invoice.date}
                    </td>

                    <td className="py-4.5 px-6 font-bold text-white">
                      {invoice.amount}
                    </td>

                    <td className="py-4.5 px-6 whitespace-nowrap">
                      {invoice.status === 'Paid' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 border border-green-500/20 text-green-400">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Paid
                        </span>
                      )}
                      {invoice.status === 'Pending' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          Pending
                        </span>
                      )}
                      {invoice.status === 'Overdue' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 border border-red-500/20 text-red-400">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          Overdue
                        </span>
                      )}
                    </td>

                    <td className="py-4.5 px-6 text-right whitespace-nowrap">
                      {invoice.hasDownload ? (
                        <button
                          onClick={() => handleDownload(invoice.id)}
                          className="p-1.5 bg-[#1C1F2B] border border-gray-800 hover:border-gray-700 hover:text-white rounded-md text-gray-400 transition"
                          title="Download Invoice PDF"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-600 italic select-none">No Action</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">No matching invoices found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
