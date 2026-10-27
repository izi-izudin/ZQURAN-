import React from 'react';

export interface TajwidRuleItem {
  id: string;
  name: string;
  color: string;
  badgeBg: string;
  description: string;
  examples: string;
}

export const TAJWID_RULES: TajwidRuleItem[] = [
  {
    id: 'madd',
    name: 'Madd (Panjang 4-6 Harakat)',
    color: '#F43F5E', // Rose Red
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    description: 'Hukum membaca panjang ketika terdapat tanda bendera/alis (ٓ) di atas huruf mad.',
    examples: 'السَّمَاۤءِ ، جَاۤءَ',
  },
  {
    id: 'ghunnah',
    name: 'Ghunnah (Dengung Sempurna)',
    color: '#10B981', // Emerald Green
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    description: 'Huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ) dibaca dengung 2 harakat.',
    examples: 'اِنَّ ، عَمَّ',
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah (Memantul)',
    color: '#38BDF8', // Sky Blue
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    description: 'Huruf Qalqalah (ق، ط، ب، ج، د) berharakat sukun/mati dipantulkan suaranya.',
    examples: 'الْفَلَقِ ، اَحَدٌ ، حَبْلٌ',
  },
  {
    id: 'iqlab',
    name: 'Iqlab & Ikhfa (Samar / Berubah)',
    color: '#F59E0B', // Amber
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    description: 'Nun sukun/tanwin bertemu Ba (ada tanda mim kecil ۭ) atau 15 huruf ikhfa.',
    examples: 'مِنْ بَعْدِ ، مِنْ شَرِّ',
  },
  {
    id: 'idgham',
    name: 'Idgham (Melebur)',
    color: '#EAB308', // Gold Yellow
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    description: 'Nun sukun atau tanwin melebur ke huruf Idgham (ي، ن، م، و، ل، ر).',
    examples: 'مَنْ يَّقُوْلُ ، مِنْ رَّبِّهِمْ',
  },
  {
    id: 'waqf',
    name: 'Tanda Waqaf (Berhenti / Lanjut)',
    color: '#FFE29A', // Champagne Gold
    badgeBg: 'rgba(255, 226, 154, 0.15)',
    description: 'Tanda petunjuk tempat berhenti atau terus membaca dalam mushaf (ۚ، ۗ، ۖ، ۘ، ۙ).',
    examples: 'ۚ ، ۗ ، ۖ ، ۘ ، ۙ',
  },
];

/**
 * Regex patterns for Tajwid identification
 */
const T_MADD = /([\u0600-\u06FF]*[\u0653\u06E1][\u0600-\u06FF]*)/; // character with Maddah
const T_GHUNNAH = /([نم]\u0651[\u064B-\u0652\u0670]?)/; // Nun/Meem with Shaddah
const T_QALQALAH = /([قطبجد]\u0652)/; // Qalqalah with sukun
const T_IQLAB = /([\u0600-\u06FF]*[\u06ED\u06E2][\u0600-\u06FF]*)/; // Small meem sign
const T_WAQF = /([\u06D6-\u06DC\u06DF-\u06E8])/; // Waqf symbols

/**
 * Tokenize a word into tajwid segments
 */
function parseWordTajwid(word: string): React.ReactNode[] {
  // Check for waqf marks at the end of word
  const waqfMatch = word.match(/([\u06D6-\u06DC\u06DF-\u06E8])$/);
  let mainWord = word;
  let waqfChar = '';

  if (waqfMatch) {
    waqfChar = waqfMatch[0];
    mainWord = word.slice(0, -waqfChar.length);
  }

  // Segment the word
  // Match tokens: Madd, Ghunnah, Qalqalah, Iqlab, or regular Arabic letters with their diacritics
  const regex = /([\u0600-\u06FF]*[\u0653][\u0600-\u06FF]*|[نم]\u0651[\u064B-\u0650\u0670]?|[قطبجد]\u0652|[\u0600-\u06FF]*[\u06ED\u06E2][\u0600-\u06FF]*|[^\s]+)/g;

  const matches = mainWord.match(regex);
  if (!matches) {
    return [
      <span key="w">{word}</span>
    ];
  }

  const nodes: React.ReactNode[] = [];

  matches.forEach((segment, i) => {
    // Madd
    if (segment.includes('\u0653')) {
      nodes.push(
        <span
          key={`madd-${i}`}
          style={{ color: '#F43F5E' }}
          title="Hukum Madd (Panjang 4-6 Harakat)"
        >
          {segment}
        </span>
      );
    }
    // Ghunnah: Nun or Meem with Shaddah
    else if (/[نم]\u0651/.test(segment)) {
      nodes.push(
        <span
          key={`ghunnah-${i}`}
          style={{ color: '#10B981' }}
          title="Hukum Ghunnah (Dengung)"
        >
          {segment}
        </span>
      );
    }
    // Qalqalah: Qaf, Taa, Baa, Jeem, Dal with Sukun
    else if (/[قطبجد]\u0652/.test(segment)) {
      nodes.push(
        <span
          key={`qalqalah-${i}`}
          style={{ color: '#38BDF8' }}
          title="Hukum Qalqalah (Memantul)"
        >
          {segment}
        </span>
      );
    }
    // Iqlab: with small meem diacritic
    else if (/[\u06ED\u06E2]/.test(segment)) {
      nodes.push(
        <span
          key={`iqlab-${i}`}
          style={{ color: '#F59E0B' }}
          title="Hukum Iqlab (Samar Meem)"
        >
          {segment}
        </span>
      );
    } else {
      nodes.push(<span key={`normal-${i}`}>{segment}</span>);
    }
  });

  if (waqfChar) {
    nodes.push(
      <span
        key="waqf"
        style={{ color: '#FFE29A', marginRight: '0.2em' }}
        title="Tanda Waqaf"
      >
        {waqfChar}
      </span>
    );
  }

  return nodes;
}

/**
 * Render complete Arabic text with or without Tajwid color coding
 */
export function renderTajwidText(text: string, enabled: boolean): React.ReactNode {
  if (!enabled) {
    return text;
  }

  const words = text.split(' ');

  return (
    <>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          {parseWordTajwid(word)}
          {index < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </>
  );
}
