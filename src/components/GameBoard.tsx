import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Languages,
  Settings,
  ShoppingBag,
  Sparkles,
  Trees,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type {
  BlockColorId,
  BlockStyleId,
  FloatingCallout,
  GridMatrix,
  Language,
  Particle,
  Shockwave,
  ThemeMode,
  TrayPiece,
} from '../types/game';
import { soundEngine } from '../utils/audio';
import type { Translations } from '../utils/i18n';
import {
  canPlacePieceAnywhere,
  canPlaceShape,
  GRID_SIZE,
  simulatePlacementLines,
} from '../utils/shapes';
import { BlockTile, getParticleHex } from './BlockTile';

interface GameBoardProps {
  board: GridMatrix;
  tray: (TrayPiece | null)[];
  score: number;
  bestScore: number;
  coins: number;
  comboStreak: number;
  theme: ThemeMode;
  language: Language;
  equippedStyle: BlockStyleId;
  soundEnabled: boolean;
  canClaimDaily: boolean;
  particles: Particle[];
  shockwaves: Shockwave[];
  flashingCells: Set<string>;
  callouts: FloatingCallout[];
  shakeLevel: 'none' | 'normal' | 'heavy';
  onPlacePiece: (trayIndex: number, row: number, col: number) => void;
  onGoHome: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onToggleSound: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  t: Translations;
}

interface DragState {
  trayIndex: number;
  piece: TrayPiece;
  clientX: number;
  clientY: number;
  isTouch: boolean;
  cellSize: number;
  targetRow: number | null;
  targetCol: number | null;
}

const TOUCH_Y_OFFSET = 64;

function useAnimatedNumber(target: number, durationMs = 420): number {
  const [displayValue, setDisplayValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const startVal = currentRef.current;
    if (startVal === target) return;

    // Instant reset when starting a fresh match (e.g. target drops to 0)
    if (target < startVal) {
      currentRef.current = target;
      setDisplayValue(target);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Smooth ease-out cubic curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startVal + (target - startVal) * eased);

      currentRef.current = nextVal;
      setDisplayValue(nextVal);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        currentRef.current = target;
        setDisplayValue(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs]);

  return displayValue;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  tray,
  score,
  bestScore,
  coins,
  comboStreak,
  theme,
  equippedStyle,
  soundEnabled,
  canClaimDaily,
  particles,
  shockwaves,
  flashingCells,
  callouts,
  shakeLevel,
  onPlacePiece,
  onGoHome,
  onToggleTheme,
  onToggleLanguage,
  onToggleSound,
  onOpenShop,
  onOpenSettings,
  t,
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [boardCellSize, setBoardCellSize] = useState<number>(38);

  const animatedScore = useAnimatedNumber(score, 420);
  const animatedBest = useAnimatedNumber(bestScore, 420);

  // Keep cell size measured accurately on resize
  useEffect(() => {
    const measure = () => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const innerWidth = rect.width - 14 - (GRID_SIZE - 1) * 4;
      setBoardCellSize(Math.max(24, innerWidth / GRID_SIZE));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const computeGridTarget = useCallback(
    (clientX: number, clientY: number, piece: TrayPiece, isTouch: boolean) => {
      if (!boardRef.current) return { row: null, col: null };
      const rect = boardRef.current.getBoundingClientRect();
      const pad = 7;
      const innerLeft = rect.left + pad;
      const innerTop = rect.top + pad;
      const innerSize = rect.width - pad * 2;
      const step = innerSize / GRID_SIZE;

      const visualCenterX = clientX;
      const visualCenterY = isTouch ? clientY - TOUCH_Y_OFFSET : clientY;

      const pieceRows = piece.matrix.length;
      const pieceCols = piece.matrix[0].length;

      const topLeftX = visualCenterX - (pieceCols * step) / 2;
      const topLeftY = visualCenterY - (pieceRows * step) / 2;

      const col = Math.round((topLeftX - innerLeft) / step);
      const row = Math.round((topLeftY - innerTop) / step);

      if (canPlaceShape(board, piece.matrix, row, col)) {
        return { row, col };
      }
      return { row: null, col: null };
    },
    [board]
  );

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      const { row, col } = computeGridTarget(
        e.clientX,
        e.clientY,
        dragState.piece,
        dragState.isTouch
      );
      setDragState((prev) =>
        prev
          ? {
              ...prev,
              clientX: e.clientX,
              clientY: e.clientY,
              targetRow: row,
              targetCol: col,
            }
          : null
      );
    };

    const handlePointerUp = (e: PointerEvent) => {
      const { row, col } = computeGridTarget(
        e.clientX,
        e.clientY,
        dragState.piece,
        dragState.isTouch
      );
      const idx = dragState.trayIndex;
      setDragState(null);

      if (row !== null && col !== null) {
        onPlacePiece(idx, row, col);
      } else {
        soundEngine.playInvalid();
      }
    };

    const handlePointerCancel = () => {
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [dragState, computeGridTarget, onPlacePiece]);

  const handleStartDrag = (
    e: React.PointerEvent<HTMLDivElement>,
    trayIndex: number,
    piece: TrayPiece
  ) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    const isTouch = e.pointerType === 'touch';

    let cellSz = boardCellSize;
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      cellSz = Math.max(26, (rect.width - 14 - (GRID_SIZE - 1) * 4) / GRID_SIZE);
      setBoardCellSize(cellSz);
    }

    soundEngine.playPickup();
    const { row, col } = computeGridTarget(e.clientX, e.clientY, piece, isTouch);
    setDragState({
      trayIndex,
      piece,
      clientX: e.clientX,
      clientY: e.clientY,
      isTouch,
      cellSize: cellSz,
      targetRow: row,
      targetCol: col,
    });
  };

  const { ghostCells, clearHighlightRows, clearHighlightCols } = useMemo(() => {
    const gSet = new Set<string>();
    const rSet = new Set<number>();
    const cSet = new Set<number>();

    if (dragState && dragState.targetRow !== null && dragState.targetCol !== null) {
      const { piece, targetRow, targetCol } = dragState;
      for (let r = 0; r < piece.matrix.length; r++) {
        for (let c = 0; c < piece.matrix[0].length; c++) {
          if (piece.matrix[r][c] === 1) {
            gSet.add(`${targetRow + r}-${targetCol + c}`);
          }
        }
      }
      const { rowsToClear, colsToClear } = simulatePlacementLines(
        board,
        piece.matrix,
        targetRow,
        targetCol
      );
      rowsToClear.forEach((r) => rSet.add(r));
      colsToClear.forEach((c) => cSet.add(c));
    }

    return {
      ghostCells: gSet,
      clearHighlightRows: rSet,
      clearHighlightCols: cSet,
    };
  }, [dragState, board]);

  const shakeClass =
    shakeLevel === 'heavy'
      ? 'animate-board-shake-heavy'
      : shakeLevel === 'normal'
      ? 'animate-board-shake'
      : '';

  const glassButton =
    theme === 'cosmic'
      ? 'bg-slate-950/65 hover:bg-purple-950/75 border-amber-300/25 text-purple-100'
      : 'bg-emerald-950/65 hover:bg-emerald-900/75 border-emerald-300/25 text-emerald-50';

  const glassPanel =
    theme === 'cosmic'
      ? 'bg-slate-950/65 border-amber-300/25 shadow-[0_10px_28px_rgba(0,0,0,0.45)]'
      : 'bg-emerald-950/65 border-emerald-300/25 shadow-[0_10px_28px_rgba(0,0,0,0.45)]';

  return (
    <div className="relative z-10 h-[100dvh] w-full overflow-hidden flex flex-col justify-between text-white select-none">
      {/* Compact Glassmorphism Top Bar + Rolling Score Strip */}
      <header className="w-full max-w-xl mx-auto px-3 pt-2.5 pb-1 shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Left Quick Nav */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onGoHome}
              aria-label={t.home}
              className={`min-h-[40px] min-w-[40px] rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors ${glassButton}`}
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className={`min-h-[40px] min-w-[40px] rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors ${glassButton}`}
            >
              {theme === 'cosmic' ? (
                <Trees className="w-4 h-4 text-emerald-300" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
            </button>
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`min-h-[40px] px-2.5 rounded-xl border backdrop-blur-md text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap ${glassButton}`}
            >
              <Languages className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{t.langToggleLabel}</span>
            </button>
          </div>

          {/* Right Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenShop}
              aria-label={t.shopTitle}
              className={`min-h-[40px] px-2.5 rounded-xl border backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${glassButton}`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono-num text-amber-300">{coins}</span>
              {canClaimDaily && (
                <span className="px-1 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                  +
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? t.soundOn : t.soundOff}
              className={`min-h-[40px] min-w-[40px] rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors ${glassButton}`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              aria-label={t.settingsTitle}
              className={`min-h-[40px] min-w-[40px] rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors ${glassButton}`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Glassmorphic Rolling Score & Best Header */}
        <div
          className={`flex items-center justify-between px-4 py-2 rounded-2xl border backdrop-blur-xl ${glassPanel}`}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-slate-300">{t.score}</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-num tracking-tight text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.35)]">
              {animatedScore.toLocaleString()}
            </span>
          </div>

          {comboStreak > 1 && (
            <div className="text-xs sm:text-sm font-extrabold font-mono-num text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
              {t.combo} ×{comboStreak}
            </div>
          )}

          <div className="flex items-baseline gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400 self-center" />
            <span className="text-xs font-semibold text-slate-300">{t.best}</span>
            <span className="text-lg font-extrabold font-mono-num text-white">
              {animatedBest.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Center 8x8 Carved 3D Obsidian & Brushed-Gold Board */}
      <main className="flex-1 w-full max-w-xl mx-auto px-3 flex items-center justify-center min-h-0">
        <div
          className={`relative w-full max-w-[min(92vw,52dvh)] sm:max-w-[min(86vw,54dvh)] md:max-w-[432px] aspect-square ${shakeClass}`}
        >
          {/* Outer Brushed Gold & Obsidian Bezel with Moving Specular Light */}
          <div
            className={`relative w-full h-full p-[6px] rounded-[22px] overflow-hidden ${
              theme === 'cosmic' ? 'obsidian-frame' : 'obsidian-frame-jungle'
            }`}
          >
            {/* Dynamic Moving Light Source Specular Reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1/2 animate-frame-specular"
              style={{
                background:
                  theme === 'cosmic'
                    ? 'linear-gradient(90deg, transparent 35%, rgba(253, 230, 138, 0.32) 50%, transparent 65%)'
                    : 'linear-gradient(90deg, transparent 35%, rgba(167, 243, 208, 0.28) 50%, transparent 65%)',
              }}
            />

            {/* Corner Brushed Gold Studs */}
            <span className="pointer-events-none absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 shadow-sm z-10" />
            <span className="pointer-events-none absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 shadow-sm z-10" />
            <span className="pointer-events-none absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 shadow-sm z-10" />
            <span className="pointer-events-none absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 shadow-sm z-10" />

            <div
              ref={boardRef}
              style={{ touchAction: 'none' }}
              className="relative z-[1] w-full h-full p-1.5 rounded-[16px] bg-black/55 border border-amber-300/20 grid grid-cols-8 grid-rows-8 gap-1"
            >
              {board.map((rowArr, rIdx) =>
                rowArr.map((cellColor, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  const isGhost = ghostCells.has(key);
                  const isImminentClear =
                    clearHighlightRows.has(rIdx) || clearHighlightCols.has(cIdx);
                  const isFlashing = flashingCells.has(key);

                  return (
                    <div
                      key={key}
                      className={`relative w-full h-full rounded-[7px] transition-colors duration-100 ${
                        isImminentClear && !cellColor && !isGhost
                          ? 'bg-amber-400/25 ring-1 ring-amber-300/60'
                          : theme === 'cosmic'
                          ? 'stone-slot-cosmic'
                          : 'stone-slot-jungle'
                      }`}
                    >
                      {cellColor && (
                        <BlockTile
                          color={cellColor}
                          blockStyle={equippedStyle}
                          theme={theme}
                          isClearHighlight={isImminentClear}
                          className={isFlashing ? 'brightness-150 scale-90' : ''}
                        />
                      )}
                      {!cellColor && isGhost && dragState && (
                        <BlockTile
                          color={dragState.piece.color}
                          blockStyle={equippedStyle}
                          theme={theme}
                          isGhost
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Shockwave Ring Layer */}
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {shockwaves.map((sw) => (
              <span
                key={sw.id}
                className="absolute w-16 h-16 rounded-full border-[3px] animate-shockwave-expand"
                style={{
                  left: `${sw.xPercent}%`,
                  top: `${sw.yPercent}%`,
                  borderColor: getParticleHex(sw.color, theme),
                  boxShadow: `0 0 22px ${getParticleHex(sw.color, theme)}`,
                }}
              />
            ))}
          </div>

          {/* 3D Crystal Shatter Particle Overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {particles.map((p) => {
              const hex = getParticleHex(p.color, theme);
              return (
                <span
                  key={p.id}
                  className="absolute rounded-[2px] border border-white/60 animate-particle-burst"
                  style={
                    {
                      left: `${p.xPercent}%`,
                      top: `${p.yPercent}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: `linear-gradient(135deg, #ffffff 0%, ${hex} 55%, rgba(0,0,0,0.4) 100%)`,
                      boxShadow: `0 0 10px ${hex}`,
                      '--tx': `${p.tx}px`,
                      '--ty': `${p.ty}px`,
                      '--rot': `${p.rot}deg`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>

          {/* Floating Combo Callouts */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
            {callouts.map((c) => (
              <div
                key={c.id}
                className="absolute left-1/2 top-[38%] animate-combo-float text-center whitespace-nowrap"
              >
                <div
                  className={`font-display font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${
                    c.variant === 'royal'
                      ? 'text-2xl sm:text-3xl text-amber-300'
                      : 'text-xl sm:text-2xl text-white'
                  }`}
                >
                  {c.title}
                </div>
                {c.subtitle && (
                  <div className="text-xs sm:text-sm font-bold font-mono-num text-emerald-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {c.subtitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom 3-Piece Polyomino Glassmorphic Tray */}
      <section className="w-full max-w-xl mx-auto px-3 pb-3 pt-1 shrink-0">
        <div
          className={`h-[116px] sm:h-[132px] w-full rounded-2xl border backdrop-blur-xl grid grid-cols-3 divide-x divide-white/10 ${glassPanel}`}
        >
          {tray.map((piece, idx) => {
            const isBeingDragged = dragState?.trayIndex === idx;
            const isPlayable = piece ? canPlacePieceAnywhere(board, piece.matrix) : false;

            return (
              <div
                key={piece ? piece.instanceId : `empty-${idx}`}
                style={{ touchAction: 'none' }}
                onPointerDown={(e) => {
                  if (piece) handleStartDrag(e, idx, piece);
                }}
                className={`relative flex items-center justify-center p-2 transition-opacity ${
                  piece ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                } ${isBeingDragged ? 'opacity-20' : !isPlayable && piece ? 'opacity-45' : 'opacity-100'}`}
              >
                {piece && (
                  <TrayPiecePreview
                    matrix={piece.matrix}
                    color={piece.color}
                    blockStyle={equippedStyle}
                    theme={theme}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating 3D Dragged Piece Layer with Realistic Drop Shadow */}
      {dragState && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: dragState.clientX,
            top: dragState.isTouch ? dragState.clientY - TOUCH_Y_OFFSET : dragState.clientY,
            transform: 'translate(-50%, -50%) scale(1.06)',
          }}
        >
          <div
            className="grid gap-1 drop-shadow-[0_22px_28px_rgba(0,0,0,0.75)]"
            style={{
              gridTemplateColumns: `repeat(${dragState.piece.matrix[0].length}, ${dragState.cellSize}px)`,
              gridTemplateRows: `repeat(${dragState.piece.matrix.length}, ${dragState.cellSize}px)`,
            }}
          >
            {dragState.piece.matrix.flatMap((rowArr, r) =>
              rowArr.map((val, c) => (
                <div key={`${r}-${c}`} className="w-full h-full">
                  {val === 1 && (
                    <BlockTile
                      color={dragState.piece.color}
                      blockStyle={equippedStyle}
                      theme={theme}
                      isDragging
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface TrayPiecePreviewProps {
  matrix: number[][];
  color: BlockColorId;
  blockStyle: BlockStyleId;
  theme: ThemeMode;
}

const TrayPiecePreview: React.FC<TrayPiecePreviewProps> = React.memo(
  ({ matrix, color, blockStyle, theme }) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const maxDim = Math.max(rows, cols);
    const tilePx = maxDim >= 5 ? 16 : maxDim === 4 ? 18 : maxDim === 3 ? 21 : 24;

    return (
      <div
        className="grid gap-[3px] pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${tilePx}px)`,
          gridTemplateRows: `repeat(${rows}, ${tilePx}px)`,
        }}
      >
        {matrix.flatMap((rowArr, r) =>
          rowArr.map((val, c) => (
            <div key={`${r}-${c}`} className="w-full h-full">
              {val === 1 && (
                <BlockTile color={color} blockStyle={blockStyle} theme={theme} />
              )}
            </div>
          ))
        )}
      </div>
    );
  }
);

TrayPiecePreview.displayName = 'TrayPiecePreview';
