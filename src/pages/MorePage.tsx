import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Search,
  Calendar,
  Heart,
  Sparkles,
  Settings,
  Info,
  Star,
  Volume2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { BRANDING } from '../config/appConfig';
import {
  DoaDzikirModal,
  AsmaulHusnaModal,
  KalenderHijriahModal,
} from '../components/modals/IslamicFeaturesModals';

interface MorePageProps {
  onNavigate: (tab: string, meta?: unknown) => void;
  onOpenInfo: () => void;
  onOpenRating: () => void;
}

export const MorePage: React.FC<MorePageProps> = ({ onNavigate, onOpenInfo, onOpenRating }) => {
  const [showDoa, setShowDoa] = useState(false);
  const [showAsmaul, setShowAsmaul] = useState(false);
  const [showKalender, setShowKalender] = useState(false);

  const sections = [
    {
      title: 'Al-Qur\'an & Studi',
      items: [
        {
          id: 'bookmarks',
          label: 'Bookmark & Catatan Tadabbur',
          desc: 'Koleksi ayat yang ditandai dan catatan pribadi',
          icon: Bookmark,
          color: 'text-[#D9A441]',
          action: () => onNavigate('bookmarks'),
        },
        {
          id: 'tafsir',
          label: 'Tafsir Kemenag RI',
          desc: 'Penjelasan makna ayat dari Kementerian Agama Republik Indonesia',
          icon: BookOpen,
          color: 'text-[#168BFF]',
          action: () => onNavigate('tafsir'),
        },
        {
          id: 'search',
          label: 'Pencarian Global Al-Qur\'an',
          desc: 'Cari kata, terjemahan, nomor ayat, dan nama surat',
          icon: Search,
          color: 'text-[#FFE29A]',
          action: () => onNavigate('search'),
        },
      ],
    },
    {
      title: 'Ibadah & Doa',
      items: [
        {
          id: 'kalender',
          label: 'Kalender Hijriah & Puasa Sunnah',
          desc: 'Penanggalan Islam dinamis, Ayyamul Bidh, dan Ramadan',
          icon: Calendar,
          color: 'text-[#10B981]',
          action: () => setShowKalender(true),
        },
        {
          id: 'doa',
          label: 'Doa & Dzikir Harian',
          desc: 'Al-Ma\'tsurat pagi petang dan doa sehari-hari',
          icon: Heart,
          color: 'text-[#EF4444]',
          action: () => setShowDoa(true),
        },
        {
          id: 'asmaul',
          label: 'Asmaul Husna',
          desc: '99 Nama-Nama Indah Allah dengan tulisan Arab dan makna',
          icon: Sparkles,
          color: 'text-[#D9A441]',
          action: () => setShowAsmaul(true),
        },
      ],
    },
    {
      title: 'Aplikasi & Preferensi',
      items: [
        {
          id: 'settings',
          label: 'Pengaturan Tilawah & Tampilan',
          desc: 'Tema [Dark / Light], font Arab, tajwid warna, dan ukuran teks',
          icon: Settings,
          color: 'text-[#FFE29A]',
          action: () => onNavigate('settings'),
        },
        {
          id: 'rating',
          label: 'Beri Penilaian & Saran',
          desc: 'Bantu kami meningkatkan kualitas aplikasi ZQuran',
          icon: Star,
          color: 'text-[#D9A441]',
          action: onOpenRating,
        },
        {
          id: 'info',
          label: 'Tentang ZQuran Digital',
          desc: 'Informasi lisensi data Kemenag, privasi, dan versi aplikasi',
          icon: Info,
          color: 'text-[#8CA3C7]',
          action: onOpenInfo,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24 md:pb-16 text-[#F5F1E6]">
      {/* Top Banner */}
      <div className="pb-3 border-b border-[#0D3169]">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F1E6]">
          Lainnya & Fitur Tambahan
        </h2>
        <p className="text-xs text-[#8CA3C7] mt-0.5">
          Eksplorasi seluruh modul ibadah, kajian Al-Qur'an, dan konfigurasi ZQuran
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-2.5">
            <h3 className="text-xs font-bold text-[#FFE29A] uppercase tracking-wider px-1">
              {sec.title}
            </h3>

            <div className="rounded-2xl bg-[#051D42]/90 border border-[#0D3169] divide-y divide-[#0D3169]/60 overflow-hidden shadow-sm">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#001F52] transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-3">
                      <div className="w-10 h-10 rounded-xl bg-[#001F52] border border-[#0D3169] flex items-center justify-center shrink-0 group-hover:border-[#D9A441] transition-colors shadow-inner">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-semibold text-[#F5F1E6] group-hover:text-[#FFE29A] transition-colors truncate">
                          {item.label}
                        </h4>
                        <p className="text-xs text-[#8CA3C7] truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#8CA3C7] group-hover:text-[#FFE29A] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Branding Card */}
      <div className="p-4 rounded-2xl bg-[#001F52]/60 border border-[#0D3169] flex items-center justify-between gap-3 text-xs text-[#8CA3C7]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>ZQuran Digital • Versi 1.0.0 (PWA Ready & Offline First)</span>
        </div>
        <span className="font-mono text-[11px] text-[#FFE29A]">Kemenag RI</span>
      </div>

      {/* Modals */}
      <DoaDzikirModal isOpen={showDoa} onClose={() => setShowDoa(false)} />
      <AsmaulHusnaModal isOpen={showAsmaul} onClose={() => setShowAsmaul(false)} />
      <KalenderHijriahModal isOpen={showKalender} onClose={() => setShowKalender(false)} />
    </div>
  );
};
