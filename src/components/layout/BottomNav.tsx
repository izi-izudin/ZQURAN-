import React from 'react';
import { Home, BookOpen, Search, Bookmark, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'quran', label: "Qur'an", icon: BookOpen },
    { id: 'search', label: 'Cari', icon: Search },
    { id: 'bookmarks', label: 'Bookmark', icon: Bookmark },
    { id: 'settings', label: 'Lagi', icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label="Navigasi Utama Bawah ZQuran"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03152F] border-t border-[#0D3169] transition-all"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-15 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (item.id === 'quran' && currentTab === 'reader') ||
            (item.id === 'bookmarks' && currentTab === 'bookmarks');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer relative ${
                isActive ? 'text-[#FFE29A]' : 'text-[#F5F1E6]/50 hover:text-[#F5F1E6]'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? 'bg-[#001F52] text-[#FFE29A]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#FFE29A]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
