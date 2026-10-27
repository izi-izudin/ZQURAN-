import React from 'react';
import { BookOpen, Search, Bookmark, Lightbulb, Headphones, Settings } from 'lucide-react';

interface QuickActionGridProps {
  onNavigate: (tab: string, meta?: unknown) => void;
  onOpenAudioQari?: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onNavigate,
  onOpenAudioQari,
}) => {
  const actions = [
    {
      id: 'quran',
      title: "Al-Qur'an",
      icon: BookOpen,
      action: () => onNavigate('quran'),
    },
    {
      id: 'search',
      title: 'Pencarian',
      icon: Search,
      action: () => onNavigate('search'),
    },
    {
      id: 'bookmark',
      title: 'Bookmark',
      icon: Bookmark,
      action: () => onNavigate('bookmarks'),
    },
    {
      id: 'tafsir',
      title: 'Tafsir',
      icon: Lightbulb,
      action: () => onNavigate('tafsir'),
    },
    {
      id: 'audio',
      title: 'Audio Qari',
      icon: Headphones,
      action: () => (onOpenAudioQari ? onOpenAudioQari() : onNavigate('settings')),
    },
    {
      id: 'settings',
      title: 'Pengaturan',
      icon: Settings,
      action: () => onNavigate('settings'),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={act.action}
            aria-label={act.title}
            className="p-3.5 sm:p-4 rounded-2xl bg-[#051D42]/90 light:bg-white hover:bg-[#001F52] light:hover:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] hover:border-[#D9A441]/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#0D3169] light:border-[#E5DFD5] flex items-center justify-center mb-2 group-hover:scale-105 group-hover:border-[#D9A441]/50 transition-all shadow-inner">
              <Icon className="w-5 h-5 text-[#FFE29A] light:text-[#2E6F52] group-hover:text-[#D9A441] transition-colors" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#F5F1E6] light:text-[#1A202C] tracking-tight truncate w-full group-hover:text-[#FFE29A] light:group-hover:text-[#2E6F52] transition-colors">
              {act.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
