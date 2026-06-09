'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerUserAction, fetchUsersAction, updateUserAction, deleteUserAction } from '../../lib/actions';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  username?: string;
  company_name?: string;
  company_address?: string;
  role?: string;
  status?: string;
}

interface UsersClientProps {
  initialUsers: User[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('User');
  const [editStatus, setEditStatus] = useState('Aktif');
  const [editCompanyName, setEditCompanyName] = useState('-');
  const [editCompanyAddress, setEditCompanyAddress] = useState('-');
  const [editErrorMsg, setEditErrorMsg] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [showAddErrors, setShowAddErrors] = useState(false);
  const [showEditErrors, setShowEditErrors] = useState(false);

  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem('user_session');
      if (sessionStr) {
        const sess = JSON.parse(sessionStr);
        setCurrentUser({ id: sess.id, email: sess.email });
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }, []);

  const reloadUsers = async () => {
    const res = await fetchUsersAction(true);
    if (res.success && res.data) {
      setUsers(res.data as any as User[]);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (currentUser && user.id === currentUser.id) {
      alert('Tidak dapat menghapus diri sendiri.');
      return;
    }
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.full_name}"? Semua pengiriman dan tagihan pengguna ini juga akan terhapus.`);
    if (!confirmed) return;

    try {
      const res = await deleteUserAction(user.id, currentUser?.id);
      if (res.success) {
        alert('User berhasil dihapus.');
        await reloadUsers();
      } else {
        alert(res.error || 'Gagal menghapus user.');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFullName(user.full_name || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditRole(user.role || 'User');
    setEditStatus(user.status || 'Aktif');
    setEditCompanyName(user.company_name || '-');
    setEditCompanyAddress(user.company_address || '-');
    setEditErrorMsg('');
    setEditSuccessMsg('');
    setShowEditErrors(false);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditErrorMsg('');
    setEditSuccessMsg('');
    setIsEditSubmitting(true);

    if (!editingUser) return;

    setShowEditErrors(true);
    if (!editFullName || !editEmail || !editPhone) {
      setEditErrorMsg('Nama, Email, dan Telepon harus diisi.');
      setIsEditSubmitting(false);
      return;
    }

    try {
      const res = await updateUserAction(
        editingUser.id,
        editFullName,
        editEmail,
        editPhone,
        editCompanyName,
        editCompanyAddress,
        editRole,
        editStatus
      );

      if (res.success) {
        setEditSuccessMsg('User berhasil diperbarui!');
        await reloadUsers();
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
          setEditSuccessMsg('');
        }, 1500);
      } else {
        setEditErrorMsg(res.error || 'Gagal memperbarui user.');
      }
    } catch (err: any) {
      setEditErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setShowAddErrors(true);

    if (!fullName || !email || !phone || !password) {
      setErrorMsg('Semua kolom harus diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await registerUserAction(fullName, email, phone, password);
      if (res.success) {
        setSuccessMsg('User berhasil ditambahkan!');
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        
        await reloadUsers();
        
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
          setShowAddErrors(false);
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Gagal menambahkan user.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.phone && user.phone.includes(query))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Kelola Pengguna</h1>
          <p className="text-xs text-gray-500 mt-1">Manajemen akun pengguna sistem</p>
        </div>
        
        <button
          suppressHydrationWarning
          onClick={() => {
            setFullName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setErrorMsg('');
            setSuccessMsg('');
            setShowAddErrors(false);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-[#7C3AED] to-[#D977F9] hover:opacity-90 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-1.5 self-start md:self-auto"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah User
        </button>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </span>
        <input
          suppressHydrationWarning
          type="text"
          placeholder="Cari nama, email, atau username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121622] text-sm text-white placeholder-gray-500 pl-10 pr-4 py-3 rounded-lg border border-gray-800/80 focus:outline-none focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30 transition-all font-sans"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800/60 bg-[#0E1017] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#7C3AED] text-white text-[11px] font-bold uppercase tracking-wider border-b border-purple-700">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Kontak</th>
              <th className="py-4 px-6">Perusahaan</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/40 text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                  Tidak ditemukan data pengguna.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const initial = user.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'US';
                const isSystemAdmin = user.email === 'admin@seaparcel.com';
                const derivedUsername = user.username || user.email.split('@')[0];
                const displayCompany = user.company_name && user.company_name !== '-' ? user.company_name : '-';
                const displayAddress = user.company_address && user.company_address !== '-' ? user.company_address : '';
                const displayRole = user.role || 'User';
                const displayStatus = user.status || 'Aktif';
                
                return (
                  <tr key={user.id} className="hover:bg-[#151926]/40 transition-colors bg-[#0B0D14]/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1A1F30] border border-gray-800 flex items-center justify-center text-xs font-bold text-[#D977F9] shadow-inner shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate text-xs">{user.full_name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">@{derivedUsername}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-sans">
                      <p className="text-white font-medium text-xs">{user.email}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{user.phone || '-'}</p>
                    </td>

                    <td className="py-4 px-6 font-sans">
                      <p className="text-white text-xs">{displayCompany}</p>
                      {displayAddress && <p className="text-[10px] text-gray-500 mt-0.5">{displayAddress}</p>}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {displayRole === 'Admin' ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                            <span className="text-xs text-purple-400 font-medium">Admin</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span className="text-xs text-blue-400 font-medium">User</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#132A22] text-[#00E5FF] border border-[#00E5FF]/20 uppercase tracking-wider">
                        {displayStatus === 'Aktif' ? 'AKTIF' : displayStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          suppressHydrationWarning
                          onClick={() => handleEditClick(user)}
                          className="p-1.5 rounded transition-all text-gray-400 hover:text-white hover:bg-gray-800"
                          title="Edit User"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        {(() => {
                          const isSelf = currentUser && user.id === currentUser.id;
                          return (
                            <button 
                              suppressHydrationWarning
                              disabled={!!isSelf}
                              onClick={() => handleDeleteUser(user)}
                              className={`p-1.5 rounded transition-all ${isSelf ? 'text-gray-700 cursor-not-allowed opacity-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'}`}
                              title={isSelf ? "Tidak dapat menghapus diri sendiri" : "Hapus User"}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0F121C] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden font-sans border-t-4 border-t-[#7C3AED]">
            <div className="p-5 border-b border-gray-900 flex justify-between items-center bg-[#090B11]/50">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Tambah Pengguna Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form noValidate onSubmit={handleAddUser} className="p-5 space-y-4">
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{successMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: John Doe"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showAddErrors && !fullName
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: john@example.com"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showAddErrors && !email
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Telepon</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: +62 813 9876 5432"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showAddErrors && !phone
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password minimal 6 karakter"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showAddErrors && !password
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white font-bold text-xs p-3 rounded-lg transition-all border border-gray-800/80"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#D977F9] hover:opacity-90 text-white font-bold text-xs p-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-[#0F121C] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden font-sans border-t-4 border-t-[#7C3AED]">
            <div className="p-5 border-b border-gray-900 flex justify-between items-center bg-[#090B11]/50">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Edit Pengguna</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form noValidate onSubmit={handleEditSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {editErrorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{editErrorMsg}</span>
                </div>
              )}
              {editSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Contoh: John Doe"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showEditErrors && !editFullName
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Contoh: john@example.com"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showEditErrors && !editEmail
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Telepon</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Contoh: +62 813 9876 5432"
                  className={`w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border focus:outline-none transition-all ${
                    showEditErrors && !editPhone
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                      : 'border-gray-800 focus:border-[#7C3AED]/70 focus:ring-1 focus:ring-[#7C3AED]/30'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-[#121622] text-xs text-white p-3 rounded-lg border border-gray-800 focus:outline-none focus:border-[#7C3AED]/70 transition-all cursor-pointer"
                    required
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-[#121622] text-xs text-white p-3 rounded-lg border border-gray-800 focus:outline-none focus:border-[#7C3AED]/70 transition-all cursor-pointer"
                    required
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Perusahaan</label>
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  placeholder="Contoh: PT. Maju Bersama"
                  className="w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border border-gray-800 focus:outline-none focus:border-[#7C3AED]/70 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Perusahaan</label>
                <input
                  type="text"
                  value={editCompanyAddress}
                  onChange={(e) => setEditCompanyAddress(e.target.value)}
                  placeholder="Contoh: Jakarta, Indonesia"
                  className="w-full bg-[#121622] text-xs text-white placeholder-gray-600 p-3 rounded-lg border border-gray-800 focus:outline-none focus:border-[#7C3AED]/70 transition-all"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-white font-bold text-xs p-3 rounded-lg transition-all border border-gray-800/80"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#7C3AED] to-[#D977F9] hover:opacity-90 text-white font-bold text-xs p-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isEditSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
