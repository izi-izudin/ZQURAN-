import { QARI_LIST, type QariId } from '../config/appConfig';
import type { Ayah, SurahSummary } from '../types/quran';

/**
 * Mendapatkan URL Audio untuk satu ayat dari data API
 */
export function getAyahAudioUrl(ayah: Ayah, qariId: string): string | null {
  if (!ayah.audio || typeof ayah.audio !== 'object') {
    return null;
  }
  // Cek apakah qari yang dipilih tersedia di response
  if (ayah.audio[qariId]) {
    return ayah.audio[qariId];
  }
  // Fallback ke qari default '01' jika ada
  if (ayah.audio['01']) {
    return ayah.audio['01'];
  }
  // Atau ambil audio pertama yang valid
  const firstAvailable = Object.values(ayah.audio)[0];
  return firstAvailable || null;
}

/**
 * Mendapatkan URL Audio untuk satu surat penuh dari data API
 */
export function getSurahAudioUrl(surah: SurahSummary, qariId: string): string | null {
  if (!surah.audioFull || typeof surah.audioFull !== 'object') {
    return null;
  }
  if (surah.audioFull[qariId]) {
    return surah.audioFull[qariId];
  }
  if (surah.audioFull['01']) {
    return surah.audioFull['01'];
  }
  const firstAvailable = Object.values(surah.audioFull)[0];
  return firstAvailable || null;
}

/**
 * Mendapatkan informasi nama qari berdasarkan ID
 */
export function getQariInfo(qariId: string) {
  const found = QARI_LIST.find((q) => q.id === qariId);
  return found || QARI_LIST[0];
}
