import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Volume2, BookOpen, Filter, X } from 'lucide-react';
import type { SurahSummary } from '../types/quran';
import { useAudio } from '../context/AudioContext';
import { SurahSkeleton } from '../components/common/Skeletons';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

interface SurahListPageProps {
  surahs: SurahSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectSurah: (surahNumber: number) => void;
}

export const SurahListPage: React.FC<SurahListPageProps> = ({
  surahs,
  isLoading,
  error,
  onRetry,
  onSelectSurah,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'Mekah' | 'Madinah'>('all');
  const { playSurah, surahId, isPlaying, togglePlay } = useAudio();

  // Filtered & Searched list with clean normalization
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

  if (isLoading && surahs.length === 0) {
    return (
      <div className="space-y-4 pb-20 md:pb-12">
        <div className="h-12 w-full rounded-2xl bg-[#051D42]/60 animate-pulse" />
        <SurahSkeleton />
      </div>
    );
  }

  if (error && surahs.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-5 pb-24 md:pb-16">
      {/* Search & Filter Header */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CA3C7]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari surat (contoh: Yasin, Al-Baqarah, Mekah, atau nomor 36)..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#051D42] border border-[#0D3169] text-sm text-[#F5F1E6] placeholder-[#8CA3C7] focus:outline-none focus:border-[#D9A441] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Hapus teks pencarian"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8CA3C7] hover:text-[#F5F1E6] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer border ${
              activeFilter === 'all'
                ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Semua ({surahs.length})
          </button>
          <button
            onClick={() => setActiveFilter('Mekah')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer border ${
              activeFilter === 'Mekah'
                ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Makkiyyah (Mekah)
          </button>
          <button
            onClick={() => setActiveFilter('Madinah')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer border ${
              activeFilter === 'Madinah'
                ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                : 'bg-[#001F52] border-[#0D3169] text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Madaniyyah (Madinah)
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#8CA3C7] px-1">
        <span>Menampilkan {filteredSurahs.length} dari {surahs.length} Surat</span>
        {searchQuery && (
          <span className="text-[#FFE29A]">Hasil untuk "{searchQuery}"</span>
        )}
      </div>

      {/* Surah List Grid */}
      {filteredSurahs.length === 0 ? (
        <EmptyState
          title="Tidak ditemukan hasil yang sesuai"
          description={`Tidak ada surat yang cocok dengan kata kunci "${searchQuery}". Coba gunakan nama latin, arti, atau nomor surat.`}
          actionLabel="Bersihkan Pencarian"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSurahs.map((surah) => {
            const isCurrentPlaying = surahId === surah.nomor;

            return (
              <div
                key={surah.nomor}
                className={`group p-4 rounded-2xl border transition duration-200 flex items-center justify-between gap-3 shadow-xs ${
                  isCurrentPlaying
                    ? 'bg-[#051D42] border-[#D9A441] ring-1 ring-[#D9A441]/40'
                    : 'bg-[#051D42]/70 hover:bg-[#051D42] border-[#0D3169]'
                }`}
              >
                {/* Clickable Area to Open Surah */}
                <button
                  onClick={() => onSelectSurah(surah.nomor)}
                  aria-label={`Buka Surat ${surah.namaLatin}`}
                  className="flex items-center gap-3.5 min-w-0 flex-1 text-left cursor-pointer"
                >
                  {/* Number Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition ${
                      isCurrentPlaying
                        ? 'bg-[#0647A5] text-[#FFE29A] border border-[#168BFF]'
                        : 'bg-[#001F52] group-hover:bg-[#0647A5] text-[#FFE29A] border border-[#0D3169]'
                    }`}
                  >
                    {surah.nomor}
                  </div>

                  {/* Metadata */}
                  <div className="truncate">
                    <h3 className="text-sm font-bold text-[#F5F1E6] group-hover:text-[#FFE29A] truncate transition">
                      {surah.namaLatin}
                    </h3>
                    <p className="text-xs text-[#8CA3C7] truncate mt-0.5">
                      {surah.arti} • {surah.jumlahAyat} ayat
                    </p>
                    <span className="inline-block text-[10px] text-[#8CA3C7]/90 mt-0.5 font-medium">
                      {surah.tempatTurun}
                    </span>
                  </div>
                </button>

                {/* Right Area: Arabic Name & Quick Play Audio */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="font-arabic text-lg text-[#D9A441]">
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
                    title="Putar Audio Penuh"
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
  );
};
