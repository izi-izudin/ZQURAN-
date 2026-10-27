import React, { useState } from 'react';
import { X, Clock, Compass, Heart, Sparkles, Calendar, Volume2, CheckCircle2, ChevronRight, Navigation } from 'lucide-react';
import { QiblaRouteMap } from '../home/QiblaRouteMap';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Jadwal Sholat Modal
export const PrayerScheduleModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const times = [
    { name: 'Imsak', time: '04:02' },
    { name: 'Subuh', time: '04:12' },
    { name: 'Terbit', time: '05:28' },
    { name: 'Dhuha', time: '05:52' },
    { name: 'Dzuhur', time: '11:45' },
    { name: 'Ashar', time: '15:08' },
    { name: 'Maghrib', time: '17:52', isNext: true },
    { name: 'Isya', time: '19:06' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#051D42] light:bg-white border border-[#D9A441]/40 light:border-[#E5DFD5] p-6 shadow-2xl text-[#F5F1E6] light:text-[#1A202C] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] light:border-[#E5DFD5]">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h3 className="font-bold text-base">Jadwal Sholat & Imsakiyah</h3>
              <p className="text-xs text-[#8CA3C7] light:text-[#64748B]">
                Kecamatan Baros, Kabupaten Serang, Banten
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-xl bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] hover:text-[#FFE29A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Card */}
        <div className="my-4 p-4 rounded-2xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#0D3169] light:border-[#2E6F52]/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#FFE29A] light:text-[#2E6F52] font-semibold">
              Waktu Sholat Berikutnya
            </span>
            <h4 className="text-xl font-bold text-white light:text-[#1A202C]">Maghrib 17:52 WIB</h4>
            <p className="text-xs text-[#8CA3C7] light:text-[#64748B]">
              Tersisa ~00:42:13 menuju adzan Maghrib
            </p>
          </div>
          <div className="text-3xl">🕌</div>
        </div>

        {/* Schedule List */}
        <div className="space-y-2">
          {times.map((item) => (
            <div
              key={item.name}
              className={`flex items-center justify-between p-3 rounded-xl transition ${
                item.isNext
                  ? 'bg-[#0647A5] light:bg-[#2E6F52] text-white font-bold border border-[#D9A441]'
                  : 'bg-[#001F52]/60 light:bg-[#F9F8F6] text-[#F5F1E6] light:text-[#1A202C] border border-[#0D3169] light:border-[#E5DFD5]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.name}</span>
                {item.isNext && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#D9A441] text-[#001F52] font-extrabold">
                    SELANJUTNYA
                  </span>
                )}
              </div>
              <span className="font-mono text-sm">{item.time} WIB</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#0D3169] light:border-[#E5DFD5] text-center">
          <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
            Perhitungan berdasarkan kriteria Kemenag RI / MABIMS (Subuh 20°, Ashar 1, Maghrib 1°).
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. Fullscreen Qibla Compass Modal
export const QiblaModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#03152F] light:bg-white border border-[#D9A441]/50 p-6 shadow-2xl text-[#F5F1E6] light:text-[#1A202C] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] light:border-[#E5DFD5]">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h3 className="font-bold text-base">Kompas Kiblat Presisi Fullscreen</h3>
              <p className="text-xs text-[#8CA3C7] light:text-[#64748B]">
                Baros, Banten menuju Ka'bah Al-Mukarramah (294.8° NW)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-xl bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] hover:text-[#FFE29A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4">
          <QiblaRouteMap />
        </div>

        <div className="p-3.5 rounded-2xl bg-[#001F52]/60 light:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] text-xs text-[#8CA3C7] light:text-[#64748B] space-y-1">
          <p className="font-semibold text-[#FFE29A] light:text-[#2E6F52]">
            Petunjuk Penggunaan Kompas:
          </p>
          <p>1. Letakkan perangkat di atas permukaan datar jauh dari medan magnet logam.</p>
          <p>2. Putar tubuh Anda hingga ikon Ka'bah berada tepat di titik puncak jarum.</p>
          <p>3. Sudut azimuth Baros Banten adalah 294.8° dari arah Utara searah jarum jam.</p>
        </div>
      </div>
    </div>
  );
};

// 3. Doa & Dzikir Modal
export const DoaDzikirModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'pagi' | 'petang' | 'harian'>('pagi');

  if (!isOpen) return null;

  const doaList = {
    pagi: [
      {
        title: 'Sayyidul Istighfar',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        latin: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka...",
        arti: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah selain Engkau. Engkau yang menciptakan aku...',
      },
      {
        title: 'Dzikir Perlindungan Pagi',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        latin: "Ash-bahna wa ash-bahal mulku lillah, wal-hamdu lillah...",
        arti: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah...',
      },
    ],
    petang: [
      {
        title: 'Dzikir Petang Pembuka',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        latin: "Amsayna wa amsal mulku lillah, wal-hamdu lillah...",
        arti: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah...',
      },
      {
        title: 'Perlindungan dari Kejahatan Makhluk',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        latin: "A'udzu bi-kalimatillahit tammati min syarri ma khalaq.",
        arti: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang Dia ciptakan.',
      },
    ],
    harian: [
      {
        title: 'Doa Sebelum Tidur',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        latin: 'Bismika Allahumma amutu wa ahya.',
        arti: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
      },
      {
        title: 'Doa Bangun Tidur',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        latin: "Alhamdu lillahilladzi ahyana ba'da ma amatana wa ilaihin nusyur.",
        arti: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami kembali.',
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#051D42] light:bg-white border border-[#D9A441]/40 light:border-[#E5DFD5] p-6 shadow-2xl text-[#F5F1E6] light:text-[#1A202C] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] light:border-[#E5DFD5]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#EF4444]" />
            <h3 className="font-bold text-base">Doa & Dzikir Pilihan</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-xl bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] hover:text-[#FFE29A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 my-3">
          {(['pagi', 'petang', 'harian'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0647A5] light:bg-[#2E6F52] text-[#FFE29A] light:text-white border border-[#D9A441]'
                  : 'bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] light:text-[#64748B]'
              }`}
            >
              {cat === 'pagi' ? 'Dzikir Pagi' : cat === 'petang' ? 'Dzikir Petang' : 'Doa Harian'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {doaList[activeCategory].map((d, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#001F52]/70 light:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] space-y-2"
            >
              <h4 className="text-sm font-bold text-[#FFE29A] light:text-[#2E6F52]">{d.title}</h4>
              <p className="font-arabic text-lg text-[#F5F1E6] light:text-[#1A202C] leading-loose">
                {d.arabic}
              </p>
              <p className="text-xs italic text-[#168BFF] light:text-[#3B7A57]">{d.latin}</p>
              <p className="text-xs text-[#8CA3C7] light:text-[#64748B]">{d.arti}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Asmaul Husna Modal
export const AsmaulHusnaModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const names = [
    { num: 1, arab: 'الرَّحْمَنُ', latin: 'Ar-Rahman', arti: 'Yang Maha Pengasih' },
    { num: 2, arab: 'الرَّحِيمُ', latin: 'Ar-Rahim', arti: 'Yang Maha Penyayang' },
    { num: 3, arab: 'الْمَلِكُ', latin: 'Al-Malik', arti: 'Yang Maha Merajai' },
    { num: 4, arab: 'الْقُدُّوسُ', latin: 'Al-Quddus', arti: 'Yang Maha Suci' },
    { num: 5, arab: 'السَّلَامُ', latin: 'As-Salam', arti: 'Yang Maha Memberi Kesejahteraan' },
    { num: 6, arab: 'الْمُؤْمِنُ', latin: 'Al-Mu’min', arti: 'Yang Maha Memberi Keamanan' },
    { num: 7, arab: 'الْمُهَيْمِنُ', latin: 'Al-Muhaymin', arti: 'Yang Maha Memelihara' },
    { num: 8, arab: 'الْعَزِيزُ', latin: 'Al-Aziz', arti: 'Yang Maha Perkasa' },
    { num: 9, arab: 'الْجَبَّارُ', latin: 'Al-Jabbar', arti: 'Yang Memiliki Mutlak Kegagahan' },
    { num: 10, arab: 'الْمُتَكَبِّرُ', latin: 'Al-Mutakabbir', arti: 'Yang Maha Megah' },
    { num: 11, arab: 'الْخَالِقُ', latin: 'Al-Khaliq', arti: 'Yang Maha Pencipta' },
    { num: 12, arab: 'الْبَارِئُ', latin: 'Al-Bari’', arti: 'Yang Maha Melepaskan' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#051D42] light:bg-white border border-[#D9A441]/40 light:border-[#E5DFD5] p-6 shadow-2xl text-[#F5F1E6] light:text-[#1A202C] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] light:border-[#E5DFD5]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D9A441]" />
            <h3 className="font-bold text-base">Asmaul Husna (99 Nama Allah)</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-xl bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] hover:text-[#FFE29A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#8CA3C7] light:text-[#64748B] my-3">
          "Hanya milik Allah asma-ul husna, maka bermohonlah kepada-Nya dengan menyebut asma-ul husna itu..." (QS. Al-A'raf: 180)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {names.map((item) => (
            <div
              key={item.num}
              className="p-3 rounded-2xl bg-[#001F52]/60 light:bg-[#F9F8F6] border border-[#0D3169] light:border-[#E5DFD5] text-center space-y-1 hover:border-[#D9A441] transition"
            >
              <span className="text-[10px] text-[#FFE29A] light:text-[#2E6F52] font-mono">
                #{item.num}
              </span>
              <p className="font-arabic text-xl text-[#D9A441]">{item.arab}</p>
              <p className="text-xs font-bold text-[#F5F1E6] light:text-[#1A202C]">{item.latin}</p>
              <p className="text-[10px] text-[#8CA3C7] light:text-[#64748B]">{item.arti}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Kalender Hijriah Modal (Dynamic with HijriCalendarService)
import {
  getHijriToday,
  getHijriMonth,
  HIJRI_MONTH_NAMES_ID,
  type HijriCalendarMonth,
  type HijriConversionResult,
} from '../../services/hijriCalendarService';

export const KalenderHijriahModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [currentHijri, setCurrentHijri] = useState<HijriConversionResult | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(5);
  const [selectedYear, setSelectedYear] = useState<number>(1448);
  const [monthData, setMonthData] = useState<HijriCalendarMonth | null>(null);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      getHijriToday().then((today) => {
        setCurrentHijri(today);
        setSelectedMonth(today.hijri.month);
        setSelectedYear(today.hijri.year);
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoadingMonth(true);
      getHijriMonth(selectedYear, selectedMonth)
        .then((m) => setMonthData(m))
        .finally(() => setIsLoadingMonth(false));
    }
  }, [isOpen, selectedYear, selectedMonth]);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#051D42] light:bg-white border border-[#D9A441]/50 light:border-[#E5DFD5] p-5 sm:p-6 shadow-2xl text-[#F5F1E6] light:text-[#1A202C] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0D3169] light:border-[#E5DFD5]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#10B981]" />
            <div>
              <h3 className="font-bold text-base">Kalender Hijriah Indonesia</h3>
              <p className="text-[11px] text-[#8CA3C7] light:text-[#64748B]">
                Sumber: Intl Islamic Engine • Status: {monthData?.status || 'valid'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-xl bg-[#001F52] light:bg-[#F4EFE6] text-[#8CA3C7] hover:text-[#FFE29A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Navigation Banner */}
        <div className="my-4 p-4 rounded-2xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#0D3169] flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1.5 rounded-xl bg-[#03152F] light:bg-white border border-[#0D3169] text-xs font-semibold text-[#FFE29A] light:text-[#2E6F52] hover:border-[#D9A441] transition cursor-pointer"
          >
            ← Bulan Lalu
          </button>

          <div className="text-center">
            <h4 className="text-lg sm:text-xl font-bold text-white light:text-[#1A202C]">
              {HIJRI_MONTH_NAMES_ID[selectedMonth - 1]} {selectedYear} H
            </h4>
            <p className="text-xs text-[#8CA3C7] light:text-[#64748B] mt-0.5">
              {monthData ? `${monthData.gregorianRange.start} s/d ${monthData.gregorianRange.end}` : ''}
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            className="px-3 py-1.5 rounded-xl bg-[#03152F] light:bg-white border border-[#0D3169] text-xs font-semibold text-[#FFE29A] light:text-[#2E6F52] hover:border-[#D9A441] transition cursor-pointer"
          >
            Bulan Depan →
          </button>
        </div>

        {/* Calendar Days Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-[#8CA3C7] light:text-[#64748B] pb-1">
            <span>Ahad</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {isLoadingMonth ? (
            <div className="py-12 text-center text-xs text-[#8CA3C7]">
              Memuat kalender dari HijriCalendarService...
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {monthData?.days.map((day) => (
                <div
                  key={day.id}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center justify-between border transition ${
                    day.isToday
                      ? 'bg-[#0647A5] light:bg-[#2E6F52] text-white border-[#D9A441] font-bold shadow-md'
                      : day.isFastDay
                      ? 'bg-[#001F52]/80 light:bg-[#E8F0EC]/80 border-[#10B981]/50 text-[#F5F1E6]'
                      : 'bg-[#001F52]/50 light:bg-[#F9F8F6] border-[#0D3169] text-[#8CA3C7]'
                  }`}
                  title={day.fastType || `Hari ke-${day.hijri.day}`}
                >
                  <span className="font-mono font-bold text-sm text-[#FFE29A] light:text-[#C4922F]">
                    {day.hijri.day}
                  </span>
                  <span className="text-[10px] opacity-75">{day.gregorian.day}</span>
                  {day.isFastDay && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fast Days Legend */}
        <div className="mt-4 pt-3 border-t border-[#0D3169] light:border-[#E5DFD5] space-y-2 text-xs">
          <h5 className="text-xs font-bold text-[#FFE29A] light:text-[#2E6F52] uppercase tracking-wider">
            Keterangan Puasa Sunnah Bulan Ini
          </h5>
          <div className="p-3 rounded-xl bg-[#001F52]/60 light:bg-[#F9F8F6] border border-[#0D3169] flex justify-between text-xs">
            <span>Puasa Sunnah Senin & Kamis</span>
            <span className="text-[#10B981] font-semibold">Tiap Senin & Kamis</span>
          </div>
          <div className="p-3 rounded-xl bg-[#001F52]/60 light:bg-[#F9F8F6] border border-[#0D3169] flex justify-between text-xs">
            <span>Puasa Ayyamul Bidh (13, 14, 15 {HIJRI_MONTH_NAMES_ID[selectedMonth - 1]})</span>
            <span className="text-[#FFE29A] light:text-[#2E6F52] font-semibold">
              Pertengahan Bulan Hijriah
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
