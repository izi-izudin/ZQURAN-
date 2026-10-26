import React from 'react';
import { BookOpen, ArrowRight, Bookmark } from 'lucide-react';
import type { ReadingHistory } from '../../types/quran';

interface ContinueReadingCardProps {
  history: ReadingHistory | null;
  onContinue: (surahId: number, ayahNumber?: number) => void;
  onStartReading: () => void;
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({
  history,
  onContinue,
  onStartReading,
}) => {
  if (!history) {
    return (
      <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 sm:p-6 shadow-md text-[#F5F1E6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#001F52] border border-[#0D3169] flex items-center justify-center text-[#D9A441] shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-[#8CA3C7] tracking-wider">
                Terakhir Dibaca
              </p>
              <h3 className="text-base sm:text-lg font-bold text-[#F5F1E6]">
                Mulai perjalanan membaca Al-Qur'an
              </h3>
              <p className="text-xs text-[#8CA3C7]">
                Tandai ayat favorit dan lanjutkan tilawah kapan saja.
              </p>
            </div>
          </div>

          <button
            onClick={onStartReading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 border border-[#168BFF]/40 shadow-sm"
          >
            <span>Mulai Membaca</span>
            <ArrowRight className="w-4 h-4 text-[#FFE29A]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 sm:p-6 shadow-md text-[#F5F1E6]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#001F52] border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441] shrink-0">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#FFE29A] tracking-wider px-2 py-0.5 rounded-full bg-[#001F52] border border-[#0D3169]">
                Terakhir Dibaca
              </span>
              <span className="text-xs text-[#8CA3C7]">
                {new Date(history.timestamp).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F5F1E6] mt-1">
              Surat {history.surahName}
            </h3>
            <p className="text-xs text-[#8CA3C7]">
              Ayat ke-{history.ayahNumber} • {Math.round(history.progressPercent)}% selesai
            </p>
          </div>
        </div>

        <button
          onClick={() => onContinue(history.surahId, history.ayahNumber)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 border border-[#168BFF]/40 shadow-sm"
        >
          <span>Lanjutkan Membaca</span>
          <ArrowRight className="w-4 h-4 text-[#FFE29A]" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-[#0D3169]/60">
        <div className="flex justify-between text-[11px] text-[#8CA3C7] mb-1">
          <span>Progres Surat</span>
          <span className="text-[#FFE29A] font-semibold">
            {Math.round(history.progressPercent)}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#001F52] overflow-hidden">
          <div
            className="h-full bg-[#D9A441] rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(5, history.progressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
