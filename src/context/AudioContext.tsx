import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import type { Ayah, SurahDetail, SurahSummary } from '../types/quran';
import { getAyahAudioUrl, getSurahAudioUrl, getQariInfo } from '../api/audioApi';
import { useSettings } from './SettingsContext';

export interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  surahId: number | null;
  surahName: string | null;
  currentAyah: number | null;
  totalAyah: number | null;
  currentQari: string;
  currentTime: number;
  duration: number;
  progress: number; // 0 - 100
  playbackError: string | null;
  repeatMode: 'none' | 'ayah' | 'surah';
  
  // Actions
  playAyah: (ayah: Ayah, surah: { nomor: number; namaLatin: string; jumlahAyat: number }, autoAdvanceSurah?: SurahDetail) => void;
  playSurah: (surah: SurahSummary) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setQari: (qariId: string) => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [surahId, setSurahId] = useState<number | null>(null);
  const [surahName, setSurahName] = useState<string | null>(null);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [totalAyah, setTotalAyah] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState<'none' | 'ayah' | 'surah'>('none');

  // Cache current active surah detail for auto-advancing ayah
  const activeSurahDetailRef = useRef<SurahDetail | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setPlaybackError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setPlaybackError('Audio tidak dapat diputar. Silakan coba lagi.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Handle track end (auto-advance ayah or repeat)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'ayah') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      // If playing ayah in a surah and autoAdvance is possible
      if (currentAyah !== null && activeSurahDetailRef.current) {
        const nextAyahNum = currentAyah + 1;
        const nextAyah = activeSurahDetailRef.current.ayat.find((a) => a.nomorAyat === nextAyahNum);

        if (nextAyah) {
          const qari = settings.preferredQari;
          const url = getAyahAudioUrl(nextAyah, qari);
          if (url) {
            setCurrentAyah(nextAyahNum);
            audio.src = url;
            audio.play().catch(() => {});
            return;
          }
        }
      }

      if (repeatMode === 'surah') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, currentAyah, settings.preferredQari]);

  const playAyah = useCallback(
    (
      ayah: Ayah,
      surah: { nomor: number; namaLatin: string; jumlahAyat: number },
      autoAdvanceSurah?: SurahDetail
    ) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (autoAdvanceSurah) {
        activeSurahDetailRef.current = autoAdvanceSurah;
      }

      const qari = settings.preferredQari;
      const url = getAyahAudioUrl(ayah, qari);

      if (!url) {
        setPlaybackError('Audio tidak tersedia untuk ayat ini.');
        return;
      }

      setPlaybackError(null);
      setSurahId(surah.nomor);
      setSurahName(surah.namaLatin);
      setCurrentAyah(ayah.nomorAyat);
      setTotalAyah(surah.jumlahAyat);
      setIsLoading(true);

      audio.src = url;
      audio.play().catch((err) => {
        console.warn('Playback blocked or failed:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    },
    [settings.preferredQari]
  );

  const playSurah = useCallback(
    (surah: SurahSummary) => {
      const audio = audioRef.current;
      if (!audio) return;

      activeSurahDetailRef.current = null;
      const qari = settings.preferredQari;
      const url = getSurahAudioUrl(surah, qari);

      if (!url) {
        setPlaybackError('Audio surat tidak tersedia.');
        return;
      }

      setPlaybackError(null);
      setSurahId(surah.nomor);
      setSurahName(surah.namaLatin);
      setCurrentAyah(null); // Full surah
      setTotalAyah(surah.jumlahAyat);
      setIsLoading(true);

      audio.src = url;
      audio.play().catch((err) => {
        console.warn('Playback blocked or failed:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    },
    [settings.preferredQari]
  );

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resumeAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  }, [isPlaying, pauseAudio, resumeAudio]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const setQari = useCallback(
    (qariId: string) => {
      updateSettings({ preferredQari: qariId });

      // If already playing an ayah or surah, switch stream seamlessly to new qari
      const audio = audioRef.current;
      if (!audio || !surahId) return;

      const wasPlaying = isPlaying;
      const curTime = audio.currentTime;

      if (currentAyah !== null && activeSurahDetailRef.current) {
        const ayahObj = activeSurahDetailRef.current.ayat.find((a) => a.nomorAyat === currentAyah);
        if (ayahObj) {
          const newUrl = getAyahAudioUrl(ayahObj, qariId);
          if (newUrl) {
            audio.src = newUrl;
            if (wasPlaying) audio.play().catch(() => {});
          }
        }
      }
    },
    [isPlaying, surahId, currentAyah, updateSettings]
  );

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'ayah';
      if (prev === 'ayah') return 'surah';
      return 'none';
    });
  }, []);

  const nextTrack = useCallback(() => {
    if (currentAyah !== null && activeSurahDetailRef.current) {
      const nextAyahNum = currentAyah + 1;
      const nextAyah = activeSurahDetailRef.current.ayat.find((a) => a.nomorAyat === nextAyahNum);
      if (nextAyah) {
        playAyah(
          nextAyah,
          {
            nomor: activeSurahDetailRef.current.nomor,
            namaLatin: activeSurahDetailRef.current.namaLatin,
            jumlahAyat: activeSurahDetailRef.current.jumlahAyat,
          },
          activeSurahDetailRef.current
        );
      }
    }
  }, [currentAyah, playAyah]);

  const prevTrack = useCallback(() => {
    if (currentAyah !== null && activeSurahDetailRef.current) {
      const prevAyahNum = currentAyah - 1;
      if (prevAyahNum >= 1) {
        const prevAyah = activeSurahDetailRef.current.ayat.find((a) => a.nomorAyat === prevAyahNum);
        if (prevAyah) {
          playAyah(
            prevAyah,
            {
              nomor: activeSurahDetailRef.current.nomor,
              namaLatin: activeSurahDetailRef.current.namaLatin,
              jumlahAyat: activeSurahDetailRef.current.jumlahAyat,
            },
            activeSurahDetailRef.current
          );
        }
      }
    }
  }, [currentAyah, playAyah]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsPlaying(false);
    setSurahId(null);
    setCurrentAyah(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isLoading,
        surahId,
        surahName,
        currentAyah,
        totalAyah,
        currentQari: settings.preferredQari,
        currentTime,
        duration,
        progress,
        playbackError,
        repeatMode,
        playAyah,
        playSurah,
        pauseAudio,
        resumeAudio,
        togglePlay,
        seek,
        setQari,
        toggleRepeat,
        nextTrack,
        prevTrack,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export function useAudio(): AudioContextType {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return ctx;
}
