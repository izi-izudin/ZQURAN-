import React from 'react';
import { Home, BookOpen, Search, Bookmark, Settings, BookMarked, Compass } from 'lucide-react';
import { BRANDING } from '../../config/appConfig';

interface DesktopSidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentTab, onNavigate }) => {
  const mainNavItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'quran', label: "Daftar 114 Surat", icon: BookOpen },
    { id: 'search', label: 'Pencarian Global', icon: Search },
    { id: 'bookmarks', label: 'Bookmark & Catatan', icon: Bookmark },
    { id: 'settings', label: 'Pengaturan Tilawah', icon: Settings },
  ];

  return (
    <aside
      aria-label="Navigasi Desktop ZQuran"
      className="hidden md:flex flex-col w-64 shrink-0 bg-[#03152F] border-r border-[#0D3169] min-h-[calc(100vh-4rem)] p-4"
    >
      {/* Brand Badge */}
      <div className="p-3.5 rounded-2xl bg-[#051D42]/70 border border-[#0D3169] mb-6 flex items-center gap-3">
        <img
          src={BRANDING.logoUrl}
          alt={BRANDING.name}
          className="w-10 h-10 rounded-xl object-contain border border-[#D9A441]/40 shadow-sm"
        />
        <div className="overflow-hidden">
          <h2 className="text-sm font-bold text-[#F5F1E6] truncate">{BRANDING.name}</h2>
          <p className="text-[11px] text-[#FFE29A] font-medium truncate">Membaca & Tadabbur</p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        <p className="text-[10px] font-semibold text-[#8CA3C7] uppercase tracking-wider px-3 mb-2">
          Menu Utama
        </p>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'quran' && currentTab === 'reader');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-[#0647A5] text-[#F5F1E6] shadow-sm font-semibold'
                  : 'text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#051D42]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFE29A]' : 'text-[#8CA3C7]'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFE29A]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Info */}
      <div className="pt-4 border-t border-[#0D3169]/60 text-[11px] text-[#8CA3C7] px-3 space-y-1">
        <p className="text-[#FFE29A] font-medium">Kemenag RI Certified Data</p>
        <p className="text-[10px]">Audio Murottal 6 Qari Resmi</p>
      </div>
    </aside>
  );
};
