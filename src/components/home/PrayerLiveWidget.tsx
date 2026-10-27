import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface PrayerLiveWidgetProps {
  onOpenTilawahSettings?: () => void;
  onOpenPrayerScheduleModal?: () => void;
}

export const PrayerLiveWidget: React.FC<PrayerLiveWidgetProps> = ({
  onOpenTilawahSettings,
  onOpenPrayerScheduleModal,
}) => {
  // Real-time ticking countdown to Maghrib (00:42:13)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 42, seconds: 13 });
  const [currentTimeStr, setCurrentTimeStr] = useState('13:29');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 42, seconds: 13 };
      });

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${hh}:${mm}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Left Card: Jadwal Sholat Live Countdown */}
      <div
        onClick={onOpenPrayerScheduleModal}
        className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/85 light:bg-white/85 border border-[#D9A441]/35 light:border-[#E5DFD5] shadow-lg flex flex-col justify-between hover:border-[#D9A441]/60 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FFE29A] light:text-[#C4922F]" />
            <span className="text-xs sm:text-sm font-semibold text-[#F5F1E6] light:text-[#1A202C]">
              Jadwal Sholat
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#001F52] border border-[#D9A441]/50 text-[#FFE29A] font-extrabold tracking-wider">
            <span className="text-[#D9A441]">·:·</span>
            <span>LIVE COUNTDOWN</span>
            <span className="text-[#D9A441]">·:·</span>
          </span>
        </div>

        <div className="my-1">
          <span className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            Sholat Berikutnya:
          </span>
          <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-black text-[#FFE29A] light:text-[#C4922F] tracking-wider my-0.5">
            <Clock className="w-5 h-5 text-[#FFE29A] light:text-[#C4922F] shrink-0" />
            <span>
              {formatPad(countdown.hours)}:{formatPad(countdown.minutes)}:{formatPad(countdown.seconds)}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            Waktu sekarang • {currentTimeStr} WIB • Diperbarui: baru saja
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#0D3169]/60 light:border-[#E5DFD5] text-center">
          <span className="text-xs sm:text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition-colors">
            Progres Tilawah Harian
          </span>
        </div>
      </div>

      {/* Right Card: Progress Tilawah 70% Menuju Maghrib */}
      <div
        onClick={onOpenTilawahSettings}
        className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/85 light:bg-white/85 border border-[#D9A441]/35 light:border-[#E5DFD5] shadow-lg flex flex-col justify-between hover:border-[#D9A441]/60 transition-all cursor-pointer group"
      >
        <div className="flex flex-col items-center justify-center my-1">
          {/* Radial Ring Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center mb-1">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#001F52] light:text-[#E5DFD5]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#FFE29A] light:text-[#D9A441]"
                strokeDasharray="70, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-black text-xs text-[#FFE29A] light:text-[#2E6F52]">
              70%
            </span>
          </div>
          <span className="text-xs font-semibold text-[#F5F1E6] light:text-[#1A202C]">
            Menuju Maghrib
          </span>
          <span className="text-[10px] text-[#8CA3C7] light:text-[#64748B]">
            Estimasi Maghrib: 14:12
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-1.5 mt-2">
          <div>
            <div className="w-full h-1.5 rounded-full bg-[#001F52] light:bg-[#E5DFD5] overflow-hidden">
              <div className="h-full rounded-full bg-[#168BFF] light:bg-[#2E6F52] w-[60%]" />
            </div>
            <p className="text-[10px] text-center text-[#8CA3C7] light:text-[#64748B] mt-0.5">
              Hari ini: 12/20 halaman • 60% selesai
            </p>
          </div>

          <div>
            <div className="w-full h-1.5 rounded-full bg-[#001F52] light:bg-[#E5DFD5] overflow-hidden">
              <div className="h-full rounded-full bg-[#D9A441] w-[75%]" />
            </div>
            <p className="text-[10px] text-center text-[#8CA3C7] light:text-[#64748B] mt-0.5">
              Target Bulan ini: 500 Halaman
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
