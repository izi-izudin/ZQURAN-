import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserSettings } from '../types/quran';
import { getStoredSettings, saveStoredSettings, DEFAULT_SETTINGS } from '../services/storageService';

interface SettingsContextValue {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  markSurahCompleted: (surahId: number) => void;
  resetSettings: () => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => getStoredSettings());

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Sync theme with document element classes and data attribute
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  }, [settings.theme]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const markSurahCompleted = (surahId: number) => {
    setSettings((prev) => {
      const already = prev.readSurahs.includes(surahId);
      const updated = already ? prev.readSurahs : [...prev.readSurahs, surahId];
      return { ...prev, readSurahs: updated };
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        markSurahCompleted,
        resetSettings,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
