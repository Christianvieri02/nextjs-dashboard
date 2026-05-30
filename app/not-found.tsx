import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan (404) | Sea Parcel',
  description: 'Halaman yang Anda cari tidak dapat ditemukan.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05060B] relative overflow-hidden font-mono px-4 text-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,249,0.06)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D977F9]/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>

      <div className="relative z-10 max-w-lg w-full bg-[#11131A]/60 border border-gray-800/80 rounded-2xl p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
        {/* Maritime Styled 404 Logo */}
        <div className="w-20 h-20 bg-[#D977F9]/10 border border-[#D977F9]/30 rounded-full flex items-center justify-center mx-auto mb-8 text-[#D977F9]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-7xl font-extrabold text-white tracking-widest mb-4">404</h1>
        <h2 className="text-sm font-bold text-[#00E5FF] tracking-[0.2em] uppercase mb-6">HALAMAN TIDAK DITEMUKAN</h2>
        
        <p className="text-gray-400 text-xs leading-relaxed mb-8">
          Kapal kargo Anda keluar dari radar. Halaman yang Anda cari tidak ditemukan atau telah dipindahkan ke koordinat lain.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="bg-[#D977F9] hover:bg-[#c75be9] text-[#250F2D] px-6 py-3 rounded text-xs font-bold tracking-widest transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(217,119,249,0.3)]"
          >
            MENU UTAMA
          </Link>
          <a
            href="javascript:history.back()"
            className="border border-gray-800 text-gray-400 hover:text-white px-6 py-3 rounded text-xs font-bold tracking-widest transition-all hover:bg-gray-900/40"
          >
            KEMBALI
          </a>
        </div>
      </div>

      <div className="mt-8 text-[9px] text-gray-600 tracking-[0.2em]">
        SEA PARCEL MONITORING SYSTEM &nbsp;|&nbsp; STATUS: DISCONNECTED
      </div>
    </div>
  );
}
