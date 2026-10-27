import React from 'react';
import { Home, BookOpen, Clock, Compass, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  quranSubTab?: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, quranSubTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'quran', label: "Al-Qur'an", icon: BookOpen },
    { id: 'schedule', label: 'Jadwal', icon: Clock },
    { id: 'qibla', label: 'Kiblat', icon: Compass },
    { id: 'more', label: 'Lainnya', icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label="Navigasi Utama Bawah ZQuran"
      className="md:hidden fixed bottom-2 left-3 right-3 z-40 backdrop-blur-xl bg-[#03152F]/92 light:bg-[#FDFBF7]/92 border border-[#D9A441]/35 light:border-[#E5DFD5] rounded-3xl shadow-2xl transition-all"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isQuran = item.id === 'quran';
          const isMore = item.id === 'more';

          const isActive = isQuran
            ? currentTab === 'quran' || currentTab === 'reader'
            : isMore
            ? currentTab === 'more' || currentTab === 'settings' || currentTab === 'bookmarks' || currentTab === 'tafsir' || currentTab === 'search'
            : currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer relative select-none ${
                isActive
                  ? 'text-[#FFE29A] light:text-[#2E6F52]'
                  : 'text-[#F5F1E6]/50 light:text-[#64748B] hover:text-[#F5F1E6] light:hover:text-[#1A202C]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#001F52] light:bg-[#E8F0EC] text-[#FFE29A] light:text-[#2E6F52] shadow-xs'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#FFE29A] light:text-[#2E6F52]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] light:bg-[#2E6F52] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
