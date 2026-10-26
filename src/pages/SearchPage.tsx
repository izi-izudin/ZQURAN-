import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import { searchIndex, type IndexStatus } from '../services/searchIndexService';
import type { SearchResultItem, SurahSummary } from '../types/quran';
import { EmptyState } from '../components/common/EmptyState';

interface SearchPageProps {
  surahs: SurahSummary[];
  onSelectResult: (surahNumber: number, ayahNumber: number) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ surahs, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [indexStatus, setIndexStatus] = useState<IndexStatus>(() => searchIndex.getStatus());

  // Listen for index building updates
  useEffect(() => {
    const unsub = searchIndex.onStatusChange(setIndexStatus);
    // Ensure index building starts if not yet underway
    if (surahs.length > 0) {
      searchIndex.startIndexing(surahs);
    }
    return unsub;
  }, [surahs]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute Search
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return searchIndex.search(debouncedQuery, 50);
  }, [debouncedQuery, indexStatus.indexedSurahCount]);

  // Highlight matched terms in text safely
  const highlightMatches = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <mark key={i} className="bg-[#D9A441] text-[#03152F] rounded-xs px-1 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-5 pb-24 md:pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F1E6]">Pencarian Global Al-Qur'an</h2>
        <p className="text-xs sm:text-sm text-[#8CA3C7] mt-1">
          Cari berdasarkan nama surat, nomor ayat (misal: 2:255), kata, atau arti dalam terjemahan bahasa Indonesia.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CA3C7]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik kata pencarian (contoh: sabar, shalat, surga, atau 2:255)..."
          autoFocus
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#051D42] border border-[#0D3169] text-sm text-[#F5F1E6] placeholder-[#8CA3C7] focus:outline-none focus:border-[#D9A441] transition shadow-xs"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Bersihkan kata pencarian"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8CA3C7] hover:text-[#F5F1E6] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Indexing Progress Indicator */}
      {indexStatus.progressPercent < 100 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169] text-xs text-[#8CA3C7]">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#168BFF]" />
            <span>
              Index pencarian sedang dipersiapkan... ({indexStatus.indexedSurahCount} dari{' '}
              {indexStatus.totalSurahs} Surat)
            </span>
          </div>
          <span className="font-semibold text-[#FFE29A]">{indexStatus.progressPercent}%</span>
        </div>
      )}

      {/* Search Results */}
      {debouncedQuery.trim() ? (
        results.length === 0 ? (
          <EmptyState
            title="Tidak ditemukan hasil yang sesuai"
            description={`Tidak ditemukan ayat atau surat yang mengandung "${debouncedQuery}". Coba kata kunci yang lebih umum.`}
            actionLabel="Coba kata lain"
            onAction={() => setQuery('')}
          />
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-[#8CA3C7] px-1 flex justify-between items-center">
              <span>Ditemukan {results.length} hasil untuk "{debouncedQuery}"</span>
            </div>

            <div className="space-y-3">
              {results.map((item, idx) => (
                <div
                  key={`${item.surahId}-${item.ayahNumber}-${idx}`}
                  onClick={() => onSelectResult(item.surahId, item.ayahNumber)}
                  className="p-4 sm:p-5 rounded-2xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] hover:border-[#168BFF]/60 transition cursor-pointer group shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#0D3169]/50">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#001F52] text-[#FFE29A] font-bold text-xs flex items-center justify-center border border-[#0D3169]">
                        {item.ayahNumber}
                      </span>
                      <h4 className="text-sm font-bold text-[#F5F1E6] group-hover:text-[#FFE29A] transition">
                        QS. {item.surahName} [{item.surahId}]: Ayat {item.ayahNumber}
                      </h4>
                    </div>
                    <span className="text-xs text-[#168BFF] flex items-center gap-1 group-hover:translate-x-0.5 transition">
                      Buka Ayat <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Arabic Snippet */}
                  <p
                    className="font-arabic text-lg sm:text-xl text-[#F5F1E6] text-right line-clamp-2"
                    dir="rtl"
                  >
                    {item.teksArab}
                  </p>

                  {/* Translation Snippet with Highlight */}
                  <p className="text-xs sm:text-sm text-[#8CA3C7] leading-relaxed line-clamp-3">
                    {highlightMatches(item.teksIndonesia, debouncedQuery)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* Suggestions & Initial State */
        <div className="space-y-4 pt-2">
          <p className="text-xs uppercase font-bold text-[#8CA3C7] tracking-wider px-1">
            Pencarian Populer
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Sabar',
              'Shalat',
              'Sedekah',
              'Ampunan',
              'Surga',
              'Taqwa',
              'Orang Tua',
              'Rezeki',
              'Al-Fatihah',
              'Ayat Kursi (2:255)',
            ].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term.includes(':') ? '2:255' : term)}
                className="px-3 py-1.5 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-xs font-medium text-[#F5F1E6] hover:text-[#FFE29A] transition cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-[#001F52]/40 border border-[#0D3169] text-xs text-[#8CA3C7] leading-relaxed">
            <h4 className="text-[#F5F1E6] font-semibold mb-1">Tips Pencarian ZQuran:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Ketik nama surat untuk langsung melihat surat tersebut (contoh: <em>Yasin</em>).</li>
              <li>Gunakan format <strong>nomor_surat:nomor_ayat</strong> untuk langsung loncat ke ayat tertentu (contoh: <em>36:58</em> atau <em>2:255</em>).</li>
              <li>Ketik kata terjemahan untuk menemukan ayat-ayat yang memuat topik tersebut.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
