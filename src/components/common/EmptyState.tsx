import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#051D42]/40 border border-[#0D3169]/40 my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#001F52] flex items-center justify-center text-[#D9A441] mb-4">
        {icon || <BookOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-[#F5F1E6] mb-1">{title}</h3>
      {description && <p className="text-xs md:text-sm text-[#8CA3C7] max-w-sm mb-5">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] text-xs md:text-sm font-medium transition cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
