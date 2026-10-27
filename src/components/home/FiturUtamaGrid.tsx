import React from 'react';
import { BookOpen, Clock, Compass, Heart, Sparkles, Calendar } from 'lucide-react';

interface FiturUtamaGridProps {
  onNavigate: (tab: string, meta?: unknown) => void;
  onOpenPrayerModal: () => void;
  onOpenQiblaModal: () => void;
  onOpenDoaModal: () => void;
  onOpenAsmaulHusnaModal: () => void;
  onOpenKalenderModal: () => void;
}

export const FiturUtamaGrid: React.FC<FiturUtamaGridProps> = ({
  onNavigate,
  onOpenPrayerModal,
  onOpenQiblaModal,
  onOpenDoaModal,
  onOpenAsmaulHusnaModal,
  onOpenKalenderModal,
}) => {
  const features = [
    {
      id: 'quran',
      title: "Al-Qur'an",
      subtitle: '114 Surat & 30 Juz',
      icon: BookOpen,
      iconColor: 'text-[#D9A441]',
      bgColor: 'bg-[#001F52] light:bg-[#E8F0EC]',
      borderColor: 'border-[#0D3169] light:border-[#E5DFD5]',
      action: () => onNavigate('quran'),
    },
    {
      id: 'sholat',
      title: 'Jadwal Sholat',
      subtitle: 'Waktu Subuh s/d Isya',
      icon: Clock,
      iconColor: 'text-[#168BFF] light:text-[#2E6F52]',
      bgColor: 'bg-[#001F52] light:bg-[#E8F0EC]',
      borderColor: 'border-[#0D3169] light:border-[#E5DFD5]',
      action: onOpenPrayerModal,
    },
    {
      id: 'kiblat',
      title: 'Arah Kiblat',
      subtitle: '294.8° NW • Ka\'bah',
      icon: Compass,
      iconColor: 'text-[#FFE29A] light:text-[#C4922F]',
      bgColor: 'bg-[#001F52] light:bg-[#E8F0EC]',
      borderColor: 'border-[#0D3169] light:border-[#E5DFD5]',
      action: onOpenQiblaModal,
    },
    {
      id: 'doa',
      title: 'Doa & Dzikir',
      subtitle: 'Al-Ma\'tsurat & Harian',
      icon: Heart,
      iconColor: 'text-[#EF4444]',
      bgColor: 'bg-[#001F52] light:bg-[#E8F0EC]',
      borderColor: 'border-[#0D3169] light:border-[#E5DFD5]',
      action: onOpenDoaModal,
    },
    {
      id: 'asmaul_husna',
      title: 'Asmaul Husna',
      subtitle: '99 Nama Mulia Allah',
      icon: Sparkles,
      iconColor: 'text-[#D9A441]',
      bgColor: 'bg-[#001F52] light:bg-[#E8F0EC]',
      borderColor: 'border-[#0D3169] light:border-[#E5DFD5]',
      action: onOpenAsmaulHusnaModal,
    },
    {
      id: 'kalender',
      title: 'Kalender Hijriah',
      subtitle: '1448 H & Puasa Sunnah',
      icon: Calendar,
      iconColor: 'text-[#10B981]',
      bgColor: 'bg-[#001F52] light:bg-[#E8F0EC]',
      borderColor: 'border-[#0D3169] light:border-[#E5DFD5]',
      action: onOpenKalenderModal,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {features.map((feat) => {
        const Icon = feat.icon;
        return (
          <button
            key={feat.id}
            onClick={feat.action}
            className={`p-3 sm:p-4 rounded-2xl ${feat.bgColor} border ${feat.borderColor} hover:border-[#D9A441]/60 transition-all cursor-pointer flex flex-col items-center text-center group shadow-xs hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#03152F] light:bg-white border border-[#0D3169] light:border-[#E5DFD5] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-inner">
              <Icon className={`w-5 h-5 ${feat.iconColor}`} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] tracking-tight line-clamp-1 group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition-colors">
              {feat.title}
            </span>
            <span className="text-[10px] text-[#8CA3C7] light:text-[#64748B] mt-0.5 line-clamp-1">
              {feat.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
};
