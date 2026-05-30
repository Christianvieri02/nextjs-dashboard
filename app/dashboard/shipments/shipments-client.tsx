'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createShipmentAction, updateShipmentStatusAction, deleteShipmentAction, updateShipmentDetailsAction } from '../../lib/actions';

interface ShipmentItem {
  id: string;
  tracking_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  sender_name: string;
  receiver_name: string;
  phone: string;
  origin_city: string;
  destination_city: string;
  item_type: string;
  weight_kg: number;
  total_cost: number;
  vehicle_type: string;
  shipment_type: string;
  status: string;
  status_barang?: string;
  status_transaksi?: string;
  description: string;
  shipment_date: string;
  created_at: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
}

interface ShipmentsClientProps {
  initialShipments: ShipmentItem[];
  users: UserItem[];
}

function getStatusBadgeClass(status: string) {
  const norm = status.toLowerCase();
  if (norm.includes('deliver')) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
  if (norm.includes('transit') || norm.includes('angkut')) return 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10';
  if (norm.includes('delay')) return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
  if (norm.includes('process') || norm.includes('proses')) return 'text-gray-400 border-gray-800 bg-gray-900/10';
  return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
}

function getShipmentTypeClass(type: string) {
  const norm = type ? type.toLowerCase() : '';
  if (norm === 'vvip' || norm === 'vip') return 'text-[#D977F9] border-[#D977F9]/30 bg-[#D977F9]/10 font-bold';
  if (norm === 'cepat') return 'text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10';
  return 'text-gray-400 border-gray-800 bg-gray-800/20';
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

export default function ShipmentsClient({ initialShipments, users }: ShipmentsClientProps) {
  const router = useRouter();
  const [shipments, setShipments] = useState<ShipmentItem[]>(initialShipments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [userId, setUserId] = useState(users[0]?.id || '');
  const [shipmentDate, setShipmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [itemType, setItemType] = useState('');
  const [weightKg, setWeightKg] = useState<number>(1);
  const [totalCost, setTotalCost] = useState<number>(10000);
  const [vehicleType, setVehicleType] = useState('Container Ship');
  const [shipmentType, setShipmentType] = useState('Biasa');
  const [status, setStatus] = useState('Diproses');
  const [statusBarang, setStatusBarang] = useState('Diproses');
  const [statusTransaksi, setStatusTransaksi] = useState('Diproses');
  const [description, setDescription] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('Diproses');
  const [editStatusBarang, setEditStatusBarang] = useState('Diproses');
  const [editStatusTransaksi, setEditStatusTransaksi] = useState('Diproses');
  const [editTotalCost, setEditTotalCost] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setShipments(initialShipments);
  }, [initialShipments]);

  useEffect(() => {
    let rate = 10000;
    const type = shipmentType.toLowerCase();
    if (type === 'cepat') {
      rate = 14000;
    } else if (type === 'vvip' || type === 'vip') {
      rate = 20000;
    }
    setTotalCost(Number(weightKg) * rate);
  }, [weightKg, shipmentType]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await updateShipmentStatusAction(id, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Gagal memperbarui status.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan sistem.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pengiriman ini?')) return;
    try {
      const res = await deleteShipmentAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Gagal menghapus pengiriman.');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan sistem.');
    }
  };

  const openEditModal = (shipment: ShipmentItem) => {
    setEditingShipmentId(shipment.id);
    setEditStatus(shipment.status || 'Diproses');
    setEditStatusBarang(shipment.status_barang || 'Diproses');
    setEditStatusTransaksi(shipment.status_transaksi || 'Diproses');
    setEditTotalCost(Number(shipment.total_cost));
    setIsEditOpen(true);
  };

  const handleEditShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipmentId) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await updateShipmentDetailsAction(editingShipmentId, {
        status: editStatus,
        status_barang: editStatusBarang,
        status_transaksi: editStatusTransaksi,
        total_cost: Number(editTotalCost)
      });

      if (res.success) {
        setIsEditOpen(false);
        setEditingShipmentId(null);
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Gagal menyimpan data pengiriman.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredShipments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return shipments;
    return shipments.filter((s) => 
      s.tracking_number.toLowerCase().includes(query) ||
      (s.sender_name && s.sender_name.toLowerCase().includes(query)) ||
      (s.receiver_name && s.receiver_name.toLowerCase().includes(query)) ||
      (s.origin_city && s.origin_city.toLowerCase().includes(query)) ||
      (s.destination_city && s.destination_city.toLowerCase().includes(query)) ||
      (s.item_type && s.item_type.toLowerCase().includes(query)) ||
      s.status.toLowerCase().includes(query)
    );
  }, [shipments, searchQuery]);

  const resetForm = () => {
    setUserId(users[0]?.id || '');
    setShipmentDate(new Date().toISOString().split('T')[0]);
    setSenderName('');
    setReceiverName('');
    setPhone('');
    setOriginCity('');
    setDestinationCity('');
    setItemType('');
    setWeightKg(1);
    setTotalCost(0);
    setVehicleType('Container Ship');
    setShipmentType('Biasa');
    setStatus('Diproses');
    setStatusBarang('Diproses');
    setStatusTransaksi('Diproses');
    setDescription('');
    setErrorMsg('');
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !senderName || !receiverName || !phone || !originCity || !destinationCity || !itemType) {
      setErrorMsg('Harap lengkapi semua kolom yang wajib diisi (*).');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await createShipmentAction({
        userId,
        senderName,
        receiverName,
        phone,
        originCity,
        destinationCity,
        itemType,
        weightKg: Number(weightKg),
        totalCost: Number(totalCost),
        vehicleType,
        shipmentType,
        status,
        description,
        shipmentDate,
        statusBarang,
        statusTransaksi
      });

      if (res.success) {
        setIsCreateOpen(false);
        resetForm();
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Gagal menyimpan data pengiriman.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-mono">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl text-white mb-2 tracking-wide">Pengiriman Cargo</h1>
          <p className="text-[10px] text-gray-500 tracking-widest">MANAGE AND MONITOR ALL SHIPMENTS ACROSS THE MARITIME NETWORK</p>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="bg-[#D977F9] hover:bg-[#c75be9] text-[#250F2D] px-5 py-2.5 rounded-md text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(217,119,249,0.35)] active:scale-[0.98] transition-all"
        >
          Tambah Pengiriman <span>+</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'TOTAL SHIPMENTS', value: shipments.length, iconColor: 'text-[#D977F9]' },
          { title: 'IN TRANSIT', value: shipments.filter(s => s.status.toLowerCase().includes('transit')).length, iconColor: 'text-[#00E5FF]' },
          { title: 'DELIVERED', value: shipments.filter(s => s.status.toLowerCase().includes('deliver')).length, iconColor: 'text-emerald-400' },
          { title: 'DELAYED', value: shipments.filter(s => s.status.toLowerCase().includes('delay')).length, iconColor: 'text-rose-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#11131A] p-6 rounded border border-gray-800/80 shadow flex flex-col justify-between h-28 relative">
            <div className="flex justify-between items-start">
              <span className={`text-xl ${stat.iconColor}`}>📦</span>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Search Filter */}
      <div className="mb-6 relative w-full sm:w-[350px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Cari pengiriman (resi, pengirim, kota)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#11131A]/80 border border-gray-800/80 rounded-md py-2.5 pl-11 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30 transition"
        />
      </div>

      {/* Shipments Table */}
      <div className="bg-[#11131A] rounded border border-gray-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/80 text-[9px] text-gray-500 uppercase tracking-widest bg-[#0A0C10]/60">
                <th className="p-5 font-normal">NO RESI</th>
                <th className="p-5 font-normal">TANGGAL KIRIM</th>
                <th className="p-5 font-normal">PENGIRIM / PENERIMA</th>
                <th className="p-5 font-normal">RUTE (ASAL → TUJUAN)</th>
                <th className="p-5 font-normal">BARANG / BERAT</th>
                <th className="p-5 font-normal">KENDARAAN / JENIS</th>
                <th className="p-5 font-normal">TARIF</th>
                <th className="p-5 font-normal">STATUS PENGIRIMAN</th>
                <th className="p-5 font-normal">STATUS BARANG</th>
                <th className="p-5 font-normal">STATUS TRANSAKSI</th>
                <th className="p-5 font-normal text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-400 divide-y divide-gray-800/30">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-10 text-center text-gray-500 font-mono">
                    TIDAK ADA DATA PENGIRIMAN CARGO
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => {
                  const statusColor = getStatusBadgeClass(shipment.status);
                  const statusBColor = getStatusBadgeClass(shipment.status_barang || 'Diproses');
                  const statusTColor = getStatusBadgeClass(shipment.status_transaksi || 'Diproses');
                  const typeColor = getShipmentTypeClass(shipment.shipment_type);

                  return (
                    <tr key={shipment.id} className="border-b border-gray-800/50 hover:bg-[#1A1C24]/30 transition-colors">
                      <td className="p-5 font-bold text-[#D977F9] font-mono">{shipment.tracking_number}</td>
                      <td className="p-5 whitespace-nowrap">{formatDate(shipment.shipment_date)}</td>
                      <td className="p-5">
                        <div className="font-bold text-white">{shipment.sender_name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Penerima: {shipment.receiver_name} ({shipment.phone})</div>
                      </td>
                      <td className="p-5">
                        <div className="text-white font-medium">{shipment.origin_city} → {shipment.destination_city}</div>
                        <div className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wide">User: {shipment.user_name}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-white">{shipment.item_type}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{shipment.weight_kg} kg</div>
                      </td>
                      <td className="p-5">
                        <div className="text-gray-300">{shipment.vehicle_type}</div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] border mt-1 ${typeColor}`}>
                          {shipment.shipment_type}
                        </span>
                      </td>
                      <td className="p-5 font-bold text-white">Rp {Number(shipment.total_cost).toLocaleString('id-ID')}</td>
                      <td className="p-5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] border ${statusColor}`}>
                          {shipment.status === 'Order Processed' ? 'Diproses' : shipment.status === 'In Transit' ? 'Diangkut' : shipment.status}
                        </span>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] border ${statusBColor}`}>
                          {shipment.status_barang || 'Diproses'}
                        </span>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] border ${statusTColor}`}>
                          {shipment.status_transaksi || 'Diproses'}
                        </span>
                      </td>
                      <td className="p-5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            suppressHydrationWarning
                            onClick={() => openEditModal(shipment)}
                            className="p-1.5 bg-[#1C2030] text-[#D977F9] hover:bg-[#25293d] rounded-md transition-all border border-[#D977F9]/20"
                            title="Edit Pengiriman"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            suppressHydrationWarning
                            onClick={() => handleUpdateStatus(shipment.id, 'In Transit')}
                            className="p-1.5 bg-[#132A22] text-[#00E5FF] hover:bg-[#1a3d31] rounded-md transition-all border border-[#00E5FF]/20"
                            title="Set Status Diangkut"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            suppressHydrationWarning
                            onClick={() => handleDelete(shipment.id)}
                            className="p-1.5 bg-[#2A131A] text-rose-500 hover:bg-[#3d1a24] rounded-md transition-all border border-rose-500/20"
                            title="Hapus Pengiriman"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-4 border-b border-gray-900 bg-[#0A0C10]/60 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white tracking-wide">Form Pengiriman Baru</h3>
              <button 
                onClick={() => setIsCreateOpen(false)} 
                className="text-gray-500 hover:text-white transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateShipment} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3.5 rounded text-xs text-center font-bold">
                  {errorMsg}
                </div>
              )}

              {/* User Selection & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Akun Pengguna (Database) *</label>
                  <select
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Tanggal Kirim *</label>
                  <input
                    required
                    type="date"
                    value={shipmentDate}
                    onChange={(e) => setShipmentDate(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
              </div>

              {/* Sender & Receiver */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Nama Pengirim *</label>
                  <input
                    required
                    type="text"
                    placeholder="Nama Pengirim"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Nama Penerima *</label>
                  <input
                    required
                    type="text"
                    placeholder="Nama Penerima"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
              </div>

              {/* Phone & Vehicle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">No Telepon Penerima *</label>
                  <input
                    required
                    type="text"
                    placeholder="Contoh: 0812xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Jenis Kendaraan</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Container Ship">Container Ship (Kapal Laut)</option>
                    <option value="Cargo Ship">Cargo Ship (Kapal Kargo)</option>
                    <option value="Tanker">Tanker (Kapal Tanki)</option>
                    <option value="Bulk Carrier">Bulk Carrier</option>
                  </select>
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Kota Asal *</label>
                  <input
                    required
                    type="text"
                    placeholder="Pelabuhan Asal / Kota Asal"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Kota Tujuan *</label>
                  <input
                    required
                    type="text"
                    placeholder="Pelabuhan Tujuan / Kota Tujuan"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
              </div>

              {/* Item Type & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Jenis Barang *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sparepart, Tekstil, Elektronik"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Berat Barang (kg) *</label>
                  <input
                    required
                    type="number"
                    min="0.1"
                    step="any"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  />
                </div>
              </div>

              {/* Cost & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Harga/Tarif Pengiriman (Rp) (Otomatis)</label>
                  <input
                    readOnly
                    required
                    type="number"
                    value={totalCost}
                    className="w-full bg-[#13151D] border border-gray-800/50 rounded p-3 text-xs text-gray-400 focus:outline-none cursor-not-allowed opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Jenis Pengiriman</label>
                  <select
                    value={shipmentType}
                    onChange={(e) => setShipmentType(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Cepat">Cepat</option>
                    <option value="Vvip">VVIP</option>
                  </select>
                </div>
              </div>

              {/* Cost & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Harga/Tarif Pengiriman (Rp) (Otomatis)</label>
                  <input
                    readOnly
                    required
                    type="number"
                    value={totalCost}
                    className="w-full bg-[#13151D] border border-gray-800/50 rounded p-3 text-xs text-gray-400 focus:outline-none cursor-not-allowed opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Jenis Pengiriman</label>
                  <select
                    value={shipmentType}
                    onChange={(e) => setShipmentType(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Cepat">Cepat</option>
                    <option value="Vvip">VVIP</option>
                  </select>
                </div>
              </div>

              {/* Status Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Status Pengiriman</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Diproses">Diproses</option>
                    <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                    <option value="Sampai Tujuan">Sampai Tujuan</option>
                    <option value="Pending">Pending</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Status Barang</label>
                  <select
                    value={statusBarang}
                    onChange={(e) => setStatusBarang(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Diproses">Diproses</option>
                    <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                    <option value="Sampai Tujuan">Sampai Tujuan</option>
                    <option value="Pending">Pending</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Status Transaksi</label>
                  <select
                    value={statusTransaksi}
                    onChange={(e) => setStatusTransaksi(e.target.value)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Diproses">Diproses</option>
                    <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                    <option value="Sampai Tujuan">Sampai Tujuan</option>
                    <option value="Pending">Pending</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Deskripsi / Catatan Barang</label>
                <textarea
                  rows={3}
                  placeholder="Masukkan keterangan detail barang atau catatan khusus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-900 mt-6">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#D977F9] hover:bg-[#c75be9] text-[#250F2D] font-bold rounded text-xs transition disabled:opacity-50"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Pengiriman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-4 border-b border-gray-900 bg-[#0A0C10]/60 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white tracking-wide">Edit Status & Tarif Pengiriman</h3>
              <button 
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingShipmentId(null);
                }} 
                className="text-gray-500 hover:text-white transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditShipment} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3.5 rounded text-xs text-center font-bold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Status Pengiriman *</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                >
                  <option value="Diproses">Diproses</option>
                  <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                  <option value="Sampai Tujuan">Sampai Tujuan</option>
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Status Barang *</label>
                <select
                  value={editStatusBarang}
                  onChange={(e) => setEditStatusBarang(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                >
                  <option value="Diproses">Diproses</option>
                  <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                  <option value="Sampai Tujuan">Sampai Tujuan</option>
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Status Transaksi *</label>
                <select
                  value={editStatusTransaksi}
                  onChange={(e) => setEditStatusTransaksi(e.target.value)}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                >
                  <option value="Diproses">Diproses</option>
                  <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                  <option value="Sampai Tujuan">Sampai Tujuan</option>
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Harga/Tarif Pengiriman (Rp) *</label>
                <input
                  required
                  type="number"
                  value={editTotalCost}
                  onChange={(e) => setEditTotalCost(Number(e.target.value))}
                  className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-900 mt-6">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingShipmentId(null);
                  }}
                  className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#D977F9] hover:bg-[#c75be9] text-[#250F2D] font-bold rounded text-xs transition disabled:opacity-50"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
