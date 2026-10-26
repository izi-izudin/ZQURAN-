/**
 * SINGLE SOURCE OF TRUTH CONFIGURATION
 * Edit bagian ini jika ingin mengubah identitas dasar aplikasi.
 */
export const APP_CONFIG = {
  appName: "ZQuran",
  primaryColor: "#0647A5",
};

/**
 * Konfigurasi Visual, Branding, dan Design Tokens
 * Dihasilkan secara konsisten & otomatis berdasarkan APP_CONFIG.
 */
export const BRANDING = {
  name: APP_CONFIG.appName,
  tagline: "Membaca, Memahami, dan Mendekatkan Diri kepada Al-Qur'an",
  description: "Aplikasi Al-Qur'an Digital modern, tenang, dan elegan dengan audio qari, terjemahan, tafsir Kemenag, auto-scroll tilawah, dan pencarian global.",
  logoUrl: "/assets/aistudio/ezgif-88b596edb932c106_ad7daa48.png",
  version: "1.0.0",
  
  // Design Palette ZQuran (Solid colors, no gradient)
  colors: {
    background: "#03152F", // Navy sangat gelap
    primary: APP_CONFIG.primaryColor, // Royal / Deep Blue (#0647A5)
    accent: "#168BFF", // Electric Blue
    darkAccent: "#001F52", // Midnight Blue
    gold: "#D9A441", // Metallic Gold
    goldLight: "#FFE29A", // Champagne Gold
    pearl: "#F5F1E6", // Pearl White
    
    // Status & Utility Colors
    surface: "#051D42", // Elevated Navy Surface
    surfaceHover: "#082859",
    border: "#0D3169",
    borderGold: "#5A441B",
    muted: "#8CA3C7",
    success: "#10B981",
    error: "#EF4444",
  },
  
  // Font styles
  typography: {
    arabicFonts: [
      { id: "amiri", name: "Amiri (Standar Mushaf)", className: "font-arabic" },
      { id: "scheherazade", name: "Scheherazade New (Naskh Tradisional)", className: "font-arabic-scheherazade" },
    ],
  },
};

/**
 * Daftar Resmi Qari Tersedia di equran.id API v2
 */
export const QARI_LIST = [
  { id: "01", name: "Abdullah Al-Juhany", title: "Imam Masjidil Haram" },
  { id: "02", name: "Abdul-Muhsin Al-Qasim", title: "Imam Masjid Nabawi" },
  { id: "03", name: "Abdurrahman as-Sudais", title: "Imam Besar Masjidil Haram" },
  { id: "04", name: "Ibrahim Al-Dossari", title: "Qari Internasional" },
  { id: "05", name: "Misyari Rasyid Al-Afasi", title: "Qari Terkenal Kuwait" },
  { id: "06", name: "Yasser Al-Dosari", title: "Imam Masjidil Haram" },
] as const;

export type QariId = typeof QARI_LIST[number]["id"];
