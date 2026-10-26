import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Data belum dapat dimuat. Periksa koneksi internet Anda lalu coba lagi.',
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#051D42]/60 border border-[#EF4444]/30 my-6">
      <div className="w-12 h-12 rounded-xl bg-[#001F52] flex items-center justify-center text-[#EF4444] mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm md:text-base font-semibold text-[#F5F1E6] mb-1">Terjadi Kendala</h3>
      <p className="text-xs md:text-sm text-[#8CA3C7] max-w-sm mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-xs md:text-sm font-medium transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Memuat ulang...' : 'Coba Lagi'}
        </button>
      )}
    </div>
  );
};
