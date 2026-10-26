import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-[#001F52] border border-[#D9A441] px-4 py-2 text-xs font-medium text-[#FFE29A] shadow-xl"
    >
      <WifiOff className="w-4 h-4 text-[#D9A441] animate-pulse" />
      <span>Mode Offline — Menampilkan surat & ayat yang tersimpan di cache.</span>
    </div>
  );
};
