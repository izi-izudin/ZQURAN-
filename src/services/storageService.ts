import type { BookmarkItem, ReadingHistory, UserSettings } from '../types/quran';

const BOOKMARKS_KEY = 'zquran_bookmarks_v1';
const HISTORY_KEY = 'zquran_reading_history_v1';
const SETTINGS_KEY = 'zquran_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  arabicFontSize: 30, // px
  translationFontSize: 15, // px
  showTransliteration: true,
  showTranslation: true,
  arabicFontFamily: 'amiri',
  preferredQari: '01',
  showTajwid: true,
  dailyTargetType: 'pages',
  dailyTargetValue: 2,
  readSurahs: [],
};

// --- BOOKMARKS & NOTES ---

export function getBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Gagal membaca bookmark dari storage:', e);
    return [];
  }
}

export function saveBookmark(item: BookmarkItem): BookmarkItem[] {
  try {
    const list = getBookmarks();
    // Jika sudah ada bookmark pada ayat yang sama, perbarui catatan/data
    const existingIndex = list.findIndex(
      (b) => b.surahId === item.surahId && b.ayahNumber === item.ayahNumber
    );

    let updated: BookmarkItem[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...updated[existingIndex], ...item };
    } else {
      updated = [item, ...list];
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Gagal menyimpan bookmark:', e);
    return getBookmarks();
  }
}

export function removeBookmark(surahId: number, ayahNumber: number): BookmarkItem[] {
  try {
    const list = getBookmarks();
    const updated = list.filter((b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber));
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Gagal menghapus bookmark:', e);
    return getBookmarks();
  }
}

export function isAyahBookmarked(surahId: number, ayahNumber: number): boolean {
  const list = getBookmarks();
  return list.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber);
}

export function getBookmarkNote(surahId: number, ayahNumber: number): string | undefined {
  const list = getBookmarks();
  const item = list.find((b) => b.surahId === surahId && b.ayahNumber === ayahNumber);
  return item?.note;
}

// --- READING HISTORY ---

export function getReadingHistory(): ReadingHistory | null {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReadingHistory;
  } catch (e) {
    console.error('Gagal membaca history:', e);
    return null;
  }
}

export function saveReadingHistory(history: ReadingHistory): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Gagal menyimpan history:', e);
  }
}

// --- SETTINGS ---

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Gagal membaca settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Gagal menyimpan settings:', e);
  }
}
