/**
 * ZQuran Prayer Audio Service
 * Manages playback, preview, and trigger-safety for Adhan, Imsak, and Terbit.
 */

export const PRAYER_AUDIO_URLS = {
  subuh: 'https://wflq2j4mi1smqyku.public.blob.vercel-storage.com/adzan_subuh.mp3',
  standardAdzan: 'https://wflq2j4mi1smqyku.public.blob.vercel-storage.com/adzan.mp3',
  imsak: 'https://wflq2j4mi1smqyku.public.blob.vercel-storage.com/imsak.mp3',
  terbit: 'https://wflq2j4mi1smqyku.public.blob.vercel-storage.com/ayam.mp3',
} as const;

export type PrayerAudioType = keyof typeof PRAYER_AUDIO_URLS;

class PrayerAudioManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentAudioType: PrayerAudioType | null = null;
  private isPlaying: boolean = false;
  private triggeredEvents: Set<string> = new Set();

  /**
   * Resolve appropriate Audio URL for prayer name
   */
  public getAudioUrlForPrayer(prayerName: string): string {
    const lower = prayerName.toLowerCase().trim();
    if (lower === 'subuh') return PRAYER_AUDIO_URLS.subuh;
    if (lower === 'imsak') return PRAYER_AUDIO_URLS.imsak;
    if (lower === 'terbit' || lower === 'syuruq') return PRAYER_AUDIO_URLS.terbit;
    return PRAYER_AUDIO_URLS.standardAdzan;
  }

  /**
   * Play prayer audio safely with singleton lock to prevent audio overlap
   */
  public async playPrayerAudio(
    type: PrayerAudioType,
    eventId?: string,
    volume: number = 1.0
  ): Promise<boolean> {
    // If this specific event was already triggered, prevent duplicate execution
    if (eventId && this.triggeredEvents.has(eventId)) {
      return false;
    }

    try {
      this.stop(); // Stop any previous playback

      const url = PRAYER_AUDIO_URLS[type];
      const audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, volume));

      this.currentAudio = audio;
      this.currentAudioType = type;
      this.isPlaying = true;

      audio.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        this.currentAudioType = null;
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error:', e);
        this.isPlaying = false;
        this.currentAudio = null;
        this.currentAudioType = null;
      };

      await audio.play();

      if (eventId) {
        this.triggeredEvents.add(eventId);
      }
      return true;
    } catch (err) {
      console.warn('Autoplay / Media permission blocked or network error:', err);
      this.isPlaying = false;
      return false;
    }
  }

  /**
   * Test audio preview with instant toggle
   */
  public async toggleTestAudio(type: PrayerAudioType, volume: number = 1.0): Promise<boolean> {
    if (this.isPlaying && this.currentAudioType === type) {
      this.stop();
      return false;
    }
    return this.playPrayerAudio(type, undefined, volume);
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.currentAudioType = null;
  }

  public getPlaybackState(): { isPlaying: boolean; activeType: PrayerAudioType | null } {
    return {
      isPlaying: this.isPlaying,
      activeType: this.currentAudioType,
    };
  }
}

export const prayerAudioManager = new PrayerAudioManager();
