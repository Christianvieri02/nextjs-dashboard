'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createVesselAction, updateVesselAction, deleteVesselAction } from '../../lib/actions';

interface VesselItem {
  id: string;
  vessel_code: string;
  name: string;
  type: 'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Cargo';
  captain_name: string;
  status: 'En Route' | 'In Port' | 'Delayed' | 'Maintenance' | 'Active' | 'Inactive';
  capacity_muatan?: string | null;
  origin_port?: string | null;
  destination_port?: string | null;
  eta?: string | null;
  is_active?: boolean | null;
}

interface FleetClientProps {
  initialVessels: VesselItem[];
}

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

function formatRoute(status: string, origin: string | null | undefined, destination: string | null | undefined): string {
  if (!origin && !destination) return '-';
  if (status === 'In Port' && origin) {
    return origin.toLowerCase().includes('port') ? origin : `${origin} Port`;
  }
  if (origin && destination) {
    return `${origin} → ${destination}`;
  }
  return origin || destination || '-';
}

export default function FleetClient({ initialVessels }: FleetClientProps) {
  const router = useRouter();
  const [vessels, setVessels] = useState<VesselItem[]>(initialVessels);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    setVessels(initialVessels);
  }, [initialVessels]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [vesselCodeInput, setVesselCodeInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [typeInput, setTypeInput] = useState<'Container Ship' | 'Bulk Carrier' | 'Tanker' | 'Cargo'>('Container Ship');
  const [captainInput, setCaptainInput] = useState('');
  const [statusInput, setStatusInput] = useState<VesselItem['status']>('En Route');
  const [originPortInput, setOriginPortInput] = useState('');
  const [destinationPortInput, setDestinationPortInput] = useState('');
  const [etaInput, setEtaInput] = useState(new Date().toISOString().split('T')[0] + 'T12:00');
  const [isActiveInput, setIsActiveInput] = useState(true);
  const [capacityMuatanInput, setCapacityMuatanInput] = useState('1000 Ton');
  const [showCreateErrors, setShowCreateErrors] = useState(false);
  const [showEditErrors, setShowEditErrors] = useState(false);
  
  const [editingVesselId, setEditingVesselId] = useState<string | null>(null);
  const [deletingVesselId, setDeletingVesselId] = useState<string | null>(null);

  const countStatus = (statusName: string) => vessels.filter(v => v.status === statusName).length;

  const filteredVessels = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return vessels;
    return vessels.filter((vessel) => 
      vessel.vessel_code.toLowerCase().includes(query) ||
      vessel.name.toLowerCase().includes(query) ||
      vessel.captain_name.toLowerCase().includes(query) ||
      vessel.type.toLowerCase().includes(query) ||
      vessel.status.toLowerCase().includes(query)
    );
  }, [vessels, searchQuery]);

  const resetForm = () => {
    setVesselCodeInput('');
    setNameInput('');
    setTypeInput('Container Ship');
    setCaptainInput('');
    setStatusInput('En Route');
    setOriginPortInput('');
    setDestinationPortInput('');
    setEtaInput(new Date().toISOString().split('T')[0] + 'T12:00');
    setIsActiveInput(true);
    setCapacityMuatanInput('1000 Ton');
    setEditingVesselId(null);
    setShowCreateErrors(false);
    setShowEditErrors(false);
  };

  const handleCreateVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateErrors(true);
    if (!vesselCodeInput || !nameInput || !captainInput || !capacityMuatanInput) {
      alert('Please fill out all required fields.');
      return;
    }

    const res = await createVesselAction(
      vesselCodeInput,
      nameInput,
      typeInput,
      captainInput,
      statusInput,
      originPortInput,
      destinationPortInput,
      new Date(etaInput).toISOString(),
      isActiveInput,
      capacityMuatanInput
    );

    if (res.success) {
      setIsCreateOpen(false);
      resetForm();
      router.refresh();
    } else {
      alert(res.error || 'Failed to create vessel.');
    }
  };

  const openEditModal = (vessel: VesselItem) => {
    setEditingVesselId(vessel.id);
    setVesselCodeInput(vessel.vessel_code);
    setNameInput(vessel.name);
    setTypeInput(vessel.type);
    setCaptainInput(vessel.captain_name);
    setStatusInput(vessel.status);
    setOriginPortInput(vessel.origin_port || '');
    setDestinationPortInput(vessel.destination_port || '');
    setCapacityMuatanInput(vessel.capacity_muatan || '1000 Ton');
    
    if (vessel.eta) {
      const etaDate = new Date(vessel.eta);
      const tzOffset = etaDate.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(etaDate.getTime() - tzOffset)).toISOString().slice(0, -1);
      setEtaInput(localISOTime.substring(0, 16));
    } else {
      setEtaInput(new Date().toISOString().substring(0, 16));
    }
    
    setIsActiveInput(vessel.is_active !== false);
    setIsEditOpen(true);
  };

  const handleEditVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVesselId) return;
    setShowEditErrors(true);
    if (!vesselCodeInput || !nameInput || !captainInput || !capacityMuatanInput) {
      alert('Please fill out all required fields.');
      return;
    }

    const res = await updateVesselAction(
      editingVesselId,
      vesselCodeInput,
      nameInput,
      typeInput,
      captainInput,
      statusInput,
      originPortInput,
      destinationPortInput,
      new Date(etaInput).toISOString(),
      isActiveInput,
      capacityMuatanInput
    );

    if (res.success) {
      setIsEditOpen(false);
      resetForm();
      router.refresh();
    } else {
      alert(res.error || 'Failed to update vessel.');
    }
  };

  const openDeleteModal = (id: string) => {
    setDeletingVesselId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteVessel = async () => {
    if (!deletingVesselId) return;

    const res = await deleteVesselAction(deletingVesselId);
    if (res.success) {
      setIsDeleteOpen(false);
      setDeletingVesselId(null);
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete vessel.');
    }
  };

  return (
    <div className="font-mono">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl text-white mb-2 tracking-wide">Fleet Management</h1>
          <p className="text-[10px] text-gray-500 tracking-widest">COMPLETE LIST OF ALL VESSELS IN THE SEA PARCEL FLEET</p>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowCreateErrors(false);
            setIsCreateOpen(true);
          }}
          className="bg-[#A855F7] hover:bg-[#9333EA] text-white px-5 py-2.5 rounded-md text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.35)] active:scale-[0.98] transition-all"
        >
          Add Vessel <span>+</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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

      <div className="mb-6 relative w-full sm:w-[350px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search fleet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#11131A]/80 border border-gray-800/80 rounded-md py-2.5 pl-11 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30 transition"
        />
      </div>

      <div className="bg-[#11131A] rounded border border-gray-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/80 text-[9px] text-gray-500 uppercase tracking-widest bg-[#0A0C10]/60">
                <th className="p-5 font-normal">VESSEL ID</th>
                <th className="p-5 font-normal">NAME</th>
                <th className="p-5 font-normal">TYPE</th>
                <th className="p-5 font-normal">CAPTAIN</th>
                <th className="p-5 font-normal">CAPACITY</th>
                <th className="p-5 font-normal">STATUS</th>
                <th className="p-5 font-normal">ROUTE</th>
                <th className="p-5 font-normal">ETA</th>
                <th className="p-5 font-normal text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-xs text-gray-400 divide-y divide-gray-800/30">
              {filteredVessels.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-gray-500 font-mono">
                    NO VESSELS REGISTERED IN FLEET
                  </td>
                </tr>
              ) : (
                filteredVessels.map((vessel, idx) => {
                  const statusColor = getStatusColor(vessel.status);
                  const route = formatRoute(vessel.status, vessel.origin_port, vessel.destination_port);
                  const eta = formatETA(vessel.eta);

                  return (
                    <tr key={vessel.id} className="border-b border-gray-800/50 hover:bg-[#1A1C24]/30 transition-colors">
                      <td className="p-5 text-gray-500">{vessel.vessel_code}</td>
                      
                      <td className="p-5 font-bold text-white flex items-center gap-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D977F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12h20"></path><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path><path d="M12 12v-6"></path>
                        </svg>
                        {vessel.name}
                      </td>
                      
                      <td className="p-5">{vessel.type}</td>
                      
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {vessel.captain_name}
                        </div>
                      </td>

                      <td className="p-5 font-bold text-white">{vessel.capacity_muatan || '1000 Ton'}</td>
                      
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] border ${statusColor}`}>
                          {vessel.status}
                        </span>
                      </td>
                      
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {route}
                        </div>
                      </td>
                      
                      <td className="p-5 text-gray-500">{eta}</td>
                      
                      <td className="p-5 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(vessel)}
                            className="p-1 text-gray-500 hover:text-white rounded transition-colors"
                            title="Edit Vessel"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(vessel.id)}
                            className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                            title="Delete Vessel"
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-4 border-b border-gray-900 bg-[#0A0C10]/60 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white tracking-wide">Register Vessel</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-500 hover:text-white transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form noValidate onSubmit={handleCreateVessel} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Vessel Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. V006"
                    value={vesselCodeInput}
                    onChange={(e) => setVesselCodeInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showCreateErrors && !vesselCodeInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Vessel Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. RED DRAGON"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showCreateErrors && !nameInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Type</label>
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value as any)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Container Ship">Container Ship</option>
                    <option value="Bulk Carrier">Bulk Carrier</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Cargo">Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Captain Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Capt. Sarah Connor"
                    value={captainInput}
                    onChange={(e) => setCaptainInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showCreateErrors && !captainInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Vessel Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="En Route">En Route</option>
                    <option value="In Port">In Port</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Kapasitas Muatan *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1000 Ton"
                    value={capacityMuatanInput}
                    onChange={(e) => setCapacityMuatanInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showCreateErrors && !capacityMuatanInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="border-t border-gray-800/80 pt-4 mt-2">
                <h4 className="text-[10px] text-[#D977F9] font-bold tracking-widest uppercase mb-4">Voyage Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Origin Port</label>
                    <input
                      type="text"
                      placeholder="e.g. Shanghai"
                      value={originPortInput}
                      onChange={(e) => setOriginPortInput(e.target.value)}
                      className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Destination Port</label>
                    <input
                      type="text"
                      placeholder="e.g. Jakarta"
                      value={destinationPortInput}
                      onChange={(e) => setDestinationPortInput(e.target.value)}
                      className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">ETA</label>
                    <input
                      type="datetime-local"
                      value={etaInput}
                      onChange={(e) => setEtaInput(e.target.value)}
                      className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Voyage Active</label>
                    <div className="flex items-center h-11">
                      <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                        <input
                          type="checkbox"
                          checked={isActiveInput}
                          onChange={(e) => setIsActiveInput(e.target.checked)}
                          className="text-[#A855F7] focus:ring-0 focus:ring-offset-0 bg-gray-800 border-gray-700 rounded w-4 h-4"
                        />
                        Active
                      </label>
                    </div>
                  </div>
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
                  Register Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-4 border-b border-gray-900 bg-[#0A0C10]/60 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white tracking-wide">Edit Vessel ({vesselCodeInput})</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-white transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form noValidate onSubmit={handleEditVessel} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Vessel Code *</label>
                  <input
                    type="text"
                    value={vesselCodeInput}
                    onChange={(e) => setVesselCodeInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showEditErrors && !vesselCodeInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Vessel Name *</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showEditErrors && !nameInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Type</label>
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value as any)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="Container Ship">Container Ship</option>
                    <option value="Bulk Carrier">Bulk Carrier</option>
                    <option value="Tanker">Tanker</option>
                    <option value="Cargo">Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Captain Name *</label>
                  <input
                    type="text"
                    value={captainInput}
                    onChange={(e) => setCaptainInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showEditErrors && !captainInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Vessel Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                  >
                    <option value="En Route">En Route</option>
                    <option value="In Port">In Port</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Kapasitas Muatan *</label>
                  <input
                    type="text"
                    value={capacityMuatanInput}
                    onChange={(e) => setCapacityMuatanInput(e.target.value)}
                    className={`w-full bg-[#1A1C24] border rounded p-3 text-xs text-white focus:outline-none transition ${
                      showEditErrors && !capacityMuatanInput
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-gray-800 focus:border-[#D977F9] focus:ring-1 focus:ring-[#D977F9]/30'
                    }`}
                  />
                </div>
              </div>

              <div className="border-t border-gray-800/80 pt-4 mt-2">
                <h4 className="text-[10px] text-[#D977F9] font-bold tracking-widest uppercase mb-4">Voyage Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Origin Port</label>
                    <input
                      type="text"
                      placeholder="e.g. Shanghai"
                      value={originPortInput}
                      onChange={(e) => setOriginPortInput(e.target.value)}
                      className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Destination Port</label>
                    <input
                      type="text"
                      placeholder="e.g. Jakarta"
                      value={destinationPortInput}
                      onChange={(e) => setDestinationPortInput(e.target.value)}
                      className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">ETA</label>
                    <input
                      type="datetime-local"
                      value={etaInput}
                      onChange={(e) => setEtaInput(e.target.value)}
                      className="w-full bg-[#1A1C24] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:border-[#D977F9] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[9px] font-bold uppercase tracking-wider mb-2">Voyage Active</label>
                    <div className="flex items-center h-11">
                      <label className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                        <input
                          type="checkbox"
                          checked={isActiveInput}
                          onChange={(e) => setIsActiveInput(e.target.checked)}
                          className="text-[#A855F7] focus:ring-0 focus:ring-offset-0 bg-gray-800 border-gray-700 rounded w-4 h-4"
                        />
                        Active
                      </label>
                    </div>
                  </div>
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
          <div className="bg-[#11131A] border border-gray-800/80 rounded-lg w-full max-w-sm shadow-2xl overflow-hidden font-mono">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-2">Decommission Vessel</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Are you sure you want to remove this vessel from the fleet registry? This action cannot be undone.
              </p>
            </div>
            
            <div className="px-6 py-4 bg-[#0A0C10]/60 border-t border-gray-900/60 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeletingVesselId(null);
                }}
                className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVessel}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded text-xs transition"
              >
                Decommission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
