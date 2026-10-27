import React, { useState } from 'react';
import { Search, MoreVertical, ArrowLeft, SlidersHorizontal, Bell, Sun, Moon, User, Layers } from 'lucide-react';
import { BRANDING } from '../../config/appConfig';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useSettings } from '../../context/SettingsContext';
import { PopupMenu } from '../common/PopupMenu';
import { PWAInstallButton } from '../common/PWAInstallButton';

export type QuranTab = 'surah' | 'juz' | 'bookmark';

interface ScrollAwareHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showTabs?: boolean;
  activeTab?: QuranTab;
  onTabChange?: (tab: QuranTab) => void;
  onOpenSearch?: () => void;
  onOpenBell?: () => void;
  onOpenStoryboard?: () => void;
  onOpenSettings: () => void;
  onOpenLastRead: () => void;
  onOpenRating: () => void;
  onOpenInfo: () => void;
  onOpenAuth: () => void;
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
  onToggleFilter?: () => void;
  isFilterActive?: boolean;
}

export const ScrollAwareHeader: React.FC<ScrollAwareHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showTabs = false,
  activeTab = 'surah',
  onTabChange,
  onOpenSearch,
  onOpenBell,
  onOpenStoryboard,
  onOpenSettings,
  onOpenLastRead,
  onOpenRating,
  onOpenInfo,
  onOpenAuth,
  currentUser,
  onLogout,
  onToggleFilter,
  isFilterActive = false,
}) => {
  const { isVisible, isAtTop } = useScrollDirection({ threshold: 10, topThreshold: 45 });
  const { settings, toggleTheme } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // When tabs are shown, collapse only the top bar on scroll-down, keeping tabs docked at top
  const isTopBarHidden = !isVisible && !isAtTop;

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md bg-[#03152F]/90 light:bg-[#FDFBF7]/90 border-b border-[#0D3169] light:border-[#E5DFD5] transition-transform duration-200 ease-out shadow-xs ${
        !showTabs && isTopBarHidden ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/* Top App Bar (Collapses smoothly on scroll down when tabs are visible) */}
      <div
        className={`max-w-7xl mx-auto px-3.5 sm:px-6 transition-all duration-200 ease-out overflow-hidden flex items-center justify-between gap-2 ${
          showTabs && isTopBarHidden
            ? 'h-0 opacity-0 md:h-14 md:opacity-100'
            : 'h-14 sm:h-16 opacity-100'
        }`}
      >
        {/* Left: Back / Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="p-2 rounded-xl bg-[#051D42] light:bg-[#E8F0EC] hover:bg-[#001F52] border border-[#0D3169] light:border-[#E5DFD5] text-[#F5F1E6] light:text-[#1A202C] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              onClick={onBack || (() => {})}
              className="flex items-center gap-2 cursor-pointer group"
              aria-label="Logo ZQuran"
            >
              <img
                src={BRANDING.logoUrl}
                alt={BRANDING.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain border border-[#D9A441]/50 shadow-sm"
              />
            </button>
          )}

          {/* Center: Title & Subtitle */}
          <div className="truncate pl-0.5">
            <h1 className="text-sm sm:text-base font-bold text-[#F5F1E6] light:text-[#1A202C] truncate tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B] truncate font-normal leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions (Search, Bell, Theme, Avatar, Menu) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative">
          {/* Storyboard 4 Frame Launcher Button */}
          {onOpenStoryboard && (
            <button
              onClick={onOpenStoryboard}
              aria-label="Lihat Storyboard 4 Frame"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#D9A441]/40 text-[#FFE29A] light:text-[#2E6F52] text-xs font-semibold hover:border-[#D9A441] transition cursor-pointer shadow-xs"
              title="Storyboard 4 Frame Showcase"
            >
              <Layers className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Storyboard</span>
            </button>
          )}

          {/* Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              aria-label="Pencarian Al-Qur'an"
              className="p-2 rounded-xl text-[#8CA3C7] light:text-[#64748B] hover:text-[#FFE29A] hover:bg-[#051D42] light:hover:bg-[#E8F0EC] transition cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Bell / Prayer Notification Button */}
          {onOpenBell && (
            <button
              onClick={onOpenBell}
              aria-label="Notifikasi Waktu Sholat"
              className="p-2 rounded-xl text-[#8CA3C7] light:text-[#64748B] hover:text-[#FFE29A] hover:bg-[#051D42] light:hover:bg-[#E8F0EC] transition cursor-pointer relative"
              title="Pengingat Adzan"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D9A441] ring-2 ring-[#03152F] light:ring-white" />
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={settings.theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
            className="p-2 rounded-xl text-[#8CA3C7] light:text-[#64748B] hover:text-[#FFE29A] hover:bg-[#051D42] light:hover:bg-[#E8F0EC] transition cursor-pointer"
            title={settings.theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
          >
            {settings.theme === 'light' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E6F52]" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFE29A]" />
            )}
          </button>

          {/* Avatar / Profile Button */}
          <button
            onClick={currentUser ? onOpenSettings : onOpenAuth}
            aria-label={currentUser ? `Profil: ${currentUser.name}` : 'Masuk Akun'}
            className="p-1.5 rounded-xl border border-[#0D3169] light:border-[#E5DFD5] bg-[#001F52] light:bg-[#E8F0EC] hover:border-[#D9A441] transition cursor-pointer flex items-center justify-center text-[#FFE29A] light:text-[#2E6F52]"
            title={currentUser ? currentUser.name : 'Masuk'}
          >
            {currentUser ? (
              <div className="w-6 h-6 rounded-lg bg-[#0647A5] text-[#FFE29A] font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User className="w-4 h-4 text-[#8CA3C7] light:text-[#64748B]" />
            )}
          </button>

          {/* Filter toggle button if present */}
          {onToggleFilter && (
            <button
              onClick={onToggleFilter}
              aria-label="Filter Surat"
              className={`p-2 rounded-xl transition cursor-pointer ${
                isFilterActive
                  ? 'bg-[#001F52] text-[#FFE29A] border border-[#D9A441]'
                  : 'text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#051D42]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <PWAInstallButton compact />

          {/* 3-Dots More Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu Opsi Lainnya"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isMenuOpen
                ? 'bg-[#001F52] text-[#FFE29A] border border-[#0D3169]'
                : 'text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#051D42]'
            }`}
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Popup Menu */}
          <PopupMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onOpenSettings={onOpenSettings}
            onOpenLastRead={onOpenLastRead}
            onOpenRating={onOpenRating}
            onOpenInfo={onOpenInfo}
            onOpenAuth={onOpenAuth}
            currentUser={currentUser}
            onLogout={onLogout}
          />
        </div>
      </div>

      {/* Sticky Tabs Navigation for Quran Page: SURAH | JUZ | BOOKMARK */}
      {showTabs && onTabChange && (
        <div className="max-w-7xl mx-auto px-4 border-t border-[#0D3169]/60 light:border-[#E5DFD5] flex items-center justify-around backdrop-blur-md bg-[#03152F]/95 light:bg-[#FDFBF7]/95 shadow-xs">
          {(['surah', 'juz', 'bookmark'] as QuranTab[]).map((tab) => {
            const isActive = activeTab === tab;
            const labels: Record<QuranTab, string> = {
              surah: 'SURAH',
              juz: 'JUZ',
              bookmark: 'BOOKMARK',
            };

            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab)}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wider transition cursor-pointer relative text-center select-none ${
                  isActive
                    ? 'text-[#FFE29A] light:text-[#2E6F52]'
                    : 'text-[#F5F1E6]/50 light:text-[#64748B] hover:text-[#F5F1E6] light:hover:text-[#1A202C]'
                }`}
              >
                <span>{labels[tab]}</span>
                {/* Thin Active Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-6 right-6 h-[2.5px] bg-[#D9A441] light:bg-[#2E6F52] rounded-t-full transition-all" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
