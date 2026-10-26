import React, { useState } from 'react';
import { X, Star, Heart, Check } from 'lucide-react';
import { BRANDING } from '../../config/appConfig';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Beri Rating ZQuran"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#03152F]/80 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#051D42] border border-[#0D3169] p-5 sm:p-6 shadow-2xl relative text-[#F5F1E6]">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-4 right-4 text-[#8CA3C7] hover:text-[#F5F1E6] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#001F52] border border-[#10B981] flex items-center justify-center text-[#10B981] mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F5F1E6]">Jazakallahu Khair!</h3>
            <p className="text-xs text-[#8CA3C7]">
              Terima kasih banyak atas penilaian dan dukungan Anda untuk pengembangan ZQuran.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#001F52] border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441] mx-auto">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#F5F1E6]">Beri Rating {BRANDING.name}</h3>
              <p className="text-xs text-[#8CA3C7] mt-1">
                Bantu kami menjaga kenyamanan dan ketenangan dalam membaca Al-Qur'an.
              </p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-[#FFE29A] hover:scale-110 transition cursor-pointer"
                  aria-label={`Rating ${star} Bintang`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-[#D9A441] text-[#D9A441]' : 'text-[#8CA3C7]/40'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tulis ulasan atau saran untuk ZQuran (opsional)..."
              rows={3}
              className="w-full rounded-xl bg-[#001F52] border border-[#0D3169] p-3 text-xs text-[#F5F1E6] placeholder-[#8CA3C7]/60 focus:outline-none focus:border-[#D9A441]"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer border border-[#168BFF]/40"
            >
              Kirim Penilaian
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
