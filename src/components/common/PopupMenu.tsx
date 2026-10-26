import React, { useEffect, useRef } from 'react';
import { Settings, Bookmark, Star, Info, User, LogOut } from 'lucide-react';

interface PopupMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenLastRead: () => void;
  onOpenRating: () => void;
  onOpenInfo: () => void;
  onOpenAuth: () => void;
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const PopupMenu: React.FC<PopupMenuProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenLastRead,
  onOpenRating,
  onOpenInfo,
  onOpenAuth,
  currentUser,
  onLogout,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click or Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Menu Opsi ZQuran"
      className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#051D42] border border-[#0D3169] shadow-2xl p-2 z-50 text-[#F5F1E6] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* User Status Header if logged in */}
      {currentUser && (
        <div className="px-3 py-2 border-b border-[#0D3169]/80 mb-1">
          <p className="text-[11px] text-[#8CA3C7]">Masuk sebagai:</p>
          <p className="text-xs font-bold text-[#FFE29A] truncate">{currentUser.name}</p>
        </div>
      )}

      <div className="space-y-1">
        <button
          role="menuitem"
          onClick={() => {
            onOpenLastRead();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#001F52] text-xs font-medium text-[#F5F1E6] hover:text-[#FFE29A] transition cursor-pointer text-left"
        >
          <Bookmark className="w-4 h-4 text-[#D9A441]" />
          <span>Terakhir Baca</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#001F52] text-xs font-medium text-[#F5F1E6] hover:text-[#FFE29A] transition cursor-pointer text-left"
        >
          <Settings className="w-4 h-4 text-[#168BFF]" />
          <span>Pengaturan</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onOpenRating();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#001F52] text-xs font-medium text-[#F5F1E6] hover:text-[#FFE29A] transition cursor-pointer text-left"
        >
          <Star className="w-4 h-4 text-[#FFE29A]" />
          <span>Beri Rating</span>
        </button>

        <button
          role="menuitem"
          onClick={() => {
            onOpenInfo();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#001F52] text-xs font-medium text-[#F5F1E6] hover:text-[#FFE29A] transition cursor-pointer text-left"
        >
          <Info className="w-4 h-4 text-[#8CA3C7]" />
          <span>Info Aplikasi</span>
        </button>

        <div className="border-t border-[#0D3169]/80 my-1 pt-1">
          {currentUser ? (
            <button
              role="menuitem"
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#001F52] text-xs font-medium text-[#EF4444] transition cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          ) : (
            <button
              role="menuitem"
              onClick={() => {
                onOpenAuth();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#001F52] text-xs font-medium text-[#FFE29A] transition cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-[#D9A441]" />
              <span>Masuk / Akun</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
