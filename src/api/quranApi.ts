import { apiRequest } from './apiClient';
import type { SurahSummary, SurahDetail, SurahTafsir } from '../types/quran';

/**
 * Mengambil daftar 114 surat Al-Qur'an dari API v2
 */
export async function getSurahList(signal?: AbortSignal): Promise<SurahSummary[]> {
  const data = await apiRequest<SurahSummary[]>('/surat', { signal });
  if (!Array.isArray(data)) {
    throw new Error('Daftar surat tidak berformat array.');
  }
  return data;
}

/**
 * Mengambil detail surat beserta teks Arab, Latin, Terjemahan, dan Audio per ayat
 */
export async function getSurahDetail(surahNumber: number, signal?: AbortSignal): Promise<SurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Nomor surat tidak valid: ${surahNumber}. Harus di antara 1 dan 114.`);
  }
  const data = await apiRequest<SurahDetail>(`/surat/${surahNumber}`, { signal });
  if (!data || !Array.isArray(data.ayat)) {
    throw new Error(`Data ayat surat nomor ${surahNumber} tidak lengkap.`);
  }
  return data;
}

/**
 * Mengambil data tafsir Kemenag per ayat untuk surat tertentu
 */
export async function getSurahTafsir(surahNumber: number, signal?: AbortSignal): Promise<SurahTafsir> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Nomor surat tidak valid: ${surahNumber}. Harus di antara 1 dan 114.`);
  }
  const data = await apiRequest<SurahTafsir>(`/tafsir/${surahNumber}`, { signal });
  if (!data || !Array.isArray(data.tafsir)) {
    throw new Error(`Tafsir untuk surat ${surahNumber} tidak ditemukan.`);
  }
  return data;
}
