/**
 * Data Resmi 30 Juz Al-Qur'an
 * Menyimpan titik awal surat dan nomor ayat untuk setiap Juz
 */

export interface JuzItem {
  juzNumber: number;
  startSurahNumber: number;
  startSurahName: string;
  startAyahNumber: number;
  endSurahNumber: number;
  endSurahName: string;
  endAyahNumber: number;
  arabicName: string;
}

export const JUZ_LIST: JuzItem[] = [
  { juzNumber: 1, startSurahNumber: 1, startSurahName: 'Al-Fatihah', startAyahNumber: 1, endSurahNumber: 2, endSurahName: 'Al-Baqarah', endAyahNumber: 141, arabicName: 'الجزء الأول' },
  { juzNumber: 2, startSurahNumber: 2, startSurahName: 'Al-Baqarah', startAyahNumber: 142, endSurahNumber: 2, endSurahName: 'Al-Baqarah', endAyahNumber: 252, arabicName: 'الجزء الثاني' },
  { juzNumber: 3, startSurahNumber: 2, startSurahName: 'Al-Baqarah', startAyahNumber: 253, endSurahNumber: 3, endSurahName: "Ali 'Imran", endAyahNumber: 92, arabicName: 'الجزء الثالث' },
  { juzNumber: 4, startSurahNumber: 3, startSurahName: "Ali 'Imran", startAyahNumber: 93, endSurahNumber: 4, endSurahName: "An-Nisa'", endAyahNumber: 23, arabicName: 'الجزء الرابع' },
  { juzNumber: 5, startSurahNumber: 4, startSurahName: "An-Nisa'", startAyahNumber: 24, endSurahNumber: 4, endSurahName: "An-Nisa'", endAyahNumber: 147, arabicName: 'الجزء الخامس' },
  { juzNumber: 6, startSurahNumber: 4, startSurahName: "An-Nisa'", startAyahNumber: 148, endSurahNumber: 5, endSurahName: "Al-Ma'idah", endAyahNumber: 81, arabicName: 'الجزء السادس' },
  { juzNumber: 7, startSurahNumber: 5, startSurahName: "Al-Ma'idah", startAyahNumber: 82, endSurahNumber: 6, endSurahName: "Al-An'am", endAyahNumber: 110, arabicName: 'الجزء السابع' },
  { juzNumber: 8, startSurahNumber: 6, startSurahName: "Al-An'am", startAyahNumber: 111, endSurahNumber: 7, endSurahName: "Al-A'raf", endAyahNumber: 87, arabicName: 'الجزء الثامن' },
  { juzNumber: 9, startSurahNumber: 7, startSurahName: "Al-A'raf", startAyahNumber: 88, endSurahNumber: 8, endSurahName: 'Al-Anfal', endAyahNumber: 40, arabicName: 'الجزء التاسع' },
  { juzNumber: 10, startSurahNumber: 8, startSurahName: 'Al-Anfal', startAyahNumber: 41, endSurahNumber: 9, endSurahName: 'At-Taubah', endAyahNumber: 92, arabicName: 'الجزء العاشر' },
  { juzNumber: 11, startSurahNumber: 9, startSurahName: 'At-Taubah', startAyahNumber: 93, endSurahNumber: 11, endSurahName: 'Hud', endAyahNumber: 5, arabicName: 'الجزء الحادي عشر' },
  { juzNumber: 12, startSurahNumber: 11, startSurahName: 'Hud', startAyahNumber: 6, endSurahNumber: 12, endSurahName: 'Yusuf', endAyahNumber: 52, arabicName: 'الجزء الثاني عشر' },
  { juzNumber: 13, startSurahNumber: 12, startSurahName: 'Yusuf', startAyahNumber: 53, endSurahNumber: 14, endSurahName: 'Ibrahim', endAyahNumber: 52, arabicName: 'الجزء الثالث عشر' },
  { juzNumber: 14, startSurahNumber: 15, startSurahName: 'Al-Hijr', startAyahNumber: 1, endSurahNumber: 16, endSurahName: 'An-Nahl', endAyahNumber: 128, arabicName: 'الجزء الرابع عشر' },
  { juzNumber: 15, startSurahNumber: 17, startSurahName: "Al-Isra'", startAyahNumber: 1, endSurahNumber: 18, endSurahName: 'Al-Kahf', endAyahNumber: 74, arabicName: 'الجزء الخامس عشر' },
  { juzNumber: 16, startSurahNumber: 18, startSurahName: 'Al-Kahf', startAyahNumber: 75, endSurahNumber: 20, endSurahName: 'Ta-Ha', endAyahNumber: 135, arabicName: 'الجزء السادس عشر' },
  { juzNumber: 17, startSurahNumber: 21, startSurahName: "Al-Anbiya'", startAyahNumber: 1, endSurahNumber: 22, endSurahName: 'Al-Hajj', endAyahNumber: 78, arabicName: 'الجزء السابع عشر' },
  { juzNumber: 18, startSurahNumber: 23, startSurahName: "Al-Mu'minun", startAyahNumber: 1, endSurahNumber: 25, endSurahName: 'Al-Furqan', endAyahNumber: 20, arabicName: 'الجزء الثامن عشر' },
  { juzNumber: 19, startSurahNumber: 25, startSurahName: 'Al-Furqan', startAyahNumber: 21, endSurahNumber: 27, endSurahName: 'An-Naml', endAyahNumber: 55, arabicName: 'الجزء التاسع عشر' },
  { juzNumber: 20, startSurahNumber: 27, startSurahName: 'An-Naml', startAyahNumber: 56, endSurahNumber: 29, endSurahName: "Al-'Ankabut", endAyahNumber: 45, arabicName: 'الجزء العشرون' },
  { juzNumber: 21, startSurahNumber: 29, startSurahName: "Al-'Ankabut", startAyahNumber: 46, endSurahNumber: 33, endSurahName: 'Al-Ahzab', endAyahNumber: 30, arabicName: 'الجزء الحادي والعشرون' },
  { juzNumber: 22, startSurahNumber: 33, startSurahName: 'Al-Ahzab', startAyahNumber: 31, endSurahNumber: 36, endSurahName: 'Yasin', endAyahNumber: 27, arabicName: 'الجزء الثاني والعشرون' },
  { juzNumber: 23, startSurahNumber: 36, startSurahName: 'Yasin', startAyahNumber: 28, endSurahNumber: 39, endSurahName: 'Az-Zumar', endAyahNumber: 31, arabicName: 'الجزء الثالث والعشرون' },
  { juzNumber: 24, startSurahNumber: 39, startSurahName: 'Az-Zumar', startAyahNumber: 32, endSurahNumber: 41, endSurahName: 'Fussilat', endAyahNumber: 46, arabicName: 'الجزء الرابع والعشرون' },
  { juzNumber: 25, startSurahNumber: 41, startSurahName: 'Fussilat', startAyahNumber: 47, endSurahNumber: 45, endSurahName: 'Al-Jasiyah', endAyahNumber: 37, arabicName: 'الجزء الخامس والعشرون' },
  { juzNumber: 26, startSurahNumber: 46, startSurahName: 'Al-Ahqaf', startAyahNumber: 1, endSurahNumber: 51, endSurahName: 'Az-Zariyat', endAyahNumber: 30, arabicName: 'الجزء السادس والعشرون' },
  { juzNumber: 27, startSurahNumber: 51, startSurahName: 'Az-Zariyat', startAyahNumber: 31, endSurahNumber: 57, endSurahName: 'Al-Hadid', endAyahNumber: 29, arabicName: 'الجزء السابع والعشرون' },
  { juzNumber: 28, startSurahNumber: 58, startSurahName: 'Al-Mujadilah', startAyahNumber: 1, endSurahNumber: 66, endSurahName: 'At-Tahrim', endAyahNumber: 12, arabicName: 'الجزء الثامن والعشرون' },
  { juzNumber: 29, startSurahNumber: 67, startSurahName: 'Al-Mulk', startAyahNumber: 1, endSurahNumber: 77, endSurahName: 'Al-Mursalat', endAyahNumber: 50, arabicName: 'الجزء التاسع والعشرون' },
  { juzNumber: 30, startSurahNumber: 78, startSurahName: "An-Naba'", startAyahNumber: 1, endSurahNumber: 114, endSurahName: 'An-Nas', endAyahNumber: 6, arabicName: 'الجزء الثلاثون' },
];
