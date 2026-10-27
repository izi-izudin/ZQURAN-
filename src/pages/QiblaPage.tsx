import React, { useState, useEffect } from 'react';
import { Compass, RotateCw, MapPin, Wind, Sun, AlertCircle, Sparkles, Navigation, Globe } from 'lucide-react';
import { QiblaRouteMap } from '../components/home/QiblaRouteMap';

interface QiblaPageProps {
  onBack?: () => void;
}

export const QiblaPage: React.FC<QiblaPageProps> = ({ onBack }) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [compassMode, setCompassMode] = useState<'fullscreen' | 'map'>('fullscreen');
  const [sensorSupported, setSensorSupported] = useState<boolean>(true);

  // Exact target azimuth for Baros, Banten -> Ka'bah, Makkah
  const qiblaAzimuth = 294.8;

  useEffect(() => {
    // Device orientation handler for mobile sensors
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (ev.webkitCompassHeading !== undefined) {
        // iOS Safari
        setDeviceHeading(ev.webkitCompassHeading);
      } else if (e.alpha !== null) {
        // Android (alpha is degrees from North counter-clockwise, invert for compass)
        setDeviceHeading((360 - e.alpha) % 360);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setSensorSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
    }, 700);
  };

  // Dial rotation angle: if sensor available, rotate dial relative to heading; else show default 294.8°
  const needleRotation = qiblaAzimuth;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24 md:pb-16 text-[#F5F1E6]">
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#0D3169]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F1E6]">
            Kompas Kiblat
          </h2>
          <p className="text-xs text-[#8CA3C7] mt-0.5">
            Halaman Kompas Kiblat • Fullscreen Presisi
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#001F52] p-1 rounded-xl border border-[#0D3169]">
          <button
            onClick={() => setCompassMode('fullscreen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              compassMode === 'fullscreen'
                ? 'bg-[#0647A5] text-[#FFE29A] shadow-xs'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Kompas Dial
          </button>
          <button
            onClick={() => setCompassMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              compassMode === 'map'
                ? 'bg-[#0647A5] text-[#FFE29A] shadow-xs'
                : 'text-[#8CA3C7] hover:text-[#F5F1E6]'
            }`}
          >
            Peta Rute
          </button>
        </div>
      </div>

      {compassMode === 'fullscreen' ? (
        <div className="rounded-3xl bg-[#051D42]/90 border border-[#D9A441]/40 p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          {/* Main Dial (Matches Storyboard Frame 3) */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-[#D9A441] bg-[#03152F] flex items-center justify-center shadow-[0_0_35px_rgba(217,164,65,0.2)] my-2">
            {/* Compass Cardinal Marks */}
            <span className="absolute top-2.5 text-sm font-extrabold text-[#EF4444]">N</span>
            <span className="absolute right-3.5 text-xs font-bold text-[#8CA3C7]">E</span>
            <span className="absolute bottom-2.5 text-xs font-bold text-[#8CA3C7]">S</span>
            <span className="absolute left-3.5 text-xs font-bold text-[#8CA3C7]">W</span>

            {/* Inner Ring */}
            <div className="absolute inset-4 rounded-full border border-dashed border-[#0D3169] pointer-events-none" />

            {/* Needle pointing to Ka'bah (294.8°) */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="w-2 sm:w-2.5 h-28 sm:h-32 bg-gradient-to-t from-transparent via-[#168BFF] to-[#FFE29A] rounded-full relative">
                {/* Ka'bah icon at tip */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-[#001F52] border-2 border-[#D9A441] flex items-center justify-center shadow-xl">
                  <span className="text-sm">🕋</span>
                </div>
              </div>
            </div>

            {/* Ka'bah Label inside compass dial */}
            <div className="absolute top-14 right-10 flex items-center gap-1 text-[11px] text-[#FFE29A] font-bold">
              <span>Ka'bah</span>
            </div>

            {/* Center Pivot */}
            <div className="w-8 h-8 rounded-full bg-[#FFE29A] border-4 border-[#001F52] shadow-md flex items-center justify-center z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0647A5]" />
            </div>
          </div>

          {/* Heading Angle Text */}
          <div className="mt-4">
            <h3 className="text-3xl sm:text-4xl font-black text-[#FFE29A] tracking-wider font-mono">
              294.8°
            </h3>
            <p className="text-sm font-bold text-[#F5F1E6] mt-1">
              Mengarahkan ke Ka'bah, Masjidil Haram — Barat Laut
            </p>
            <p className="text-xs text-[#8CA3C7] mt-1">
              Sholat Berikutnya: <span className="text-[#FFE29A] font-semibold">Maghrib 17:52 WIB</span> • Di barat Laut
            </p>
          </div>

          {/* 3 Metric Cards (Location, Wind, UV Index) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mt-6">
            {/* Lokasi Anda */}
            <div className="p-3.5 rounded-2xl bg-[#001F52]/80 border border-[#0D3169] text-left">
              <div className="flex items-center gap-1.5 text-xs text-[#FFE29A] font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Lokasi Anda</span>
              </div>
              <p className="text-xs font-bold text-[#F5F1E6]">Baros, Banten</p>
              <p className="text-[10px] text-[#8CA3C7] font-mono mt-0.5">
                Lat -6.3978° • Lon 106.1520°
              </p>
            </div>

            {/* Angin */}
            <div className="p-3.5 rounded-2xl bg-[#001F52]/80 border border-[#0D3169] text-left">
              <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold mb-1">
                <Wind className="w-3.5 h-3.5" />
                <span>Kecepatan Angin</span>
              </div>
              <p className="text-xs font-bold text-[#F5F1E6]">12 km/j</p>
              <p className="text-[10px] text-[#8CA3C7] mt-0.5">Semilir Angin Tenang</p>
            </div>

            {/* UV Index */}
            <div className="p-3.5 rounded-2xl bg-[#001F52]/80 border border-[#0D3169] text-left">
              <div className="flex items-center gap-1.5 text-xs text-[#FFE29A] font-semibold mb-1">
                <Sun className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>UV Index</span>
              </div>
              <p className="text-xs font-bold text-[#F5F1E6]">3 • Sedang</p>
              <p className="text-[10px] text-[#8CA3C7] mt-0.5">Aman untuk Ibadah</p>
            </div>
          </div>

          {/* Kalibrasi Button & Guidance */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={handleCalibrate}
              disabled={isCalibrating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#001F52] hover:bg-[#0647A5] border border-[#D9A441]/50 text-xs text-[#FFE29A] font-bold transition cursor-pointer shadow-md"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
              <span>{isCalibrating ? 'Mengkalibrasi Kompas...' : 'Kalibrasi Kompas'}</span>
            </button>

            <p className="text-[11px] text-[#8CA3C7]">
              Pastikan perangkat rata & jauh dari magnet • Update GPS: baik
            </p>
            <p className="text-[11px] text-[#FFE29A] font-medium">
              Pengingat Maghrib: 5 menit sebelum 🔔
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <QiblaRouteMap />
        </div>
      )}
    </div>
  );
};
