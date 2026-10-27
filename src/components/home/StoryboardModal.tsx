import React, { useState } from 'react';
import { X, Layers, Sparkles, Compass, Clock, MapPin, Eye, CheckCircle2, Navigation, Wind, Sun, RotateCw } from 'lucide-react';
import { QiblaRouteMap } from './QiblaRouteMap';
import { PrayerLiveWidget } from './PrayerLiveWidget';
import { HijriWeatherWidget } from './HijriWeatherWidget';

interface StoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string, meta?: unknown) => void;
}

export const StoryboardModal: React.FC<StoryboardModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [activeFrame, setActiveFrame] = useState<1 | 2 | 3 | 4 | 'all'>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#03152F] light:bg-[#FDFBF7] border border-[#D9A441]/50 p-4 sm:p-6 shadow-2xl text-[#F5F1E6] light:text-[#1A202C] max-h-[96vh] overflow-y-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#0D3169] light:border-[#E5DFD5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#D9A441] flex items-center justify-center text-[#FFE29A] light:text-[#2E6F52]">
              <Layers className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  STORYBOARD UI/UX — ZQuran Digital
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0647A5] text-[#FFE29A] font-semibold">
                  Dark Mode • Glassmorphism • Premium Gold
                </span>
              </div>
              <p className="text-xs text-[#8CA3C7] light:text-[#64748B]">
                Versi 1.0 • PWA Ready & Mobile-First High Fidelity Showcase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Storyboard"
            className="p-2 rounded-xl bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] hover:text-[#FFE29A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Frame Navigation Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 my-3">
          {[
            { id: 1, label: 'Frame 1: Beranda' },
            { id: 2, label: 'Frame 2: Beranda + Kiblat' },
            { id: 3, label: 'Frame 3: Kompas Kiblat' },
            { id: 4, label: 'Frame 4: Jadwal Sholat' },
            { id: 'all', label: 'Grid 4 Frame (Overview)' },
          ].map((item) => {
            const isSelected = activeFrame === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveFrame(item.id as 1 | 2 | 3 | 4 | 'all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0647A5] light:bg-[#2E6F52] text-[#FFE29A] light:text-white border-[#D9A441] shadow-md scale-102'
                    : 'bg-[#001F52]/80 light:bg-[#F4EFE6] text-[#8CA3C7] light:text-[#64748B] border-[#0D3169] light:border-[#E5DFD5]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Presentation Canvas */}
        <div className="rounded-3xl bg-[#051D42]/90 light:bg-[#FDFBF7] border border-[#0D3169] light:border-[#E5DFD5] p-4 sm:p-6 shadow-inner">
          {/* Frame 1: Beranda (Hero & Informasi Utama) */}
          {(activeFrame === 1 || activeFrame === 'all') && (
            <div className={`space-y-4 ${activeFrame === 'all' ? 'mb-8 pb-6 border-b border-[#0D3169]' : 'max-w-xl mx-auto'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#001F52] text-[#FFE29A] font-bold border border-[#D9A441]/40">
                  Frame 1 • Beranda (Hero & Informasi Utama)
                </span>
                <span className="text-[11px] text-[#8CA3C7]">13.29 WIB</span>
              </div>

              {/* Hero Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#03152F] border border-[#D9A441]/50 text-center relative overflow-hidden shadow-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001F52] border border-[#D9A441]/40 text-xs text-[#FFE29A] font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>☆ Al-Qur'an Digital Indonesia</span>
                </div>

                <p className="font-arabic text-2xl sm:text-3xl text-[#FFE29A] drop-shadow-md my-1">
                  ZQuran
                </p>

                <p className="text-xs text-[#8CA3C7] max-w-sm mx-auto mb-3">
                  Membaca, Memahami, dan Mendekatkan Diri kepada Al-Qur'an • 6 Qari • Tafsir • Kemenag RI • Mode auto-scroll
                </p>

                <div className="flex items-center justify-center gap-2.5">
                  <button
                    onClick={() => onNavigate && onNavigate('quran')}
                    className="px-4 py-2 rounded-xl bg-[#D9A441] text-xs font-bold text-[#03152F] shadow-md"
                  >
                    Mulai Membaca →
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('search')}
                    className="px-4 py-2 rounded-xl bg-[#001F52] text-xs font-semibold text-[#FFE29A] border border-[#0D3169]"
                  >
                    Cari Ayat
                  </button>
                </div>
              </div>

              {/* 2 Column Top Grid: Tanggal Hijriah & Cuaca */}
              <HijriWeatherWidget />

              {/* 2 Column Bottom Grid: Jadwal Sholat Live & Progress Tilawah 70% */}
              <PrayerLiveWidget
                onOpenTilawahSettings={() => onNavigate && onNavigate('settings')}
                onOpenPrayerScheduleModal={() => onNavigate && onNavigate('schedule')}
              />
            </div>
          )}

          {/* Frame 2: Beranda + Arah Kiblat */}
          {(activeFrame === 2 || activeFrame === 'all') && (
            <div className={`space-y-4 ${activeFrame === 'all' ? 'mb-8 pb-6 border-b border-[#0D3169]' : 'max-w-xl mx-auto'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#001F52] text-[#FFE29A] font-bold border border-[#D9A441]/40">
                  Frame 2 • Beranda + Arah Kiblat (Integrasi Widget Rute)
                </span>
                <span className="text-[11px] text-[#8CA3C7]">13.29 WIB</span>
              </div>

              <QiblaRouteMap onOpenCompassModal={() => onNavigate && onNavigate('qibla')} />
            </div>
          )}

          {/* Frame 3: Kompas Kiblat Fullscreen */}
          {(activeFrame === 3 || activeFrame === 'all') && (
            <div className={`space-y-4 ${activeFrame === 'all' ? 'mb-8 pb-6 border-b border-[#0D3169]' : 'max-w-xl mx-auto'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#001F52] text-[#FFE29A] font-bold border border-[#D9A441]/40">
                  Frame 3 • Kompas Kiblat (Halaman Kompas Kiblat • Fullscreen)
                </span>
                <span className="text-[11px] text-[#8CA3C7]">Kompas 294.8° NW</span>
              </div>

              <div className="p-6 rounded-3xl bg-[#001F52]/90 border border-[#D9A441]/50 text-center flex flex-col items-center shadow-xl">
                {/* Big Compass Dial with 294.8° and Ka'bah marker */}
                <div className="relative w-52 h-52 rounded-full border-4 border-[#D9A441] bg-[#03152F] flex items-center justify-center shadow-2xl my-2">
                  <span className="absolute top-2 text-xs font-bold text-[#EF4444]">N</span>
                  <span className="absolute right-3 text-[10px] font-bold text-[#8CA3C7]">E</span>
                  <span className="absolute bottom-2 text-[10px] font-bold text-[#8CA3C7]">S</span>
                  <span className="absolute left-3 text-[10px] font-bold text-[#8CA3C7]">W</span>

                  <div className="absolute top-12 right-10 text-[10px] font-bold text-[#FFE29A]">
                    Ka'bah
                  </div>

                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: 'rotate(294.8deg)' }}
                  >
                    <div className="w-2 h-26 bg-gradient-to-t from-transparent via-[#168BFF] to-[#FFE29A] rounded-full relative">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-lg bg-[#001F52] border border-[#D9A441] flex items-center justify-center shadow-lg">
                        <span className="text-xs">🕋</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[#FFE29A] border-2 border-[#001F52] flex items-center justify-center z-10 shadow">
                    <div className="w-2 h-2 rounded-full bg-[#0647A5]" />
                  </div>
                </div>

                <h3 className="font-mono text-3xl font-black text-[#FFE29A] mt-2 tracking-wider">
                  294.8°
                </h3>
                <p className="text-xs font-bold text-[#F5F1E6] mt-0.5">
                  Mengarahkan ke Ka'bah, Masjidil Haram — Barat Laut
                </p>
                <p className="text-[11px] text-[#8CA3C7] mt-0.5">
                  Sholat Berikutnya: <span className="text-[#FFE29A]">Maghrib 17:52 WIB</span> • Di barat Laut
                </p>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-2 w-full mt-4 text-left">
                  <div className="p-2.5 rounded-xl bg-[#03152F] border border-[#0D3169]">
                    <span className="text-[9px] text-[#8CA3C7]">Lokasi Anda</span>
                    <p className="text-[11px] font-bold text-[#F5F1E6] truncate">Baros, Banten</p>
                    <p className="text-[8px] text-[#8CA3C7] font-mono">-6.3978, 106.1520</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#03152F] border border-[#0D3169]">
                    <span className="text-[9px] text-[#8CA3C7]">Angin</span>
                    <p className="text-[11px] font-bold text-[#F5F1E6]">12 km/j</p>
                    <p className="text-[8px] text-[#10B981]">Tenang</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#03152F] border border-[#0D3169]">
                    <span className="text-[9px] text-[#8CA3C7]">UV Index</span>
                    <p className="text-[11px] font-bold text-[#F5F1E6]">3 • Sedang</p>
                    <p className="text-[8px] text-[#FFE29A]">Aman</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className="px-4 py-1.5 rounded-xl bg-[#03152F] text-xs font-bold text-[#FFE29A] border border-[#D9A441]/40">
                    ⟳ Kalibrasi Kompas
                  </span>
                  <p className="text-[10px] text-[#8CA3C7]">
                    Pastikan perangkat rata & jauh dari magnet • Update GPS: baik
                  </p>
                  <p className="text-[10px] text-[#FFE29A]">
                    Pengingat Maghrib: 5 menit sebelum 🔔
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Frame 4: Jadwal Sholat */}
          {(activeFrame === 4 || activeFrame === 'all') && (
            <div className={`space-y-4 ${activeFrame === 'all' ? 'mb-4' : 'max-w-xl mx-auto'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#001F52] text-[#FFE29A] font-bold border border-[#D9A441]/40">
                  Frame 4 • Jadwal Sholat (Dalaman Kompas Kiblat • Fullscreen)
                </span>
                <span className="text-[11px] text-[#8CA3C7]">Waktu Indonesia Barat</span>
              </div>

              {/* Frame 4 Top Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#001F52] border border-[#0D3169] text-center">
                  <div className="w-12 h-12 rounded-full border border-[#D9A441] mx-auto flex items-center justify-center font-mono text-xs font-bold text-[#FFE29A] mb-1">
                    294.8°
                  </div>
                  <h5 className="text-xs font-bold text-[#F5F1E6]">Arah Kiblat dari Baros</h5>
                  <p className="text-[10px] text-[#8CA3C7] mt-0.5">8.347 km • Barat Laut</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#001F52] border border-[#D9A441]/40 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-xs font-bold text-[#FFE29A]">Arah Kiblat</span>
                    <p className="text-[10px] text-[#10B981] mt-0.5">🟢 Akurasi GPS ±3m</p>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate('qibla')}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-[#D9A441] text-[#03152F] text-xs font-bold"
                  >
                    → Lihat Kompas
                  </button>
                </div>
              </div>

              {/* Complete Schedule List with green ticks */}
              <div className="p-4 rounded-2xl bg-[#001F52] border border-[#0D3169] space-y-2 text-xs">
                {[
                  { name: 'Subuh', time: '04:12' },
                  { name: 'Dzuhur', time: '11:45' },
                  { name: 'Ashar', time: '15:08' },
                  { name: 'Maghrib', time: '17:52', isNext: true },
                  { name: 'Isya', time: '19:06' },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between p-2.5 rounded-xl ${
                      p.isNext ? 'bg-[#0647A5] text-white font-bold border border-[#D9A441]' : 'bg-[#03152F] text-[#F5F1E6]'
                    }`}
                  >
                    <span>{p.name}</span>
                    <div className="flex items-center gap-2">
                      {p.isNext && (
                        <span className="text-[10px] text-[#FFE29A]">Berikutnya • 00:42:13</span>
                      )}
                      <span className="font-mono">{p.time}</span>
                      <span className="text-[#10B981] font-bold">✓</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-[10px] text-[#8CA3C7]">
                Diperbarui: 13:29 WIB • Metode Perhitungan: Kemenag RI • Pengingat Maghrib: 5 menit sebelum 🔔
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#0D3169] light:border-[#E5DFD5] flex items-center justify-between text-xs text-[#8CA3C7]">
          <span>Klik frame di atas untuk beralih atau pilih tab navigasi aplikasi.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0647A5] text-[#F5F1E6] font-semibold hover:bg-[#168BFF] transition cursor-pointer"
          >
            Tutup Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
