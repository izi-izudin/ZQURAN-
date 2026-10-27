import React, { useState, useEffect } from 'react';
import { Calendar, CloudSun, Droplets, Wind, Sun } from 'lucide-react';
import { getHijriToday, type HijriConversionResult } from '../../services/hijriCalendarService';

interface HijriWeatherWidgetProps {
  onOpenHijriModal?: () => void;
}

export const HijriWeatherWidget: React.FC<HijriWeatherWidgetProps> = ({ onOpenHijriModal }) => {
  const [hijriData, setHijriData] = useState<HijriConversionResult | null>(null);

  useEffect(() => {
    getHijriToday().then((res) => setHijriData(res));
  }, []);

  const hijriDay = hijriData ? hijriData.hijri.day : 5;
  const hijriMonthName = hijriData ? hijriData.hijri.monthName : 'Jumadil Awal';
  const hijriYear = hijriData ? hijriData.hijri.year : 1448;

  // Format Indonesian Gregorian Date
  const now = new Date();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const formattedGregorian = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Left Card: Tanggal Hijriah */}
      <div
        onClick={onOpenHijriModal}
        className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/85 light:bg-white/85 border border-[#D9A441]/35 light:border-[#E5DFD5] shadow-lg flex flex-col items-center justify-center text-center hover:border-[#D9A441]/60 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Calendar className="w-4 h-4 text-[#FFE29A] light:text-[#C4922F]" />
          <span className="text-xs font-semibold text-[#8CA3C7] light:text-[#64748B]">
            Tanggal Hijriah
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-[#F5F1E6] light:text-[#1A202C] tracking-tight group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition-colors">
          {hijriDay} {hijriMonthName} {hijriYear} H
        </h3>

        <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B] mt-1 font-medium">
          {formattedGregorian}
        </p>
      </div>

      {/* Right Card: Cuaca Hari Ini */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/85 light:bg-white/85 border border-[#D9A441]/35 light:border-[#E5DFD5] shadow-lg flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 mb-1">
          <CloudSun className="w-4 h-4 text-[#FFE29A] light:text-[#C4922F]" />
          <span className="text-xs font-semibold text-[#8CA3C7] light:text-[#64748B]">
            Cuaca Hari Ini
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-black text-[#F5F1E6] light:text-[#1A202C] tracking-tight">
          29°C
        </div>

        <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B] mt-0.5">
          Baros, Banten • Cerah Berawan
        </p>

        <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-[#8CA3C7] light:text-[#64748B]">
          <span className="flex items-center gap-0.5">
            <Droplets className="w-3 h-3 text-[#168BFF]" /> 68%
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <Wind className="w-3 h-3 text-[#10B981]" /> 12 km/j
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <Sun className="w-3 h-3 text-[#FFE29A]" /> 70%
          </span>
        </div>
      </div>
    </div>
  );
};
