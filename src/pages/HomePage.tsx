import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  Clock,
  Layers,
  Heart,
  Search,
  CheckCircle2,
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
import { FiturUtamaGrid } from '../components/home/FiturUtamaGrid';
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

  // Surat-surat pilihan yang dianjurkan dibaca berkala
  // 1 (Al-Fatihah), 18 (Al-Kahfi), 36 (Yasin), 55 (Ar-Rahman), 56 (Al-Waqi'ah), 67 (Al-Mulk)
  const featuredSurahNumbers = [1, 18, 36, 55, 56, 67];
  const featuredSurahs = surahs.filter((s) => featuredSurahNumbers.includes(s.nomor));

  // Resolved Last Read data fallback to QS. Al-Fatihah : Ayat 1 if new user
  const lastReadTitle = history ? `QS. ${history.surahName}` : 'QS. Al-Fatihah';
  const lastReadAyah = history ? history.ayahNumber : 1;
  const lastReadSurahId = history ? history.surahId : 1;

  return (
    <div className="space-y-6 pb-24 md:pb-14">
      {/* 1. BIG HERO: Masjid backdrop + glowing gold calligraphy + title + actions + last read */}
      <section className="relative rounded-3xl overflow-hidden border border-[#D9A441]/40 light:border-[#E5DFD5] shadow-2xl bg-[#051D42] light:bg-[#FDFBF7]">
        {/* Background Masjid Photo Backdrop with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80"
            alt="Masjid Nabawi Madinah & Makkah"
            className="w-full h-full object-cover object-center opacity-25 light:opacity-15 mix-blend-luminosity scale-105"
            loading="lazy"
          />
          {/* Theme overlay gradient to keep text crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03152F] via-[#051D42]/90 to-[#001F52]/80 light:from-[#FDFBF7] light:via-[#FDFBF7]/90 light:to-[#E8F0EC]/80" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-xl text-center md:text-left">
            {/* Top Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001F52]/90 light:bg-[#E8F0EC] border border-[#D9A441]/50 text-xs text-[#FFE29A] light:text-[#2E6F52] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Al-Qur'an Digital Indonesia</span>
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

            {/* Glowing Arabic Calligraphy */}
            <div className="py-1">
              <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[#FFE29A] light:text-[#C4922F] drop-shadow-[0_2px_12px_rgba(217,164,65,0.4)] tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white light:text-[#1A202C]">
              {BRANDING.name}
            </h1>

            <p className="text-sm sm:text-base text-[#8CA3C7] light:text-[#64748B] leading-relaxed max-w-lg">
              {BRANDING.tagline}. Dilengkapi audio 6 qari ternama, terjemahan resmi, tafsir Kemenag RI, auto-scroll tilawah, dan kompas kiblat presisi.
            </p>

            {/* Action Buttons: [Mulai Membaca] [Cari Ayat] */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('quran')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0647A5] light:bg-[#2E6F52] hover:bg-[#168BFF] light:hover:bg-[#3B7A57] text-white text-sm font-bold transition cursor-pointer border border-[#168BFF]/40 shadow-lg hover:shadow-xl active:scale-95"
              >
                <span>Mulai Membaca</span>
                <ArrowRight className="w-4 h-4 text-[#FFE29A] light:text-white" />
              </button>

              <button
                onClick={() => onNavigate('search')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#001F52] light:bg-white hover:bg-[#051D42] light:hover:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] text-[#F5F1E6] light:text-[#1A202C] text-sm font-semibold transition cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4 text-[#D9A441]" />
                <span>Cari Ayat</span>
              </button>
            </div>

            {/* Integrated Last Read Card: Al-Fatihah */}
            <div className="pt-3">
              <div
                onClick={() =>
                  onNavigate('reader', { surahNumber: lastReadSurahId, ayahNumber: lastReadAyah })
                }
                className="p-3.5 rounded-2xl bg-[#001F52]/80 light:bg-white/90 border border-[#D9A441]/40 light:border-[#E5DFD5] flex items-center justify-between gap-3 cursor-pointer hover:border-[#D9A441] transition group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0647A5] light:bg-[#E8F0EC] flex items-center justify-center text-[#FFE29A] light:text-[#2E6F52] shrink-0 font-bold text-xs">
                    📖
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441]">
                      Terakhir Dibaca
                    </span>
                    <h4 className="text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition">
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
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative p-2.5 rounded-3xl bg-[#001F52]/90 light:bg-white border-2 border-[#D9A441]/50 shadow-2xl group hover:scale-105 transition-transform">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-2xl drop-shadow"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0647A5] text-[10px] font-extrabold text-[#FFE29A] tracking-wider whitespace-nowrap border border-[#D9A441]/60">
                ZQURAN DIGITAL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Widget Hijriah + Weather: "5 Jumadil Awal 1448 H • 29°C Baros, Banten Cerah Berawan, 68%, 12 km/j" */}
      <section aria-label="Widget Hijriah dan Cuaca">
        <HijriWeatherWidget onOpenHijriModal={() => setShowKalenderModal(true)} />
      </section>

      {/* 3. Jadwal Sholat Live Countdown 00:42:13 to Maghrib + Tilawah Progress 70% */}
      <section aria-label="Jadwal Sholat Live & Tilawah">
        <PrayerLiveWidget
          onOpenTilawahSettings={() => onNavigate('settings')}
          onOpenPrayerScheduleModal={() => onNavigate('schedule')}
        />
      </section>

      {/* 4. Qibla Widget: Compass 294.8° NW, "Baros, Banten to Ka'bah 8.347 km", GPS ±3m + World Map */}
      <section aria-label="Arah Kiblat dan Peta Rute">
        <QiblaRouteMap onOpenCompassModal={() => onNavigate('qibla')} />
      </section>

      {/* 5. Fitur Utama Grid 3x2 */}
      <section aria-label="Fitur Utama">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-[#F5F1E6] light:text-[#1A202C]">
            Fitur Utama ZQuran
          </h2>
          <span className="text-xs text-[#8CA3C7] light:text-[#64748B]">Grid 3×2 Cepat</span>
        </div>
        <FiturUtamaGrid
          onNavigate={onNavigate}
          onOpenPrayerModal={() => onNavigate('schedule')}
          onOpenQiblaModal={() => onNavigate('qibla')}
          onOpenDoaModal={() => setShowDoaModal(true)}
          onOpenAsmaulHusnaModal={() => setShowAsmaulModal(true)}
          onOpenKalenderModal={() => setShowKalenderModal(true)}
        />
      </section>

      {/* 6. Surat Pilihan list: Al-Kahfi, Yasin, Al-Mulk, Ar-Rahman, Al-Waqi'ah, Al-Fatihah */}
      {featuredSurahs.length > 0 && (
        <section aria-label="Surat Populer Pilihan">
          <div className="flex items-center justify-between mb-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredSurahs.map((surah) => (
              <div
                key={surah.nomor}
                onClick={() => onNavigate('reader', { surahNumber: surah.nomor })}
                className="p-4 rounded-2xl bg-[#051D42] light:bg-white hover:bg-[#001F52] light:hover:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] transition cursor-pointer group flex items-center justify-between gap-3 shadow-xs hover:border-[#D9A441]/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] group-hover:bg-[#0647A5] light:group-hover:bg-[#2E6F52] border border-[#0D3169] light:border-[#E5DFD5] flex items-center justify-center text-xs font-bold text-[#FFE29A] light:text-[#2E6F52] group-hover:text-white shrink-0 transition">
                    {surah.nomor}
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] truncate transition">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-xs text-[#8CA3C7] light:text-[#64748B] truncate">
                      {surah.arti} • {surah.jumlahAyat} ayat
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-arabic text-lg text-[#D9A441] leading-none">
                    {surah.nama}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Keutamaan Membaca Al-Qur'an */}
      <section className="p-5 rounded-2xl bg-[#001F52]/60 light:bg-white/80 border border-[#0D3169] light:border-[#E5DFD5] flex items-start gap-4 text-[#8CA3C7] light:text-[#64748B] text-xs leading-relaxed">
        <Heart className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#F5F1E6] light:text-[#1A202C] font-semibold mb-1 text-sm">
            "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
          </p>
          <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            (HR. Bukhari no. 5027 dari Utsman bin Affan radhiyallahu 'anhu)
          </p>
        </div>
      </section>

      {/* Modals */}
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
      <QariSelectorModal
        isOpen={showQariModal}
        onClose={() => setShowQariModal(false)}
        selectedQari={currentQari}
        onSelect={setQari}
      />
    </div>
  );
};
