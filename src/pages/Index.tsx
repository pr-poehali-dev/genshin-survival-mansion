import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

type Location = 'menu' | 'corridor' | 'basement' | 'library' | 'attic' | 'bedroom' | 'kitchen' | 'ending';
type Antagonist = 'dottore' | 'tartaglia' | 'venti' | 'scaramouche' | 'sandrone';
type EndingType = 'insanity' | 'caught' | 'exhaustion' | 'cursed' | 'sacrifice';
type Difficulty = 'easy' | 'normal' | 'nightmare';

interface GameEvent {
  message: string;
  type: 'danger' | 'warning' | 'info' | 'help';
  antagonist?: Antagonist;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface GameState {
  currentLocation: Location;
  health: number;
  sanity: number;
  inventory: string[];
  rulesViolated: number;
  discoveredClues: number;
  antagonistActivity: { [key in Antagonist]: boolean };
  timeElapsed: number;
  currentEvent: GameEvent | null;
  ending: EndingType | null;
  isHiding: boolean;
  difficulty: Difficulty;
  achievements: Achievement[];
  soundEnabled: boolean;
}

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

  const playSound = (soundType: 'footsteps' | 'heartbeat' | 'whisper' | 'door' | 'scream') => {
    if (!gameState.soundEnabled) return;
    console.log(`🔊 Звук: ${soundType}`);
  };

  const locations = [
    { id: 'corridor', name: 'Коридоры', icon: 'Footprints', danger: 2, description: 'Тускло освещенные проходы, где слышны шаги' },
    { id: 'basement', name: 'Подвал', icon: 'Skull', danger: 5, description: 'Самое опасное место в особняке' },
    { id: 'library', name: 'Библиотека', icon: 'BookOpen', danger: 1, description: 'Древние знания и подсказки' },
    { id: 'attic', name: 'Чердак', icon: 'Package', danger: 3, description: 'Секретные предметы скрыты здесь' },
    { id: 'bedroom', name: 'Спальни', icon: 'Bed', danger: 2, description: 'Временное укрытие от опасности' },
    { id: 'kitchen', name: 'Кухня', icon: 'UtensilsCrossed', danger: 2, description: 'Источник ресурсов для выживания' }
  ];

  const antagonists = [
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
        currentLocation: locationId as Location,
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
        currentLocation: locationId as Location,
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

  const getEnding = (endingType: EndingType) => {
    const endings = {
      insanity: {
        title: 'БЕЗУМИЕ',
        description: 'Ваш разум не выдержал ужасов особняка. Теперь вы один из его призраков, обречённых вечно бродить по коридорам.',
        icon: 'Brain'
      },
      caught: {
        title: 'ПОЙМАНЫ',
        description: 'Антагонисты настигли вас. Ваша судьба стала частью мрачной коллекции этого особняка.',
        icon: 'Skull'
      },
      exhaustion: {
        title: 'ИСТОЩЕНИЕ',
        description: 'Время вышло. Силы покинули вас в самый критический момент. Особняк поглотил ещё одну душу.',
        icon: 'Timer'
      },
      cursed: {
        title: 'ПРОКЛЯТИЕ',
        description: 'Вы нарушили слишком много правил. Проклятие особняка отныне следует за вами вечно.',
        icon: 'Ghost'
      },
      sacrifice: {
        title: 'ЖЕРТВА',
        description: 'Вы узнали слишком много. Знания о тайнах особняка требуют цену — вашу душу.',
        icon: 'BookOpen'
      }
    };
    return endings[endingType];
  };

  if (gameState.currentLocation === 'ending' && gameState.ending) {
    const ending = getEnding(gameState.ending);
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#1A0A0F] to-[#0A0A0F] flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <Card className="bg-[#1C1C1C]/95 border-[#8B0000]/50 backdrop-blur">
            <CardContent className="pt-12 pb-12 text-center">
              <Icon name={ending.icon} size={80} className="text-[#8B0000] mx-auto mb-6 flicker" />
              <h1 className="text-5xl font-bold text-[#8B0000] mb-6">{ending.title}</h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">{ending.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="bg-black/40 p-4 rounded border border-[#8B0000]/20">
                  <div className="text-2xl font-bold text-[#8B0000]">{formatTime(gameState.timeElapsed)}</div>
                  <div className="text-sm text-gray-500">Время выжило</div>
                </div>
                <div className="bg-black/40 p-4 rounded border border-[#8B0000]/20">
                  <div className="text-2xl font-bold text-[#8B0000]">{gameState.discoveredClues}</div>
                  <div className="text-sm text-gray-500">Улик найдено</div>
                </div>
                <div className="bg-black/40 p-4 rounded border border-[#8B0000]/20">
                  <div className="text-2xl font-bold text-[#8B0000]">{gameState.rulesViolated}</div>
                  <div className="text-sm text-gray-500">Правил нарушено</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#8B0000] mb-3">Достижения</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameState.achievements.filter(a => a.unlocked).map(achievement => (
                    <Badge key={achievement.id} className="bg-[#8B0000]/20 border-[#8B0000] text-gray-300">
                      ✅ {achievement.name}
                    </Badge>
                  ))}
                  {gameState.achievements.filter(a => a.unlocked).length === 0 && (
                    <div className="text-gray-500 text-sm">Достижения не получены</div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => setGameState({ ...gameState, currentLocation: 'menu', ending: null })}
                size="lg"
                className="bg-[#8B0000] hover:bg-[#A00000] text-white text-xl px-12 py-6"
              >
                Начать заново
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.currentLocation === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#1A0A0F] to-[#0A0A0F] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 flicker">
            <h1 className="text-6xl md:text-7xl font-bold text-[#8B0000] mb-4 tracking-wider">
              ОСОБНЯК ТЕНЕЙ
            </h1>
            <p className="text-xl text-gray-400 font-light">Выживание невозможно. Побег невозможен.</p>
          </div>

          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-[#8B0000] flex items-center gap-2">
                <Icon name="AlertTriangle" size={24} />
                Правила выживания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300 text-sm p-2 bg-black/30 rounded border border-[#8B0000]/20">
                    {rule}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-[#8B0000] flex items-center gap-2">
                <Icon name="Skull" size={24} />
                Антагонисты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {antagonists.map((antagonist) => (
                  <div key={antagonist.id} className="text-center p-3 bg-black/40 rounded border border-[#8B0000]/20 hover:border-[#8B0000]/50 transition-all pulse-glow">
                    <Icon name={antagonist.icon} className={`${antagonist.color} mx-auto mb-2`} size={32} />
                    <div className="text-sm text-gray-300 font-semibold">{antagonist.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{antagonist.threat}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-[#8B0000] flex items-center gap-2">
                <Icon name="Target" size={24} />
                Выберите сложность
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => startGame('easy')}
                  variant="outline"
                  className="border-green-500/50 text-gray-300 hover:bg-green-500/10 h-24 flex flex-col gap-2"
                >
                  <span className="text-lg font-bold">🌱 Лёгкий</span>
                  <span className="text-xs text-gray-500">Меньше урона, больше времени</span>
                </Button>
                <Button 
                  onClick={() => startGame('normal')}
                  className="bg-[#8B0000] hover:bg-[#A00000] text-white h-24 flex flex-col gap-2 pulse-glow"
                >
                  <span className="text-lg font-bold">⚔️ Нормальный</span>
                  <span className="text-xs">Сбалансированное выживание</span>
                </Button>
                <Button 
                  onClick={() => startGame('nightmare')}
                  variant="outline"
                  className="border-red-500/50 text-gray-300 hover:bg-red-500/10 h-24 flex flex-col gap-2"
                >
                  <span className="text-lg font-bold">🔥 Кошмар</span>
                  <span className="text-xs text-gray-500">Двойной урон, максимальная опасность</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-[#8B0000] flex items-center gap-2">
                <Icon name="Trophy" size={24} />
                Достижения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameState.achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`flex items-center justify-between p-3 rounded border ${
                      achievement.unlocked 
                        ? 'bg-[#8B0000]/20 border-[#8B0000]/50' 
                        : 'bg-black/20 border-[#8B0000]/10'
                    }`}
                  >
                    <div>
                      <div className={`font-semibold ${
                        achievement.unlocked ? 'text-[#8B0000]' : 'text-gray-500'
                      }`}>
                        {achievement.unlocked ? '✅' : '🔒'} {achievement.name}
                      </div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => setGameState({ ...gameState, soundEnabled: !gameState.soundEnabled })}
              className="border-[#8B0000]/50 text-gray-300"
            >
              <Icon name={gameState.soundEnabled ? 'Volume2' : 'VolumeX'} size={16} className="mr-2" />
              {gameState.soundEnabled ? 'Звук вкл.' : 'Звук выкл.'}
            </Button>
          </div>

          <Alert className="mt-6 bg-[#8B0000]/10 border-[#8B0000]/50">
            <Icon name="Info" size={16} />
            <AlertDescription className="text-gray-400">
              В этой игре нет хороших концовок. Каждое решение приближает вас к одному из мрачных финалов.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#1A0A0F] to-[#0A0A0F] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#8B0000] flicker">ОСОБНЯК ТЕНЕЙ</h1>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <div className="text-2xl font-bold text-[#8B0000] font-mono">{formatTime(gameState.timeElapsed)}</div>
              <div className="text-xs text-gray-500">Время в особняке</div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setGameState({ ...gameState, currentLocation: 'menu' })}
              className="border-[#8B0000]/50 text-gray-300"
            >
              <Icon name="DoorOpen" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>

        {gameState.currentEvent && (
          <Alert className={`mb-6 ${
            gameState.currentEvent.type === 'danger' ? 'bg-[#8B0000]/20 border-[#8B0000]' :
            gameState.currentEvent.type === 'warning' ? 'bg-[#A0522D]/20 border-[#A0522D]' :
            'bg-[#2D1B1F]/20 border-[#2D1B1F]'
          } animate-pulse`}>
            <Icon name={gameState.currentEvent.type === 'danger' ? 'AlertTriangle' : 'Info'} size={16} />
            <AlertDescription className="text-gray-200 font-semibold">
              {gameState.currentEvent.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B0000] flex items-center gap-2">
                <Icon name="Heart" size={20} />
                Здоровье
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={gameState.health} className="h-3" />
              <div className="text-right text-sm text-gray-400 mt-1">{gameState.health}%</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B0000] flex items-center gap-2">
                <Icon name="Brain" size={20} />
                Рассудок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={gameState.sanity} className="h-3" />
              <div className="text-right text-sm text-gray-400 mt-1">{gameState.sanity}%</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B0000] flex items-center gap-2">
                <Icon name="Package" size={20} />
                Инвентарь ({gameState.inventory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {gameState.inventory.slice(0, 4).map((item, index) => (
                  <Badge key={index} variant="outline" className="border-[#8B0000]/30 text-gray-300">
                    {item}
                  </Badge>
                ))}
                {gameState.inventory.length > 4 && (
                  <Badge variant="outline" className="border-[#8B0000]/30 text-gray-400">
                    +{gameState.inventory.length - 4}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#8B0000] mb-4">Локации особняка</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((location) => (
                <Card 
                  key={location.id}
                  className={`bg-[#1C1C1C]/90 border-[#8B0000]/30 cursor-pointer hover:border-[#8B0000]/70 transition-all ${
                    gameState.currentLocation === location.id ? 'ring-2 ring-[#8B0000]' : ''
                  }`}
                  onClick={() => visitLocation(location.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-300 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon name={location.icon} size={20} />
                        {location.name}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: location.danger }).map((_, i) => (
                          <Icon key={i} name="Flame" size={12} className="text-[#8B0000]" />
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{location.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30 mt-4">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B0000]">Действия</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button 
                  onClick={findItem}
                  className="bg-[#2D1B1F] hover:bg-[#3D2B2F] text-gray-300 flex-1"
                  disabled={gameState.isHiding}
                >
                  <Icon name="Search" size={16} className="mr-2" />
                  Исследовать
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#8B0000]/50 text-gray-300 flex-1"
                  disabled={gameState.sanity < 20 || gameState.isHiding}
                  onClick={hideAction}
                >
                  <Icon name="EyeOff" size={16} className="mr-2" />
                  {gameState.isHiding ? 'Прячетесь...' : 'Спрятаться'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#8B0000] mb-4">Активность антагонистов</h2>
            <div className="space-y-3">
              {antagonists.map((antagonist) => (
                <Card key={antagonist.id} className="bg-[#1C1C1C]/90 border-[#8B0000]/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon name={antagonist.icon} className={antagonist.color} size={24} />
                        <div>
                          <div className="font-semibold text-gray-300">{antagonist.name}</div>
                          <div className="text-xs text-gray-500">{antagonist.threat}</div>
                        </div>
                      </div>
                      <Badge 
                        variant={gameState.antagonistActivity[antagonist.id as Antagonist] ? 'destructive' : 'outline'}
                        className={gameState.antagonistActivity[antagonist.id as Antagonist] ? 'pulse-glow' : ''}
                      >
                        {gameState.antagonistActivity[antagonist.id as Antagonist] ? 'Активен' : 'Спокоен'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#1C1C1C]/90 border-[#8B0000]/30 mt-4">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B0000]">Статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Нарушено правил:</span>
                    <span className="text-[#8B0000] font-semibold">{gameState.rulesViolated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Найдено улик:</span>
                    <span className="text-gray-300 font-semibold">{gameState.discoveredClues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Предметов в инвентаре:</span>
                    <span className="text-gray-300 font-semibold">{gameState.inventory.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;