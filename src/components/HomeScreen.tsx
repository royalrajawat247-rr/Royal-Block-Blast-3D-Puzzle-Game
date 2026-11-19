import React from 'react';
import {
  Coins,
  Crown,
  Flame,
  Languages,
  Play,
  RotateCcw,
  Settings,
  ShoppingBag,
  Sparkles,
  Trees,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { BlockColorId, BlockStyleId, Language, ThemeMode } from '../types/game';
import type { Translations } from '../utils/i18n';
import { BlockTile } from './BlockTile';

interface HomeScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bestScore: number;
  currentScore: number;
  hasActiveBoard: boolean;
  coins: number;
  dailyStreak: number;
  linesClearedTotal: number;
  canClaimDaily: boolean;
  equippedStyle: BlockStyleId;
  onPlayResume: () => void;
  onStartNewGame: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  t: Translations;
}

const SHOWCASE_GRID: (BlockColorId | null)[][] = [
  ['royal', 'royal', null, 'gold'],
  ['royal', 'emerald', 'emerald', 'gold'],
  [null, 'emerald', 'violet', null],
  ['ruby', 'ruby', 'violet', 'violet'],
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  bestScore,
  currentScore,
  hasActiveBoard,
  coins,
  dailyStreak,
  linesClearedTotal,
  canClaimDaily,
  equippedStyle,
  onPlayResume,
  onStartNewGame,
  onOpenShop,
  onOpenSettings,
  t,
}) => {
  const glassButton =
    theme === 'cosmic'
      ? 'bg-slate-950/65 hover:bg-purple-950/75 border-amber-300/25 text-purple-100'
      : 'bg-emerald-950/65 hover:bg-emerald-900/75 border-emerald-300/25 text-emerald-50';

  const glassCard =
    theme === 'cosmic'
      ? 'bg-slate-950/60 border-amber-300/25 shadow-[0_14px_34px_rgba(0,0,0,0.5)]'
      : 'bg-emerald-950/60 border-emerald-300/25 shadow-[0_14px_34px_rgba(0,0,0,0.5)]';

  return (
    <div className="relative z-10 min-h-[100dvh] w-full flex flex-col justify-between text-white">
      {/* Top Utility Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        {/* Left: 1-Click Scenic Theme Switcher */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl border backdrop-blur-md text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${glassButton}`}
        >
          {theme === 'cosmic' ? (
            <Trees className="w-4 h-4 text-emerald-300 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          )}
          <span>{theme === 'cosmic' ? t.themeSwitchToDark : t.themeSwitchToLight}</span>
        </button>

        {/* Right: Language + Sound + Settings & Info */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl border backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${glassButton}`}
            aria-label="Toggle Language"
          >
            <Languages className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{t.langToggleLabel}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? t.soundOn : t.soundOff}
            className={`min-h-[44px] min-w-[44px] rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors shrink-0 ${glassButton}`}
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
            aria-label={t.settingsAndInfo}
            className={`min-h-[44px] min-w-[44px] rounded-xl border backdrop-blur-md flex items-center justify-center transition-colors shrink-0 ${glassButton}`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 items-center justify-center">
        {/* Brand & Action Column */}
        <div className="w-full max-w-md lg:max-w-none lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          {/* RR Tech Labs Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md text-xs font-semibold text-amber-100 ${glassCard}`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{t.engineeredBy}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-emerald-300">{t.offlineBadge}</span>
          </div>

          {/* Hero Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08] text-balance drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              {t.appName}
            </h1>
            <p className="text-sm sm:text-base font-medium text-slate-200/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {t.appSubtitle} — {t.howToPlayHint}
            </p>
          </div>

          {/* Glassmorphic Metric Strip */}
          <div
            className={`w-full grid grid-cols-3 gap-3 py-3.5 px-4 rounded-2xl border backdrop-blur-xl ${glassCard}`}
          >
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {t.best}
              </span>
              <span className="text-xl font-extrabold font-mono-num text-white mt-0.5">
                {bestScore.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center lg:items-start border-x border-white/15 px-2">
              <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {t.coins}
              </span>
              <span className="text-xl font-extrabold font-mono-num text-amber-300 mt-0.5">
                {coins.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-emerald-300" />
                {t.totalLinesLabel}
              </span>
              <span className="text-xl font-extrabold font-mono-num text-white mt-0.5">
                {linesClearedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Primary Play / Resume Actions */}
          <div className="w-full space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onPlayResume}
              className="w-full min-h-[54px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2.5 shadow-[0_10px_28px_rgba(245,158,11,0.4)] border border-amber-200/70 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-current shrink-0" />
              <span>
                {hasActiveBoard && currentScore > 0
                  ? `${t.resumeGame} (${currentScore.toLocaleString()})`
                  : t.playNow}
              </span>
            </button>

            <div className={`grid grid-cols-2 gap-2.5 ${canClaimDaily ? 'pt-2' : ''}`}>
              <button
                type="button"
                onClick={onOpenShop}
                className={`relative min-h-[48px] px-4 py-2.5 rounded-xl border backdrop-blur-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${glassButton}`}
              >
                {canClaimDaily && (
                  <span className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight bg-emerald-500 text-slate-950 shadow-[0_2px_10px_rgba(16,185,129,0.5)] border border-emerald-200/80 whitespace-nowrap">
                    {t.newRewardAvailable}
                  </span>
                )}
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.shopAndStreak}</span>
              </button>

              {hasActiveBoard && currentScore > 0 ? (
                <button
                  type="button"
                  onClick={onStartNewGame}
                  className={`min-h-[48px] px-4 py-2.5 rounded-xl border backdrop-blur-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${glassButton}`}
                >
                  <RotateCcw className="w-4 h-4 text-slate-200 shrink-0" />
                  <span>{t.startFresh}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className={`min-h-[48px] px-4 py-2.5 rounded-xl border backdrop-blur-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${glassButton}`}
                >
                  <Settings className="w-4 h-4 text-slate-200 shrink-0" />
                  <span>{t.settingsAndInfo}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carved 3D Obsidian & Brushed-Gold Showcase Board Preview */}
        <div className="hidden sm:flex lg:col-span-5 flex-col items-center justify-center mt-8 lg:mt-0 w-full max-w-[330px]">
          <div
            className={`relative w-full p-4 rounded-3xl overflow-hidden ${
              theme === 'cosmic' ? 'obsidian-frame' : 'obsidian-frame-jungle'
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1/2 animate-frame-specular"
              style={{
                background:
                  theme === 'cosmic'
                    ? 'linear-gradient(90deg, transparent 35%, rgba(253, 230, 138, 0.28) 50%, transparent 65%)'
                    : 'linear-gradient(90deg, transparent 35%, rgba(167, 243, 208, 0.25) 50%, transparent 65%)',
              }}
            />
            <div className="relative z-[1] flex items-center justify-between text-xs font-semibold text-amber-200/90 mb-3 px-1">
              <span>{theme === 'cosmic' ? t.themeLightLabel : t.themeDarkLabel}</span>
              <span className="font-mono-num text-emerald-300">
                {dailyStreak} {t.streakDaysCount}
              </span>
            </div>
            <div className="relative z-[1] grid grid-cols-4 gap-1.5 aspect-square p-2 rounded-2xl bg-black/55 border border-amber-300/20">
              {SHOWCASE_GRID.flatMap((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-full h-full rounded-[7px] ${
                      theme === 'cosmic' ? 'stone-slot-cosmic' : 'stone-slot-jungle'
                    }`}
                  >
                    {cell && (
                      <BlockTile
                        color={cell}
                        blockStyle={equippedStyle}
                        theme={theme}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-300/80">
        <span>RR Tech Labs · {language === 'hi' ? 'ऑफलाइन 3D पज़ल इंजन' : 'Offline 3D Puzzle Engine'}</span>
        <button
          type="button"
          onClick={onOpenSettings}
          className="hover:text-amber-300 underline underline-offset-2 transition-colors py-1"
        >
          {t.settingsAndInfo}
        </button>
      </footer>
    </div>
  );
};
