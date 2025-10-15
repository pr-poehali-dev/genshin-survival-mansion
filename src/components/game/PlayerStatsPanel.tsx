import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { PlayerStats, EndingType } from './types';

interface PlayerStatsPanelProps {
  stats: PlayerStats;
  formatTime: (seconds: number) => string;
  onClose: () => void;
  onResetStats: () => void;
}

const PlayerStatsPanel = ({ stats, formatTime, onClose, onResetStats }: PlayerStatsPanelProps) => {
  const getEndingName = (endingType: EndingType) => {
    const names = {
      insanity: '🧠 Безумие',
      caught: '💀 Пойманы',
      exhaustion: '⏱️ Истощение',
      cursed: '👻 Проклятие',
      sacrifice: '📖 Жертва'
    };
    return names[endingType];
  };

  const getTotalEndings = () => {
    return Object.values(stats.endings).reduce((sum, count) => sum + count, 0);
  };

  const getMostCommonEnding = (): EndingType | null => {
    const entries = Object.entries(stats.endings) as [EndingType, number][];
    if (entries.length === 0) return null;
    const maxEntry = entries.reduce((max, entry) => entry[1] > max[1] ? entry : max);
    return maxEntry[1] > 0 ? maxEntry[0] : null;
  };

  const getAverageSurvivalTime = () => {
    return stats.totalGames > 0 ? Math.floor(stats.totalTime / stats.totalGames) : 0;
  };

  const mostCommonEnding = getMostCommonEnding();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-[#1C1C1C]/95 border-[#8B0000]/50 backdrop-blur max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl text-[#8B0000] flex items-center gap-2">
              <Icon name="TrendingUp" size={32} />
              Статистика игрока
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-[#8B0000]"
            >
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-[#8B0000]/20">
              <CardContent className="pt-6 text-center">
                <Icon name="Gamepad2" size={40} className="text-[#8B0000] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#8B0000]">{stats.totalGames}</div>
                <div className="text-sm text-gray-400">Всего игр</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-[#8B0000]/20">
              <CardContent className="pt-6 text-center">
                <Icon name="Clock" size={40} className="text-[#8B0000] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#8B0000]">{formatTime(stats.totalTime)}</div>
                <div className="text-sm text-gray-400">Общее время</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-[#8B0000]/20">
              <CardContent className="pt-6 text-center">
                <Icon name="Trophy" size={40} className="text-[#8B0000] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#8B0000]">{formatTime(stats.bestSurvivalTime)}</div>
                <div className="text-sm text-gray-400">Лучшее время</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Общая статистика
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/30 rounded border border-[#8B0000]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Предметов собрано</span>
                  <Badge variant="outline" className="border-[#8B0000]/30 text-[#8B0000]">
                    {stats.itemsCollected}
                  </Badge>
                </div>
                <Progress value={Math.min(100, (stats.itemsCollected / 50) * 100)} className="h-2" />
              </div>

              <div className="p-4 bg-black/30 rounded border border-[#8B0000]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Правил нарушено</span>
                  <Badge variant="outline" className="border-[#8B0000]/30 text-[#8B0000]">
                    {stats.rulesViolated}
                  </Badge>
                </div>
                <Progress value={Math.min(100, (stats.rulesViolated / 30) * 100)} className="h-2" />
              </div>

              <div className="p-4 bg-black/30 rounded border border-[#8B0000]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Антагонистов встречено</span>
                  <Badge variant="outline" className="border-[#8B0000]/30 text-[#8B0000]">
                    {stats.antagonistsEncountered}
                  </Badge>
                </div>
                <Progress value={Math.min(100, (stats.antagonistsEncountered / 20) * 100)} className="h-2" />
              </div>

              <div className="p-4 bg-black/30 rounded border border-[#8B0000]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Среднее время выживания</span>
                  <Badge variant="outline" className="border-[#8B0000]/30 text-[#8B0000]">
                    {formatTime(getAverageSurvivalTime())}
                  </Badge>
                </div>
                <Progress value={Math.min(100, (getAverageSurvivalTime() / 300) * 100)} className="h-2" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
              <Icon name="Skull" size={20} />
              Концовки
            </h3>

            {mostCommonEnding && (
              <div className="p-4 bg-[#8B0000]/10 rounded border border-[#8B0000]/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Star" size={16} className="text-[#8B0000]" />
                  <span className="text-sm text-gray-400">Самая частая концовка</span>
                </div>
                <div className="text-lg font-semibold text-[#8B0000]">
                  {getEndingName(mostCommonEnding)}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {(Object.entries(stats.endings) as [EndingType, number][]).map(([endingType, count]) => (
                <div key={endingType} className="p-4 bg-black/30 rounded border border-[#8B0000]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">{getEndingName(endingType)}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[#8B0000]/30 text-[#8B0000]">
                        {count}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {getTotalEndings() > 0 ? Math.round((count / getTotalEndings()) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={getTotalEndings() > 0 ? (count / getTotalEndings()) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </div>

          {stats.favoriteLocation && (
            <div className="p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="MapPin" size={20} className="text-[#8B0000]" />
                <span className="text-gray-300">Любимая локация</span>
              </div>
              <div className="text-xl font-semibold text-[#8B0000]">{stats.favoriteLocation}</div>
            </div>
          )}

          <div className="pt-4 border-t border-[#8B0000]/20 flex gap-3">
            <Button
              onClick={onResetStats}
              variant="outline"
              className="flex-1 border-[#8B0000]/50 text-gray-300 hover:bg-[#8B0000]/10"
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Сбросить статистику
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-[#8B0000] hover:bg-[#A00000] text-white"
            >
              Закрыть
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStatsPanel;
