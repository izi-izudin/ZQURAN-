/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { AudioProvider } from './context/AudioContext';
import { getSurahList } from './api/quranApi';
import type { SurahSummary } from './types/quran';
import { searchIndex } from './services/searchIndexService';
import { getReadingHistory } from './services/storageService';

import { ScrollAwareHeader, type QuranTab } from './components/layout/ScrollAwareHeader';
import { BottomNav } from './components/layout/BottomNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { GlobalAudioPlayer } from './components/audio/GlobalAudioPlayer';

import { HomePage } from './pages/HomePage';
import { QuranTabsPage } from './pages/QuranTabsPage';
import { QuranReaderPage } from './pages/QuranReaderPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarkPage } from './pages/BookmarkPage';
import { TafsirPage } from './pages/TafsirPage';
import { SettingsPage } from './pages/SettingsPage';
import { SchedulePage } from './pages/SchedulePage';
import { QiblaPage } from './pages/QiblaPage';
import { MorePage } from './pages/MorePage';

import { LoginModal } from './components/auth/LoginModal';
import { RatingModal } from './components/modals/RatingModal';
import { InfoModal } from './components/modals/InfoModal';
import { StoryboardModal } from './components/home/StoryboardModal';
import { PrayerScheduleModal } from './components/modals/IslamicFeaturesModals';

export type AppTab =
  | 'home'
  | 'quran'
  | 'schedule'
  | 'qibla'
  | 'more'
  | 'reader'
  | 'search'
  | 'bookmarks'
  | 'tafsir'
  | 'settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [quranSubTab, setQuranSubTab] = useState<QuranTab>('surah');
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(1);
  const [activeAyahNumber, setActiveAyahNumber] = useState<number | undefined>(undefined);

  // User auth state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const stored = localStorage.getItem('zquran_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Global Modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  // 114 Surahs state
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [surahError, setSurahError] = useState<string | null>(null);

  // Fetch 114 Surahs from real equran API
  const loadSurahs = useCallback(async () => {
    setIsLoadingSurahs(true);
    setSurahError(null);
    try {
      const data = await getSurahList();
      setSurahs(data);
      // Initialize search index manager with surahs
      searchIndex.setSurahs(data);
      // Start background indexing
      searchIndex.startIndexing(data);
    } catch (err: unknown) {
      setSurahError((err as Error)?.message || 'Gagal memuat daftar 114 surat Al-Qur\'an.');
    } finally {
      setIsLoadingSurahs(false);
    }
  }, []);

  useEffect(() => {
    loadSurahs();
  }, [loadSurahs]);

  // Keyboard shortcut Ctrl+K / Cmd+K to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handler
  const handleNavigate = (tab: string, meta?: unknown) => {
    const targetTab = tab as AppTab;
    if (targetTab === 'reader' && meta && typeof meta === 'object') {
      const { surahNumber, ayahNumber } = meta as { surahNumber: number; ayahNumber?: number };
      setActiveSurahNumber(surahNumber);
      setActiveAyahNumber(ayahNumber);
    }
    if (targetTab === 'bookmarks') {
      // In the redesigned tabs layout, 'bookmarks' switches directly into the Quran tab's Bookmark view
      setCurrentTab('quran');
      setQuranSubTab('bookmark');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (targetTab === 'quran') {
      setCurrentTab('quran');
      if (meta && typeof meta === 'string' && (meta === 'surah' || meta === 'juz' || meta === 'bookmark')) {
        setQuranSubTab(meta as QuranTab);
      } else {
        setQuranSubTab('surah');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSurah = (surahNumber: number, ayahNumber?: number) => {
    setActiveSurahNumber(surahNumber);
    setActiveAyahNumber(ayahNumber);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLastRead = () => {
    const history = getReadingHistory();
    if (history) {
      handleOpenSurah(history.surahId, history.ayahNumber);
    } else {
      handleOpenSurah(1, 1);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('zquran_user_session');
    } catch {}
    setCurrentUser(null);
  };

  const activeSurahMeta = surahs.find((s) => s.nomor === activeSurahNumber);

  // Derive header title
  const getHeaderTitle = () => {
    if (currentTab === 'reader' && activeSurahMeta) {
      return `QS. ${activeSurahMeta.namaLatin}`;
    }
    if (currentTab === 'quran') return "Baca Qur'an";
    if (currentTab === 'schedule') return 'Jadwal Sholat & Alarm';
    if (currentTab === 'qibla') return 'Arah Kiblat Presisi';
    if (currentTab === 'more') return 'Lainnya & Modul Ibadah';
    if (currentTab === 'search') return 'Pencarian Global';
    if (currentTab === 'bookmarks') return 'Bookmark & Catatan';
    if (currentTab === 'tafsir') return 'Tafsir Kemenag RI';
    if (currentTab === 'settings') return 'Pengaturan';
    return 'ZQuran Digital';
  };

  const getHeaderSubtitle = () => {
    if (currentTab === 'reader' && activeSurahMeta) {
      return `${activeSurahMeta.arti} • ${activeSurahMeta.jumlahAyat} Ayat`;
    }
    if (currentTab === 'quran') {
      return '114 Surat • 30 Juz • Catatan Tadabbur';
    }
    if (currentTab === 'schedule') {
      return 'Baros, Banten • Waktu Indonesia Barat (WIB)';
    }
    if (currentTab === 'qibla') {
      return '294.8° NW • Jarak ke Ka\'bah 8.347 km';
    }
    if (currentTab === 'more') {
      return 'Tafsir, Bookmark, Kalender Hijriah & Pengaturan';
    }
    return undefined;
  };

  return (
    <SettingsProvider>
      <AudioProvider>
        <div className="min-h-screen bg-[#03152F] light:bg-[#FDFBF7] text-[#F5F1E6] light:text-[#1A202C] flex flex-col antialiased selection:bg-[#0647A5] selection:text-[#FFE29A]">
          {/* Offline Indicator Toast */}
          <OfflineIndicator />

          {/* Mobile-Native Scroll-Aware Header */}
          <ScrollAwareHeader
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
            showBack={currentTab === 'reader' || (currentTab !== 'home' && currentTab !== 'quran')}
            onBack={
              currentTab === 'reader'
                ? () => setCurrentTab('quran')
                : currentTab !== 'home'
                ? () => setCurrentTab('home')
                : undefined
            }
            showTabs={currentTab === 'quran'}
            activeTab={quranSubTab}
            onTabChange={(tab) => setQuranSubTab(tab)}
            onOpenSearch={() => setCurrentTab('search')}
            onOpenBell={() => setShowPrayerModal(true)}
            onOpenStoryboard={() => setShowStoryboardModal(true)}
            onOpenSettings={() => setCurrentTab('settings')}
            onOpenLastRead={handleOpenLastRead}
            onOpenRating={() => setShowRatingModal(true)}
            onOpenInfo={() => setShowInfoModal(true)}
            onOpenAuth={() => setShowLoginModal(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Main Layout: Desktop Sidebar + Content */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            {/* Desktop Left Sidebar */}
            <DesktopSidebar
              currentTab={currentTab}
              quranSubTab={quranSubTab}
              onNavigate={handleNavigate}
            />

            {/* Main Content Area with scroll padding & mobile bottom clearance */}
            <main className="flex-1 min-w-0 px-3.5 sm:px-6 py-5 pb-36 md:pb-20 overflow-x-hidden scroll-pt-20">
              {currentTab === 'home' && (
                <HomePage onNavigate={handleNavigate} surahs={surahs} />
              )}

              {currentTab === 'quran' && (
                <QuranTabsPage
                  surahs={surahs}
                  isLoading={isLoadingSurahs}
                  error={surahError}
                  onRetry={loadSurahs}
                  onSelectSurah={handleOpenSurah}
                  activeTab={quranSubTab}
                  onTabChange={setQuranSubTab}
                />
              )}

              {currentTab === 'schedule' && (
                <SchedulePage onOpenQibla={() => handleNavigate('qibla')} />
              )}

              {currentTab === 'qibla' && (
                <QiblaPage onBack={() => handleNavigate('home')} />
              )}

              {currentTab === 'more' && (
                <MorePage
                  onNavigate={handleNavigate}
                  onOpenInfo={() => setShowInfoModal(true)}
                  onOpenRating={() => setShowRatingModal(true)}
                />
              )}

              {currentTab === 'reader' && (
                <QuranReaderPage
                  surahNumber={activeSurahNumber}
                  initialAyahNumber={activeAyahNumber}
                  onNavigateSurah={(sNum, aNum) => {
                    setActiveSurahNumber(sNum);
                    setActiveAyahNumber(aNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onBack={() => setCurrentTab('quran')}
                />
              )}

              {currentTab === 'search' && (
                <SearchPage surahs={surahs} onSelectResult={handleOpenSurah} />
              )}

              {currentTab === 'bookmarks' && (
                <BookmarkPage
                  onSelectBookmark={handleOpenSurah}
                  onExploreSurah={() => {
                    setCurrentTab('quran');
                    setQuranSubTab('surah');
                  }}
                />
              )}

              {currentTab === 'tafsir' && (
                <TafsirPage surahs={surahs} onOpenAyahInReader={handleOpenSurah} />
              )}

              {currentTab === 'settings' && <SettingsPage />}
            </main>
          </div>

          {/* Global Floating Mini Audio Player */}
          <GlobalAudioPlayer />

          {/* Mobile Clean Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            quranSubTab={quranSubTab}
            onNavigate={handleNavigate}
          />

          {/* Modals */}
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={(user) => setCurrentUser(user)}
          />
          <RatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
          />
          <InfoModal
            isOpen={showInfoModal}
            onClose={() => setShowInfoModal(false)}
          />
          <StoryboardModal
            isOpen={showStoryboardModal}
            onClose={() => setShowStoryboardModal(false)}
            onNavigate={handleNavigate}
          />
          <PrayerScheduleModal
            isOpen={showPrayerModal}
            onClose={() => setShowPrayerModal(false)}
          />
        </div>
      </AudioProvider>
    </SettingsProvider>
  );
}
