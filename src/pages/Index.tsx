import MainMenu from '@/components/game/MainMenu';
import GameScreen from '@/components/game/GameScreen';
import EndingScreen from '@/components/game/EndingScreen';
import SettingsPanel from '@/components/game/SettingsPanel';
import PlayerStatsPanel from '@/components/game/PlayerStatsPanel';
import { useGameData } from '@/hooks/useGameData';
import { useGameLogic } from '@/hooks/useGameLogic';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { useSettings } from '@/hooks/useSettings';

const Index = () => {
  const { locations, antagonists, rules } = useGameData();
  const { settings, updateSettings, showSettings, setShowSettings, showStats, setShowStats } = useSettings();
  const { playerStats, updateStatsAfterGame, resetStats } = usePlayerStats();
  
  const {
    gameState,
    setGameState,
    startGame,
    visitLocation,
    findItem,
    hideAction,
    handleExit,
    handleToggleSound
  } = useGameLogic({ locations, antagonists, soundEnabled: gameState.soundEnabled });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    if (gameState.ending) {
      updateStatsAfterGame(
        gameState.timeElapsed,
        gameState.inventory.length,
        gameState.rulesViolated,
        gameState.ending
      );
    }
    setGameState({ ...gameState, currentLocation: 'menu', ending: null });
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
            onMusicVolumeChange={(v) => updateSettings({ musicVolume: v })}
            onSfxVolumeChange={(v) => updateSettings({ sfxVolume: v })}
            onDifficultyChange={(d) => setGameState({ ...gameState, difficulty: d })}
            onToggleHints={() => updateSettings({ showHints: !settings.showHints })}
            onToggleScreenShake={() => updateSettings({ screenShake: !settings.screenShake })}
            onToggleAutoSave={() => updateSettings({ autoSave: !settings.autoSave })}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showStats && (
          <PlayerStatsPanel
            stats={playerStats}
            formatTime={formatTime}
            onClose={() => setShowStats(false)}
            onResetStats={resetStats}
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
            onMusicVolumeChange={(v) => updateSettings({ musicVolume: v })}
            onSfxVolumeChange={(v) => updateSettings({ sfxVolume: v })}
            onDifficultyChange={(d) => setGameState({ ...gameState, difficulty: d })}
            onToggleHints={() => updateSettings({ showHints: !settings.showHints })}
            onToggleScreenShake={() => updateSettings({ screenShake: !settings.screenShake })}
            onToggleAutoSave={() => updateSettings({ autoSave: !settings.autoSave })}
            onClose={() => setShowSettings(false)}
          />
        )}
        {showStats && (
          <PlayerStatsPanel
            stats={playerStats}
            formatTime={formatTime}
            onClose={() => setShowStats(false)}
            onResetStats={resetStats}
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
          onMusicVolumeChange={(v) => updateSettings({ musicVolume: v })}
          onSfxVolumeChange={(v) => updateSettings({ sfxVolume: v })}
          onDifficultyChange={(d) => setGameState({ ...gameState, difficulty: d })}
          onToggleHints={() => updateSettings({ showHints: !settings.showHints })}
          onToggleScreenShake={() => updateSettings({ screenShake: !settings.screenShake })}
          onToggleAutoSave={() => updateSettings({ autoSave: !settings.autoSave })}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showStats && (
        <PlayerStatsPanel
          stats={playerStats}
          formatTime={formatTime}
          onClose={() => setShowStats(false)}
          onResetStats={resetStats}
        />
      )}
    </>
  );
};

export default Index;
