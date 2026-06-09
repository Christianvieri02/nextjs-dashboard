'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDateToLocal } from '../../lib/utils';
import { createInvoiceAction, updateInvoiceAction, deleteInvoiceAction } from '../../lib/actions';
import { User } from '../../lib/definitions';

interface InvoiceItem {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerImage: string;
  amount: number;
  status: 'paid' | 'pending';
  date: string;
}

const ITEMS_PER_PAGE = 5;

interface InvoicesClientProps {
  initialInvoices: InvoiceItem[];
  customers: User[];
}

export default function InvoicesClient({ initialInvoices, customers }: InvoicesClientProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [amountInput, setAmountInput] = useState('');
  const [statusInput, setStatusInput] = useState<'paid' | 'pending'>('paid');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const [showCreateErrors, setShowCreateErrors] = useState(false);
  const [showEditErrors, setShowEditErrors] = useState(false);

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return invoices;
    return invoices.filter((inv) => {
      const formattedAmount = (inv.amount / 100).toFixed(2);
      return (
        inv.customerName.toLowerCase().includes(query) ||
        inv.customerEmail.toLowerCase().includes(query) ||
        inv.status.toLowerCase().includes(query) ||
        formattedAmount.includes(query) ||
        inv.date.includes(query)
      );
    });
  }, [invoices, searchQuery]);

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE) || 1;
  
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvoices, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetForm = () => {
    setSelectedCustomerId(customers[0]?.id || '');
    setAmountInput('');
    setStatusInput('paid');
    setDateInput(new Date().toISOString().split('T')[0]);
    setEditingInvoiceId(null);
    setShowCreateErrors(false);
    setShowEditErrors(false);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateErrors(true);
    if (!amountInput || parseFloat(amountInput) < 0.01 || !dateInput) return;

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return;

    const amountInCents = Math.round(parseFloat(amountInput) * 100);

    const res = await createInvoiceAction(selectedCustomerId, amountInCents, statusInput, dateInput);
    if (res.success) {
      setIsCreateOpen(false);
      resetForm();
      setCurrentPage(1);
      router.refresh();
    } else {
      alert(res.error || 'Failed to create invoice.');
    }
  };

  const openEditModal = (invoice: InvoiceItem) => {
    setEditingInvoiceId(invoice.id);
    setSelectedCustomerId(invoice.customerId);
    setAmountInput((invoice.amount / 100).toString());
    setStatusInput(invoice.status);
    setDateInput(invoice.date);
    setIsEditOpen(true);
  };

  const handleEditInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoiceId) return;
    setShowEditErrors(true);
    if (!amountInput || parseFloat(amountInput) < 0.01 || !dateInput) return;

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return;

    const amountInCents = Math.round(parseFloat(amountInput) * 100);

    const res = await updateInvoiceAction(editingInvoiceId, selectedCustomerId, amountInCents, statusInput, dateInput);
    if (res.success) {
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } else {
      alert(res.error || 'Failed to update invoice.');
    }
  };

  const openDeleteModal = (id: string) => {
    setDeletingInvoiceId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (!deletingInvoiceId) return;

    const res = await deleteInvoiceAction(deletingInvoiceId);
    if (res.success) {
      setIsDeleteOpen(false);
      setDeletingInvoiceId(null);
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete invoice.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Invoices</h1>
        <p className="text-sm text-gray-400">Manage and track your maritime logistics billing.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-[350px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#11131A]/80 border border-gray-800/80 rounded-md py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30 transition"
          />
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateErrors(false);
            setIsCreateOpen(true);
          }}
          className="w-full sm:w-auto bg-[#A855F7] hover:bg-[#9333EA] text-white px-5 py-2.5 rounded-md text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.35)] active:scale-[0.98] transition-all"
        >
          Create Invoice <span>+</span>
        </button>
      </div>

      <div className="bg-[#11131A]/40 rounded-lg border border-gray-900 overflow-hidden shadow-xl mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-900/60 bg-[#0A0C10]/60 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-300 divide-y divide-gray-900/50">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-[#1A1C24]/30 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded relative overflow-hidden bg-gray-800 border border-gray-800">
                        <img
                          src={invoice.customerImage}
                          alt={invoice.customerName}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/customers/evil-rabbit.png';
                          }}
                        />
                      </div>
                      <span className="font-bold text-white uppercase tracking-wide">
                        {invoice.customerName}
                      </span>
                    </td>

                    <td className="p-4 text-gray-400 font-normal">
                      {invoice.customerEmail}
                    </td>

                    <td className="p-4 font-bold text-white">
                      {formatCurrency(invoice.amount)}
                    </td>

                    <td className="p-4 text-gray-400">
                      {formatDateToLocal(invoice.date)}
                    </td>

                    <td className="p-4">
                      {invoice.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0D2924] border border-emerald-500/20 text-[#00E5FF]">
                          <svg className="w-3 h-3 text-[#00E5FF]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-800/40 border border-gray-700/30 text-gray-400">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          PENDING
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(invoice)}
                          className="p-1 text-gray-500 hover:text-white rounded transition-colors"
                          title="Edit Invoice"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(invoice.id)}
                          className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                          title="Delete Invoice"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded flex items-center justify-center transition border border-gray-900/50 ${
              currentPage === 1
                ? 'text-gray-600 cursor-not-allowed bg-[#11131A]/20'
                : 'text-gray-300 hover:bg-[#1A1C24] bg-[#11131A]'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded text-xs font-bold transition flex items-center justify-center ${
                  isActive
                    ? 'bg-[#A855F7] text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-[#11131A] text-gray-400 hover:text-white hover:bg-[#1A1C24] border border-gray-900/50'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded flex items-center justify-center transition border border-gray-900/50 ${
              currentPage === totalPages
                ? 'text-gray-600 cursor-not-allowed bg-[#11131A]/20'
                : 'text-gray-300 hover:bg-[#1A1C24] bg-[#11131A]'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-900 bg-[#0A0C10]/60 flex justify-between items-center">
              <h3 className="font-bold text-base text-white tracking-wide">Create Invoice</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form noValidate onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                >
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Amount (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 448.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                    showCreateErrors && (!amountInput || parseFloat(amountInput) < 0.01)
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                  }`}
                />
                {showCreateErrors && (!amountInput || parseFloat(amountInput) < 0.01) && (
                  <p className="text-[10px] text-red-500 mt-1.5 font-bold">Angka minimal 0.01</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Invoice Date *</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                    showCreateErrors && !dateInput
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="paid"
                      checked={statusInput === 'paid'}
                      onChange={() => setStatusInput('paid')}
                      className="text-[#A855F7] focus:ring-0 focus:ring-offset-0 bg-gray-800 border-gray-700"
                    />
                    PAID
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={statusInput === 'pending'}
                      onChange={() => setStatusInput('pending')}
                      className="text-[#A855F7] focus:ring-0 focus:ring-offset-0 bg-gray-800 border-gray-700"
                    />
                    PENDING
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-900 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold rounded text-xs transition"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-900 bg-[#0A0C10]/60 flex justify-between items-center">
              <h3 className="font-bold text-base text-white tracking-wide">Edit Invoice</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form noValidate onSubmit={handleEditInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                >
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Amount (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 448.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                    showEditErrors && (!amountInput || parseFloat(amountInput) < 0.01)
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                  }`}
                />
                {showEditErrors && (!amountInput || parseFloat(amountInput) < 0.01) && (
                  <p className="text-[10px] text-red-500 mt-1.5 font-bold">Angka minimal 0.01</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Invoice Date *</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                    showEditErrors && !dateInput
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="paid"
                      checked={statusInput === 'paid'}
                      onChange={() => setStatusInput('paid')}
                      className="text-[#A855F7] focus:ring-0 focus:ring-offset-0 bg-gray-800 border-gray-700"
                    />
                    PAID
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={statusInput === 'pending'}
                      onChange={() => setStatusInput('pending')}
                      className="text-[#A855F7] focus:ring-0 focus:ring-offset-0 bg-gray-800 border-gray-700"
                    />
                    PENDING
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-900 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold rounded text-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-2">Delete Invoice</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Are you sure you want to delete this invoice ({deletingInvoiceId})? This action cannot be undone.
              </p>
            </div>
            
            <div className="px-6 py-4 bg-[#0A0C10]/60 border-t border-gray-900 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeletingInvoiceId(null);
                }}
                className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInvoice}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded text-xs transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
