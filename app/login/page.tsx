'use client'; // Wajib ditambahkan untuk interaksi klik

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { registerUserAction, loginUserAction } from '../lib/actions';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);


export default function LoginPage() {
  // State untuk menyimpan tab mana yang sedang aktif (user atau admin)
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // State untuk registrasi
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showLoginErrors, setShowLoginErrors] = useState(false);
  const [showRegisterErrors, setShowRegisterErrors] = useState(false);
  
  // Router untuk berpindah halaman
  const router = useRouter();

  // Hapus sesi pengguna saat halaman dimuat (auto sign-out)
  useEffect(() => {
    localStorage.removeItem('user_session');
  }, []);

  // Fungsi saat tombol login ditekan
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setShowLoginErrors(true);
    if (!username || !password) {
      setErrorMsg('Username dan Password wajib diisi.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(''); 
    setSuccessMsg('');

    try {
      const res = await loginUserAction(username, password, activeTab);
      if (res.success && res.user) {
        // Simpan detail sesi login ke localStorage
        localStorage.setItem('user_session', JSON.stringify({
          id: res.user.id,
          username: res.user.username,
          role: res.user.role,
          email: res.user.email,
          fullName: res.user.fullName,
          phone: res.user.phone
        }));

        if (activeTab === 'user') {
          router.push('/user'); 
        } else {
          router.push('/dashboard'); 
        }
      } else {
        setErrorMsg(res.error || 'Akses ditolak! Periksa kembali kredensial Anda.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('Terjadi kesalahan saat masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi saat tombol registrasi ditekan
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegisterErrors(true);

    const trimmedEmail = regEmail.trim();
    const trimmedPhone = regPhone.trim();

    if (!fullName || !trimmedEmail || !trimmedPhone || !regPassword || !regConfirmPassword) {
      setErrorMsg('Harap lengkapi semua kolom.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerUserAction(fullName, trimmedEmail, trimmedPhone, regPassword);
      if (res.success) {
        setSuccessMsg('Akun berhasil terdaftar! Silakan masuk dengan kredensial Anda.');
        setUsername(trimmedEmail);
        setPassword(regPassword);
        setActiveTab('user');
        setIsRegistering(false);

        // Reset state input form registrasi
        setFullName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
        setRegConfirmPassword('');
        setShowRegisterErrors(false);
      } else {
        setErrorMsg(res.error || 'Gagal mendaftarkan akun.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan saat mendaftarkan akun.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050A] relative overflow-hidden">
      
      {/* Gambar Background Latar */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/60 to-transparent"></div>

      {/* Kad Log Masuk */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo & Tajuk */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#D977F9]/10 border border-[#D977F9]/30 rounded-lg flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D977F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14L6 18H18L20 14M4 14L2 10H22L20 14M4 14H20" />
              <path d="M7 10V6H17V10" />
              <path d="M10 6V4H14V6" />
              <path d="M2 21C2 21 3.5 19.5 6 19.5C8.5 19.5 10 21 12 21C14 21 15.5 19.5 18 19.5C20.5 19.5 22 21 22 21" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Sea Parcel</h1>
          <p className="text-[#00E5FF] text-[10px] font-bold tracking-[0.2em] mt-2">EXPRESS SHIPPING PORTAL</p>
        </div>

        {/* Borang Log Masuk */}
        <div className="bg-[#11131A] p-8 rounded-lg border border-gray-800 shadow-2xl">
          
          {isRegistering ? (
            <>
              {/* Header Registrasi */}
              <div className="mb-8 text-center">
                <h2 className="text-lg font-bold text-white tracking-widest uppercase">BUAT AKUN BARU</h2>
                <p className="text-gray-500 text-[10px] tracking-wide mt-1">DAFTAR UNTUK MENGAKSES PORTAL SEA PARCEL</p>
              </div>

              <form noValidate onSubmit={handleRegister} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-white text-[10px] font-bold mb-2 tracking-widest uppercase">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">✍️</span>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="NAMA LENGKAP ANDA" 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showRegisterErrors && !fullName
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[10px] font-bold mb-2 tracking-widest uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">✉️</span>
                    <input 
                      type="email" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ALAMAT EMAIL ANDA" 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showRegisterErrors && !regEmail
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[10px] font-bold mb-2 tracking-widest uppercase">
                    Nomor Telepon
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">📞</span>
                    <input 
                      type="tel" 
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="NOMOR TELEPON AKTIF" 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showRegisterErrors && !regPhone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[10px] font-bold mb-2 tracking-widest uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">🔒</span>
                    <input 
                      type="password" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••" 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showRegisterErrors && !regPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[10px] font-bold mb-2 tracking-widest uppercase">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">🔒</span>
                    <input 
                      type="password" 
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showRegisterErrors && !regConfirmPassword
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full font-bold text-xs tracking-widest py-4 rounded transition mt-4 ${
                    isLoading 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#D977F9] text-[#250F2D] hover:bg-[#c75be9] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? 'CREATING ACCOUNT...' : 'DAFTAR SEKARANG'}
                </button>

                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                      setShowRegisterErrors(false);
                      setShowLoginErrors(false);
                    }}
                    className="text-gray-500 hover:text-[#D977F9] text-[10px] font-bold tracking-widest uppercase"
                  >
                    ← KEMBALI KE LOGIN
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Tab Pengguna / Admin (BISA DIKLIK) */}
              <div className="flex mb-8 rounded bg-black overflow-hidden border border-gray-800">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveTab('user');
                    setShowLoginErrors(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'user' ? 'bg-[#D977F9] text-[#250F2D]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  USER
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setShowLoginErrors(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'admin' ? 'bg-[#D977F9] text-[#250F2D]' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  ADMIN
                </button>
              </div>

              <form noValidate onSubmit={handleLogin} className="space-y-6">
                
                {successMsg && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-xs p-3 rounded text-center font-semibold">
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-white text-[10px] font-bold mb-2 tracking-widest uppercase">
                    {activeTab === 'admin' ? 'Admin ID' : 'Username / Email'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">👤</span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={activeTab === 'admin' ? "ENTER ADMIN ID" : "USERNAME OR EMAIL"} 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showLoginErrors && !username
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-white text-[10px] font-bold tracking-widest uppercase">Password</label>
                    <a href="#" className="text-gray-500 text-[10px] hover:text-[#D977F9]">FORGOT KEY?</a>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">🔒</span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className={`w-full bg-[#1A1C24] border text-white text-xs p-4 pl-10 rounded focus:outline-none placeholder-gray-600 transition ${
                        showLoginErrors && !password
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-transparent focus:border-[#D977F9]'
                      }`} 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full font-bold text-xs tracking-widest py-4 rounded transition mt-4 ${
                    isLoading 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#D977F9] text-[#250F2D] hover:bg-[#c75be9] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
                </button>

                <div className="text-center mt-4">
                  <span className="text-gray-500 text-[10px]">Belum memiliki akses? </span>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[#00E5FF] hover:text-[#D977F9] text-[10px] font-bold tracking-widest uppercase"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-8 text-center border-t border-gray-800 pt-6">
            <p className="text-[#00E5FF] text-[9px] font-bold tracking-[0.1em] flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse"></span> SECURE CONNECTION ESTABLISHED
            </p>
            <p className="text-gray-600 text-[9px] tracking-[0.15em] uppercase">ENCRYPTION: AES-256 &nbsp;&nbsp;|&nbsp;&nbsp; PORT: 443 &nbsp;&nbsp;|&nbsp;&nbsp; NODE: MAR-72-B</p>
          </div>
        </div>
      </div>
    </div>
  );
}