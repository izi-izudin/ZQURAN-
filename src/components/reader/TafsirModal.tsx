import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { getSurahTafsir } from '../../api/quranApi';
import type { SurahTafsir, TafsirAyah } from '../../types/quran';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  targetAyahNumber?: number;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  targetAyahNumber,
}) => {
  const [tafsirData, setTafsirData] = useState<SurahTafsir | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number>(targetAyahNumber || 1);

  useEffect(() => {
    if (!isOpen || !surahNumber) return;

    if (targetAyahNumber) {
      setSelectedAyah(targetAyahNumber);
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchTafsir = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSurahTafsir(surahNumber, controller.signal);
        if (isMounted) {
          setTafsirData(data);
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
  }, [isOpen, surahNumber, targetAyahNumber]);

  if (!isOpen) return null;

  const currentAyahTafsir = tafsirData?.tafsir.find((t) => t.ayat === selectedAyah);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tafsir Surat ${surahName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/80 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#051D42] border border-[#0D3169] flex flex-col shadow-2xl text-[#F5F1E6]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#0D3169] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#001F52] flex items-center justify-center text-[#D9A441]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F5F1E6]">
                Tafsir Kemenag RI — {surahName}
              </h3>
              <p className="text-xs text-[#8CA3C7]">
                Kementerian Agama Republik Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal tafsir"
            className="p-1.5 rounded-lg text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ayah Navigation Tabs */}
        {tafsirData && (
          <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-[#0D3169]/60 shrink-0 bg-[#001F52]/40">
            <span className="text-xs text-[#8CA3C7] shrink-0 mr-1 font-medium">Ayat:</span>
            {tafsirData.tafsir.map((t) => (
              <button
                key={t.ayat}
                onClick={() => setSelectedAyah(t.ayat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                  selectedAyah === t.ayat
                    ? 'bg-[#0647A5] text-[#FFE29A] border border-[#168BFF]'
                    : 'bg-[#001F52] text-[#8CA3C7] hover:text-[#F5F1E6] border border-[#0D3169]'
                }`}
              >
                {t.ayat}
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <span className="w-7 h-7 border-3 border-[#0647A5] border-t-[#D9A441] rounded-full animate-spin" />
              <p className="text-xs text-[#8CA3C7]">Memuat tafsir ayat dari server...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#001F52] border border-[#EF4444]/40 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-[#EF4444] mx-auto" />
              <p className="text-xs text-[#EF4444]">{error}</p>
            </div>
          )}

          {!isLoading && !error && currentAyahTafsir && (
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-[#001F52] border border-[#0D3169] text-xs font-semibold text-[#FFE29A]">
                Ayat {currentAyahTafsir.ayat}
              </div>
              <div className="text-sm leading-relaxed text-[#F5F1E6] whitespace-pre-line space-y-3">
                {currentAyahTafsir.teks}
              </div>
            </div>
          )}

          {!isLoading && !error && !currentAyahTafsir && (
            <div className="py-8 text-center text-xs text-[#8CA3C7]">
              Tafsir untuk ayat ini tidak tersedia dari sumber API.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#0D3169] flex items-center justify-between shrink-0 bg-[#001F52]/30">
          <span className="text-[11px] text-[#8CA3C7]">
            Sumber: Kementerian Agama RI via eQuran API v2
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-medium text-[#F5F1E6] transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
