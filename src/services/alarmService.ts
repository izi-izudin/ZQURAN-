/**
 * ZQuran Alarm & Prayer Reminder Service
 * Persists user alarms in IndexedDB USER_ALARMS and checks triggers.
 */

import { getAllFromStore, putToStore, deleteFromStore, STORES } from './dbService';
import type { PrayerAudioType } from './prayerAudioService';

export interface UserAlarm {
  id: string;
  name: string;
  time: string; // "HH:mm"
  days: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  isEnabled: boolean;
  volume: number; // 0.1 to 1.0
  sound: PrayerAudioType;
  vibration: boolean;
  linkedPrayer?: 'imsak' | 'subuh' | 'terbit' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  offsetMinutes?: number; // e.g., -10 for 10 minutes before prayer
  createdAt: string;
}

export const DEFAULT_ALARMS: UserAlarm[] = [
  {
    id: 'alarm_subuh_default',
    name: 'Pengingat Sholat Subuh',
    time: '04:12',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
    volume: 0.9,
    sound: 'subuh',
    vibration: true,
    linkedPrayer: 'subuh',
    offsetMinutes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alarm_maghrib_default',
    name: 'Pengingat Sholat Maghrib',
    time: '17:52',
    days: [0, 1, 2, 3, 4, 5, 6],
    isEnabled: true,
    volume: 0.9,
    sound: 'standardAdzan',
    vibration: true,
    linkedPrayer: 'maghrib',
    offsetMinutes: 0,
    createdAt: new Date().toISOString(),
  },
];

export async function getUserAlarms(): Promise<UserAlarm[]> {
  try {
    const list = await getAllFromStore<UserAlarm>(STORES.USER_ALARMS);
    if (!list || list.length === 0) {
      // Seed default alarms
      for (const a of DEFAULT_ALARMS) {
        await putToStore(STORES.USER_ALARMS, a);
      }
      return DEFAULT_ALARMS;
    }
    return list;
  } catch (e) {
    console.warn('Gagal membaca alarm dari IndexedDB:', e);
    return DEFAULT_ALARMS;
  }
}

export async function saveAlarm(alarm: UserAlarm): Promise<void> {
  await putToStore(STORES.USER_ALARMS, alarm);
}

export async function deleteAlarm(id: string): Promise<void> {
  await deleteFromStore(STORES.USER_ALARMS, id);
}

export async function toggleAlarmState(id: string, isEnabled: boolean): Promise<void> {
  const alarms = await getUserAlarms();
  const target = alarms.find((a) => a.id === id);
  if (target) {
    target.isEnabled = isEnabled;
    await putToStore(STORES.USER_ALARMS, target);
  }
}

/**
 * Trigger device vibration if supported
 */
export function triggerVibration(pattern: number[] = [300, 150, 300]): boolean {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}
