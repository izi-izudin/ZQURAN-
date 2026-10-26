import React from 'react';
import { BookOpen, Search, Bookmark, BookMarked, Volume2, Settings } from 'lucide-react';

interface QuickActionGridProps {
  onNavigate: (tab: string, meta?: unknown) => void;
  onOpenQariModal: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onNavigate,
  onOpenQariModal,
}) => {
  const actions = [
    {
      id: 'quran',
      title: "Al-Qur'an",
      subtitle: '114 Surat Lengkap',
      icon: BookOpen,
      color: 'text-[#D9A441]',
      onClick: () => onNavigate('quran'),
    },
    {
      id: 'search',
      title: 'Pencarian',
      subtitle: 'Cari Surat & Terjemahan',
      icon: Search,
      color: 'text-[#168BFF]',
      onClick: () => onNavigate('search'),
    },
    {
      id: 'bookmarks',
      title: 'Bookmark',
      subtitle: 'Ayat & Catatan Tersimpan',
      icon: Bookmark,
      color: 'text-[#FFE29A]',
      onClick: () => onNavigate('bookmarks'),
    },
    {
      id: 'tafsir',
      title: 'Tafsir',
      subtitle: 'Kemenag Republik Indonesia',
      icon: BookMarked,
      color: 'text-[#D9A441]',
      onClick: () => onNavigate('tafsir'),
    },
    {
      id: 'audio',
      title: 'Audio Qari',
      subtitle: '6 Pilihan Qari Murottal',
      icon: Volume2,
      color: 'text-[#168BFF]',
      onClick: () => onOpenQariModal(),
    },
    {
      id: 'settings',
      title: 'Pengaturan',
      subtitle: 'Font Arab & Preferensi',
      icon: Settings,
      color: 'text-[#8CA3C7]',
      onClick: () => onNavigate('settings'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={act.onClick}
            className="flex flex-col items-start p-4 rounded-2xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] transition cursor-pointer text-left group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-[#001F52] group-hover:bg-[#0647A5] border border-[#0D3169] flex items-center justify-center mb-3 transition">
              <Icon className={`w-5 h-5 ${act.color} transition`} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F5F1E6] group-hover:text-[#FFE29A] transition">
              {act.title}
            </h4>
            <p className="text-[11px] text-[#8CA3C7] mt-0.5 line-clamp-1">
              {act.subtitle}
            </p>
          </button>
        );
      })}
    </div>
  );
};
