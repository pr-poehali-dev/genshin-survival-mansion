import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { GameState, EndingType } from './types';

interface EndingScreenProps {
  gameState: GameState;
  formatTime: (seconds: number) => string;
  onRestart: () => void;
}

const EndingScreen = ({ gameState, formatTime, onRestart }: EndingScreenProps) => {
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

  if (!gameState.ending) return null;

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
              onClick={onRestart}
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
};

export default EndingScreen;
