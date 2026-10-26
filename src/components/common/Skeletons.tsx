import React from 'react';

export const SurahSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl bg-[#051D42]/60 border border-[#0D3169]/50 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#001F52]" />
            <div className="space-y-2">
              <div className="w-32 h-4 rounded bg-[#001F52]" />
              <div className="w-24 h-3 rounded bg-[#001F52]/60" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-20 h-5 rounded bg-[#001F52]" />
            <div className="w-14 h-3 rounded bg-[#001F52]/60" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AyahSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#051D42]/60 border border-[#0D3169]/50 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]/40">
            <div className="w-8 h-8 rounded-full bg-[#001F52]" />
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded bg-[#001F52]" />
              <div className="w-6 h-6 rounded bg-[#001F52]" />
              <div className="w-6 h-6 rounded bg-[#001F52]" />
            </div>
          </div>
          <div className="w-full h-12 rounded bg-[#001F52]/70" />
          <div className="w-3/4 h-4 rounded bg-[#001F52]/50" />
          <div className="w-5/6 h-4 rounded bg-[#001F52]/40" />
        </div>
      ))}
    </div>
  );
};

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-44 rounded-2xl bg-[#051D42]/70 border border-[#0D3169]/50" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#051D42]/60 border border-[#0D3169]/40" />
        ))}
      </div>
      <div className="h-32 rounded-xl bg-[#051D42]/60 border border-[#0D3169]/40" />
    </div>
  );
};

export const SearchSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-[#051D42]/60 border border-[#0D3169]/40 space-y-2">
          <div className="flex justify-between">
            <div className="w-28 h-4 rounded bg-[#001F52]" />
            <div className="w-12 h-4 rounded bg-[#001F52]" />
          </div>
          <div className="w-full h-8 rounded bg-[#001F52]/50" />
        </div>
      ))}
    </div>
  );
};
