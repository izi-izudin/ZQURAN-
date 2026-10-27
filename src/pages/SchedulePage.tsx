import React, { useState, useEffect } from 'react';
import {
  Clock,
  Bell,
  BellRing,
  Volume2,
  Plus,
  Trash2,
  Check,
  Compass,
  AlertCircle,
  Play,
  Square,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  getUserAlarms,
  saveAlarm,
  deleteAlarm,
  toggleAlarmState,
  triggerVibration,
  type UserAlarm,
} from '../services/alarmService';
import { prayerAudioManager, PRAYER_AUDIO_URLS, type PrayerAudioType } from '../services/prayerAudioService';

interface SchedulePageProps {
  onOpenQibla?: () => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ onOpenQibla }) => {
  const [alarms, setAlarms] = useState<UserAlarm[]>([]);
  const [activeTab, setActiveTab] = useState<'jadwal' | 'alarm'>('jadwal');
  const [activeAudioTest, setActiveAudioTest] = useState<string | null>(null);

  // Form state for creating new alarm
  const [showAddForm, setShowAddForm] = useState(false);
  const [formName, setFormName] = useState('Pengingat Sholat');
  const [formTime, setFormTime] = useState('04:12');
  const [formSound, setFormSound] = useState<PrayerAudioType>('subuh');
  const [formVibrate, setFormVibrate] = useState(true);

  // Prayer times data (Baros, Banten)
  const prayerTimes = [
    { id: 'imsak', name: 'Imsak', time: '04:02', sound: 'imsak' as PrayerAudioType },
    { id: 'subuh', name: 'Subuh', time: '04:12', sound: 'subuh' as PrayerAudioType, checked: true },
    { id: 'terbit', name: 'Terbit', time: '05:28', sound: 'terbit' as PrayerAudioType },
    { id: 'dzuhur', name: 'Dzuhur', time: '11:45', sound: 'standardAdzan' as PrayerAudioType, checked: true },
    { id: 'ashar', name: 'Ashar', time: '15:08', sound: 'standardAdzan' as PrayerAudioType, checked: true },
    { id: 'maghrib', name: 'Maghrib', time: '17:52', sound: 'standardAdzan' as PrayerAudioType, checked: true, isNext: true },
    { id: 'isya', name: 'Isya', time: '19:06', sound: 'standardAdzan' as PrayerAudioType, checked: true },
  ];

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    const list = await getUserAlarms();
    setAlarms(list);
  };

  const handleToggleAlarm = async (id: string, currentState: boolean) => {
    await toggleAlarmState(id, !currentState);
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !currentState } : a))
    );
  };

  const handleDeleteAlarm = async (id: string) => {
    await deleteAlarm(id);
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAlarm = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarm: UserAlarm = {
      id: `alarm_${Date.now()}`,
      name: formName || 'Alarm ZQuran',
      time: formTime,
      days: [0, 1, 2, 3, 4, 5, 6],
      isEnabled: true,
      volume: 0.9,
      sound: formSound,
      vibration: formVibrate,
      createdAt: new Date().toISOString(),
    };

    await saveAlarm(newAlarm);
    setAlarms((prev) => [...prev, newAlarm]);
    setShowAddForm(false);
  };

  const handleTestAudio = async (type: PrayerAudioType) => {
    if (activeAudioTest === type) {
      prayerAudioManager.stop();
      setActiveAudioTest(null);
    } else {
      setActiveAudioTest(type);
      triggerVibration([100, 50, 100]);
      const ok = await prayerAudioManager.playPrayerAudio(type, undefined, 0.9);
      if (!ok) {
        setActiveAudioTest(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24 md:pb-16 text-[#F5F1E6]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F1E6]">
            Jadwal Sholat & Alarm
          </h2>
          <p className="text-xs text-[#8CA3C7] mt-0.5">
            Kecamatan Baros, Kabupaten Serang, Banten • Waktu Indonesia Barat (WIB)
          </p>
        </div>

        {/* Tab switch between Jadwal Sholat and Alarm Tilawah */}
        <div className="flex items-center gap-1.5 bg-[#001F52] p-1 rounded-xl border border-[#0D3169]">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'jadwal'
                ? 'bg-[#0647A5] text-[#FFE29A] shadow-xs'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Waktu Sholat
          </button>
          <button
            onClick={() => setActiveTab('alarm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'alarm'
                ? 'bg-[#0647A5] text-[#FFE29A] shadow-xs'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Kelola Alarm ({alarms.length})
          </button>
        </div>
      </div>

      {activeTab === 'jadwal' ? (
        <div className="space-y-6">
          {/* Storyboard Frame 4 Top Grid: Mini Compass + Arah Kiblat Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Card: Mini Dial 294.8° */}
            <div className="p-5 rounded-3xl bg-[#051D42]/90 border border-[#0D3169] flex items-center justify-between shadow-lg">
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-[#D9A441] bg-[#03152F] flex items-center justify-center relative mb-2">
                  <span className="font-mono font-bold text-xs text-[#FFE29A]">294.8°</span>
                  <div className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#168BFF]" />
                </div>
                <h4 className="text-sm font-bold text-[#F5F1E6]">Arah Kiblat dari Baros</h4>
                <p className="text-xs text-[#8CA3C7] mt-0.5">
                  Jarak ke Ka'bah: <span className="text-[#FFE29A] font-semibold">8.347 km</span> • Barat Laut
                </p>
              </div>

              {onOpenQibla && (
                <button
                  onClick={onOpenQibla}
                  className="px-3.5 py-2 rounded-xl bg-[#001F52] hover:bg-[#0647A5] border border-[#D9A441]/40 text-xs text-[#FFE29A] font-semibold transition cursor-pointer shrink-0"
                >
                  Detail →
                </button>
              )}
            </div>

            {/* Right Card: Arah Kiblat status & button */}
            <div className="p-5 rounded-3xl bg-[#051D42]/90 border border-[#D9A441]/50 flex flex-col justify-between shadow-lg relative">
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-md bg-[#0647A5] text-[#FFE29A] font-extrabold">
                Baru
              </span>
              <div>
                <div className="flex items-center gap-2 text-xs text-[#FFE29A] font-semibold mb-1">
                  <Compass className="w-4 h-4 text-[#D9A441]" />
                  <span>Arah Kiblat</span>
                </div>
                <p className="text-xs text-[#10B981] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Akurasi GPS: ±3 meter • Tinggi
                </p>
                <p className="text-[11px] text-[#8CA3C7] mt-0.5">Diperbarui: detik ini</p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#0D3169] flex items-center justify-between">
                <span className="text-xs text-[#F5F1E6] font-medium">
                  294.8° Barat Laut | Ka'bah
                </span>
                {onOpenQibla && (
                  <button
                    onClick={onOpenQibla}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D9A441] hover:bg-[#FFE29A] text-[#03152F] text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    <span>→ Lihat Kompas</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Complete Prayer Schedule Table (Storyboard Frame 4 bottom layout) */}
          <div className="rounded-3xl bg-[#051D42]/90 border border-[#0D3169] p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D9A441]" />
                <h3 className="text-sm font-bold text-[#F5F1E6]">Waktu Sholat Hari Ini</h3>
              </div>
              <span className="text-[11px] text-[#8CA3C7]">Metode: Kemenag RI (MABIMS)</span>
            </div>

            <div className="space-y-2">
              {prayerTimes.map((prayer) => (
                <div
                  key={prayer.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition border ${
                    prayer.isNext
                      ? 'bg-[#0647A5]/80 border-[#D9A441] text-white shadow-md'
                      : 'bg-[#001F52]/60 border-[#0D3169] text-[#F5F1E6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{prayer.name}</span>
                    {prayer.isNext && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D9A441] text-[#03152F] font-extrabold">
                        Berikutnya • 00:42:13
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold">{prayer.time} WIB</span>
                    {prayer.checked && (
                      <span className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}

                    {/* Audio Preview Button */}
                    <button
                      onClick={() => handleTestAudio(prayer.sound)}
                      aria-label={`Dengarkan Audio ${prayer.name}`}
                      className={`p-1.5 rounded-xl border transition cursor-pointer ${
                        activeAudioTest === prayer.sound
                          ? 'bg-[#D9A441] text-[#03152F] border-[#FFE29A]'
                          : 'bg-[#001F52] text-[#8CA3C7] hover:text-[#FFE29A] border-[#0D3169]'
                      }`}
                      title="Tes Audio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#0D3169] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8CA3C7]">
              <span>Diperbarui: 13:29 WIB • Lokasi: Baros, Banten</span>
              <span className="text-[#FFE29A] font-medium flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 text-[#D9A441]" />
                Pengingat Maghrib: 5 menit sebelum
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Alarm Manager View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F5F1E6]">Daftar Alarm & Pengingat</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-white text-xs font-bold transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Alarm</span>
            </button>
          </div>

          {/* Add Alarm Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateAlarm}
              className="p-5 rounded-3xl bg-[#051D42] border border-[#D9A441] space-y-4 shadow-xl animate-fadeIn"
            >
              <h4 className="text-xs font-bold text-[#FFE29A] uppercase tracking-wider">
                Buat Alarm Baru
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8CA3C7] mb-1">Nama Alarm</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#001F52] border border-[#0D3169] text-xs text-[#F5F1E6] focus:border-[#D9A441] outline-none"
                    placeholder="Contoh: Bangun Tahajud"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8CA3C7] mb-1">Waktu (HH:mm)</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#001F52] border border-[#0D3169] text-xs text-[#F5F1E6] focus:border-[#D9A441] outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8CA3C7] mb-1">Suara Pengingat</label>
                  <select
                    value={formSound}
                    onChange={(e) => setFormSound(e.target.value as PrayerAudioType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#001F52] border border-[#0D3169] text-xs text-[#F5F1E6] focus:border-[#D9A441] outline-none"
                  >
                    <option value="subuh">Adzan Subuh (Makkah)</option>
                    <option value="standardAdzan">Adzan Dzuhur/Ashar/Maghrib/Isya</option>
                    <option value="imsak">Sirine/Audio Imsak</option>
                    <option value="terbit">Suara Syuruq/Terbit</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formVibrate}
                      onChange={(e) => setFormVibrate(e.target.checked)}
                      className="rounded accent-[#D9A441]"
                    />
                    <span>Getar Perangkat (Vibrate)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-[#001F52] text-xs text-[#8CA3C7] hover:text-[#F5F1E6] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-white text-xs font-bold transition cursor-pointer shadow-md"
                >
                  Simpan Alarm
                </button>
              </div>
            </form>
          )}

          {/* Alarm List */}
          <div className="space-y-2.5">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="p-4 rounded-2xl bg-[#051D42]/90 border border-[#0D3169] flex items-center justify-between gap-3 shadow-sm hover:border-[#D9A441]/40 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#F5F1E6]">{alarm.name}</h4>
                    {alarm.linkedPrayer && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#001F52] border border-[#D9A441]/40 text-[#FFE29A] capitalize">
                        {alarm.linkedPrayer}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xl font-black text-[#FFE29A] mt-1">
                    {alarm.time}
                  </p>
                  <p className="text-[11px] text-[#8CA3C7]">
                    Suara: <span className="capitalize">{alarm.sound}</span> • Getar: {alarm.vibration ? 'Ya' : 'Tidak'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Test Sound Button */}
                  <button
                    onClick={() => handleTestAudio(alarm.sound)}
                    className="p-2 rounded-xl bg-[#001F52] hover:bg-[#0647A5] text-[#FFE29A] border border-[#0D3169] transition cursor-pointer"
                    title="Uji Suara Alarm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggleAlarm(alarm.id, alarm.isEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                      alarm.isEnabled ? 'bg-[#10B981]' : 'bg-[#001F52] border border-[#0D3169]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        alarm.isEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteAlarm(alarm.id)}
                    className="p-2 rounded-xl bg-[#001F52] hover:bg-[#EF4444] text-[#8CA3C7] hover:text-white transition cursor-pointer ml-1"
                    title="Hapus Alarm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Browser Limitation Disclaimer Notice */}
          <div className="p-4 rounded-2xl bg-[#001F52]/60 border border-[#0D3169] flex items-start gap-3 text-xs text-[#8CA3C7]">
            <AlertCircle className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#FFE29A]">Catatan Transparansi Sistem:</strong> Pengingat audio alarm dapat berbunyi optimal saat aplikasi ZQuran dibuka di tab browser atau mode PWA layar depan. Kebijakan sistem operasi browser membatasi pemutaran audio latar belakang ketika browser sepenuhnya ditutup.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
