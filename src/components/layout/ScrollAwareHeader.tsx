import React, { useState } from 'react';
import { Search, MoreVertical, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { BRANDING } from '../../config/appConfig';
import { useScrollDirection } from '../../hooks/useScrollDirection';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // When tabs are shown, we collapse only the top bar on scroll-down, keeping tabs docked at top!
  const isTopBarHidden = !isVisible && !isAtTop;

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-[#03152F] border-b border-[#0D3169] transition-transform duration-200 ease-out ${
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
              className="p-2 rounded-xl bg-[#051D42] hover:bg-[#001F52] border border-[#0D3169] text-[#F5F1E6] transition cursor-pointer"
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
            <h1 className="text-sm sm:text-base font-bold text-[#F5F1E6] truncate tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#8CA3C7] truncate font-normal leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative">
          {/* Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              aria-label="Pencarian Al-Qur'an"
              className="p-2 rounded-xl text-[#8CA3C7] hover:text-[#FFE29A] hover:bg-[#051D42] transition cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

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
        <div className="max-w-7xl mx-auto px-4 border-t border-[#0D3169]/60 flex items-center justify-around bg-[#03152F] shadow-xs">
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
                    ? 'text-[#FFE29A]'
                    : 'text-[#F5F1E6]/50 hover:text-[#F5F1E6]/80'
                }`}
              >
                <span>{labels[tab]}</span>
                {/* Thin Active Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-6 right-6 h-[2.5px] bg-[#D9A441] rounded-t-full transition-all" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
