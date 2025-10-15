import { useState, useEffect } from 'react';
import { GameState, Antagonist, Difficulty, GameEvent, LocationData, AntagonistData } from '@/components/game/types';

interface UseGameLogicProps {
  locations: LocationData[];
  antagonists: AntagonistData[];
  soundEnabled: boolean;
}

export const useGameLogic = ({ locations, antagonists, soundEnabled }: UseGameLogicProps) => {
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

  const playSound = (soundType: 'footsteps' | 'heartbeat' | 'whisper' | 'door' | 'scream') => {
    if (!soundEnabled) return;
    console.log(`🔊 Звук: ${soundType}`);
  };

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

  const handleExit = () => {
    setGameState({ ...gameState, currentLocation: 'menu' });
  };

  const handleToggleSound = () => {
    setGameState({ ...gameState, soundEnabled: !gameState.soundEnabled });
  };

  return {
    gameState,
    setGameState,
    startGame,
    visitLocation,
    findItem,
    hideAction,
    handleExit,
    handleToggleSound
  };
};
