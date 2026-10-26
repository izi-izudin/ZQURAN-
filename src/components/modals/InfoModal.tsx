import React from 'react';
import { X, ShieldCheck, Database, Award, Sparkles } from 'lucide-react';
import { BRANDING } from '../../config/appConfig';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Informasi Aplikasi ZQuran"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/80 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 sm:p-6 shadow-2xl relative text-[#F5F1E6] space-y-4">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-[#8CA3C7] hover:text-[#F5F1E6] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-[#0D3169]">
          <img
            src={BRANDING.logoUrl}
            alt={BRANDING.name}
            className="w-12 h-12 rounded-xl object-contain border border-[#D9A441]/50 shadow"
          />
          <div>
            <h3 className="text-base font-bold text-[#F5F1E6]">{BRANDING.name} Digital</h3>
            <p className="text-xs text-[#FFE29A]">{BRANDING.tagline}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[#8CA3C7] leading-relaxed">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
            <Database className="w-4 h-4 text-[#168BFF] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#F5F1E6]">Sumber Data Al-Qur'an & Terjemahan</p>
              <p className="text-[11px] text-[#8CA3C7] mt-0.5">
                Menggunakan eQuran API v2 bersertifikasi resmi Kementerian Agama Republik Indonesia (Kemenag RI).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
            <Award className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#F5F1E6]">Audio Murottal 6 Qari</p>
              <p className="text-[11px] text-[#8CA3C7] mt-0.5">
                Imam Masjidil Haram, Imam Masjid Nabawi, dan qari internasional tersertifikasi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#001F52]/60 border border-[#0D3169]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#F5F1E6]">Privasi & Penyimpanan Lokal</p>
              <p className="text-[11px] text-[#8CA3C7] mt-0.5">
                Riwayat bacaan, bookmark, dan catatan tadabbur Anda tersimpan aman secara lokal di perangkat Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
