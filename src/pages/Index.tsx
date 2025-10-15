import { useState, useEffect } from 'react';
import MainMenu from '@/components/game/MainMenu';
import GameScreen from '@/components/game/GameScreen';
import EndingScreen from '@/components/game/EndingScreen';
import SettingsPanel from '@/components/game/SettingsPanel';
import PlayerStatsPanel from '@/components/game/PlayerStatsPanel';
import { GameState, Antagonist, Difficulty, GameEvent, LocationData, AntagonistData, PlayerStats, EndingType } from '@/components/game/types';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLocation: 'menu',
    health: 100,
    sanity: 100,
    inventory: [],
    rulesViolated: 0,
    discoveredClues: 0,
    antagonistActivity: {
      dottore: false,
      tartaglia: false,
      venti: false,
      scaramouche: false,
      sandrone: false
    },
    timeElapsed: 0,
    currentEvent: null,
    ending: null,
    isHiding: false,
    difficulty: 'normal',
    achievements: [
      { id: 'survivor', name: 'Выживший', description: 'Продержался 3 минуты', unlocked: false },
      { id: 'collector', name: 'Коллекционер', description: 'Найди 5 предметов', unlocked: false },
      { id: 'rulebreaker', name: 'Нарушитель', description: 'Нарушь 3 правила', unlocked: false },
      { id: 'explorer', name: 'Исследователь', description: 'Посети все локации', unlocked: false },
      { id: 'escaped', name: 'Спасённый', description: 'Встретил Муалани', unlocked: false },
    ],
    soundEnabled: true
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [settings, setSettings] = useState({
    musicVolume: 70,
    sfxVolume: 80,
    showHints: true,
    screenShake: true,
    autoSave: true
  });

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
    const savedSettings = localStorage.getItem('mansionSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mansionStats', JSON.stringify(playerStats));
  }, [playerStats]);

  useEffect(() => {
    localStorage.setItem('mansionSettings', JSON.stringify(settings));
  }, [settings]);

  const playSound = (soundType: 'footsteps' | 'heartbeat' | 'whisper' | 'door' | 'scream') => {
    if (!gameState.soundEnabled) return;
    console.log(`🔊 Звук: ${soundType}`);
  };

  const locations: LocationData[] = [
    { id: 'corridor', name: 'Коридоры', icon: 'Footprints', danger: 2, description: 'Тускло освещенные проходы, где слышны шаги' },
    { id: 'basement', name: 'Подвал', icon: 'Skull', danger: 5, description: 'Самое опасное место в особняке' },
    { id: 'library', name: 'Библиотека', icon: 'BookOpen', danger: 1, description: 'Древние знания и подсказки' },
    { id: 'attic', name: 'Чердак', icon: 'Package', danger: 3, description: 'Секретные предметы скрыты здесь' },
    { id: 'bedroom', name: 'Спальни', icon: 'Bed', danger: 2, description: 'Временное укрытие от опасности' },
    { id: 'kitchen', name: 'Кухня', icon: 'UtensilsCrossed', danger: 2, description: 'Источник ресурсов для выживания' }
  ];

  const antagonists: AntagonistData[] = [
    { id: 'dottore', name: 'Дотторе', threat: 'Эксперименты', icon: 'Syringe', color: 'text-blue-400' },
    { id: 'tartaglia', name: 'Тарталья', threat: 'Преследование', icon: 'Sword', color: 'text-cyan-400' },
    { id: 'venti', name: 'Венти', threat: 'Обман', icon: 'Wind', color: 'text-green-400' },
    { id: 'scaramouche', name: 'Скарамучча', threat: 'Гнев', icon: 'Zap', color: 'text-purple-400' },
    { id: 'sandrone', name: 'Сандроне', threat: 'Марионетки', icon: 'Bot', color: 'text-rose-400' }
  ];

  const rules = [
    '🕯️ Не оставайтесь в темноте дольше 30 секунд',
    '🔇 Не издавайте громких звуков в коридорах',
    '🚪 Всегда закрывайте двери за собой',
    '👁️ Не смотрите в глаза антагонистам',
    '📜 Не читайте вслух найденные записи',
    '🔦 Не тратьте батарею фонаря впустую'
  ];

  useEffect(() => {
    if (gameState.currentLocation === 'menu' || gameState.currentLocation === 'ending') return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeElapsed + 1;
        let newState = { ...prev, timeElapsed: newTime };

        if (newTime % 15 === 0 && Math.random() > 0.5) {
          newState = triggerRandomEvent(newState);
        }
        
        newState = checkAchievements(newState);

        if (newTime % 10 === 0) {
          const antagonistKeys = Object.keys(prev.antagonistActivity) as Antagonist[];
          const randomAntagonist = antagonistKeys[Math.floor(Math.random() * antagonistKeys.length)];
          newState.antagonistActivity[randomAntagonist] = Math.random() > 0.6;
        }

        return checkEnding(newState);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.currentLocation]);

  const triggerRandomEvent = (state: GameState): GameState => {
    const events: GameEvent[] = [
      { message: 'Вы слышите шаги за дверью...', type: 'warning' },
      { message: 'Свет начинает мерцать', type: 'danger' },
      { message: 'Тишина становится невыносимой', type: 'info' },
      { message: 'Дотторе близко. Вы чувствуете запах химикатов.', type: 'danger', antagonist: 'dottore' },
      { message: 'Тарталья охотится. Слышен звук оружия.', type: 'danger', antagonist: 'tartaglia' },
      { message: 'Венти насмехается где-то рядом', type: 'warning', antagonist: 'venti' },
      { message: 'Скарамучча в ярости. Воздух наэлектризован.', type: 'danger', antagonist: 'scaramouche' },
      { message: 'Марионетки Сандроне движутся по коридорам', type: 'danger', antagonist: 'sandrone' },
      { message: '🌊 Муалани появилась! Она принесла медикаменты и успокоила вас.', type: 'help' },
      { message: '✨ Барбара поёт громкую песню, привлекая внимание антагонистов!', type: 'danger' },
      { message: '🎭 Итер подшутил над вами, заперев дверь. Вы теряете время...', type: 'warning' },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    const difficultyMultiplier = state.difficulty === 'nightmare' ? 2 : state.difficulty === 'normal' ? 1 : 0.5;
    let sanityLoss = (randomEvent.type === 'danger' ? 10 : randomEvent.type === 'warning' ? 5 : 2) * difficultyMultiplier;
    
    if (randomEvent.type === 'help') {
      playSound('whisper');
      const newAchievements = state.achievements.map(a => 
        a.id === 'escaped' ? { ...a, unlocked: true } : a
      );
      return {
        ...state,
        health: Math.min(100, state.health + 20),
        sanity: Math.min(100, state.sanity + 15),
        currentEvent: randomEvent,
        achievements: newAchievements
      };
    }
    
    if (randomEvent.message.includes('Барбара')) {
      playSound('whisper');
      const antagonistKeys = Object.keys(state.antagonistActivity) as Antagonist[];
      const updatedActivity = { ...state.antagonistActivity };
      antagonistKeys.forEach(key => {
        if (Math.random() > 0.5) updatedActivity[key] = true;
      });
      return {
        ...state,
        sanity: Math.max(0, state.sanity - 15 * difficultyMultiplier),
        antagonistActivity: updatedActivity,
        currentEvent: randomEvent
      };
    }
    
    if (randomEvent.message.includes('Итер')) {
      playSound('door');
      return {
        ...state,
        sanity: Math.max(0, state.sanity - 10 * difficultyMultiplier),
        timeElapsed: state.timeElapsed + 10,
        currentEvent: randomEvent
      };
    }
    
    if (randomEvent.antagonist && state.antagonistActivity[randomEvent.antagonist]) {
      sanityLoss += 15 * difficultyMultiplier;
      if (Math.random() > 0.7 && !state.isHiding) {
        playSound('scream');
        return {
          ...state,
          health: Math.max(0, state.health - 20 * difficultyMultiplier),
          sanity: Math.max(0, state.sanity - sanityLoss),
          rulesViolated: state.rulesViolated + 1,
          currentEvent: { ...randomEvent, message: randomEvent.message + ' ВЫ ОБНАРУЖЕНЫ!' }
        };
      }
    }
    
    if (randomEvent.type === 'danger') playSound('heartbeat');
    if (randomEvent.type === 'warning') playSound('footsteps');

    return {
      ...state,
      sanity: Math.max(0, state.sanity - sanityLoss),
      currentEvent: randomEvent
    };
  };

  const checkEnding = (state: GameState): GameState => {
    if (state.ending) return state;

    if (state.health <= 0) {
      return { ...state, currentLocation: 'ending', ending: 'caught' };
    }
    if (state.sanity <= 0) {
      return { ...state, currentLocation: 'ending', ending: 'insanity' };
    }
    if (state.timeElapsed >= 300) {
      return { ...state, currentLocation: 'ending', ending: 'exhaustion' };
    }
    if (state.rulesViolated >= 5) {
      return { ...state, currentLocation: 'ending', ending: 'cursed' };
    }
    if (state.discoveredClues >= 10 && state.health < 30) {
      return { ...state, currentLocation: 'ending', ending: 'sacrifice' };
    }

    return state;
  };

  const checkAchievements = (state: GameState): GameState => {
    const newAchievements = state.achievements.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      if (achievement.id === 'survivor' && state.timeElapsed >= 180) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 'collector' && state.inventory.length >= 5) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 'rulebreaker' && state.rulesViolated >= 3) {
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });
    
    return { ...state, achievements: newAchievements };
  };

  const startGame = (difficulty: Difficulty = 'normal') => {
    setGameState({
      currentLocation: 'corridor',
      health: 100,
      sanity: 100,
      inventory: ['🔦 Фонарь'],
      rulesViolated: 0,
      discoveredClues: 0,
      antagonistActivity: {
        dottore: false,
        tartaglia: false,
        venti: false,
        scaramouche: false,
        sandrone: false
      },
      timeElapsed: 0,
      currentEvent: null,
      ending: null,
      isHiding: false,
      difficulty,
      achievements: gameState.achievements,
      soundEnabled: gameState.soundEnabled
    });
  };

  const visitLocation = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    const sanityLoss = location.danger * 5;
    const newSanity = Math.max(0, gameState.sanity - sanityLoss);

    const activeAntagonists = Object.entries(gameState.antagonistActivity)
      .filter(([_, active]) => active)
      .map(([id]) => id as Antagonist);

    if (activeAntagonists.length > 0 && Math.random() > 0.6) {
      const randomAntagonist = activeAntagonists[Math.floor(Math.random() * activeAntagonists.length)];
      setGameState({
        ...gameState,
        currentLocation: locationId as any,
        sanity: newSanity,
        health: Math.max(0, gameState.health - 15),
        rulesViolated: gameState.rulesViolated + 1,
        currentEvent: {
          message: `При входе вы столкнулись с ${antagonists.find(a => a.id === randomAntagonist)?.name}!`,
          type: 'danger',
          antagonist: randomAntagonist
        },
        isHiding: false
      });
    } else {
      setGameState({
        ...gameState,
        currentLocation: locationId as any,
        sanity: newSanity,
        currentEvent: null,
        isHiding: false
      });
    }
  };

  const findItem = () => {
    const items = ['🗝️ Старый ключ', '📖 Дневник', '🕯️ Свеча', '💊 Медикаменты', '🔮 Странный артефакт'];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    const isTrap = Math.random() > 0.7;
    
    if (isTrap) {
      setGameState({
        ...gameState,
        health: Math.max(0, gameState.health - 10),
        sanity: Math.max(0, gameState.sanity - 10),
        rulesViolated: gameState.rulesViolated + 1,
        currentEvent: {
          message: 'Это была ловушка! Вы привлекли внимание.',
          type: 'danger'
        }
      });
    } else {
      setGameState({
        ...gameState,
        inventory: [...gameState.inventory, randomItem],
        discoveredClues: gameState.discoveredClues + 1,
        health: randomItem === '💊 Медикаменты' ? Math.min(100, gameState.health + 15) : gameState.health,
        currentEvent: {
          message: `Найдено: ${randomItem}`,
          type: 'info'
        }
      });
    }
  };

  const hideAction = () => {
    setGameState({
      ...gameState,
      isHiding: true,
      sanity: Math.max(0, gameState.sanity - 5),
      currentEvent: {
        message: 'Вы прячетесь в темноте...',
        type: 'info'
      }
    });

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        isHiding: false,
        currentEvent: null
      }));
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    if (gameState.ending) {
      setPlayerStats(prev => ({
        ...prev,
        totalGames: prev.totalGames + 1,
        totalTime: prev.totalTime + gameState.timeElapsed,
        bestSurvivalTime: Math.max(prev.bestSurvivalTime, gameState.timeElapsed),
        itemsCollected: prev.itemsCollected + gameState.inventory.length,
        rulesViolated: prev.rulesViolated + gameState.rulesViolated,
        endings: {
          ...prev.endings,
          [gameState.ending]: prev.endings[gameState.ending] + 1
        }
      }));
    }
    setGameState({ ...gameState, currentLocation: 'menu', ending: null });
  };

  const handleExit = () => {
    setGameState({ ...gameState, currentLocation: 'menu' });
  };

  const handleToggleSound = () => {
    setGameState({ ...gameState, soundEnabled: !gameState.soundEnabled });
  };

  const handleResetStats = () => {
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

  if (gameState.currentLocation === 'ending') {
    return (
      <>
        <EndingScreen 
          gameState={gameState}
          formatTime={formatTime}
          onRestart={handleRestart}
        />
        {showSettings && (
          <SettingsPanel
            soundEnabled={gameState.soundEnabled}
            musicVolume={settings.musicVolume}
            sfxVolume={settings.sfxVolume}
            difficulty={gameState.difficulty}
            showHints={settings.showHints}
            screenShake={settings.screenShake}
            autoSave={settings.autoSave}
            onToggleSound={handleToggleSound}
            onMusicVolumeChange={(v) => setSettings({ ...settings, musicVolume: v })}
            onSfxVolumeChange={(v) => setSettings({ ...settings, sfxVolume: v })}
            onDifficultyChange={(d) => setGameState({ ...gameState, difficulty: d })}
            onToggleHints={() => setSettings({ ...settings, showHints: !settings.showHints })}
            onToggleScreenShake={() => setSettings({ ...settings, screenShake: !settings.screenShake })}
            onToggleAutoSave={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showStats && (
          <PlayerStatsPanel
            stats={playerStats}
            formatTime={formatTime}
            onClose={() => setShowStats(false)}
            onResetStats={handleResetStats}
          />
        )}
      </>
    );
  }

  if (gameState.currentLocation === 'menu') {
    return (
      <>
        <MainMenu 
          gameState={gameState}
          antagonists={antagonists}
          rules={rules}
          onStartGame={startGame}
          onToggleSound={handleToggleSound}
        />
        <div className="fixed bottom-4 right-4 flex gap-2 z-40">
          <button
            onClick={() => setShowStats(true)}
            className="p-3 bg-[#1C1C1C]/90 border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/20 transition-all"
            title="Статистика"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 bg-[#1C1C1C]/90 border border-[#8B0000]/30 rounded-lg hover:bg-[#8B0000]/20 transition-all"
            title="Настройки"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
        {showSettings && (
          <SettingsPanel
            soundEnabled={gameState.soundEnabled}
            musicVolume={settings.musicVolume}
            sfxVolume={settings.sfxVolume}
            difficulty={gameState.difficulty}
            showHints={settings.showHints}
            screenShake={settings.screenShake}
            autoSave={settings.autoSave}
            onToggleSound={handleToggleSound}
            onMusicVolumeChange={(v) => setSettings({ ...settings, musicVolume: v })}
            onSfxVolumeChange={(v) => setSettings({ ...settings, sfxVolume: v })}
            onDifficultyChange={(d) => setGameState({ ...gameState, difficulty: d })}
            onToggleHints={() => setSettings({ ...settings, showHints: !settings.showHints })}
            onToggleScreenShake={() => setSettings({ ...settings, screenShake: !settings.screenShake })}
            onToggleAutoSave={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showStats && (
          <PlayerStatsPanel
            stats={playerStats}
            formatTime={formatTime}
            onClose={() => setShowStats(false)}
            onResetStats={handleResetStats}
          />
        )}
      </>
    );
  }

  return (
    <>
      <GameScreen 
        gameState={gameState}
        locations={locations}
        antagonists={antagonists}
        formatTime={formatTime}
        onVisitLocation={visitLocation}
        onFindItem={findItem}
        onHide={hideAction}
        onExit={handleExit}
      />
      {showSettings && (
        <SettingsPanel
          soundEnabled={gameState.soundEnabled}
          musicVolume={settings.musicVolume}
          sfxVolume={settings.sfxVolume}
          difficulty={gameState.difficulty}
          showHints={settings.showHints}
          screenShake={settings.screenShake}
          autoSave={settings.autoSave}
          onToggleSound={handleToggleSound}
          onMusicVolumeChange={(v) => setSettings({ ...settings, musicVolume: v })}
          onSfxVolumeChange={(v) => setSettings({ ...settings, sfxVolume: v })}
          onDifficultyChange={(d) => setGameState({ ...gameState, difficulty: d })}
          onToggleHints={() => setSettings({ ...settings, showHints: !settings.showHints })}
          onToggleScreenShake={() => setSettings({ ...settings, screenShake: !settings.screenShake })}
          onToggleAutoSave={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showStats && (
        <PlayerStatsPanel
          stats={playerStats}
          formatTime={formatTime}
          onClose={() => setShowStats(false)}
          onResetStats={handleResetStats}
        />
      )}
    </>
  );
};

export default Index;