import React, { useState } from 'react';
import { Play, Pause, Bookmark, BookOpen, MoreVertical, Check, Copy, Share2 } from 'lucide-react';
import type { Ayah, UserSettings } from '../../types/quran';
import { IslamicNumberBadge } from '../common/IslamicNumberBadge';
import { renderTajwidText } from '../../utils/tajwidParser';

interface AyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  surahName: string;
  settings: UserSettings;
  isAudioActive: boolean;
  isPlayingAudio: boolean;
  isBookmarked: boolean;
  onPlayAudio: () => void;
  onOpenTafsir: () => void;
  onOpenActions: () => void;
  onToggleBookmark: () => void;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahNumber,
  surahName,
  settings,
  isAudioActive,
  isPlayingAudio,
  isBookmarked,
  onPlayAudio,
  onOpenTafsir,
  onOpenActions,
  onToggleBookmark,
}) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = async () => {
    const text = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}" (QS. ${surahName} [${surahNumber}]: ${ayah.nomorAyat})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // fallback
    }
  };

  const fontClass =
    settings.arabicFontFamily === 'scheherazade'
      ? 'font-arabic-scheherazade'
      : 'font-arabic';

  return (
    <article
      id={`ayah-${ayah.nomorAyat}`}
      aria-label={`Ayat ${ayah.nomorAyat}`}
      className={`rounded-2xl transition duration-200 border p-4 sm:p-6 scroll-mt-24 ${
        isAudioActive
          ? 'bg-[#051D42] border-[#D9A441] shadow-lg ring-1 ring-[#D9A441]/50'
          : 'bg-[#051D42]/60 hover:bg-[#051D42]/85 border-[#0D3169]/80'
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0D3169]/60">
        {/* Ayah Badge */}
        <div className="flex items-center gap-2.5">
          <IslamicNumberBadge number={ayah.nomorAyat} size="sm" active={isAudioActive} />
          <span className="text-xs text-[#8CA3C7] font-medium">
            {surahName} : {ayah.nomorAyat}
          </span>
          {isAudioActive && (
            <span className="flex items-center gap-1 text-[10px] text-[#FFE29A] font-semibold bg-[#001F52] px-2 py-0.5 rounded-full border border-[#D9A441]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-ping" />
              Diputar
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Audio button */}
          <button
            onClick={onPlayAudio}
            aria-label={`Putar audio ayat ${ayah.nomorAyat}`}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isAudioActive && isPlayingAudio
                ? 'bg-[#0647A5] text-[#FFE29A]'
                : 'text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#001F52]'
            }`}
          >
            {isAudioActive && isPlayingAudio ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>

          {/* Bookmark button */}
          <button
            onClick={onToggleBookmark}
            aria-label={`Simpan ayat ${ayah.nomorAyat}`}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isBookmarked
                ? 'text-[#D9A441] bg-[#001F52]'
                : 'text-[#8CA3C7] hover:text-[#D9A441] hover:bg-[#001F52]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Tafsir button */}
          <button
            onClick={onOpenTafsir}
            aria-label={`Tafsir ayat ${ayah.nomorAyat}`}
            className="p-2 rounded-xl text-[#8CA3C7] hover:text-[#168BFF] hover:bg-[#001F52] transition cursor-pointer"
            title="Lihat Tafsir Kemenag"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            aria-label={`Salin ayat ${ayah.nomorAyat}`}
            className="hidden sm:inline-flex p-2 rounded-xl text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] transition cursor-pointer"
            title="Salin Teks Arab & Terjemahan"
          >
            {copyFeedback ? (
              <Check className="w-4 h-4 text-[#10B981]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* More actions (Notes, Share, etc.) */}
          <button
            onClick={onOpenActions}
            aria-label={`Menu lainnya ayat ${ayah.nomorAyat}`}
            className="p-2 rounded-xl text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] transition cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic Text (RTL, large line height, customizable font size) */}
      <div className="py-2">
        <p
          className={`${fontClass} text-[#F5F1E6] select-text tracking-wide`}
          style={{
            fontSize: `${settings.arabicFontSize}px`,
            lineHeight: 2.3,
          }}
          dir="rtl"
          lang="ar"
        >
          {renderTajwidText(ayah.teksArab, settings.showTajwid)}
        </p>
      </div>

      {/* Transliteration (Latin) if enabled and available */}
      {settings.showTransliteration && ayah.teksLatin && (
        <div className="mt-3 pt-2 text-[#FFE29A]/90 text-xs sm:text-sm font-normal italic tracking-wide leading-relaxed">
          {ayah.teksLatin}
        </div>
      )}

      {/* Indonesian Translation if enabled */}
      {settings.showTranslation && ayah.teksIndonesia && (
        <div
          className="mt-3 text-[#F5F1E6]/90 leading-relaxed font-light"
          style={{ fontSize: `${settings.translationFontSize}px` }}
        >
          {ayah.teksIndonesia}
        </div>
      )}
    </article>
  );
};
