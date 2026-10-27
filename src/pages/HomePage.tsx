import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronRight,
  Heart,
  Search,
  Layers,
} from 'lucide-react';
import { BRANDING } from '../config/appConfig';
import { getReadingHistory } from '../services/storageService';
import type { ReadingHistory, SurahSummary } from '../types/quran';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { QariSelectorModal } from '../components/audio/QariSelectorModal';
import { HijriWeatherWidget } from '../components/home/HijriWeatherWidget';
import { PrayerLiveWidget } from '../components/home/PrayerLiveWidget';
import { QiblaRouteMap } from '../components/home/QiblaRouteMap';
import { QuickActionGrid } from '../components/home/QuickActionGrid';
import { StoryboardModal } from '../components/home/StoryboardModal';
import {
  PrayerScheduleModal,
  QiblaModal,
  DoaDzikirModal,
  AsmaulHusnaModal,
  KalenderHijriahModal,
} from '../components/modals/IslamicFeaturesModals';

interface HomePageProps {
  onNavigate: (tab: string, meta?: unknown) => void;
  surahs: SurahSummary[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, surahs }) => {
  const { settings } = useSettings();
  const { currentQari, setQari } = useAudio();
  const [history, setHistory] = useState<ReadingHistory | null>(null);

  // Modals state
  const [showQariModal, setShowQariModal] = useState(false);
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showQiblaModal, setShowQiblaModal] = useState(false);
  const [showDoaModal, setShowDoaModal] = useState(false);
  const [showAsmaulModal, setShowAsmaulModal] = useState(false);
  const [showKalenderModal, setShowKalenderModal] = useState(false);

  useEffect(() => {
    setHistory(getReadingHistory());
  }, []);

  // 4 Surat Pilihan from Reference Image 2:
  // 01 Al-Fatihah, 18 Al-Kahf, 36 Yasin, 55 Ar-Rahman
  const selectedSurahNumbers = [1, 18, 36, 55];
  const selectedSurahs = selectedSurahNumbers
    .map((num) => surahs.find((s) => s.nomor === num))
    .filter(Boolean) as SurahSummary[];

  // Fallback metadata if surahs are still loading
  const fallbackSelected = [
    { nomor: 1, namaLatin: 'Al-Fatihah', arti: 'Pembukaan', jumlahAyat: 7, nama: 'الفَاتِحَة' },
    { nomor: 18, namaLatin: 'Al-Kahf', arti: 'Gua', jumlahAyat: 110, nama: 'الكَهْف' },
    { nomor: 36, namaLatin: 'Yasin', arti: 'Yasin', jumlahAyat: 83, nama: 'يس' },
    { nomor: 55, namaLatin: 'Ar-Rahman', arti: 'Maha Pengasih', jumlahAyat: 78, nama: 'الرَّحْمٰن' },
  ];

  const displaySuratPilihan = selectedSurahs.length === 4 ? selectedSurahs : fallbackSelected;

  // Resolved Last Read data fallback to QS. Al-Fatihah : Ayat 1 if new user
  const lastReadTitle = history ? `QS. ${history.surahName}` : 'QS. Al-Fatihah';
  const lastReadAyah = history ? history.ayahNumber : 1;
  const lastReadSurahId = history ? history.surahId : 1;

  return (
    <div className="space-y-5 pb-24 md:pb-14">
      {/* 1. BIG HERO: Night Sheikh Zayed Mosque backdrop + glowing gold calligraphy + title + actions */}
      <section className="relative rounded-3xl overflow-hidden border border-[#D9A441]/40 light:border-[#E5DFD5] shadow-2xl bg-[#051D42] light:bg-[#FDFBF7]">
        {/* Background Masjid Photo Backdrop with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80"
            alt="Masjid Nabawi Madinah & Makkah"
            className="w-full h-full object-cover object-center opacity-30 light:opacity-20 mix-blend-luminosity scale-105"
            loading="lazy"
          />
          {/* Subtle gradient overlay to enhance readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03152F] via-[#051D42]/90 to-[#001F52]/80 light:from-[#FDFBF7] light:via-[#FDFBF7]/90 light:to-[#E8F0EC]/80" />
        </div>

        <div className="relative z-10 p-5 sm:p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl text-center md:text-left w-full">
            {/* Top Badge: ☆ Al-Qur'an Digital Indonesia */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001F52]/90 light:bg-[#E8F0EC] border border-[#D9A441]/50 text-xs text-[#FFE29A] light:text-[#2E6F52] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>☆ Al-Qur'an Digital Indonesia</span>
              </div>
              {/* Storyboard 4 Frame button */}
              <button
                onClick={() => setShowStoryboardModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0647A5]/80 hover:bg-[#168BFF] light:bg-[#2E6F52]/15 text-xs text-[#FFE29A] light:text-[#2E6F52] font-semibold border border-[#168BFF]/40 cursor-pointer transition"
              >
                <Layers className="w-3.5 h-3.5 text-[#FFE29A] light:text-[#2E6F52]" />
                <span>Storyboard 4 Frame</span>
              </button>
            </div>

            {/* Title: ZQuran in luminous serif gold */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-[#FFE29A] light:text-[#C4922F] drop-shadow-[0_2px_14px_rgba(217,164,65,0.35)]">
              {BRANDING.name}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#8CA3C7] light:text-[#64748B] leading-relaxed max-w-lg">
              Membaca, Memahami, dan Mendekatkan Diri kepada Al-Qur'an • 6 Qari • Tafsir • Kemenag RI • Mode auto-scroll
            </p>

            {/* Action Buttons: [Mulai Membaca →] [Cari Ayat] */}
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('quran')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D9A441] hover:bg-[#FFE29A] text-[#03152F] text-xs sm:text-sm font-bold transition cursor-pointer border border-[#FFE29A]/60 shadow-lg hover:shadow-xl active:scale-95"
              >
                <span>Mulai Membaca</span>
                <ArrowRight className="w-4 h-4 text-[#03152F]" />
              </button>
              <button
                onClick={() => onNavigate('search')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#001F52]/80 light:bg-white hover:bg-[#051D42] light:hover:bg-[#F9F8F6] border border-[#D9A441]/50 light:border-[#E5DFD5] text-[#FFE29A] light:text-[#1A202C] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs active:scale-95"
              >
                <Search className="w-4 h-4 text-[#D9A441]" />
                <span>Cari Ayat</span>
              </button>
            </div>

            {/* Integrated Last Read Card: Al-Fatihah */}
            <div className="pt-2">
              <div
                onClick={() =>
                  onNavigate('reader', { surahNumber: lastReadSurahId, ayahNumber: lastReadAyah })
                }
                className="p-3 rounded-2xl bg-[#001F52]/80 light:bg-white/90 border border-[#D9A441]/40 light:border-[#E5DFD5] flex items-center justify-between gap-3 cursor-pointer hover:border-[#D9A441] transition group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0647A5] light:bg-[#E8F0EC] flex items-center justify-center text-[#FFE29A] light:text-[#2E6F52] shrink-0 font-bold text-xs">
                    📖
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441]">
                      Terakhir Dibaca
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition">
                      {lastReadTitle} : Ayat {lastReadAyah}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#168BFF] light:text-[#2E6F52] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Crest Asset */}
          <div className="shrink-0 hidden sm:flex items-center justify-center">
            <div className="relative p-2.5 rounded-3xl bg-[#001F52]/90 light:bg-white border-2 border-[#D9A441]/50 shadow-2xl group hover:scale-105 transition-transform">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="w-32 h-32 md:w-36 md:h-36 object-contain rounded-2xl drop-shadow"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0647A5] text-[9px] font-extrabold text-[#FFE29A] tracking-wider whitespace-nowrap border border-[#D9A441]/60">
                ZQURAN DIGITAL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Row 1 Widgets: Tanggal Hijriah + Cuaca Hari Ini (2x2 Grid upper row) */}
      <section aria-label="Widget Hijriah dan Cuaca">
        <HijriWeatherWidget onOpenHijriModal={() => setShowKalenderModal(true)} />
      </section>

      {/* 3. Row 2 Widgets: Jadwal Sholat Live Countdown 00:42:13 + 70% Menuju Maghrib */}
      <section aria-label="Jadwal Sholat Live & Tilawah">
        <PrayerLiveWidget
          onOpenTilawahSettings={() => onNavigate('settings')}
          onOpenPrayerScheduleModal={() => onNavigate('schedule')}
        />
      </section>

      {/* 4. Fitur Utama: Grid 3x2 (Al-Qur'an, Pencarian, Bookmark, Tafsir, Audio Qari, Pengaturan) */}
      <section aria-label="Fitur Utama 3x2">
        <QuickActionGrid
          onNavigate={onNavigate}
          onOpenAudioQari={() => setShowQariModal(true)}
        />
      </section>

      {/* 5. Surat Pilihan: Horizontal pill cards matching reference image */}
      <section aria-label="Surat Pilihan">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#D9A441]" />
            <h2 className="text-sm sm:text-base font-bold text-[#F5F1E6] light:text-[#1A202C]">
              Surat Pilihan
            </h2>
          </div>
          <button
            onClick={() => onNavigate('quran')}
            className="text-xs text-[#168BFF] light:text-[#2E6F52] hover:text-[#FFE29A] transition cursor-pointer font-semibold"
          >
            Lihat 114 Surat →
          </button>
        </div>

        <div className="space-y-2.5">
          {displaySuratPilihan.map((surah) => {
            const formattedNum = String(surah.nomor).padStart(2, '0');
            return (
              <div
                key={surah.nomor}
                onClick={() => onNavigate('reader', { surahNumber: surah.nomor })}
                className="group px-4 py-3 rounded-2xl bg-[#051D42]/90 light:bg-white hover:bg-[#001F52] light:hover:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] hover:border-[#D9A441]/70 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs active:scale-99"
              >
                {/* Left: Rounded Pill Badge with Number + Latin Name & Subtitle */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-8 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] group-hover:bg-[#0647A5] light:group-hover:bg-[#2E6F52] border border-[#D9A441]/60 flex items-center justify-center text-xs font-bold text-[#FFE29A] light:text-[#2E6F52] group-hover:text-white shrink-0 transition">
                    {formattedNum}
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] truncate transition tracking-tight">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B] truncate mt-0.5">
                      {surah.arti} • {surah.jumlahAyat} ayat
                    </p>
                  </div>
                </div>

                {/* Right: Arabic Calligraphy + Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-arabic text-base sm:text-lg text-[#FFE29A] light:text-[#C4922F]">
                    {surah.nama}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8CA3C7] group-hover:text-[#FFE29A] group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Arah Kiblat & Mini Map Card */}
      <section aria-label="Arah Kiblat dan Peta Rute">
        <QiblaRouteMap onOpenCompassModal={() => onNavigate('qibla')} />
      </section>

      {/* 7. Hadist Keutamaan Membaca Al-Qur'an */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#001F52]/60 light:bg-white/80 border border-[#0D3169] light:border-[#E5DFD5] flex items-start gap-3.5 text-[#8CA3C7] light:text-[#64748B] text-xs leading-relaxed">
        <Heart className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#F5F1E6] light:text-[#1A202C] font-semibold mb-1 text-xs sm:text-sm">
            "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
          </p>
          <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            (HR. Bukhari no. 5027 dari Utsman bin Affan radhiyallahu 'anhu)
          </p>
        </div>
      </section>

      {/* Global Modals */}
      <QariSelectorModal
        isOpen={showQariModal}
        onClose={() => setShowQariModal(false)}
        currentQari={currentQari}
        onSelectQari={setQari}
      />
      <StoryboardModal
        isOpen={showStoryboardModal}
        onClose={() => setShowStoryboardModal(false)}
        onNavigate={onNavigate}
      />
      <PrayerScheduleModal
        isOpen={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
      />
      <QiblaModal
        isOpen={showQiblaModal}
        onClose={() => setShowQiblaModal(false)}
      />
      <DoaDzikirModal
        isOpen={showDoaModal}
        onClose={() => setShowDoaModal(false)}
      />
      <AsmaulHusnaModal
        isOpen={showAsmaulModal}
        onClose={() => setShowAsmaulModal(false)}
      />
      <KalenderHijriahModal
        isOpen={showKalenderModal}
        onClose={() => setShowKalenderModal(false)}
      />
    </div>
  );
};
