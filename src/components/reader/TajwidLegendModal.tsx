import React from 'react';
import { X, BookOpen, Check } from 'lucide-react';
import { TAJWID_RULES } from '../../utils/tajwidParser';

interface TajwidLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  isTajwidEnabled: boolean;
  onToggleTajwid: () => void;
}

export const TajwidLegendModal: React.FC<TajwidLegendModalProps> = ({
  isOpen,
  onClose,
  isTajwidEnabled,
  onToggleTajwid,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panduan Tajwid Berwarna"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/85 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-[22px] bg-[#051D42] border border-[#0D3169] p-5 sm:p-6 shadow-2xl relative text-[#F5F1E6] my-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#001F52] border border-[#D9A441] flex items-center justify-center text-[#D9A441]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#F5F1E6] tracking-tight">
                Panduan Tajwid Berwarna
              </h2>
              <p className="text-xs text-[#8CA3C7]">
                Pewarnaan otomatis harakat & hukum bacaan tilawah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup panduan tajwid"
            className="p-1.5 rounded-xl text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toggle Bar inside modal */}
        <div className="p-3.5 rounded-2xl bg-[#001F52] border border-[#0D3169] flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-[#F5F1E6]">
              Tajwid Berwarna
            </h4>
            <p className="text-[11px] text-[#8CA3C7]">
              {isTajwidEnabled
                ? 'Aktif: Huruf diwarnai sesuai kaidah tajwid'
                : 'Nonaktif: Teks Arab ditampilkan satu warna'}
            </p>
          </div>

          <button
            onClick={onToggleTajwid}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
              isTajwidEnabled ? 'bg-[#0647A5]' : 'bg-[#03152F] border border-[#0D3169]'
            }`}
            aria-label="Toggle Tajwid"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isTajwidEnabled ? 'translate-x-6 bg-[#FFE29A]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {TAJWID_RULES.map((rule) => (
            <div
              key={rule.id}
              className="p-3 sm:p-3.5 rounded-xl bg-[#03152F] border border-[#0D3169]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Color Swatch Dot */}
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 shadow-xs"
                  style={{ backgroundColor: rule.color }}
                />

                <div>
                  <h4
                    className="text-xs sm:text-sm font-bold tracking-tight"
                    style={{ color: rule.color }}
                  >
                    {rule.name}
                  </h4>
                  <p className="text-[11px] text-[#8CA3C7] mt-0.5 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>

              {/* Arabic Example Pill */}
              <div
                className="shrink-0 px-3 py-1 rounded-lg border text-right font-arabic text-base sm:text-lg self-end sm:self-center"
                style={{
                  backgroundColor: rule.badgeBg,
                  borderColor: `${rule.color}40`,
                  color: rule.color,
                }}
                dir="rtl"
              >
                {rule.examples}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-[#0D3169] flex items-center justify-between text-xs text-[#8CA3C7]">
          <span>Pengaturan disimpan otomatis di perangkat</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-[#F5F1E6] font-semibold transition cursor-pointer text-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
