import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Repeat1,
  X,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { getQariInfo } from '../../api/audioApi';
import { QariSelectorModal } from './QariSelectorModal';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const GlobalAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    isLoading,
    surahId,
    surahName,
    currentAyah,
    totalAyah,
    currentQari,
    currentTime,
    duration,
    playbackError,
    repeatMode,
    togglePlay,
    seek,
    setQari,
    toggleRepeat,
    nextTrack,
    prevTrack,
    stopAudio,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showQariModal, setShowQariModal] = useState(false);

  // Jika tidak ada audio yang sedang aktif
  if (!surahId && !playbackError) {
    return null;
  }

  const qariInfo = getQariInfo(currentQari);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div
        role="region"
        aria-label="Pemutar Audio Murottal ZQuran"
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          // Margin bottom di mobile agar tidak menutupi bottom navigation (h-16 = 64px)
          'bottom-16 md:bottom-0'
        }`}
      >
        <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-2">
          <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] shadow-2xl p-3 sm:p-4 text-[#F5F1E6]">
            {/* Progress Bar Top */}
            <div className="relative w-full h-1.5 bg-[#001F52] rounded-full overflow-hidden mb-2 cursor-pointer group">
              <div
                className="h-full bg-[#D9A441] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Bilah waktu putar audio"
              />
            </div>

            {/* Error banner if any */}
            {playbackError && (
              <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-[#001F52] border border-[#EF4444]/40 text-xs text-[#EF4444]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{playbackError}</span>
              </div>
            )}

            {/* Mini Player Row */}
            <div className="flex items-center justify-between gap-3">
              {/* Left: Track Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => setShowQariModal(true)}
                  aria-label="Ganti Qari"
                  className="w-10 h-10 rounded-xl bg-[#001F52] border border-[#0D3169] flex items-center justify-center text-[#D9A441] shrink-0 hover:bg-[#0647A5] transition cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#F5F1E6] truncate">
                      {surahName ? `Surat ${surahName}` : 'Murottal'}
                    </h4>
                    {currentAyah ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#001F52] text-[#FFE29A] font-semibold border border-[#0D3169]">
                        Ayat {currentAyah}
                        {totalAyah ? ` / ${totalAyah}` : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#001F52] text-[#FFE29A] font-semibold border border-[#0D3169]">
                        Surat Penuh
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowQariModal(true)}
                    className="text-[11px] text-[#8CA3C7] hover:text-[#FFE29A] truncate transition text-left cursor-pointer block"
                  >
                    {qariInfo.name} • <span className="underline">Ubah</span>
                  </button>
                </div>
              </div>

              {/* Center / Right: Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Time Display */}
                <span className="hidden sm:inline text-xs text-[#8CA3C7] font-mono mr-1">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Repeat mode */}
                <button
                  onClick={toggleRepeat}
                  aria-label={`Mode Ulang: ${repeatMode}`}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    repeatMode !== 'none'
                      ? 'bg-[#001F52] border-[#D9A441] text-[#FFE29A]'
                      : 'border-transparent text-[#8CA3C7] hover:text-[#F5F1E6]'
                  }`}
                >
                  {repeatMode === 'ayah' ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>

                {/* Prev button */}
                <button
                  onClick={prevTrack}
                  disabled={!currentAyah || currentAyah <= 1}
                  aria-label="Ayat Sebelumnya"
                  className="p-2 rounded-xl text-[#8CA3C7] hover:text-[#F5F1E6] disabled:opacity-30 transition cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Play / Pause button */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
                  className="w-10 h-10 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] flex items-center justify-center transition cursor-pointer border border-[#168BFF]/40 shadow-sm"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Next button */}
                <button
                  onClick={nextTrack}
                  disabled={!currentAyah || (totalAyah !== null && currentAyah >= totalAyah)}
                  aria-label="Ayat Selanjutnya"
                  className="p-2 rounded-xl text-[#8CA3C7] hover:text-[#F5F1E6] disabled:opacity-30 transition cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Stop / Close button */}
                <button
                  onClick={stopAudio}
                  aria-label="Tutup Pemutar Audio"
                  className="p-2 rounded-xl text-[#8CA3C7] hover:text-[#EF4444] hover:bg-[#001F52] transition cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Qari Selector */}
      <QariSelectorModal
        isOpen={showQariModal}
        onClose={() => setShowQariModal(false)}
        selectedQari={currentQari}
        onSelect={setQari}
      />
    </>
  );
};
