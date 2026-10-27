import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Volume2, Sparkles, BellRing } from 'lucide-react';
import { prayerAudioManager } from '../../services/prayerAudioService';

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
      {/* Left Card: Jadwal Sholat Live Countdown (Storyboard Frame 1 & 2) */}
      <div
        onClick={onOpenPrayerScheduleModal}
        className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/90 light:bg-white border border-[#0D3169] light:border-[#E5DFD5] shadow-lg flex flex-col justify-between hover:border-[#D9A441]/50 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D9A441]" />
            <span className="text-xs font-semibold text-[#8CA3C7] light:text-[#64748B]">
              Jadwal Sholat
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#001F52] border border-[#D9A441]/50 text-[#FFE29A] font-extrabold tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
            LIVE COUNTDOWN
          </span>
        </div>

        <div>
          <span className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            Sholat Berikutnya:
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#FFE29A] tracking-wider my-0.5">
            {formatPad(countdown.hours)}:{formatPad(countdown.minutes)}:{formatPad(countdown.seconds)}
          </div>
          <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            Waktu sekarang • {currentTimeStr} WIB • Diperbarui: baru saja
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#0D3169]/60 light:border-[#E5DFD5] flex items-center justify-between text-[11px] text-[#FFE29A] light:text-[#2E6F52] font-semibold">
          <span>Progres Tilawah Harian</span>
          <span>Detail Jadwal →</span>
        </div>
      </div>

      {/* Right Card: Progress Tilawah 70% (Storyboard Frame 1 & 2) */}
      <div
        onClick={onOpenTilawahSettings}
        className="p-4 sm:p-5 rounded-3xl bg-[#051D42]/90 light:bg-white border border-[#0D3169] light:border-[#E5DFD5] shadow-lg flex flex-col justify-between hover:border-[#D9A441]/50 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#001F52] light:text-[#E5DFD5]"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#D9A441]"
                  strokeDasharray="70, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-black text-[9px] text-[#FFE29A] light:text-[#2E6F52]">
                70%
              </span>
            </div>
            <span className="text-xs font-semibold text-[#8CA3C7] light:text-[#64748B]">
              Menuju Maghrib
            </span>
          </div>

          <span className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            Estimasi Maghrib: 17:52
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold text-[#F5F1E6] light:text-[#1A202C]">
            <span>Hari ini: 12/20 halaman</span>
            <span className="text-[#FFE29A] light:text-[#2E6F52]">60% selesai</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#001F52] light:bg-[#E5DFD5] mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#0647A5] to-[#D9A441] w-[60%]" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#0D3169]/60 light:border-[#E5DFD5] flex items-center justify-between text-[11px] text-[#8CA3C7] light:text-[#64748B]">
          <span>Target Bulan Ini: 500 Halaman</span>
          <span className="text-[#168BFF] light:text-[#2E6F52] font-semibold">Atur Target →</span>
        </div>
      </div>
    </div>
  );
};
