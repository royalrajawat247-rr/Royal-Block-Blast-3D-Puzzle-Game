import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameOverModal } from './components/GameOverModal';
import { HomeScreen } from './components/HomeScreen';
import { ScenicBackdrop } from './components/ScenicBackdrop';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import type {
  BlockColorId,
  BlockStyleId,
  FloatingCallout,
  Particle,
  PersistedGameState,
  ScreenView,
  Shockwave,
} from './types/game';
import { soundEngine } from './utils/audio';
import { getTranslations } from './utils/i18n';
import {
  applyPiecePlacement,
  clearRowsForRevive,
  createEmptyBoard,
  generateTrayBatch,
  GRID_SIZE,
  hasAnyValidMove,
} from './utils/shapes';
import {
  DAILY_STREAK_REWARDS,
  getTodayDateString,
  getYesterdayDateString,
  loadPersistedState,
  savePersistedState,
} from './utils/storage';

export function App() {
  const [gameState, setGameState] = useState<PersistedGameState>(() => loadPersistedState());
  const [screen, setScreen] = useState<ScreenView>('HOME');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Visual FX states
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [flashingCells] = useState<Set<string>>(() => new Set());
  const [callouts, setCallouts] = useState<FloatingCallout[]>([]);
  const [shakeLevel, setShakeLevel] = useState<'none' | 'normal' | 'heavy'>('none');
  const [isNewHighScoreInRun, setIsNewHighScoreInRun] = useState(false);

  const shakeTimerRef = useRef<number | null>(null);

  const t = useMemo(() => getTranslations(gameState.language), [gameState.language]);

  // Sync browser theme-color for scenic environments
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', gameState.theme === 'cosmic' ? '#060312' : '#020E0A');
    }
  }, [gameState.theme]);

  // Sync Web Audio & haptics configuration
  useEffect(() => {
    soundEngine.configure(gameState.soundEnabled, gameState.hapticsEnabled);
  }, [gameState.soundEnabled, gameState.hapticsEnabled]);

  // Auto-save every state change to localStorage
  useEffect(() => {
    savePersistedState(gameState);
  }, [gameState]);

  const todayStr = getTodayDateString();
  const canClaimDaily = gameState.lastClaimDate !== todayStr;

  const hasActiveBoard = useMemo(
    () => gameState.board.some((row) => row.some((cell) => cell !== null)),
    [gameState.board]
  );

  const isGameOver = useMemo(
    () => screen === 'PLAYING' && !hasAnyValidMove(gameState.board, gameState.tray),
    [screen, gameState.board, gameState.tray]
  );

  // Trigger Game Over audio once when entering game over state
  const prevGameOverRef = useRef(false);
  useEffect(() => {
    if (isGameOver && !prevGameOverRef.current) {
      soundEngine.playGameOver();
    }
    prevGameOverRef.current = isGameOver;
  }, [isGameOver]);

  const spawnExplosion = useCallback(
    (cells: { row: number; col: number; color: BlockColorId }[]) => {
      const nextParticles: Particle[] = [];
      const nextShockwaves: Shockwave[] = [];
      const particlesPerCell = cells.length > 16 ? 4 : 6;

      cells.forEach((cell, idx) => {
        const xPercent = ((cell.col + 0.5) / GRID_SIZE) * 100;
        const yPercent = ((cell.row + 0.5) / GRID_SIZE) * 100;

        // Add glowing shockwave pulses on every 3rd cleared gem for crisp impact
        if (idx % 3 === 0) {
          nextShockwaves.push({
            id: `sw-${Date.now()}-${cell.row}-${cell.col}-${Math.random()}`,
            xPercent,
            yPercent,
            color: cell.color,
          });
        }

        for (let i = 0; i < particlesPerCell; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 34 + Math.random() * 82;
          nextParticles.push({
            id: `${Date.now()}-${cell.row}-${cell.col}-${i}-${Math.random()}`,
            xPercent,
            yPercent,
            tx: Math.cos(angle) * dist,
            ty: Math.sin(angle) * dist,
            rot: Math.round((Math.random() - 0.5) * 420),
            size: 6 + Math.round(Math.random() * 7),
            color: cell.color,
          });
        }
      });

      setParticles((prev) => [...prev.slice(-100), ...nextParticles]);
      setShockwaves((prev) => [...prev.slice(-12), ...nextShockwaves]);

      window.setTimeout(() => {
        const pIds = new Set(nextParticles.map((p) => p.id));
        const sIds = new Set(nextShockwaves.map((s) => s.id));
        setParticles((prev) => prev.filter((p) => !pIds.has(p.id)));
        setShockwaves((prev) => prev.filter((s) => !sIds.has(s.id)));
      }, 680);
    },
    []
  );

  const triggerShake = useCallback((heavy: boolean) => {
    if (shakeTimerRef.current) {
      window.clearTimeout(shakeTimerRef.current);
    }
    setShakeLevel('none');
    requestAnimationFrame(() => {
      setShakeLevel(heavy ? 'heavy' : 'normal');
      shakeTimerRef.current = window.setTimeout(() => {
        setShakeLevel('none');
      }, 400);
    });
  }, []);

  const pushCallout = useCallback(
    (title: string, subtitle?: string, variant: 'combo' | 'royal' | 'points' = 'combo') => {
      const id = `${Date.now()}-${Math.random()}`;
      setCallouts((prev) => [...prev.slice(-2), { id, title, subtitle, variant }]);
      window.setTimeout(() => {
        setCallouts((prev) => prev.filter((c) => c.id !== id));
      }, 1150);
    },
    []
  );

  const handlePlacePiece = useCallback(
    (trayIndex: number, row: number, col: number) => {
      const piece = gameState.tray[trayIndex];
      if (!piece) return;

      const analysis = applyPiecePlacement(gameState.board, piece, row, col);
      const linesCount = analysis.clearedRows.length + analysis.clearedCols.length;

      const nextCombo = linesCount > 0 ? gameState.comboStreak + 1 : 0;
      const basePlacePoints = analysis.placedCellsCount * 2;
      const lineBonus =
        linesCount > 0 ? linesCount * linesCount * 20 * Math.max(1, nextCombo) : 0;
      const gainedPoints = basePlacePoints + lineBonus;

      const coinsEarned =
        linesCount > 0 ? linesCount * 3 + (linesCount > 1 || nextCombo > 1 ? 5 : 0) : 0;

      if (linesCount > 0) {
        soundEngine.playLineClear(linesCount, nextCombo);
        spawnExplosion(analysis.clearedCellsCoords);
        triggerShake(linesCount >= 2 || nextCombo >= 3);

        let title = t.comboWords.single;
        let variant: 'combo' | 'royal' = 'combo';
        if (linesCount >= 3 || nextCombo >= 4) {
          title = t.comboWords.royal;
          variant = 'royal';
        } else if (linesCount === 2) {
          title = t.comboWords.double;
        } else if (nextCombo >= 2) {
          title = `${t.comboWords.comboPrefix} ×${nextCombo}!`;
        }

        const sub = `+${gainedPoints} · +${coinsEarned} ${t.coins}`;
        pushCallout(title, sub, variant);
      } else {
        soundEngine.playSnap();
      }

      const nextTray = gameState.tray.map((item, idx) => (idx === trayIndex ? null : item));
      const trayEmpty = nextTray.every((item) => item === null);
      const finalTray = trayEmpty ? generateTrayBatch(analysis.nextBoard) : nextTray;

      const nextScore = gameState.score + gainedPoints;
      const beatBest = nextScore > gameState.bestScore;
      if (beatBest && gameState.bestScore > 0) {
        setIsNewHighScoreInRun(true);
      }

      setGameState((prev) => ({
        ...prev,
        board: analysis.nextBoard,
        tray: finalTray,
        score: nextScore,
        bestScore: Math.max(prev.bestScore, nextScore),
        comboStreak: nextCombo,
        coins: prev.coins + coinsEarned,
        linesClearedTotal: prev.linesClearedTotal + linesCount,
      }));
    },
    [
      gameState.board,
      gameState.tray,
      gameState.comboStreak,
      gameState.score,
      gameState.bestScore,
      t,
      spawnExplosion,
      triggerShake,
      pushCallout,
    ]
  );

  const handleStartNewGame = useCallback(() => {
    const freshBoard = createEmptyBoard();
    setIsNewHighScoreInRun(false);
    setGameState((prev) => ({
      ...prev,
      board: freshBoard,
      tray: generateTrayBatch(freshBoard),
      score: 0,
      comboStreak: 0,
      reviveUsedInRun: false,
    }));
    setScreen('PLAYING');
  }, []);

  const handleReviveBoard = useCallback(() => {
    if (gameState.reviveUsedInRun) return;
    const { nextBoard, clearedCoords } = clearRowsForRevive(gameState.board);
    soundEngine.playLineClear(3, 2);
    if (clearedCoords.length > 0) {
      spawnExplosion(clearedCoords);
    }
    triggerShake(true);
    pushCallout(t.comboWords.royal, t.reviveSubtitle, 'royal');

    const ensuredTray = hasAnyValidMove(nextBoard, gameState.tray)
      ? gameState.tray
      : generateTrayBatch(nextBoard);

    setGameState((prev) => ({
      ...prev,
      board: nextBoard,
      tray: ensuredTray,
      reviveUsedInRun: true,
    }));
  }, [
    gameState.reviveUsedInRun,
    gameState.board,
    gameState.tray,
    spawnExplosion,
    triggerShake,
    pushCallout,
    t,
  ]);

  const handleClaimDaily = useCallback(() => {
    const today = getTodayDateString();
    if (gameState.lastClaimDate === today) return;

    const yesterday = getYesterdayDateString();
    const continuingStreak = gameState.lastClaimDate === yesterday;
    const nextStreak = continuingStreak ? gameState.dailyStreak + 1 : 1;
    const rewardIndex = (nextStreak - 1) % DAILY_STREAK_REWARDS.length;
    const rewardAmount = DAILY_STREAK_REWARDS[rewardIndex];

    soundEngine.playCoinReward();
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + rewardAmount,
      dailyStreak: nextStreak,
      lastClaimDate: today,
    }));
  }, [gameState.lastClaimDate, gameState.dailyStreak]);

  const handleUnlockStyle = useCallback((styleId: BlockStyleId, price: number) => {
    setGameState((prev) => {
      if (prev.unlockedStyles.includes(styleId) || prev.coins < price) return prev;
      soundEngine.playCoinReward();
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedStyles: [...prev.unlockedStyles, styleId],
        equippedStyle: styleId,
      };
    });
  }, []);

  const handleEquipStyle = useCallback((styleId: BlockStyleId) => {
    soundEngine.playPickup();
    setGameState((prev) =>
      prev.unlockedStyles.includes(styleId) ? { ...prev, equippedStyle: styleId } : prev
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      theme: prev.theme === 'cosmic' ? 'jungle' : 'cosmic',
    }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en',
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  const toggleHaptics = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      hapticsEnabled: !prev.hapticsEnabled,
    }));
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden">
      {/* 3D Scenic Shader & Particle Environment */}
      <ScenicBackdrop theme={gameState.theme} />

      {screen === 'HOME' ? (
        <HomeScreen
          theme={gameState.theme}
          onToggleTheme={toggleTheme}
          language={gameState.language}
          onToggleLanguage={toggleLanguage}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={toggleSound}
          bestScore={gameState.bestScore}
          currentScore={gameState.score}
          hasActiveBoard={hasActiveBoard}
          coins={gameState.coins}
          dailyStreak={gameState.dailyStreak}
          linesClearedTotal={gameState.linesClearedTotal}
          canClaimDaily={canClaimDaily}
          equippedStyle={gameState.equippedStyle}
          onPlayResume={() => setScreen('PLAYING')}
          onStartNewGame={handleStartNewGame}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          t={t}
        />
      ) : (
        <GameBoard
          board={gameState.board}
          tray={gameState.tray}
          score={gameState.score}
          bestScore={gameState.bestScore}
          coins={gameState.coins}
          comboStreak={gameState.comboStreak}
          theme={gameState.theme}
          language={gameState.language}
          equippedStyle={gameState.equippedStyle}
          soundEnabled={gameState.soundEnabled}
          canClaimDaily={canClaimDaily}
          particles={particles}
          shockwaves={shockwaves}
          flashingCells={flashingCells}
          callouts={callouts}
          shakeLevel={shakeLevel}
          onPlacePiece={handlePlacePiece}
          onGoHome={() => setScreen('HOME')}
          onToggleTheme={toggleTheme}
          onToggleLanguage={toggleLanguage}
          onToggleSound={toggleSound}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          t={t}
        />
      )}

      {/* Game Over Modal with Dedicated 300x250 Adsterra Slot */}
      <GameOverModal
        isOpen={isGameOver}
        score={gameState.score}
        bestScore={gameState.bestScore}
        isNewHighScore={isNewHighScoreInRun}
        reviveUsedInRun={gameState.reviveUsedInRun}
        onReviveBoard={handleReviveBoard}
        onPlayAgain={handleStartNewGame}
        coins={gameState.coins}
        t={t}
      />

      {/* Daily Streak & Coin Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        theme={gameState.theme}
        t={t}
        coins={gameState.coins}
        dailyStreak={gameState.dailyStreak}
        canClaimToday={canClaimDaily}
        onClaimDaily={handleClaimDaily}
        unlockedStyles={gameState.unlockedStyles}
        equippedStyle={gameState.equippedStyle}
        onUnlockStyle={handleUnlockStyle}
        onEquipStyle={handleEquipStyle}
      />

      {/* Settings & RR Tech Labs Support / Privacy Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={gameState.theme}
        onToggleTheme={toggleTheme}
        language={gameState.language}
        onToggleLanguage={toggleLanguage}
        soundEnabled={gameState.soundEnabled}
        onToggleSound={toggleSound}
        hapticsEnabled={gameState.hapticsEnabled}
        onToggleHaptics={toggleHaptics}
        onResetBoard={handleStartNewGame}
        t={t}
      />
    </div>
  );
}

export default App;
