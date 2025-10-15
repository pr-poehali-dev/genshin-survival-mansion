import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

type Location = 'menu' | 'corridor' | 'basement' | 'library' | 'attic' | 'bedroom' | 'kitchen';
type Antagonist = 'dottore' | 'tartaglia' | 'venti' | 'scaramouche' | 'sandrone';

interface GameState {
  currentLocation: Location;
  health: number;
  sanity: number;
  inventory: string[];
  rulesViolated: number;
  discoveredClues: number;
  antagonistActivity: { [key in Antagonist]: boolean };
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
    }
  });

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

  const startGame = () => {
    setGameState({
      ...gameState,
      currentLocation: 'corridor',
      health: 100,
      sanity: 100,
      inventory: ['🔦 Фонарь'],
      rulesViolated: 0,
      discoveredClues: 0
    });
  };

  const visitLocation = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    const sanityLoss = location.danger * 5;
    const newSanity = Math.max(0, gameState.sanity - sanityLoss);

    setGameState({
      ...gameState,
      currentLocation: locationId as Location,
      sanity: newSanity
    });
  };

  const findItem = () => {
    const items = ['🗝️ Старый ключ', '📖 Дневник', '🕯️ Свеча', '💊 Медикаменты', '🔮 Странный артефакт'];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    
    setGameState({
      ...gameState,
      inventory: [...gameState.inventory, randomItem],
      discoveredClues: gameState.discoveredClues + 1
    });
  };

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

          <div className="text-center">
            <Button 
              onClick={startGame}
              size="lg"
              className="bg-[#8B0000] hover:bg-[#A00000] text-white text-xl px-12 py-6 pulse-glow"
            >
              Войти в особняк
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
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#8B0000] flicker">ОСОБНЯК ТЕНЕЙ</h1>
          <Button 
            variant="outline" 
            onClick={() => setGameState({ ...gameState, currentLocation: 'menu' })}
            className="border-[#8B0000]/50 text-gray-300"
          >
            <Icon name="DoorOpen" size={16} className="mr-2" />
            Выход
          </Button>
        </div>

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
                >
                  <Icon name="Search" size={16} className="mr-2" />
                  Исследовать
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#8B0000]/50 text-gray-300 flex-1"
                  disabled={gameState.sanity < 20}
                >
                  <Icon name="EyeOff" size={16} className="mr-2" />
                  Спрятаться
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
