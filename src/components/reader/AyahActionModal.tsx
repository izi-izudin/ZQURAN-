import React, { useState, useEffect } from 'react';
import { X, Bookmark, Edit3, Share2, Copy, Play, BookOpen, Check } from 'lucide-react';
import type { Ayah } from '../../types/quran';
import { saveBookmark, removeBookmark, isAyahBookmarked, getBookmarkNote } from '../../services/storageService';

interface AyahActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  ayah: Ayah;
  onPlayAudio: () => void;
  onOpenTafsir: () => void;
  onBookmarkChanged?: () => void;
}

export const AyahActionModal: React.FC<AyahActionModalProps> = ({
  isOpen,
  onClose,
  surahNumber,
  surahName,
  ayah,
  onPlayAudio,
  onOpenTafsir,
  onBookmarkChanged,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsBookmarked(isAyahBookmarked(surahNumber, ayah.nomorAyat));
      setNoteText(getBookmarkNote(surahNumber, ayah.nomorAyat) || '');
      setCopyFeedback(false);
    }
  }, [isOpen, surahNumber, ayah.nomorAyat]);

  if (!isOpen) return null;

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(surahNumber, ayah.nomorAyat);
      setIsBookmarked(false);
    } else {
      saveBookmark({
        id: `${surahNumber}_${ayah.nomorAyat}`,
        surahId: surahNumber,
        ayahNumber: ayah.nomorAyat,
        surahName,
        ayahSnippet: ayah.teksIndonesia,
        createdAt: new Date().toISOString(),
        note: noteText.trim() || undefined,
      });
      setIsBookmarked(true);
    }
    onBookmarkChanged?.();
  };

  const handleSaveNote = () => {
    saveBookmark({
      id: `${surahNumber}_${ayah.nomorAyat}`,
      surahId: surahNumber,
      ayahNumber: ayah.nomorAyat,
      surahName,
      ayahSnippet: ayah.teksIndonesia,
      createdAt: new Date().toISOString(),
      note: noteText.trim(),
    });
    setIsBookmarked(true);
    onBookmarkChanged?.();
  };

  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall back to execCommand
      }
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  const handleCopyText = async () => {
    const textToCopy = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}" (QS. ${surahName} [${surahNumber}]: ${ayah.nomorAyat})`;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopyFeedback(true);
      setFeedbackNotice('Ayat berhasil disalin ke papan klip.');
      setTimeout(() => {
        setCopyFeedback(false);
        setFeedbackNotice(null);
      }, 3000);
    } else {
      setFeedbackNotice('Tidak dapat menyalin ayat secara otomatis.');
      setTimeout(() => setFeedbackNotice(null), 3000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `QS. ${surahName}: ${ayah.nomorAyat}`,
      text: `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n(QS. ${surahName}: ${ayah.nomorAyat}) - ZQuran`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled share or failed
      }
    }

    // Fallback ke clipboard bila Web Share API tidak tersedia / dibatalkan
    const textToShare = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n(QS. ${surahName}: ${ayah.nomorAyat}) - ZQuran`;
    const success = await copyToClipboard(textToShare);
    if (success) {
      setFeedbackNotice('Ayat berhasil disalin. Silakan bagikan melalui aplikasi pilihan Anda.');
      setTimeout(() => setFeedbackNotice(null), 3500);
    } else {
      setFeedbackNotice('Tidak dapat menyalin ayat secara otomatis.');
      setTimeout(() => setFeedbackNotice(null), 3500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Menu Ayat ${ayah.nomorAyat}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/80 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 shadow-2xl text-[#F5F1E6] relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#001F52] border border-[#D9A441]/40 flex items-center justify-center text-xs font-bold text-[#FFE29A]">
              {ayah.nomorAyat}
            </span>
            <h3 className="text-base font-bold text-[#F5F1E6]">
              {surahName}: Ayat {ayah.nomorAyat}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup menu ayat"
            className="p-1 rounded-lg text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Notice Banner */}
        {feedbackNotice && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#0647A5]/40 border border-[#D9A441] text-xs text-[#FFE29A] text-center font-medium">
            {feedbackNotice}
          </div>
        )}

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => {
              onPlayAudio();
              onClose();
            }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-medium text-[#F5F1E6] transition cursor-pointer border border-[#0D3169]"
          >
            <Play className="w-4 h-4 text-[#D9A441]" />
            <span>Putar Audio</span>
          </button>

          <button
            onClick={() => {
              onOpenTafsir();
              onClose();
            }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-medium text-[#F5F1E6] transition cursor-pointer border border-[#0D3169]"
          >
            <BookOpen className="w-4 h-4 text-[#168BFF]" />
            <span>Buka Tafsir</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
              isBookmarked
                ? 'bg-[#0647A5] border-[#D9A441] text-[#FFE29A]'
                : 'bg-[#001F52] border-[#0D3169] text-[#F5F1E6] hover:bg-[#0647A5]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-[#D9A441]' : ''}`} />
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan Ayat'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-medium text-[#F5F1E6] transition cursor-pointer border border-[#0D3169]"
          >
            {copyFeedback ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981]">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#8CA3C7]" />
                <span>Salin Teks</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-medium text-[#F5F1E6] transition cursor-pointer border border-[#0D3169]"
          >
            <Share2 className="w-4 h-4 text-[#FFE29A]" />
            <span>Bagikan Ayat</span>
          </button>
        </div>

        {/* Note / Catatan Pribadi */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#8CA3C7] flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              Catatan Pribadi (Tadabbur)
            </span>
            {isBookmarked && <span className="text-[10px] text-[#D9A441]">Tersimpan di Bookmark</span>}
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Tulis catatan, refleksi, atau pengingat untuk ayat ini..."
            rows={3}
            className="w-full rounded-xl bg-[#001F52] border border-[#0D3169] p-3 text-xs text-[#F5F1E6] placeholder-[#8CA3C7]/60 focus:outline-none focus:border-[#D9A441]"
          />
          <button
            onClick={handleSaveNote}
            className="w-full py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
          >
            Simpan Catatan
          </button>
        </div>
      </div>
    </div>
  );
};
