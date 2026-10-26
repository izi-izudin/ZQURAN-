/**
 * Centralized API Client untuk ZQuran
 * Menangani fetch dengan timeout, retry terukur, in-memory & local cache, dan validasi response.
 */

const BASE_URL = 'https://equran.id/api/v2';
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;

// In-memory cache
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export class ApiError extends Error {
  statusCode?: number;
  isNetworkError: boolean;

  constructor(message: string, statusCode?: number, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  skipCache?: boolean;
}

/**
 * Mendapatkan cache dari memory atau localStorage
 */
function getCachedData<T>(cacheKey: string): T | null {
  const inMemory = memoryCache.get(cacheKey);
  if (inMemory && Date.now() - inMemory.timestamp < CACHE_TTL_MS) {
    return inMemory.data as T;
  }

  try {
    const local = localStorage.getItem(`zquran_cache_${cacheKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache.set(cacheKey, parsed);
        return parsed.data as T;
      } else {
        localStorage.removeItem(`zquran_cache_${cacheKey}`);
      }
    }
  } catch {
    // ignore storage failure
  }

  return null;
}

/**
 * Menyimpan data ke cache
 */
function setCachedData(cacheKey: string, data: unknown): void {
  const entry = { data, timestamp: Date.now() };
  memoryCache.set(cacheKey, entry);
  try {
    localStorage.setItem(`zquran_cache_${cacheKey}`, JSON.stringify(entry));
  } catch {
    // LocalStorage quota exceeded or private mode, in-memory still works
  }
}

/**
 * Core Request Function with Timeout & Retry
 */
export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retries = MAX_RETRIES, skipCache = false, signal, ...customInit } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const cacheKey = endpoint;

  // Cek cache untuk request GET
  if (!skipCache && (!customInit.method || customInit.method.toUpperCase() === 'GET')) {
    const cached = getCachedData<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Pasangkan abort controller eksternal jika ada
    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    const abortTimeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        reject(new ApiError('Koneksi timeout. Silakan periksa jaringan Anda.', 408, true));
      }, timeoutMs);
    });

    try {
      const response = await Promise.race([
        fetch(url, {
          ...customInit,
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            ...(customInit.headers || {}),
          },
        }),
        abortTimeout,
      ]);

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `Gagal memuat data dari server (${response.status})`,
          response.status,
          response.status >= 500
        );
      }

      const json = await response.json();

      // Validasi struktur response resmi equran.id: { code, message, data }
      if (!json || typeof json !== 'object') {
        throw new ApiError('Format respon server tidak valid (bukan JSON object).');
      }

      if (json.code !== 200 && json.code !== 201) {
        throw new ApiError(json.message || `API error dengan kode ${json.code}`);
      }

      if (json.data === undefined) {
        throw new ApiError('Format respon server tidak memiliki payload data.');
      }

      // Simpan di cache
      if (!skipCache && (!customInit.method || customInit.method.toUpperCase() === 'GET')) {
        setCachedData(cacheKey, json.data);
      }

      return json.data as T;
    } catch (err: unknown) {
      if (timeoutId) clearTimeout(timeoutId);

      const isAborted = (err as Error)?.name === 'AbortError' && signal?.aborted;
      if (isAborted) {
        throw err; // intentional abort
      }

      lastError = err as Error;
      attempt++;

      // Jika masih ada retry, tunggu sebentar (exponential backoff)
      if (attempt <= retries) {
        await new Promise((res) => setTimeout(res, 600 * attempt));
      }
    }
  }

  // Jika gagal setelah retries
  // Fallback: coba ambil stale cache jika ada
  const staleData = getCachedData<T>(cacheKey);
  if (staleData) {
    return staleData;
  }

  throw new ApiError(
    lastError?.message || 'Data belum dapat dimuat. Periksa koneksi internet Anda lalu coba lagi.',
    (lastError as ApiError)?.statusCode,
    true
  );
}
