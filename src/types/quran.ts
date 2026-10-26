/**
 * Schema & Types Al-Qur'an Data dari equran.id API v2
 */

export interface SurahSummary {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah' | string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface NavSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface SurahDetail extends SurahSummary {
  ayat: Ayah[];
  suratSebelumnya: NavSurah | false;
  suratSelanjutnya: NavSurah | false;
}

export interface TafsirAyah {
  ayat: number;
  teks: string;
}

export interface SurahTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  tafsir: TafsirAyah[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * Persistence & Application Types
 */
export interface BookmarkItem {
  id: string;
  surahId: number;
  ayahNumber: number;
  surahName: string;
  ayahSnippet: string;
  createdAt: string;
  note?: string;
}

export interface ReadingHistory {
  surahId: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
  progressPercent: number;
}

export interface UserSettings {
  arabicFontSize: number; // 24 to 48 px
  translationFontSize: number; // 14 to 22 px
  showTransliteration: boolean;
  showTranslation: boolean;
  arabicFontFamily: 'amiri' | 'scheherazade';
  preferredQari: string; // '01' - '06'
  dailyTargetType: 'pages' | 'juz' | 'surah';
  dailyTargetValue: number;
  readSurahs: number[]; // array of completed surah IDs
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  surahId: number | null;
  surahName: string | null;
  currentAyah: number | null; // null if playing full surah
  totalAyah: number | null;
  qariId: string;
  audioUrl: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'ayah' | 'surah';
  playbackError: string | null;
}

export interface SearchResultItem {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  teksArab: string;
  teksIndonesia: string;
  matchedField: 'surah' | 'translation' | 'number';
}
