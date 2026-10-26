import React from 'react';
import { Target, Award, BookCheck } from 'lucide-react';
import type { UserSettings } from '../../types/quran';

interface TilawahProgressCardProps {
  settings: UserSettings;
  onOpenSettings: () => void;
}

export const TilawahProgressCard: React.FC<TilawahProgressCardProps> = ({
  settings,
  onOpenSettings,
}) => {
  const readCount = settings.readSurahs?.length || 0;
  const overallPercent = Math.min(100, Math.round((readCount / 114) * 100));

  return (
    <div className="rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 shadow-md text-[#F5F1E6]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0D3169]/60">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#D9A441]" />
          <h3 className="text-sm font-bold text-[#F5F1E6]">Progres Tilawah Harian</h3>
        </div>
        <button
          onClick={onOpenSettings}
          className="text-xs text-[#168BFF] hover:text-[#FFE29A] transition cursor-pointer"
        >
          Atur Target
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <div className="p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
          <span className="text-[11px] text-[#8CA3C7] block">Surat Selesai</span>
          <span className="text-lg font-bold text-[#F5F1E6]">{readCount}</span>
          <span className="text-[10px] text-[#8CA3C7]">/ 114 Surat</span>
        </div>

        <div className="p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
          <span className="text-[11px] text-[#8CA3C7] block">Khatam Al-Qur'an</span>
          <span className="text-lg font-bold text-[#FFE29A]">{overallPercent}%</span>
          <span className="text-[10px] text-[#8CA3C7]">Progres Total</span>
        </div>

        <div className="p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
          <span className="text-[11px] text-[#8CA3C7] block">Target Tilawah</span>
          <span className="text-lg font-bold text-[#168BFF]">
            {settings.dailyTargetValue} {settings.dailyTargetType}
          </span>
          <span className="text-[10px] text-[#8CA3C7]">/ hari</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] text-[#8CA3C7] mb-1">
          <span>Progres Menuju Khatam</span>
          <span className="text-[#FFE29A] font-semibold">{overallPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#001F52] overflow-hidden">
          <div
            className="h-full bg-[#0647A5] rounded-full transition-all"
            style={{ width: `${Math.max(3, overallPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
