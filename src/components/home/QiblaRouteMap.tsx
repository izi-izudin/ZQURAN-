import React, { useState } from 'react';
import { Compass, Navigation, MapPin, Globe, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';

interface QiblaRouteMapProps {
  onOpenCompassModal?: () => void;
}

export const QiblaRouteMap: React.FC<QiblaRouteMapProps> = ({ onOpenCompassModal }) => {
  const [activeView, setActiveView] = useState<'route' | 'mini' | 'compass'>('route');
  const [compassHeading, setCompassHeading] = useState<number>(294.8);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const qiblaBearing = 294.8; // Baros, Banten -> Ka'bah
  const distanceKm = '8.347 km';
  const gpsAccuracy = 'GPS ±3m';

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setCompassHeading(294.8);
      setIsCalibrating(false);
    }, 600);
  };

  return (
    <div className="rounded-3xl bg-[#051D42]/90 light:bg-white border border-[#0D3169] light:border-[#E5DFD5] p-5 shadow-xl transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#001F52] light:bg-[#E8F0EC] border border-[#D9A441]/40 flex items-center justify-center text-[#FFE29A] light:text-[#2E6F52]">
            <Compass className="w-5 h-5 text-[#D9A441]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#F5F1E6] light:text-[#1A202C]">
              Arah Kiblat & Peta Rute
            </h3>
            <p className="text-xs text-[#8CA3C7] light:text-[#64748B]">
              Baros, Banten ke Ka'bah • {distanceKm}
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#001F52] light:bg-[#F4EFE6] p-1 rounded-xl border border-[#0D3169] light:border-[#E5DFD5]">
          <button
            onClick={() => setActiveView('route')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeView === 'route'
                ? 'bg-[#0647A5] light:bg-[#2E6F52] text-[#FFE29A] light:text-white shadow-xs'
                : 'text-[#8CA3C7] light:text-[#64748B] hover:text-[#F5F1E6]'
            }`}
          >
            Peta Rute
          </button>
          <button
            onClick={() => setActiveView('compass')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeView === 'compass'
                ? 'bg-[#0647A5] light:bg-[#2E6F52] text-[#FFE29A] light:text-white shadow-xs'
                : 'text-[#8CA3C7] light:text-[#64748B] hover:text-[#F5F1E6]'
            }`}
          >
            Kompas
          </button>
          <button
            onClick={() => setActiveView('mini')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeView === 'mini'
                ? 'bg-[#0647A5] light:bg-[#2E6F52] text-[#FFE29A] light:text-white shadow-xs'
                : 'text-[#8CA3C7] light:text-[#64748B] hover:text-[#F5F1E6]'
            }`}
          >
            Mini Map
          </button>
        </div>
      </div>

      {/* Main Map / Compass Interactive Canvas */}
      <div className="relative rounded-2xl bg-[#001F52]/80 light:bg-[#F9F8F6] border border-[#0D3169]/80 light:border-[#E5DFD5] overflow-hidden min-h-[220px] flex items-center justify-center p-3">
        {activeView === 'route' && (
          <div className="w-full flex flex-col items-center">
            {/* SVG World Map Route with Geodesic Line from Banten to Makkah */}
            <svg
              viewBox="0 0 540 220"
              className="w-full h-auto max-h-[200px] select-none"
              aria-label="Peta Rute Geodesik Baros Banten ke Makkah Al-Mukarramah"
            >
              <defs>
                <linearGradient id="goldRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#168BFF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FFE29A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D9A441" stopOpacity="1" />
                </linearGradient>
                <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Stylized Minimal Continental Outlines (Middle East, Indian Ocean, SE Asia) */}
              {/* Africa Horn & Arabian Peninsula */}
              <path
                d="M 60 70 Q 110 50 140 80 T 170 140 T 130 180 Z"
                fill="#051D42"
                stroke="#0D3169"
                strokeWidth="1.2"
                opacity="0.6"
              />
              {/* Arabian Peninsula */}
              <path
                d="M 140 75 L 180 65 L 200 95 L 180 130 L 155 125 Z"
                fill="#082859"
                stroke="#D9A441"
                strokeWidth="1.2"
                opacity="0.85"
              />
              {/* Indian Subcontinent */}
              <path
                d="M 260 70 L 320 65 L 305 130 L 280 115 Z"
                fill="#051D42"
                stroke="#0D3169"
                strokeWidth="1.2"
                opacity="0.5"
              />
              {/* Southeast Asia / Indonesia Archipelago */}
              <path
                d="M 370 110 Q 410 130 460 140 T 490 170 L 440 180 T 380 160 Z"
                fill="#082859"
                stroke="#168BFF"
                strokeWidth="1.2"
                opacity="0.85"
              />
              {/* Java & Banten Island */}
              <ellipse cx="430" cy="165" rx="35" ry="8" fill="#0D3169" stroke="#FFE29A" strokeWidth="1" />

              {/* Glowing Curved Geodesic Route: Baros (420, 165) -> Ka'bah (165, 95) */}
              <path
                d="M 420 165 Q 290 85 165 95"
                fill="none"
                stroke="url(#goldRouteGrad)"
                strokeWidth="3"
                strokeDasharray="6 4"
                filter="url(#glowGold)"
              />

              {/* Marker: Ka'bah Makkah (165, 95) */}
              <g transform="translate(165, 95)">
                <circle cx="0" cy="0" r="14" fill="#D9A441" opacity="0.25">
                  <animate attributeName="r" values="8;18;8" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="5" fill="#FFE29A" stroke="#001F52" strokeWidth="2" />
                {/* Ka'bah Cube Icon */}
                <rect x="-4" y="-4" width="8" height="8" fill="#1A1813" stroke="#D9A441" strokeWidth="1" />
                <text x="0" y="-12" textAnchor="middle" fill="#FFE29A" fontSize="9" fontWeight="bold">
                  Ka'bah (Makkah)
                </text>
              </g>

              {/* Marker: Baros, Banten (420, 165) */}
              <g transform="translate(420, 165)">
                <circle cx="0" cy="0" r="12" fill="#168BFF" opacity="0.3">
                  <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="4.5" fill="#168BFF" stroke="#F5F1E6" strokeWidth="1.5" />
                <text x="0" y="16" textAnchor="middle" fill="#F5F1E6" fontSize="9" fontWeight="bold">
                  Baros, Banten
                </text>
              </g>

              {/* Route Trajectory Bearing Tag */}
              <g transform="translate(290, 105)">
                <rect x="-38" y="-10" width="76" height="20" rx="10" fill="#03152F" stroke="#D9A441" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#FFE29A" fontSize="9" fontWeight="bold">
                  294.8° NW • 8.347 km
                </text>
              </g>
            </svg>
          </div>
        )}

        {activeView === 'compass' && (
          <div className="flex flex-col items-center justify-center py-2">
            {/* Visual Compass Dial */}
            <div className="relative w-44 h-44 rounded-full border-2 border-[#D9A441]/50 bg-[#03152F] flex items-center justify-center shadow-inner">
              {/* Compass Cardinal Marks */}
              <span className="absolute top-1.5 text-xs font-bold text-[#EF4444]">N</span>
              <span className="absolute right-2 text-[10px] font-bold text-[#8CA3C7]">E</span>
              <span className="absolute bottom-1.5 text-[10px] font-bold text-[#8CA3C7]">S</span>
              <span className="absolute left-2 text-[10px] font-bold text-[#8CA3C7]">W</span>

              {/* Degree Ticks */}
              <div className="absolute inset-2 rounded-full border border-dashed border-[#0D3169] pointer-events-none" />

              {/* Ka'bah Direction Pointer Indicator (294.8°) */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${compassHeading}deg)` }}
              >
                {/* Needle */}
                <div className="w-1.5 h-20 bg-gradient-to-t from-transparent via-[#168BFF] to-[#D9A441] rounded-full relative">
                  {/* Ka'bah Icon at tip */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-md bg-[#001F52] border border-[#FFE29A] flex items-center justify-center shadow-md">
                    <span className="text-[10px]">🕋</span>
                  </div>
                </div>
              </div>

              {/* Center Pivot */}
              <div className="w-6 h-6 rounded-full bg-[#FFE29A] border-2 border-[#001F52] shadow flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-[#0647A5]" />
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-base font-extrabold text-[#FFE29A] tracking-wider">
                {qiblaBearing}° NW
              </span>
              <p className="text-[11px] text-[#8CA3C7]">
                Arah tepat menghadap Ka'bah dari Baros, Serang, Banten
              </p>
            </div>
          </div>
        )}

        {activeView === 'mini' && (
          <div className="w-full flex flex-col items-center justify-center py-2 text-center">
            {/* Mini Map Baros */}
            <div className="w-full max-w-sm p-4 rounded-xl bg-[#03152F]/90 border border-[#0D3169]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#0D3169]">
                <div className="flex items-center gap-1.5 text-xs text-[#FFE29A] font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Kec. Baros, Kab. Serang, Banten</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0647A5] text-[#F5F1E6]">
                  {gpsAccuracy}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left text-xs text-[#8CA3C7]">
                <div className="p-2 rounded-lg bg-[#001F52]">
                  <p className="text-[10px] text-[#8CA3C7]">Koordinat Baros</p>
                  <p className="font-mono text-[#F5F1E6] text-xs">6.216° S, 106.09° E</p>
                </div>
                <div className="p-2 rounded-lg bg-[#001F52]">
                  <p className="text-[10px] text-[#8CA3C7]">Sudut Azimuth</p>
                  <p className="font-mono text-[#FFE29A] text-xs font-bold">294.8° (Barat Laut)</p>
                </div>
                <div className="p-2 rounded-lg bg-[#001F52]">
                  <p className="text-[10px] text-[#8CA3C7]">Jarak Udara</p>
                  <p className="font-mono text-[#F5F1E6] text-xs">8.347 kilometer</p>
                </div>
                <div className="p-2 rounded-lg bg-[#001F52]">
                  <p className="text-[10px] text-[#8CA3C7]">Presisi Sensor</p>
                  <p className="font-mono text-[#10B981] text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Akurat
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-[#0D3169]/80 light:border-[#E5DFD5] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-[#8CA3C7] light:text-[#64748B]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{gpsAccuracy} • Sensor Kompas Aktif</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCalibrate}
            disabled={isCalibrating}
            aria-label="Kalibrasi Sensor Kompas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001F52] hover:bg-[#051D42] border border-[#0D3169] text-xs text-[#FFE29A] font-medium transition cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
            <span>{isCalibrating ? 'Kalibrasi...' : 'Kalibrasi'}</span>
          </button>

          {onOpenCompassModal && (
            <button
              onClick={onOpenCompassModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0647A5] hover:bg-[#168BFF] text-xs font-semibold text-[#F5F1E6] transition cursor-pointer border border-[#168BFF]/40 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-[#FFE29A]" />
              <span>Lihat Kompas Penuh</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
