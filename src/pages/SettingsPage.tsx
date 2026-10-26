import React, { useState, useEffect } from 'react';
import {
  Moon,
  Type,
  Languages,
  BookOpen,
  Volume2,
  Sun,
  Maximize2,
  Info,
  Star,
  Trash2,
  RotateCcw,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { BRANDING, QARI_LIST } from '../config/appConfig';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { RatingModal } from '../components/modals/RatingModal';
import { InfoModal } from '../components/modals/InfoModal';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { currentQari, setQari } = useAudio();

  // Modals
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Screen Wake Lock State & Detection
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);
  const [wakeLockSupported, setWakeLockSupported] = useState(true);
  const [wakeLockNotice, setWakeLockNotice] = useState<string | null>(null);

  // Fullscreen State & Detection
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const [fullscreenNotice, setFullscreenNotice] = useState<string | null>(null);

  useEffect(() => {
    // Detect Screen Wake Lock capability
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      setWakeLockSupported(false);
    }

    // Detect Fullscreen capability
    if (typeof document === 'undefined' || !document.fullscreenEnabled) {
      setFullscreenSupported(false);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  const toggleWakeLock = async () => {
    if (!wakeLockSupported) {
      setWakeLockNotice('Fitur menjaga layar tetap menyala tidak didukung browser ini.');
      setTimeout(() => setWakeLockNotice(null), 4000);
      return;
    }

    if (wakeLockActive && wakeLockSentinel) {
      try {
        await wakeLockSentinel.release();
        setWakeLockSentinel(null);
        setWakeLockActive(false);
      } catch {}
    } else {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        setWakeLockSentinel(sentinel);
        setWakeLockActive(true);
        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
          setWakeLockSentinel(null);
        });
      } catch {
        setWakeLockNotice('Gagal mengaktifkan Screen Wake Lock pada browser.');
        setTimeout(() => setWakeLockNotice(null), 4000);
      }
    }
  };

  const toggleFullscreen = async () => {
    if (!fullscreenSupported) {
      setFullscreenNotice('Mode layar penuh tidak didukung pada browser ini.');
      setTimeout(() => setFullscreenNotice(null), 4000);
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setFullscreenNotice('Izin layar penuh dibatasi oleh browser.');
      setTimeout(() => setFullscreenNotice(null), 4000);
    }
  };

  const handleClearCache = () => {
    if (confirm('Bersihkan seluruh cache ayat tersimpan dan muat ulang?')) {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith('zquran_cache_')) {
          localStorage.removeItem(k);
        }
      }
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-28 md:pb-20 max-w-3xl mx-auto text-[#F5F1E6]">
      {/* Page Title */}
      <div className="pb-3 border-b border-[#0D3169]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F1E6] tracking-tight">
          Pengaturan
        </h2>
        <p className="text-xs text-[#8CA3C7] mt-0.5">
          Sesuaikan pengalaman membaca Al-Qur'an sesuai kebutuhan Anda.
        </p>
      </div>

      {/* Notice Banners */}
      {wakeLockNotice && (
        <div className="p-3 rounded-xl bg-[#001F52] border border-[#D9A441] text-xs text-[#FFE29A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D9A441]" />
          <span>{wakeLockNotice}</span>
        </div>
      )}
      {fullscreenNotice && (
        <div className="p-3 rounded-xl bg-[#001F52] border border-[#D9A441] text-xs text-[#FFE29A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D9A441]" />
          <span>{fullscreenNotice}</span>
        </div>
      )}

      {/* SECTION 1: TAMPILAN */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Tampilan
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] divide-y divide-[#0D3169]/60">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-[#FFE29A]" />
              <div>
                <h4 className="text-sm font-semibold text-[#F5F1E6]">Tema Aplikasi</h4>
                <p className="text-xs text-[#8CA3C7]">Mode gelap tenang ramah mata</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#001F52] border border-[#0D3169] text-[#FFE29A]">
              Gelap (Aktif)
            </span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[#168BFF]" />
              <div>
                <h4 className="text-sm font-semibold text-[#F5F1E6]">Mode Baca Qur'an</h4>
                <p className="text-xs text-[#8CA3C7]">Tampilan mushaf per ayat terstruktur</p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#8CA3C7]">
              Per Ayat & Tajwid
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: ARABIC */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Arabic
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-4 sm:p-5 space-y-4">
          {/* Live Preview */}
          <div className="p-3.5 rounded-xl bg-[#001F52]/80 border border-[#0D3169] text-right space-y-1">
            <p
              className={`${
                settings.arabicFontFamily === 'scheherazade'
                  ? 'font-arabic-scheherazade'
                  : 'font-arabic'
              } text-[#F5F1E6] select-text`}
              style={{ fontSize: `${settings.arabicFontSize}px`, lineHeight: 2.3 }}
              dir="rtl"
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>

          {/* Jenis Penulisan Arabic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8CA3C7]">
              Jenis Penulisan Arabic
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ arabicFontFamily: 'amiri' })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  settings.arabicFontFamily === 'amiri'
                    ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                    : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Amiri (Mushaf Madinah)</span>
                  {settings.arabicFontFamily === 'amiri' && <Check className="w-3.5 h-3.5 text-[#FFE29A]" />}
                </div>
                <p className="font-arabic text-base text-[#D9A441] mt-0.5" dir="rtl">
                  الفاتحة
                </p>
              </button>

              <button
                onClick={() => updateSettings({ arabicFontFamily: 'scheherazade' })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  settings.arabicFontFamily === 'scheherazade'
                    ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                    : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Scheherazade (Naskh)</span>
                  {settings.arabicFontFamily === 'scheherazade' && <Check className="w-3.5 h-3.5 text-[#FFE29A]" />}
                </div>
                <p className="font-arabic-scheherazade text-base text-[#D9A441] mt-0.5" dir="rtl">
                  الفاتحة
                </p>
              </button>
            </div>
          </div>

          {/* Ukuran Font Arabic */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8CA3C7]">Ukuran Font Arabic</span>
              <span className="font-mono text-[#FFE29A] font-bold">{settings.arabicFontSize} px</span>
            </div>
            <input
              type="range"
              min={22}
              max={48}
              step={2}
              value={settings.arabicFontSize}
              onChange={(e) => updateSettings({ arabicFontSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-[#001F52] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: LATIN (TRANSLITERASI) */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Latin (Transliterasi)
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#F5F1E6]">Aktifkan Latin</h4>
              <p className="text-xs text-[#8CA3C7]">Tampilkan ejaan latin di bawah teks Arab</p>
            </div>
            <button
              onClick={() => updateSettings({ showTransliteration: !settings.showTransliteration })}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                settings.showTransliteration ? 'bg-[#0647A5]' : 'bg-[#001F52] border border-[#0D3169]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.showTransliteration ? 'translate-x-6 bg-[#FFE29A]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: TERJEMAHAN */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Terjemahan
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]/60">
            <div>
              <h4 className="text-sm font-semibold text-[#F5F1E6]">Aktifkan Terjemahan</h4>
              <p className="text-xs text-[#8CA3C7]">Tampilkan arti ayat dalam bahasa Indonesia</p>
            </div>
            <button
              onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                settings.showTranslation ? 'bg-[#0647A5]' : 'bg-[#001F52] border border-[#0D3169]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.showTranslation ? 'translate-x-6 bg-[#FFE29A]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8CA3C7]">Penerjemah Resmi</span>
            <span className="font-semibold text-[#F5F1E6]">Kementerian Agama Republik Indonesia</span>
          </div>

          {/* Ukuran Font Terjemahan */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#8CA3C7]">Ukuran Font Terjemahan</span>
              <span className="font-mono text-[#FFE29A] font-bold">{settings.translationFontSize} px</span>
            </div>
            <input
              type="range"
              min={13}
              max={22}
              step={1}
              value={settings.translationFontSize}
              onChange={(e) => updateSettings({ translationFontSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-[#001F52] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: AUDIO MURATTAL */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Audio Murattal
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-4 sm:p-5 space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[#F5F1E6]">Qori Murattal</h4>
            <p className="text-xs text-[#8CA3C7]">Pilih lantunan suara qari favorit Anda</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QARI_LIST.map((q) => {
              const isSelected = settings.preferredQari === q.id;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setQari(q.id);
                    updateSettings({ preferredQari: q.id });
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                      : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#F5F1E6]">{q.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FFE29A]" />}
                  </div>
                  <p className="text-[11px] text-[#FFE29A] mt-0.5">{q.title}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: LAINNYA */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Lainnya
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] divide-y divide-[#0D3169]/60">
          {/* Screen Wake Lock */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-[#D9A441]" />
              <div>
                <h4 className="text-sm font-semibold text-[#F5F1E6]">Biarkan Layar Menyala</h4>
                <p className="text-xs text-[#8CA3C7]">Cegah layar redup atau mati saat tilawah</p>
              </div>
            </div>
            <button
              onClick={toggleWakeLock}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                wakeLockActive ? 'bg-[#0647A5]' : 'bg-[#001F52] border border-[#0D3169]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  wakeLockActive ? 'translate-x-6 bg-[#FFE29A]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fullscreen Mode */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Maximize2 className="w-4 h-4 text-[#168BFF]" />
              <div>
                <h4 className="text-sm font-semibold text-[#F5F1E6]">Layar Penuh</h4>
                <p className="text-xs text-[#8CA3C7]">Membaca tanpa gangguan bilah status browser</p>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isFullscreen
                  ? 'bg-[#0647A5] border-[#168BFF] text-[#FFE29A]'
                  : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
              }`}
            >
              {isFullscreen ? 'Keluar Layar Penuh' : 'Aktifkan'}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: TENTANG ZQURAN */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[#FFE29A] tracking-wider uppercase px-1">
          Tentang ZQuran
        </h3>
        <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] divide-y divide-[#0D3169]/60">
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#001F52] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#8CA3C7]" />
              <span className="text-sm font-semibold text-[#F5F1E6]">Informasi & Privasi</span>
            </div>
            <span className="text-xs text-[#8CA3C7]">Versi {BRANDING.version} →</span>
          </button>

          <button
            onClick={() => setShowRatingModal(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#001F52] transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-[#FFE29A]" />
              <span className="text-sm font-semibold text-[#F5F1E6]">Beri Rating</span>
            </div>
            <span className="text-xs text-[#FFE29A]">★★★★★</span>
          </button>

          <div className="p-4 flex flex-wrap gap-2 justify-between items-center">
            <PWAInstallButton />
            <div className="flex gap-2">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#001F52] hover:bg-[#EF4444]/20 border border-[#0D3169] text-xs font-medium text-[#8CA3C7] hover:text-[#EF4444] transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Cache</span>
              </button>
              <button
                onClick={resetSettings}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#001F52] hover:bg-[#0647A5] border border-[#0D3169] text-xs font-medium text-[#8CA3C7] hover:text-[#F5F1E6] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <RatingModal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} />
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};
