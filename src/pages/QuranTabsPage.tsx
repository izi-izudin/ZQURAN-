import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Bookmark, BookOpen, Trash2, ArrowRight, X, Clock, Edit3 } from 'lucide-react';
import type { SurahSummary, BookmarkItem, ReadingHistory } from '../types/quran';
import { useAudio } from '../context/AudioContext';
import { JUZ_LIST } from '../data/juzData';
import { IslamicNumberBadge } from '../components/common/IslamicNumberBadge';
import { SurahSkeleton } from '../components/common/Skeletons';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { getBookmarks, removeBookmark, getReadingHistory } from '../services/storageService';

interface QuranTabsPageProps {
  surahs: SurahSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectSurah: (surahNumber: number, ayahNumber?: number) => void;
  activeTab: 'surah' | 'juz' | 'bookmark';
  onTabChange: (tab: 'surah' | 'juz' | 'bookmark') => void;
}

export const QuranTabsPage: React.FC<QuranTabsPageProps> = ({
  surahs,
  isLoading,
  error,
  onRetry,
  onSelectSurah,
  activeTab,
  onTabChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Mekah' | 'Madinah'>('all');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => getBookmarks());
  const [lastRead, setLastRead] = useState<ReadingHistory | null>(() => getReadingHistory());

  const { playSurah, surahId, isPlaying, togglePlay } = useAudio();

  // Reload bookmarks / last read when bookmark tab is clicked
  React.useEffect(() => {
    if (activeTab === 'bookmark') {
      setBookmarks(getBookmarks());
      setLastRead(getReadingHistory());
    }
  }, [activeTab]);

  // Filtered surah list
  const filteredSurahs = useMemo(() => {
    let result = surahs;

    if (activeFilter !== 'all') {
      result = result.filter(
        (s) => s.tempatTurun.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (!searchQuery.trim()) return result;

    const query = searchQuery.toLowerCase().trim();

    return result.filter((s) => {
      const matchNumber = s.nomor.toString() === query;
      const matchLatin = s.namaLatin.toLowerCase().includes(query);
      const matchArti = s.arti.toLowerCase().includes(query);
      const matchArab = s.nama.includes(query);

      return matchNumber || matchLatin || matchArti || matchArab;
    });
  }, [surahs, activeFilter, searchQuery]);

  const handleDeleteBookmark = (surahId: number, ayahNumber: number) => {
    const updated = removeBookmark(surahId, ayahNumber);
    setBookmarks(updated);
  };

  if (isLoading && surahs.length === 0) {
    return (
      <div className="space-y-4 pb-20 md:pb-12 max-w-4xl mx-auto">
        <div className="h-12 w-full rounded-2xl bg-[#051D42]/60 animate-pulse" />
        <SurahSkeleton />
      </div>
    );
  }

  if (error && surahs.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-4 pb-28 md:pb-20 max-w-4xl mx-auto">
      {/* ================= TAB 1: SURAH ================= */}
      {activeTab === 'surah' && (
        <div className="space-y-4">
          {/* Search bar & Filter Pills */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CA3C7]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari surat (contoh: Yasin, Al-Baqarah, atau 36)..."
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl bg-[#051D42] border border-[#0D3169] text-xs sm:text-sm text-[#F5F1E6] placeholder-[#8CA3C7] focus:outline-none focus:border-[#D9A441] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8CA3C7] hover:text-[#F5F1E6] p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer border ${
                  activeFilter === 'all'
                    ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                    : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
                }`}
              >
                Semua ({surahs.length})
              </button>
              <button
                onClick={() => setActiveFilter('Mekah')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer border ${
                  activeFilter === 'Mekah'
                    ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                    : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
                }`}
              >
                Makkiyyah
              </button>
              <button
                onClick={() => setActiveFilter('Madinah')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer border ${
                  activeFilter === 'Madinah'
                    ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                    : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
                }`}
              >
                Madaniyyah
              </button>
            </div>
          </div>

          {/* Surah List Items */}
          {filteredSurahs.length === 0 ? (
            <EmptyState
              title="Tidak ditemukan hasil yang sesuai"
              description={`Tidak ada surat yang cocok dengan kata kunci "${searchQuery}".`}
              actionLabel="Bersihkan Pencarian"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <div className="space-y-2">
              {filteredSurahs.map((surah) => {
                const isCurrentPlaying = surahId === surah.nomor;

                return (
                  <div
                    key={surah.nomor}
                    className={`group px-3.5 py-3 sm:py-3.5 rounded-2xl border transition duration-150 flex items-center justify-between gap-3 shadow-xs ${
                      isCurrentPlaying
                        ? 'bg-[#051D42] border-[#D9A441] ring-1 ring-[#D9A441]/40'
                        : 'bg-[#051D42]/80 hover:bg-[#051D42] border-[#0D3169]/80'
                    }`}
                  >
                    {/* Left: Islamic Frame Number & Info */}
                    <button
                      onClick={() => onSelectSurah(surah.nomor)}
                      aria-label={`Buka Surat ${surah.namaLatin}`}
                      className="flex items-center gap-3.5 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <IslamicNumberBadge
                        number={surah.nomor}
                        active={isCurrentPlaying}
                      />

                      <div className="truncate">
                        <h3 className="text-sm font-bold text-[#F5F1E6] group-hover:text-[#FFE29A] truncate transition tracking-tight">
                          {surah.namaLatin}
                        </h3>
                        <p className="text-[11px] font-medium text-[#8CA3C7] truncate mt-0.5 tracking-wide uppercase">
                          {surah.tempatTurun} | {surah.jumlahAyat} AYAT
                        </p>
                      </div>
                    </button>

                    {/* Right: Arabic Text & Quick Play Audio */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-arabic text-base sm:text-lg text-[#D9A441] pr-1">
                        {surah.nama}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentPlaying && isPlaying) {
                            togglePlay();
                          } else {
                            playSurah(surah);
                          }
                        }}
                        aria-label={
                          isCurrentPlaying && isPlaying
                            ? `Jeda audio surat ${surah.namaLatin}`
                            : `Putar audio surat ${surah.namaLatin}`
                        }
                        className={`p-2 rounded-xl transition cursor-pointer ${
                          isCurrentPlaying && isPlaying
                            ? 'bg-[#0647A5] text-[#FFE29A]'
                            : 'text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#001F52]'
                        }`}
                        title="Putar Audio Surat"
                      >
                        {isCurrentPlaying && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: JUZ ================= */}
      {activeTab === 'juz' && (
        <div className="space-y-2.5">
          <p className="text-xs text-[#8CA3C7] px-1">
            Daftar 30 Juz Al-Qur'an lengkap. Ketuk pada Juz untuk langsung membaca dari ayat awal.
          </p>

          <div className="space-y-2">
            {JUZ_LIST.map((juz) => (
              <button
                key={juz.juzNumber}
                onClick={() => onSelectSurah(juz.startSurahNumber, juz.startAyahNumber)}
                className="w-full group px-3.5 py-3 sm:py-3.5 rounded-2xl bg-[#051D42]/80 hover:bg-[#051D42] border border-[#0D3169]/80 hover:border-[#168BFF]/50 transition duration-150 flex items-center justify-between gap-3 text-left cursor-pointer shadow-xs"
              >
                {/* Left: Islamic Frame Number & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <IslamicNumberBadge number={juz.juzNumber} />

                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#F5F1E6] group-hover:text-[#FFE29A] truncate transition">
                      Juz {juz.juzNumber}
                    </h3>
                    <p className="text-[11px] text-[#8CA3C7] truncate mt-0.5">
                      Mulai di: <span className="text-[#FFE29A]">{juz.startSurahName}</span> Ayat {juz.startAyahNumber}
                    </p>
                  </div>
                </div>

                {/* Right: Arabic Name */}
                <div className="text-right shrink-0">
                  <span className="font-arabic text-base text-[#D9A441]">
                    {juz.arabicName}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#168BFF] mt-0.5">
                    <span>Baca</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: BOOKMARK ================= */}
      {activeTab === 'bookmark' && (
        <div className="space-y-4">
          {/* Terakhir Baca Banner */}
          {lastRead ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#051D42] border border-[#D9A441]/40 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#001F52] border border-[#D9A441] flex items-center justify-center text-[#D9A441] shrink-0">
                  <Bookmark className="w-5 h-5 fill-current" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-[#FFE29A] tracking-wider px-2 py-0.5 rounded-full bg-[#001F52] border border-[#0D3169]">
                    Terakhir Baca
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#F5F1E6] mt-1 truncate">
                    QS. {lastRead.surahName} : Ayat {lastRead.ayahNumber}
                  </h3>
                  <p className="text-[11px] text-[#8CA3C7] truncate">
                    {Math.round(lastRead.progressPercent)}% selesai
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectSurah(lastRead.surahId, lastRead.ayahNumber)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer shrink-0 border border-[#168BFF]/40"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFE29A]" />
              </button>
            </div>
          ) : null}

          {/* Bookmarks List */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#0D3169]">
              <h3 className="text-xs uppercase font-bold text-[#8CA3C7] tracking-wider">
                Ayat Tersimpan ({bookmarks.length})
              </h3>
            </div>

            {bookmarks.length === 0 ? (
              <EmptyState
                icon={<Bookmark className="w-6 h-6 text-[#D9A441]" />}
                title="Belum ada bookmark."
                description="Tandai ayat favorit Anda saat membaca dengan menekan ikon bookmark pada kartu ayat."
                actionLabel="Jelajahi Surat"
                onAction={() => onTabChange('surah')}
              />
            ) : (
              <div className="space-y-2.5">
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#051D42]/80 border border-[#0D3169] hover:border-[#168BFF]/50 transition flex flex-col justify-between shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <IslamicNumberBadge number={b.ayahNumber} size="sm" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#F5F1E6]">
                            QS. {b.surahName} : Ayat {b.ayahNumber}
                          </h4>
                          <span className="text-[10px] text-[#8CA3C7]">
                            {new Date(b.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteBookmark(b.surahId, b.ayahNumber)}
                          aria-label="Hapus bookmark"
                          className="p-1.5 rounded-lg text-[#8CA3C7] hover:text-[#EF4444] hover:bg-[#001F52] transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectSurah(b.surahId, b.ayahNumber)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
                        >
                          <span>Buka</span>
                          <ArrowRight className="w-3 h-3 text-[#FFE29A]" />
                        </button>
                      </div>
                    </div>

                    {b.ayahSnippet && (
                      <p className="text-xs text-[#8CA3C7] line-clamp-2 italic pl-1">
                        "{b.ayahSnippet}"
                      </p>
                    )}

                    {b.note && (
                      <div className="p-2 rounded-xl bg-[#001F52]/60 border border-[#0D3169] text-xs text-[#FFE29A] flex items-start gap-1.5">
                        <Edit3 className="w-3 h-3 text-[#D9A441] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{b.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
