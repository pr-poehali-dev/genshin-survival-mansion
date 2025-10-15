import { useState, useEffect } from 'react';
import { PlayerStats, EndingType } from '@/components/game/types';

export const usePlayerStats = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalGames: 0,
    totalTime: 0,
    bestSurvivalTime: 0,
    itemsCollected: 0,
    rulesViolated: 0,
    antagonistsEncountered: 0,
    endings: {
      insanity: 0,
      caught: 0,
      exhaustion: 0,
      cursed: 0,
      sacrifice: 0
    },
    favoriteLocation: 'Коридоры'
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('mansionStats');
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mansionStats', JSON.stringify(playerStats));
  }, [playerStats]);

  const updateStatsAfterGame = (timeElapsed: number, inventoryLength: number, rulesViolated: number, ending: EndingType) => {
    setPlayerStats(prev => ({
      ...prev,
      totalGames: prev.totalGames + 1,
      totalTime: prev.totalTime + timeElapsed,
      bestSurvivalTime: Math.max(prev.bestSurvivalTime, timeElapsed),
      itemsCollected: prev.itemsCollected + inventoryLength,
      rulesViolated: prev.rulesViolated + rulesViolated,
      endings: {
        ...prev.endings,
        [ending]: prev.endings[ending] + 1
      }
    }));
  };

  const resetStats = () => {
    setPlayerStats({
      totalGames: 0,
      totalTime: 0,
      bestSurvivalTime: 0,
      itemsCollected: 0,
      rulesViolated: 0,
      antagonistsEncountered: 0,
      endings: {
        insanity: 0,
        caught: 0,
        exhaustion: 0,
        cursed: 0,
        sacrifice: 0
      },
      favoriteLocation: 'Коридоры'
    });
  };

  return {
    playerStats,
    updateStatsAfterGame,
    resetStats
  };
};
