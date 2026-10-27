import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Volume2,
  Info,
  Check,
  ChevronLeft,
  ChevronRight,
  Palette,
} from 'lucide-react';
import type { SurahDetail, Ayah } from '../types/quran';
import { getSurahDetail } from '../api/quranApi';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';
import { useAutoScroll } from '../hooks/useAutoScroll';
import {
  saveReadingHistory,
  isAyahBookmarked,
  saveBookmark,
  removeBookmark,
} from '../services/storageService';
import { searchIndex } from '../services/searchIndexService';
import { AyahCard } from '../components/reader/AyahCard';
import { AyahActionModal } from '../components/reader/AyahActionModal';
import { TafsirModal } from '../components/reader/TafsirModal';
import { AutoScrollControl } from '../components/reader/AutoScrollControl';
import { SurahJumpSelector } from '../components/reader/SurahJumpSelector';
import { TajwidLegendModal } from '../components/reader/TajwidLegendModal';
import { AyahSkeleton } from '../components/common/Skeletons';
import { ErrorState } from '../components/common/ErrorState';

interface QuranReaderPageProps {
  surahNumber: number;
  initialAyahNumber?: number;
  onNavigateSurah: (surahNumber: number, ayahNumber?: number) => void;
  onBack: () => void;
}

export const QuranReaderPage: React.FC<QuranReaderPageProps> = ({
  surahNumber,
  initialAyahNumber,
  onNavigateSurah,
  onBack,
}) => {
  const { settings, updateSettings, markSurahCompleted } = useSettings();
  const {
    playAyah,
    playSurah,
    isPlaying,
    surahId: audioSurahId,
    currentAyah: audioAyah,
  } = useAudio();

  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSurahInfo, setShowSurahInfo] = useState(false);
  const [showTajwidModal, setShowTajwidModal] = useState(false);

  // Modals state
  const [activeAyahAction, setActiveAyahAction] = useState<Ayah | null>(null);
  const [tafsirModalState, setTafsirModalState] = useState<{
    isOpen: boolean;
    ayahNumber?: number;
  }>({ isOpen: false });

  // Bookmark change trigger to re-render bookmark status
  const [bookmarkUpdateTrigger, setBookmarkUpdateTrigger] = useState(0);

  // Auto Scroll Hook
  const {
    isScrolling,
    isPaused,
    speedPreset,
    customSpeed,
    start: startAutoScroll,
    pause: pauseAutoScroll,
    resume: resumeAutoScroll,
    stop: stopAutoScroll,
    setSpeed: setAutoScrollSpeed,
  } = useAutoScroll();

  // Load Surah details
  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSurahDetail(surahNumber);
      setSurahDetail(data);
      // Index this surah into global search index
      searchIndex.addSurahToDetailIndex(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Gagal memuat surat Al-Qur\'an.');
    } finally {
      setIsLoading(false);
    }
  }, [surahNumber]);

  useEffect(() => {
    fetchDetail();
    // Stop auto-scroll when surah changes
    stopAutoScroll();
  }, [fetchDetail, stopAutoScroll]);

  // Jump to initial ayah if specified
  useEffect(() => {
    if (!isLoading && surahDetail && initialAyahNumber) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${initialAyahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }
  }, [isLoading, surahDetail, initialAyahNumber]);

  // Track scroll position to update Reading History automatically
  useEffect(() => {
    if (!surahDetail || surahDetail.ayat.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Find visible ayah
        const ayahElements = document.querySelectorAll('[id^="ayah-"]');
        let currentVisibleAyah = 1;

        for (const el of ayahElements) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
            const idNum = parseInt(el.id.replace('ayah-', ''), 10);
            if (!isNaN(idNum)) {
              currentVisibleAyah = idNum;
              break;
            }
          }
        }

        const progressPercent = (currentVisibleAyah / surahDetail.jumlahAyat) * 100;

        saveReadingHistory({
          surahId: surahDetail.nomor,
          ayahNumber: currentVisibleAyah,
          surahName: surahDetail.namaLatin,
          timestamp: Date.now(),
          progressPercent,
        });

        if (currentVisibleAyah >= surahDetail.jumlahAyat) {
          markSurahCompleted(surahDetail.nomor);
        }
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [surahDetail, markSurahCompleted]);

  // Scroll to ayah helper
  const handleJumpToAyah = (num: number) => {
    const el = document.getElementById(`ayah-${num}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleToggleBookmark = (ayahNum: number, snippet: string) => {
    if (!surahDetail) return;
    if (isAyahBookmarked(surahDetail.nomor, ayahNum)) {
      removeBookmark(surahDetail.nomor, ayahNum);
    } else {
      saveBookmark({
        id: `${surahDetail.nomor}_${ayahNum}`,
        surahId: surahDetail.nomor,
        ayahNumber: ayahNum,
        surahName: surahDetail.namaLatin,
        ayahSnippet: snippet,
        createdAt: new Date().toISOString(),
      });
    }
    setBookmarkUpdateTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-24 md:pb-16">
        <div className="h-44 rounded-3xl bg-[#051D42]/60 animate-pulse" />
        <AyahSkeleton />
      </div>
    );
  }

  if (error || !surahDetail) {
    return <ErrorState message={error || 'Surat tidak ditemukan.'} onRetry={fetchDetail} />;
  }

  // Display Basmalah: except Surah 9 (At-Taubah), and Surah 1 (Al-Fatihah) where it is verse 1
  const showIndependentBasmalah = surahDetail.nomor !== 1 && surahDetail.nomor !== 9;

  return (
    <div className="space-y-6 pb-28 md:pb-20 max-w-4xl mx-auto">
      {/* Top Action Bar: Jump selector & Auto-Scroll Controls */}
      <div className="sticky top-0 md:top-16 z-30 -mx-3.5 sm:-mx-6 px-3.5 sm:px-6 py-2.5 bg-[#03152F] border-b border-[#0D3169] flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <SurahJumpSelector
            totalAyah={surahDetail.jumlahAyat}
            currentAyah={1}
            onJumpToAyah={handleJumpToAyah}
          />
          <button
            onClick={() => setTafsirModalState({ isOpen: true, ayahNumber: 1 })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-xs font-medium text-[#168BFF] transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tafsir Surat</span>
          </button>

          {/* Tajwid Color Toggle & Info */}
          <div className="flex items-center gap-1 bg-[#051D42] border border-[#0D3169] rounded-xl p-0.5">
            <button
              onClick={() => updateSettings({ showTajwid: !settings.showTajwid })}
              aria-label={`Toggle Tajwid: ${settings.showTajwid ? 'Aktif' : 'Nonaktif'}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                settings.showTajwid
                  ? 'bg-[#0647A5] text-[#FFE29A]'
                  : 'text-[#8CA3C7] hover:text-[#F5F1E6]'
              }`}
              title="Aktif/Nonaktifkan Tajwid Berwarna"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Tajwid</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  settings.showTajwid ? 'bg-[#10B981]' : 'bg-[#8CA3C7]/40'
                }`}
              />
            </button>
            <button
              onClick={() => setShowTajwidModal(true)}
              aria-label="Panduan Warna Tajwid"
              className="p-1 rounded-lg text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#001F52] transition cursor-pointer"
              title="Buka Panduan & Kaidah Tajwid"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Auto Scroll */}
        <AutoScrollControl
          isScrolling={isScrolling}
          isPaused={isPaused}
          speedPreset={speedPreset}
          customSpeed={customSpeed}
          onStart={startAutoScroll}
          onPause={pauseAutoScroll}
          onResume={resumeAutoScroll}
          onStop={stopAutoScroll}
          onSetSpeed={setAutoScrollSpeed}
        />
      </div>

      {/* Surah Hero Header Card */}
      <div className="rounded-3xl bg-[#051D42] border border-[#0D3169] p-6 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#001F52] border border-[#0D3169] text-[#FFE29A]">
            Surat ke-{surahDetail.nomor}
          </span>
          <button
            onClick={() => setShowSurahInfo(!showSurahInfo)}
            aria-label="Info Surat"
            className="p-1.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-[#8CA3C7] hover:text-[#F5F1E6] transition cursor-pointer border border-[#0D3169]"
            title="Deskripsi & Asbabun Nuzul"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F1E6] tracking-wide">
            {surahDetail.namaLatin}
          </h2>
          <p className="font-arabic text-3xl sm:text-4xl text-[#D9A441] mt-2 mb-1">
            {surahDetail.nama}
          </p>
          <p className="text-xs sm:text-sm text-[#8CA3C7]">
            {surahDetail.arti} • {surahDetail.tempatTurun} • {surahDetail.jumlahAyat} Ayat
          </p>
        </div>

        {/* Play Full Surah Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => playSurah(surahDetail)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-xs font-semibold transition cursor-pointer border border-[#168BFF]/40 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-[#FFE29A]" />
            <span>Putar Audio Seluruh Surat</span>
          </button>
        </div>

        {/* Collapsible Surah Info / Deskripsi */}
        {showSurahInfo && surahDetail.deskripsi && (
          <div className="mt-4 pt-4 border-t border-[#0D3169] text-left text-xs leading-relaxed text-[#8CA3C7] bg-[#001F52]/40 p-4 rounded-2xl">
            <h4 className="text-sm font-bold text-[#F5F1E6] mb-2">Tentang Surat {surahDetail.namaLatin}:</h4>
            <div
              className="space-y-2"
              dangerouslySetInnerHTML={{ __html: surahDetail.deskripsi }}
            />
          </div>
        )}
      </div>

      {/* Basmalah Banner */}
      {showIndependentBasmalah && (
        <div className="py-6 text-center rounded-2xl bg-[#051D42]/40 border border-[#0D3169]/50">
          <p
            className="font-arabic text-2xl sm:text-3xl text-[#FFE29A]"
            dir="rtl"
            lang="ar"
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="text-xs text-[#8CA3C7] mt-2 italic">
            Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang
          </p>
        </div>
      )}

      {/* Ayah Cards List */}
      <div className="space-y-4">
        {surahDetail.ayat.map((ayah) => {
          const isAudioActive =
            audioSurahId === surahDetail.nomor && audioAyah === ayah.nomorAyat;
          const bookmarked = isAyahBookmarked(surahDetail.nomor, ayah.nomorAyat);

          return (
            <AyahCard
              key={ayah.nomorAyat}
              ayah={ayah}
              surahNumber={surahDetail.nomor}
              surahName={surahDetail.namaLatin}
              settings={settings}
              isAudioActive={isAudioActive}
              isPlayingAudio={isAudioActive && isPlaying}
              isBookmarked={bookmarked}
              onPlayAudio={() => playAyah(ayah, surahDetail, surahDetail)}
              onOpenTafsir={() =>
                setTafsirModalState({ isOpen: true, ayahNumber: ayah.nomorAyat })
              }
              onOpenActions={() => setActiveAyahAction(ayah)}
              onToggleBookmark={() =>
                handleToggleBookmark(ayah.nomorAyat, ayah.teksIndonesia)
              }
            />
          );
        })}
      </div>

      {/* Surah Navigation Footer */}
      <div className="pt-6 border-t border-[#0D3169] flex flex-col sm:flex-row items-center justify-between gap-3">
        {surahDetail.suratSebelumnya ? (
          <button
            onClick={() => onNavigateSurah(surahDetail.suratSebelumnya ? surahDetail.suratSebelumnya.nomor : 1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#FFE29A]" />
            <span>Surat Sebelumnya: {surahDetail.suratSebelumnya.namaLatin}</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {surahDetail.suratSelanjutnya && (
          <button
            onClick={() => onNavigateSurah(surahDetail.suratSelanjutnya ? surahDetail.suratSelanjutnya.nomor : 1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] border border-[#168BFF]/40 text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
          >
            <span>Surat Selanjutnya: {surahDetail.suratSelanjutnya.namaLatin}</span>
            <ChevronRight className="w-4 h-4 text-[#FFE29A]" />
          </button>
        )}
      </div>

      {/* Ayah Actions Modal */}
      {activeAyahAction && (
        <AyahActionModal
          isOpen={true}
          onClose={() => setActiveAyahAction(null)}
          surahNumber={surahDetail.nomor}
          surahName={surahDetail.namaLatin}
          ayah={activeAyahAction}
          onPlayAudio={() => playAyah(activeAyahAction, surahDetail, surahDetail)}
          onOpenTafsir={() => {
            setTafsirModalState({ isOpen: true, ayahNumber: activeAyahAction.nomorAyat });
          }}
          onBookmarkChanged={() => setBookmarkUpdateTrigger((prev) => prev + 1)}
        />
      )}

      {/* Tafsir Modal */}
      <TafsirModal
        isOpen={tafsirModalState.isOpen}
        onClose={() => setTafsirModalState({ isOpen: false })}
        surahNumber={surahDetail.nomor}
        surahName={surahDetail.namaLatin}
        targetAyahNumber={tafsirModalState.ayahNumber}
      />

      {/* Tajwid Legend Modal */}
      <TajwidLegendModal
        isOpen={showTajwidModal}
        onClose={() => setShowTajwidModal(false)}
        isTajwidEnabled={settings.showTajwid}
        onToggleTajwid={() => updateSettings({ showTajwid: !settings.showTajwid })}
      />
    </div>
  );
};
