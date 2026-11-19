import type { PersistedGameState, ThemeMode } from '../types/game';
import { createEmptyBoard, generateTrayBatch } from './shapes';

const STORAGE_KEY = 'rr_royal_block_blast_v1';
const CURRENT_VERSION = 2;

export const DAILY_STREAK_REWARDS = [25, 40, 60, 80, 100, 125, 150];

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function normalizeTheme(raw: unknown): ThemeMode {
  if (raw === 'jungle' || raw === 'dark') return 'jungle';
  return 'cosmic';
}

export function createDefaultState(): PersistedGameState {
  const emptyBoard = createEmptyBoard();
  return {
    version: CURRENT_VERSION,
    board: emptyBoard,
    tray: generateTrayBatch(emptyBoard),
    score: 0,
    bestScore: 0,
    comboStreak: 0,
    coins: 50,
    linesClearedTotal: 0,
    reviveUsedInRun: false,
    unlockedStyles: ['crystal'],
    equippedStyle: 'crystal',
    theme: 'cosmic',
    language: 'en',
    soundEnabled: true,
    hapticsEnabled: true,
    dailyStreak: 0,
    lastClaimDate: null,
  };
}

export function loadPersistedState(): PersistedGameState {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedGameState> & { theme?: unknown };
    const defaults = createDefaultState();

    const validBoard =
      Array.isArray(parsed.board) && parsed.board.length === 8
        ? parsed.board
        : defaults.board;

    const validTray =
      Array.isArray(parsed.tray) && parsed.tray.length === 3
        ? parsed.tray
        : generateTrayBatch(validBoard);

    return {
      ...defaults,
      ...parsed,
      theme: normalizeTheme(parsed.theme),
      version: CURRENT_VERSION,
      board: validBoard,
      tray: validTray,
      unlockedStyles:
        Array.isArray(parsed.unlockedStyles) && parsed.unlockedStyles.length > 0
          ? parsed.unlockedStyles
          : ['crystal'],
    };
  } catch {
    return createDefaultState();
  }
}

export function savePersistedState(state: PersistedGameState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Handle storage quota silently for uninterrupted gameplay
  }
}
