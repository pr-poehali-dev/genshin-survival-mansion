import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Difficulty } from './types';

interface SettingsPanelProps {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  difficulty: Difficulty;
  showHints: boolean;
  screenShake: boolean;
  autoSave: boolean;
  onToggleSound: () => void;
  onMusicVolumeChange: (value: number) => void;
  onSfxVolumeChange: (value: number) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleHints: () => void;
  onToggleScreenShake: () => void;
  onToggleAutoSave: () => void;
  onClose: () => void;
}

const SettingsPanel = ({
  soundEnabled,
  musicVolume,
  sfxVolume,
  difficulty,
  showHints,
  screenShake,
  autoSave,
  onToggleSound,
  onMusicVolumeChange,
  onSfxVolumeChange,
  onDifficultyChange,
  onToggleHints,
  onToggleScreenShake,
  onToggleAutoSave,
  onClose
}: SettingsPanelProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-[#1C1C1C]/95 border-[#8B0000]/50 backdrop-blur max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl text-[#8B0000] flex items-center gap-2">
              <Icon name="Settings" size={32} />
              Настройки
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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
              <Icon name="Volume2" size={20} />
              Звук
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <Label htmlFor="sound-toggle" className="text-gray-300 cursor-pointer">
                Включить звук
              </Label>
              <Switch
                id="sound-toggle"
                checked={soundEnabled}
                onCheckedChange={onToggleSound}
              />
            </div>

            <div className="space-y-2 p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <Label className="text-gray-300">Громкость музыки: {musicVolume}%</Label>
              <Slider
                value={[musicVolume]}
                onValueChange={(value) => onMusicVolumeChange(value[0])}
                max={100}
                step={5}
                disabled={!soundEnabled}
                className="w-full"
              />
            </div>

            <div className="space-y-2 p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <Label className="text-gray-300">Громкость эффектов: {sfxVolume}%</Label>
              <Slider
                value={[sfxVolume]}
                onValueChange={(value) => onSfxVolumeChange(value[0])}
                max={100}
                step={5}
                disabled={!soundEnabled}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
              <Icon name="Target" size={20} />
              Сложность по умолчанию
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                onClick={() => onDifficultyChange('easy')}
                className={difficulty === 'easy' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-green-500/50 text-gray-300 hover:bg-green-500/10'
                }
              >
                🌱 Лёгкий
              </Button>
              <Button
                variant={difficulty === 'normal' ? 'default' : 'outline'}
                onClick={() => onDifficultyChange('normal')}
                className={difficulty === 'normal' 
                  ? 'bg-[#8B0000] hover:bg-[#A00000] text-white' 
                  : 'border-[#8B0000]/50 text-gray-300 hover:bg-[#8B0000]/10'
                }
              >
                ⚔️ Нормальный
              </Button>
              <Button
                variant={difficulty === 'nightmare' ? 'default' : 'outline'}
                onClick={() => onDifficultyChange('nightmare')}
                className={difficulty === 'nightmare' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'border-red-500/50 text-gray-300 hover:bg-red-500/10'
                }
              >
                🔥 Кошмар
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#8B0000] flex items-center gap-2">
              <Icon name="Gamepad2" size={20} />
              Геймплей
            </h3>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <div>
                <Label htmlFor="hints-toggle" className="text-gray-300 cursor-pointer">
                  Показывать подсказки
                </Label>
                <p className="text-xs text-gray-500 mt-1">Подсказки о механиках игры</p>
              </div>
              <Switch
                id="hints-toggle"
                checked={showHints}
                onCheckedChange={onToggleHints}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <div>
                <Label htmlFor="shake-toggle" className="text-gray-300 cursor-pointer">
                  Тряска экрана
                </Label>
                <p className="text-xs text-gray-500 mt-1">При встрече с антагонистами</p>
              </div>
              <Switch
                id="shake-toggle"
                checked={screenShake}
                onCheckedChange={onToggleScreenShake}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-black/30 rounded border border-[#8B0000]/20">
              <div>
                <Label htmlFor="autosave-toggle" className="text-gray-300 cursor-pointer">
                  Автосохранение
                </Label>
                <p className="text-xs text-gray-500 mt-1">Сохранять прогресс автоматически</p>
              </div>
              <Switch
                id="autosave-toggle"
                checked={autoSave}
                onCheckedChange={onToggleAutoSave}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#8B0000]/20">
            <Button
              onClick={onClose}
              className="w-full bg-[#8B0000] hover:bg-[#A00000] text-white"
              size="lg"
            >
              Сохранить настройки
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
