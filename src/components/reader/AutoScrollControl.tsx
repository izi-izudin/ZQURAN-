import React, { useState } from 'react';
import { Play, Pause, Square, Gauge, ChevronDown, ChevronUp } from 'lucide-react';
import type { ScrollSpeedPreset } from '../../hooks/useAutoScroll';

interface AutoScrollControlProps {
  isScrolling: boolean;
  isPaused: boolean;
  speedPreset: ScrollSpeedPreset;
  customSpeed: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSetSpeed: (preset: ScrollSpeedPreset, customValue?: number) => void;
}

export const AutoScrollControl: React.FC<AutoScrollControlProps> = ({
  isScrolling,
  isPaused,
  speedPreset,
  customSpeed,
  onStart,
  onPause,
  onResume,
  onStop,
  onSetSpeed,
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[#051D42] border border-[#0D3169] shadow-md text-[#F5F1E6]">
      {/* Primary Action Button */}
      {!isScrolling ? (
        <button
          onClick={onStart}
          aria-label="Mulai Auto-Scroll Tilawah"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold transition cursor-pointer text-[#F5F1E6]"
        >
          <Play className="w-3.5 h-3.5 fill-current text-[#FFE29A]" />
          <span>Auto-Scroll</span>
        </button>
      ) : isPaused ? (
        <button
          onClick={onResume}
          aria-label="Lanjutkan Auto-Scroll"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold transition cursor-pointer text-[#F5F1E6]"
        >
          <Play className="w-3.5 h-3.5 fill-current text-[#FFE29A]" />
          <span>Lanjutkan</span>
        </button>
      ) : (
        <button
          onClick={onPause}
          aria-label="Jeda Auto-Scroll"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-semibold transition cursor-pointer text-[#FFE29A] border border-[#D9A441]"
        >
          <Pause className="w-3.5 h-3.5 fill-current" />
          <span>Jeda</span>
        </button>
      )}

      {/* Stop Button (only active when scrolling or paused) */}
      {isScrolling && (
        <button
          onClick={onStop}
          aria-label="Hentikan Auto-Scroll"
          className="p-1.5 rounded-xl text-[#8CA3C7] hover:text-[#EF4444] hover:bg-[#001F52] transition cursor-pointer"
          title="Berhenti"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Speed Selector Trigger */}
      <button
        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
        aria-label="Pilih Kecepatan Auto-Scroll"
        className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] transition cursor-pointer"
      >
        <Gauge className="w-3.5 h-3.5 text-[#D9A441]" />
        <span className="capitalize text-[11px] font-medium">{speedPreset}</span>
        {showSpeedMenu ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Speed Dropdown Menu */}
      {showSpeedMenu && (
        <div className="absolute top-full mt-2 right-0 w-44 rounded-xl bg-[#051D42] border border-[#0D3169] p-2 shadow-2xl z-50 text-xs space-y-1">
          <p className="text-[10px] uppercase font-bold text-[#8CA3C7] px-2 py-1">
            Kecepatan Gulir
          </p>

          <button
            onClick={() => {
              onSetSpeed('slow');
              setShowSpeedMenu(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition ${
              speedPreset === 'slow'
                ? 'bg-[#0647A5] text-[#FFE29A] font-semibold'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52]'
            }`}
          >
            <span>Slow (Santai)</span>
            <span className="text-[10px] text-[#8CA3C7]">0.5x</span>
          </button>

          <button
            onClick={() => {
              onSetSpeed('normal');
              setShowSpeedMenu(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition ${
              speedPreset === 'normal'
                ? 'bg-[#0647A5] text-[#FFE29A] font-semibold'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52]'
            }`}
          >
            <span>Normal (Standar)</span>
            <span className="text-[10px] text-[#8CA3C7]">1.2x</span>
          </button>

          <button
            onClick={() => {
              onSetSpeed('fast');
              setShowSpeedMenu(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition ${
              speedPreset === 'fast'
                ? 'bg-[#0647A5] text-[#FFE29A] font-semibold'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52]'
            }`}
          >
            <span>Fast (Cepat)</span>
            <span className="text-[10px] text-[#8CA3C7]">2.4x</span>
          </button>

          <div className="pt-2 border-t border-[#0D3169] px-2 space-y-1">
            <div className="flex justify-between text-[10px] text-[#8CA3C7]">
              <span>Kustom</span>
              <span className="text-[#FFE29A] font-mono">{customSpeed.toFixed(1)} px</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={4.0}
              step={0.1}
              value={customSpeed}
              onChange={(e) => onSetSpeed('custom', parseFloat(e.target.value))}
              className="w-full h-1 bg-[#001F52] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
