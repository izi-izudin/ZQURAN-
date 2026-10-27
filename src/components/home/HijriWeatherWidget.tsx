import React, { useState, useEffect } from 'react';
import { Calendar, CloudSun, Droplets, Wind, Sun, MapPin, Sparkles } from 'lucide-react';
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
      {/* Left Card: Tanggal Hijriah (Storyboard Frame 1 & 2) */}
      <div
        onClick={onOpenHijriModal}
        className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/90 light:bg-white border border-[#0D3169] light:border-[#E5DFD5] shadow-lg flex flex-col justify-between hover:border-[#D9A441]/50 transition cursor-pointer group"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#D9A441]/40 flex items-center justify-center text-[#FFE29A] light:text-[#2E6F52] group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 text-[#D9A441]" />
          </div>
          <span className="text-xs font-semibold text-[#8CA3C7] light:text-[#64748B]">
            Tanggal Hijriah
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#F5F1E6] light:text-[#1A202C] tracking-tight group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition">
            {hijriDay} {hijriMonthName} {hijriYear} H
          </h3>
          <p className="text-xs text-[#8CA3C7] light:text-[#64748B] mt-1 font-medium">
            {formattedGregorian}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#0D3169]/60 light:border-[#E5DFD5] flex items-center justify-between text-[11px] text-[#FFE29A] light:text-[#2E6F52]">
          <span>Kalender Hijriah Indonesia</span>
          <span className="text-xs">→</span>
        </div>
      </div>

      {/* Right Card: Cuaca Hari Ini (Storyboard Frame 1 & 2) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/90 light:bg-white border border-[#0D3169] light:border-[#E5DFD5] shadow-lg flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#FFE29A]/40 flex items-center justify-center text-[#FFE29A]">
            <CloudSun className="w-4 h-4 text-[#FFE29A] light:text-[#C4922F]" />
          </div>
          <span className="text-xs font-semibold text-[#8CA3C7] light:text-[#64748B]">
            Cuaca Hari Ini
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#F5F1E6] light:text-[#1A202C]">
              29°C
            </span>
          </div>
          <p className="text-xs text-[#8CA3C7] light:text-[#64748B] mt-0.5">
            Baros, Banten • Cerah Berawan
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#0D3169]/60 light:border-[#E5DFD5] flex items-center justify-between text-[11px] text-[#8CA3C7] light:text-[#64748B]">
          <span className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-[#168BFF]" /> 68%
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-[#10B981]" /> 12 km/j
          </span>
          <span className="flex items-center gap-1">
            <Sun className="w-3 h-3 text-[#FFE29A]" /> 70%
          </span>
        </div>
      </div>
    </div>
  );
};
