'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('System exception captured:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05060B] relative overflow-hidden font-mono px-4 text-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.06)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full bg-[#11131A]/60 border border-gray-800/80 rounded-2xl p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
        {/* Error icon */}
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-widest mb-4">Terjadi Kesalahan Sistem</h1>
        <h2 className="text-xs font-bold text-rose-500 tracking-[0.2em] mb-6 uppercase">FATAL ERROR DETECTED</h2>
        
        <p className="text-gray-400 text-xs leading-relaxed mb-6">
          Koneksi terganggu atau terjadi pengecualian saat merender komponen. Detail error telah dicatat di konsol sistem.
        </p>

        {error.digest && (
          <div className="bg-black/40 border border-gray-800 rounded p-3 text-[10px] text-gray-500 text-left font-mono mb-8 select-all">
            Digest: <span className="text-rose-400 font-bold">{error.digest}</span>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded text-xs font-bold tracking-widest transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            COBA LAGI
          </button>
        </div>
      </div>

      <div className="mt-8 text-[9px] text-gray-600 tracking-[0.2em]">
        SEA PARCEL FAULT RESILIENCE SYSTEM
      </div>
    </div>
  );
}
