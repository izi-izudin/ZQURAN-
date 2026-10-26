import React, { useState } from 'react';
import { Hash, ArrowRight } from 'lucide-react';

interface SurahJumpSelectorProps {
  totalAyah: number;
  currentAyah: number;
  onJumpToAyah: (ayahNumber: number) => void;
}

export const SurahJumpSelector: React.FC<SurahJumpSelectorProps> = ({
  totalAyah,
  currentAyah,
  onJumpToAyah,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState(currentAyah.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(inputVal, 10);
    if (!isNaN(num) && num >= 1 && num <= totalAyah) {
      onJumpToAyah(num);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pilih nomor ayat untuk loncat"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-xs font-medium text-[#F5F1E6] transition cursor-pointer"
      >
        <Hash className="w-3.5 h-3.5 text-[#D9A441]" />
        <span>Ayat {currentAyah} / {totalAyah}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-48 rounded-xl bg-[#051D42] border border-[#0D3169] p-3 shadow-2xl z-50 text-xs">
          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="block text-[11px] font-semibold text-[#8CA3C7]">
              Loncat ke Ayat (1 - {totalAyah}):
            </label>
            <div className="flex gap-1.5">
              <input
                type="number"
                min={1}
                max={totalAyah}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#001F52] border border-[#0D3169] text-xs text-[#F5F1E6] focus:outline-none focus:border-[#D9A441]"
              />
              <button
                type="submit"
                aria-label="Pergi ke ayat"
                className="px-2.5 py-1.5 rounded-lg bg-[#0647A5] hover:bg-[#168BFF] text-white transition cursor-pointer shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
