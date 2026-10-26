import React from 'react';
import { X, Check, Volume2 } from 'lucide-react';
import { QARI_LIST } from '../../config/appConfig';

interface QariSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQari: string;
  onSelect: (qariId: string) => void;
}

export const QariSelectorModal: React.FC<QariSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedQari,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pilih Qari Murottal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/80 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 shadow-2xl relative text-[#F5F1E6]">
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#D9A441]" />
            <h3 className="text-base font-bold text-[#F5F1E6]">Pilih Qari Murottal</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1 rounded-lg text-[#8CA3C7] hover:text-[#F5F1E6] hover:bg-[#001F52] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#8CA3C7] mb-4">
          Audio bersumber langsung dari rekaman berkualitas tinggi resmi via eQuran API.
        </p>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {QARI_LIST.map((qari) => {
            const isSelected = selectedQari === qari.id;

            return (
              <button
                key={qari.id}
                onClick={() => {
                  onSelect(qari.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#0647A5] border-[#168BFF] text-[#F5F1E6]'
                    : 'bg-[#001F52]/60 border-[#0D3169] hover:bg-[#001F52] text-[#F5F1E6]'
                }`}
              >
                <div>
                  <h4 className="text-sm font-semibold">{qari.name}</h4>
                  <p className="text-xs text-[#FFE29A]">{qari.title}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#168BFF] flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[#0D3169] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
