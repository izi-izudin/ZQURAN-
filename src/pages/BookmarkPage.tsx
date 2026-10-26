import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Edit3, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { getBookmarks, removeBookmark, saveBookmark } from '../services/storageService';
import type { BookmarkItem } from '../types/quran';
import { EmptyState } from '../components/common/EmptyState';

interface BookmarkPageProps {
  onSelectBookmark: (surahId: number, ayahNumber: number) => void;
  onExploreSurah: () => void;
}

export const BookmarkPage: React.FC<BookmarkPageProps> = ({
  onSelectBookmark,
  onExploreSurah,
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteEditVal, setNoteEditVal] = useState('');

  const loadBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleDelete = (surahId: number, ayahNumber: number) => {
    const updated = removeBookmark(surahId, ayahNumber);
    setBookmarks(updated);
  };

  const handleStartEdit = (b: BookmarkItem) => {
    setEditingId(b.id);
    setNoteEditVal(b.note || '');
  };

  const handleSaveNote = (b: BookmarkItem) => {
    const updated = saveBookmark({
      ...b,
      note: noteEditVal.trim(),
    });
    setBookmarks(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#0D3169]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F1E6]">Bookmark & Catatan</h2>
          <p className="text-xs sm:text-sm text-[#8CA3C7] mt-0.5">
            Daftar ayat yang Anda tandai beserta catatan refleksi pribadi (tadabbur).
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#001F52] border border-[#0D3169] text-[#FFE29A]">
          {bookmarks.length} Tersimpan
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-7 h-7 text-[#D9A441]" />}
          title="Belum ada ayat yang disimpan."
          description="Saat membaca surat, tekan ikon bookmark pada ayat untuk menyimpannya ke daftar ini."
          actionLabel="Mulai Membaca Surat"
          onAction={onExploreSurah}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#051D42] border border-[#0D3169] hover:border-[#168BFF]/50 transition flex flex-col justify-between shadow-xs space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#001F52] text-[#FFE29A] font-bold text-xs flex items-center justify-center border border-[#0D3169]">
                    {b.ayahNumber}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#F5F1E6]">
                      QS. {b.surahName} : Ayat {b.ayahNumber}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#8CA3C7]">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(b.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(b)}
                    aria-label="Edit catatan pribadi"
                    className="p-1.5 rounded-lg text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#001F52] transition cursor-pointer"
                    title="Edit Catatan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.surahId, b.ayahNumber)}
                    aria-label="Hapus bookmark"
                    className="p-1.5 rounded-lg text-[#8CA3C7] hover:text-[#EF4444] hover:bg-[#001F52] transition cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ayah Snippet */}
              {b.ayahSnippet && (
                <p className="text-xs text-[#8CA3C7] leading-relaxed line-clamp-3 italic">
                  "{b.ayahSnippet}"
                </p>
              )}

              {/* Note Section */}
              {editingId === b.id ? (
                <div className="space-y-2 pt-2 border-t border-[#0D3169]">
                  <textarea
                    value={noteEditVal}
                    onChange={(e) => setNoteEditVal(e.target.value)}
                    placeholder="Tulis catatan tadabbur..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-[#001F52] border border-[#0D3169] text-xs text-[#F5F1E6] focus:outline-none focus:border-[#D9A441]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 rounded-lg text-xs text-[#8CA3C7] hover:bg-[#001F52] cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleSaveNote(b)}
                      className="px-3 py-1 rounded-lg bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              ) : (
                b.note && (
                  <div className="p-2.5 rounded-xl bg-[#001F52]/60 border border-[#0D3169] text-xs text-[#FFE29A] flex items-start gap-2">
                    <Edit3 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D9A441]" />
                    <p className="line-clamp-2">{b.note}</p>
                  </div>
                )
              )}

              {/* Action: Jump to Reader */}
              <div className="pt-2 border-t border-[#0D3169]/50 flex justify-end">
                <button
                  onClick={() => onSelectBookmark(b.surahId, b.ayahNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
                >
                  <span>Buka di Reader</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFE29A]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
