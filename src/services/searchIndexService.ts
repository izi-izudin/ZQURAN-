import type { SurahSummary, SurahDetail, SearchResultItem } from '../types/quran';
import { getSurahDetail } from '../api/quranApi';

export interface IndexStatus {
  isReady: boolean;
  indexedSurahCount: number;
  totalSurahs: number;
  progressPercent: number;
}

// In-memory indexed ayat collection
interface IndexedAyahRecord {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  teksArab: string;
  teksIndonesia: string;
  normalizedText: string;
}

class SearchIndexManager {
  private indexedAyahs: IndexedAyahRecord[] = [];
  private surahSummaries: SurahSummary[] = [];
  private indexedSurahIds = new Set<number>();
  private isIndexingInProgress = false;
  private listeners = new Set<(status: IndexStatus) => void>();

  public setSurahs(surahs: SurahSummary[]) {
    this.surahSummaries = surahs;
    this.notify();
  }

  public getStatus(): IndexStatus {
    const total = this.surahSummaries.length || 114;
    const indexed = this.indexedSurahIds.size;
    const percent = Math.min(100, Math.round((indexed / total) * 100));
    return {
      isReady: indexed > 0,
      indexedSurahCount: indexed,
      totalSurahs: total,
      progressPercent: percent,
    };
  }

  public onStatusChange(listener: (status: IndexStatus) => void) {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach((fn) => fn(status));
  }

  /**
   * Menambahkan satu surat yang baru saja dibuka ke dalam index
   */
  public addSurahToDetailIndex(detail: SurahDetail) {
    if (this.indexedSurahIds.has(detail.nomor)) return;

    const records: IndexedAyahRecord[] = detail.ayat.map((ay) => ({
      surahId: detail.nomor,
      surahName: detail.namaLatin,
      ayahNumber: ay.nomorAyat,
      teksArab: ay.teksArab,
      teksIndonesia: ay.teksIndonesia,
      normalizedText: this.normalize(
        `${detail.namaLatin} ${detail.arti} ${ay.teksIndonesia} ${ay.teksLatin}`
      ),
    }));

    this.indexedAyahs.push(...records);
    this.indexedSurahIds.add(detail.nomor);
    this.notify();
  }

  /**
   * Membangun search index secara bertahap di background tanpa membebani browser UI thread
   */
  public async startIndexing(surahs: SurahSummary[]) {
    if (this.isIndexingInProgress) return;
    this.isIndexingInProgress = true;
    this.surahSummaries = surahs;

    // Prioritaskan surat yang sering dicari / surat pendek terlebih dahulu
    // lalu bertahap mengisi surat lainnya
    const prioritySurahs = [1, 36, 18, 55, 56, 67, 112, 113, 114, 2];
    const remaining = surahs
      .map((s) => s.nomor)
      .filter((num) => !prioritySurahs.includes(num));
    const queue = [...prioritySurahs, ...remaining];

    for (const surahNum of queue) {
      if (this.indexedSurahIds.has(surahNum)) continue;

      try {
        const detail = await getSurahDetail(surahNum);
        this.addSurahToDetailIndex(detail);
      } catch {
        // Abaikan error pada background indexing agar tidak mengganggu UI
      }

      // Beri jeda kecil (idle yield) agar event loop tetap responsif
      await new Promise((res) => setTimeout(res, 200));
    }

    this.isIndexingInProgress = false;
  }

  private normalize(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // hapus aksen/diakritik
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Pencarian terintegrasi: Nama Surat, Arti, Nomor Ayat, dan Kata dalam Terjemahan
   */
  public search(query: string, maxResults = 50): SearchResultItem[] {
    const rawQuery = query.trim();
    if (!rawQuery) return [];

    const normQuery = this.normalize(rawQuery);
    const results: SearchResultItem[] = [];
    const seenAyahKey = new Set<string>();

    // 1. Cek apakah format pencarian adalah nomor ayat atau surah:ayat, contoh "2:255" atau "1:1"
    const surahAyahMatch = rawQuery.match(/^(\d{1,3}):(\d{1,3})$/);
    if (surahAyahMatch) {
      const sNum = parseInt(surahAyahMatch[1], 10);
      const aNum = parseInt(surahAyahMatch[2], 10);
      const found = this.indexedAyahs.find(
        (ay) => ay.surahId === sNum && ay.ayahNumber === aNum
      );
      if (found) {
        return [
          {
            surahId: found.surahId,
            surahName: found.surahName,
            ayahNumber: found.ayahNumber,
            teksArab: found.teksArab,
            teksIndonesia: found.teksIndonesia,
            matchedField: 'number',
          },
        ];
      }
    }

    // 2. Cari di daftar surat (nama Latin, nama Arab, arti, nomor)
    for (const surah of this.surahSummaries) {
      const sNameNorm = this.normalize(surah.namaLatin);
      const sArtiNorm = this.normalize(surah.arti);
      const matchesSurah =
        sNameNorm.includes(normQuery) ||
        sArtiNorm.includes(normQuery) ||
        surah.nomor.toString() === normQuery ||
        surah.nama.includes(rawQuery);

      if (matchesSurah) {
        // Ambil ayat pertama jika sudah di-index atau placeholder
        const firstAyah = this.indexedAyahs.find((a) => a.surahId === surah.nomor && a.ayahNumber === 1);
        results.push({
          surahId: surah.nomor,
          surahName: surah.namaLatin,
          ayahNumber: 1,
          teksArab: firstAyah ? firstAyah.teksArab : surah.nama,
          teksIndonesia: `Surat ${surah.namaLatin} (${surah.arti}) — ${surah.jumlahAyat} ayat`,
          matchedField: 'surah',
        });
        seenAyahKey.add(`${surah.nomor}-1`);
      }
    }

    // 3. Cari kata / kalimat di dalam terjemahan ayat yang telah di-index
    for (const ay of this.indexedAyahs) {
      if (results.length >= maxResults) break;
      const key = `${ay.surahId}-${ay.ayahNumber}`;
      if (seenAyahKey.has(key)) continue;

      if (ay.normalizedText.includes(normQuery)) {
        results.push({
          surahId: ay.surahId,
          surahName: ay.surahName,
          ayahNumber: ay.ayahNumber,
          teksArab: ay.teksArab,
          teksIndonesia: ay.teksIndonesia,
          matchedField: 'translation',
        });
        seenAyahKey.add(key);
      }
    }

    return results;
  }
}

export const searchIndex = new SearchIndexManager();
