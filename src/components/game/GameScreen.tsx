import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { GameState, LocationData, AntagonistData, Antagonist } from './types';

interface GameScreenProps {
  gameState: GameState;
  locations: LocationData[];
  antagonists: AntagonistData[];
  formatTime: (seconds: number) => string;
  onVisitLocation: (locationId: string) => void;
  onFindItem: () => void;
  onHide: () => void;
  onExit: () => void;
}

const GameScreen = ({
  gameState,
  locations,
  antagonists,
  formatTime,
  onVisitLocation,
  onFindItem,
  onHide,
  onExit
}: GameScreenProps) => {
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
              onClick={onExit}
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
                  onClick={() => onVisitLocation(location.id)}
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
                  onClick={onFindItem}
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
                  onClick={onHide}
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

export default GameScreen;
