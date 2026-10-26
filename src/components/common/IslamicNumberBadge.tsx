import React from 'react';

interface IslamicNumberBadgeProps {
  number: number | string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IslamicNumberBadge: React.FC<IslamicNumberBadgeProps> = ({
  number,
  size = 'md',
  active = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  const formattedNumber = typeof number === 'number' && number < 10 ? `0${number}` : `${number}`;

  return (
    <div
      className={`relative ${sizeClasses[size]} shrink-0 flex items-center justify-center font-bold tracking-tight select-none transition-transform duration-200`}
    >
      {/* Outer subtle 8-pointed star shape created with two rotated squares */}
      <div
        className={`absolute inset-0 rounded-md transition-colors ${
          active
            ? 'bg-[#0647A5] border border-[#168BFF]'
            : 'bg-[#001F52] border border-[#D9A441]/50 group-hover:border-[#D9A441]'
        }`}
      />
      <div
        className={`absolute inset-0 rounded-md rotate-45 transition-colors ${
          active
            ? 'bg-[#0647A5] border border-[#168BFF]'
            : 'bg-[#001F52] border border-[#D9A441]/50 group-hover:border-[#D9A441]'
        }`}
      />

      {/* Number text in center */}
      <span
        className={`relative z-10 font-mono ${
          active ? 'text-[#FFE29A]' : 'text-[#FFE29A] group-hover:text-white'
        }`}
      >
        {formattedNumber}
      </span>
    </div>
  );
};
