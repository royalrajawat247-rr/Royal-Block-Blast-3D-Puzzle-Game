export type ThemeMode = 'cosmic' | 'jungle';
export type Language = 'en' | 'hi';
export type BlockStyleId = 'crystal' | 'neon' | 'gold';
export type BlockColorId = 'royal' | 'emerald' | 'gold' | 'ruby' | 'violet';
export type ScreenView = 'HOME' | 'PLAYING';

export type GridMatrix = (BlockColorId | null)[][];

export interface PolyominoShape {
  id: string;
  matrix: number[][]; // 1 = occupied, 0 = empty
  weight: number;
}

export interface TrayPiece {
  instanceId: string;
  shapeId: string;
  matrix: number[][];
  color: BlockColorId;
}

export interface Particle {
  id: string;
  xPercent: number;
  yPercent: number;
  tx: number;
  ty: number;
  rot: number;
  size: number;
  color: BlockColorId;
}

export interface Shockwave {
  id: string;
  xPercent: number;
  yPercent: number;
  color: BlockColorId;
}

export interface FloatingCallout {
  id: string;
  title: string;
  subtitle?: string;
  variant: 'combo' | 'royal' | 'points';
}

export interface PersistedGameState {
  version: number;
  board: GridMatrix;
  tray: (TrayPiece | null)[];
  score: number;
  bestScore: number;
  comboStreak: number;
  coins: number;
  linesClearedTotal: number;
  reviveUsedInRun: boolean;
  unlockedStyles: BlockStyleId[];
  equippedStyle: BlockStyleId;
  theme: ThemeMode;
  language: Language;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  dailyStreak: number;
  lastClaimDate: string | null; // YYYY-MM-DD local date
}
