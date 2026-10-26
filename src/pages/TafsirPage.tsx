import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowRight, ChevronDown, AlertCircle } from 'lucide-react';
import { getSurahTafsir } from '../api/quranApi';
import type { SurahSummary, SurahTafsir } from '../types/quran';
import { ErrorState } from '../components/common/ErrorState';

interface TafsirPageProps {
  surahs: SurahSummary[];
  onOpenAyahInReader: (surahNumber: number, ayahNumber: number) => void;
}

export const TafsirPage: React.FC<TafsirPageProps> = ({ surahs, onOpenAyahInReader }) => {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [tafsirData, setTafsirData] = useState<SurahTafsir | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surahSearch, setSurahSearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchTafsir = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSurahTafsir(selectedSurahNumber, controller.signal);
        if (isMounted) {
          setTafsirData(data);
          setSelectedAyah(1);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError((err as Error)?.message || 'Gagal memuat tafsir surat.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTafsir();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedSurahNumber]);

  const currentAyahTafsir = tafsirData?.tafsir.find((t) => t.ayat === selectedAyah);
  const currentSurah = surahs.find((s) => s.nomor === selectedSurahNumber);

  return (
    <div className="space-y-6 pb-24 md:pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F1E6]">
          Tafsir Al-Qur'an Kemenag RI
        </h2>
        <p className="text-xs sm:text-sm text-[#8CA3C7] mt-0.5">
          Tafsir resmi Kementerian Agama Republik Indonesia ayat demi ayat.
        </p>
      </div>

      {/* Surah Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#051D42] border border-[#0D3169] space-y-3">
        <label className="block text-xs font-semibold text-[#8CA3C7]">
          Pilih Surat untuk Dibaca Tafsirnya:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedSurahNumber}
            onChange={(e) => setSelectedSurahNumber(Number(e.target.value))}
            aria-label="Pilih Surat untuk Tafsir"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#001F52] border border-[#0D3169] text-xs sm:text-sm text-[#F5F1E6] focus:outline-none focus:border-[#D9A441]"
          >
            {surahs.map((s) => (
              <option key={s.nomor} value={s.nomor}>
                {s.nomor}. {s.namaLatin} ({s.arti}) — {s.jumlahAyat} ayat
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 rounded-2xl bg-[#051D42]/60 border border-[#0D3169] flex flex-col items-center justify-center space-y-3">
          <span className="w-8 h-8 border-3 border-[#0647A5] border-t-[#D9A441] rounded-full animate-spin" />
          <p className="text-xs text-[#8CA3C7]">Memuat teks tafsir resmi dari Kemenag RI...</p>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => setSelectedSurahNumber((n) => n)} />
      ) : tafsirData ? (
        <div className="space-y-4">
          {/* Surah Header Card */}
          <div className="p-5 rounded-2xl bg-[#051D42] border border-[#0D3169] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#001F52] border border-[#0D3169] text-[#FFE29A]">
                Surat ke-{tafsirData.nomor} • {tafsirData.tempatTurun}
              </span>
              <h3 className="text-xl font-bold text-[#F5F1E6] mt-1.5">
                Surat {tafsirData.namaLatin} ({tafsirData.arti})
              </h3>
              <p className="text-xs text-[#8CA3C7] mt-0.5">
                Total {tafsirData.jumlahAyat} Ayat
              </p>
            </div>

            <div className="font-arabic text-2xl text-[#D9A441]">
              {tafsirData.nama}
            </div>
          </div>

          {/* Ayat Tabs / Pills */}
          <div className="p-3 rounded-2xl bg-[#051D42] border border-[#0D3169] overflow-x-auto flex items-center gap-1.5">
            <span className="text-xs text-[#8CA3C7] shrink-0 font-medium mr-1">
              Pilih Ayat:
            </span>
            {tafsirData.tafsir.map((t) => (
              <button
                key={t.ayat}
                onClick={() => setSelectedAyah(t.ayat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
                  selectedAyah === t.ayat
                    ? 'bg-[#0647A5] text-[#FFE29A] border border-[#168BFF]'
                    : 'bg-[#001F52] text-[#8CA3C7] hover:text-[#F5F1E6] border border-[#0D3169]'
                }`}
              >
                Ayat {t.ayat}
              </button>
            ))}
          </div>

          {/* Tafsir Content Card */}
          {currentAyahTafsir ? (
            <div className="p-6 rounded-2xl bg-[#051D42] border border-[#0D3169] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#001F52] border border-[#D9A441]/40 flex items-center justify-center text-xs font-bold text-[#FFE29A]">
                    {currentAyahTafsir.ayat}
                  </span>
                  <h4 className="text-sm font-bold text-[#F5F1E6]">
                    Tafsir QS. {tafsirData.namaLatin} Ayat {currentAyahTafsir.ayat}
                  </h4>
                </div>

                <button
                  onClick={() => onOpenAyahInReader(tafsirData.nomor, currentAyahTafsir.ayat)}
                  className="flex items-center gap-1 text-xs text-[#168BFF] hover:text-[#FFE29A] transition cursor-pointer font-medium"
                >
                  <span>Buka di Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-[#F5F1E6] leading-relaxed whitespace-pre-line space-y-3 font-normal">
                {currentAyahTafsir.teks}
              </div>

              <div className="pt-3 border-t border-[#0D3169] flex items-center justify-between text-[11px] text-[#8CA3C7]">
                <span>Sumber: Kementerian Agama RI via eQuran API v2</span>
                <span className="text-[#FFE29A]">Certified Indonesian Tafsir</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#8CA3C7] rounded-2xl bg-[#051D42] border border-[#0D3169]">
              Tafsir untuk ayat ini tidak tersedia dari sumber API.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
