import { useState, useEffect } from 'react';

interface Settings {
  musicVolume: number;
  sfxVolume: number;
  showHints: boolean;
  screenShake: boolean;
  autoSave: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    musicVolume: 70,
    sfxVolume: 80,
    showHints: true,
    screenShake: true,
    autoSave: true
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('mansionSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mansionSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
    showSettings,
    setShowSettings,
    showStats,
    setShowStats
  };
};
