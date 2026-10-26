import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, BookOpen, Volume2, ShieldCheck, Heart } from 'lucide-react';
import { BRANDING } from '../config/appConfig';
import { getReadingHistory } from '../services/storageService';
import type { ReadingHistory, SurahSummary } from '../types/quran';
import { ContinueReadingCard } from '../components/home/ContinueReadingCard';
import { TilawahProgressCard } from '../components/home/TilawahProgressCard';
import { QuickActionGrid } from '../components/home/QuickActionGrid';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { QariSelectorModal } from '../components/audio/QariSelectorModal';

interface HomePageProps {
  onNavigate: (tab: string, meta?: unknown) => void;
  surahs: SurahSummary[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, surahs }) => {
  const { settings } = useSettings();
  const { currentQari, setQari } = useAudio();
  const [history, setHistory] = useState<ReadingHistory | null>(null);
  const [showQariModal, setShowQariModal] = useState(false);

  useEffect(() => {
    setHistory(getReadingHistory());
  }, []);

  // Surat-surat pilihan yang dianjurkan dibaca berkala
  const featuredSurahNumbers = [1, 18, 36, 55, 56, 67];
  const featuredSurahs = surahs.filter((s) => featuredSurahNumbers.includes(s.nomor));

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Hero Banner */}
      <section className="relative rounded-3xl bg-[#051D42] border border-[#0D3169] p-6 sm:p-8 overflow-hidden text-[#F5F1E6] shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001F52] border border-[#D9A441]/40 text-xs text-[#FFE29A] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Al-Qur'an Digital Indonesia</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#F5F1E6]">
              {BRANDING.name}
            </h1>

            <p className="text-sm sm:text-base text-[#8CA3C7] leading-relaxed">
              {BRANDING.tagline}. Dilengkapi audio 6 qari ternama, terjemahan resmi, tafsir Kemenag RI, dan mode auto-scroll.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigate('quran')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-sm font-semibold transition cursor-pointer border border-[#168BFF]/40 shadow-md"
              >
                <span>Mulai Membaca</span>
                <ArrowRight className="w-4 h-4 text-[#FFE29A]" />
              </button>

              <button
                onClick={() => onNavigate('search')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#001F52] hover:bg-[#051D42] border border-[#0D3169] text-[#F5F1E6] text-sm font-medium transition cursor-pointer"
              >
                <span>Cari Ayat</span>
              </button>
            </div>
          </div>

          {/* Hero Logo Asset */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative p-2 rounded-3xl bg-[#001F52]/80 border border-[#D9A441]/40 shadow-2xl">
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-2xl drop-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Terakhir Dibaca (Continue Reading) */}
      <section aria-label="Terakhir Dibaca">
        <ContinueReadingCard
          history={history}
          onContinue={(surahId, ayahNumber) =>
            onNavigate('reader', { surahNumber: surahId, ayahNumber })
          }
          onStartReading={() => onNavigate('quran')}
        />
      </section>

      {/* Quick Actions Grid */}
      <section aria-label="Menu Cepat">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-[#F5F1E6]">Fitur Utama</h2>
          <span className="text-xs text-[#8CA3C7]">Akses Cepat</span>
        </div>
        <QuickActionGrid
          onNavigate={onNavigate}
          onOpenQariModal={() => setShowQariModal(true)}
        />
      </section>

      {/* Progress Tilawah */}
      <section aria-label="Target Tilawah">
        <TilawahProgressCard
          settings={settings}
          onOpenSettings={() => onNavigate('settings')}
        />
      </section>

      {/* Surat Pilihan / Populer */}
      {featuredSurahs.length > 0 && (
        <section aria-label="Surat Populer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D9A441]" />
              <h2 className="text-sm sm:text-base font-bold text-[#F5F1E6]">Surat Pilihan</h2>
            </div>
            <button
              onClick={() => onNavigate('quran')}
              className="text-xs text-[#168BFF] hover:text-[#FFE29A] transition cursor-pointer font-medium"
            >
              Lihat 114 Surat →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredSurahs.map((surah) => (
              <div
                key={surah.nomor}
                onClick={() => onNavigate('reader', { surahNumber: surah.nomor })}
                className="p-4 rounded-2xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] transition cursor-pointer group flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#001F52] group-hover:bg-[#0647A5] border border-[#0D3169] flex items-center justify-center text-xs font-bold text-[#FFE29A] shrink-0 transition">
                    {surah.nomor}
                  </div>
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#F5F1E6] group-hover:text-[#FFE29A] truncate transition">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-xs text-[#8CA3C7] truncate">
                      {surah.arti} • {surah.jumlahAyat} ayat
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-arabic text-base text-[#D9A441]">
                    {surah.nama}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Keutamaan Tadabbur Al-Qur'an */}
      <section className="p-5 rounded-2xl bg-[#001F52]/60 border border-[#0D3169] flex items-start gap-4 text-[#8CA3C7] text-xs leading-relaxed">
        <Heart className="w-5 h-5 text-[#D9A441] shrink-0 mt-0.5" />
        <div>
          <p className="text-[#F5F1E6] font-semibold mb-1">
            "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."
          </p>
          <p className="text-[11px] text-[#8CA3C7]">
            (HR. Bukhari no. 5027 dari Utsman bin Affan radhiyallahu 'anhu)
          </p>
        </div>
      </section>

      {/* Modal Qari */}
      <QariSelectorModal
        isOpen={showQariModal}
        onClose={() => setShowQariModal(false)}
        selectedQari={currentQari}
        onSelect={setQari}
      />
    </div>
  );
};
