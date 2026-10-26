import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Jika sudah terinstal di home screen (standalone mode), jangan tampilkan tombol
  if (isInstalled) {
    return null;
  }

  // Alur Chromium / Desktop / Android yang mendukung beforeinstallprompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        aria-label="Install Aplikasi ZQuran ke Home Screen"
        className={`flex items-center gap-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] transition cursor-pointer border border-[#168BFF]/40 shadow-sm ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs md:text-sm font-medium'
        }`}
      >
        <Download className="w-4 h-4 text-[#FFE29A]" />
        <span>Install App</span>
      </button>
    );
  }

  // Alur iOS Safari (WebKit tidak mendukung beforeinstallprompt otomatis)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          aria-label="Petunjuk Install di iPhone atau iPad"
          className={`flex items-center gap-2 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-[#F5F1E6] transition cursor-pointer border border-[#0D3169] ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs md:text-sm font-medium'
          }`}
        >
          <Download className="w-4 h-4 text-[#D9A441]" />
          <span>Install di iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/80 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#051D42] border border-[#0D3169] p-6 shadow-2xl relative text-[#F5F1E6]">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-[#8CA3C7] hover:text-[#F5F1E6] cursor-pointer"
                aria-label="Tutup petunjuk"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/pwa-192x192.png"
                  alt="ZQuran Icon"
                  className="w-12 h-12 rounded-xl shadow border border-[#D9A441]/40"
                />
                <div>
                  <h3 className="text-base font-bold text-[#F5F1E6]">Pasang ZQuran</h3>
                  <p className="text-xs text-[#8CA3C7]">Akses cepat dari Home Screen iOS</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#8CA3C7] mb-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
                  <Share2 className="w-5 h-5 text-[#168BFF] shrink-0 mt-0.5" />
                  <p>
                    1. Buka ZQuran di <strong>Safari</strong> lalu ketuk tombol <strong>Bagikan (Share)</strong> di bilah bawah.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
                  <PlusSquare className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />
                  <p>
                    2. Gulir ke bawah lalu pilih <strong>Tambah ke Layar Utama (Add to Home Screen)</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-xs font-semibold transition cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
