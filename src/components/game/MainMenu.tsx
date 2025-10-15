import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { GameState, AntagonistData, Difficulty } from './types';

interface MainMenuProps {
  gameState: GameState;
  antagonists: AntagonistData[];
  rules: string[];
  onStartGame: (difficulty: Difficulty) => void;
  onToggleSound: () => void;
}

const MainMenu = ({ gameState, antagonists, rules, onStartGame, onToggleSound }: MainMenuProps) => {
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
                onClick={() => onStartGame('easy')}
                variant="outline"
                className="border-green-500/50 text-gray-300 hover:bg-green-500/10 h-24 flex flex-col gap-2"
              >
                <span className="text-lg font-bold">🌱 Лёгкий</span>
                <span className="text-xs text-gray-500">Меньше урона, больше времени</span>
              </Button>
              <Button 
                onClick={() => onStartGame('normal')}
                className="bg-[#8B0000] hover:bg-[#A00000] text-white h-24 flex flex-col gap-2 pulse-glow"
              >
                <span className="text-lg font-bold">⚔️ Нормальный</span>
                <span className="text-xs">Сбалансированное выживание</span>
              </Button>
              <Button 
                onClick={() => onStartGame('nightmare')}
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
            onClick={onToggleSound}
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
};

export default MainMenu;
