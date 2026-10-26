import React from 'react';
import { Search, Bookmark, Settings as SettingsIcon, BookOpen } from 'lucide-react';
import { BRANDING } from '../../config/appConfig';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: unknown) => void;
  titleOverride?: string;
  subtitleOverride?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  titleOverride,
  subtitleOverride,
  onBack,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#03152F]/95 backdrop-blur-md border-b border-[#0D3169]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand or Back Button */}
        <div className="flex items-center gap-3 min-w-0">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-2 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-[#F5F1E6] transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left cursor-pointer group"
              aria-label="Kembali ke Beranda ZQuran"
            >
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="w-10 h-10 rounded-xl object-contain border border-[#D9A441]/50 shadow"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#F5F1E6] tracking-wide">{BRANDING.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#001F52] border border-[#0D3169] text-[#FFE29A]">
                    Digital
                  </span>
                </div>
                <p className="text-[11px] text-[#8CA3C7] truncate max-w-[220px]">
                  {BRANDING.tagline}
                </p>
              </div>
            </button>
          )}

          {titleOverride && (
            <div className="truncate pl-1">
              <h1 className="text-sm sm:text-base font-bold text-[#F5F1E6] truncate">{titleOverride}</h1>
              {subtitleOverride && (
                <p className="text-xs text-[#8CA3C7] truncate">{subtitleOverride}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {rightAction}

          {/* Quick Header Search shortcut on Desktop */}
          {currentTab !== 'search' && !titleOverride && (
            <button
              onClick={() => onNavigate('search')}
              aria-label="Buka Pencarian Global"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-xs text-[#8CA3C7] hover:text-[#F5F1E6] transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#D9A441]" />
              <span>Cari surat, ayat, atau arti...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-[#001F52] rounded border border-[#0D3169]">Ctrl K</kbd>
            </button>
          )}

          <PWAInstallButton compact />
        </div>
      </div>
    </header>
  );
};
