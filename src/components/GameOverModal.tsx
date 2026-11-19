import React, { useEffect, useState } from 'react';
import { Coins, RotateCcw, Sparkles, Timer, Trophy } from 'lucide-react';
import type { Translations } from '../utils/i18n';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  isNewHighScore: boolean;
  reviveUsedInRun: boolean;
  onReviveBoard: () => void;
  onPlayAgain: () => void;
  coins: number;
  t: Translations;
}

const AD_COUNTDOWN_SECONDS = 30;

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  bestScore,
  isNewHighScore,
  reviveUsedInRun,
  onReviveBoard,
  onPlayAgain,
  coins,
  t,
}) => {
  const [adTimer, setAdTimer] = useState<number | null>(null);

  // Reset countdown whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      setAdTimer(null);
    }
  }, [isOpen]);

  // Manage 30-second Sponsored Ad countdown
  useEffect(() => {
    if (adTimer === null) return;

    if (adTimer <= 0) {
      setAdTimer(null);
      onReviveBoard();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAdTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [adTimer, onReviveBoard]);

  if (!isOpen) return null;

  const isAdPlaying = adTimer !== null;

  const handleStartAdRevive = () => {
    if (reviveUsedInRun || isAdPlaying) return;
    setAdTimer(AD_COUNTDOWN_SECONDS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 overflow-y-auto">
      <div className="w-full max-w-[364px] rounded-3xl bg-[#0D0819]/95 text-white border border-amber-300/35 shadow-[0_24px_60px_rgba(0,0,0,0.9)] p-4 sm:p-5 flex flex-col items-center text-center">
        {/* Title & Subtitle */}
        <h2 className="text-xl font-extrabold tracking-tight text-amber-200">{t.gameOverTitle}</h2>
        <p className="text-xs text-slate-300 mt-1">{t.noMovesLeft}</p>

        {/* Score Summary Strip */}
        <div className="w-full grid grid-cols-3 gap-2 mt-3.5 py-2.5 px-3 rounded-2xl bg-black/50 border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-medium text-slate-300">{t.finalScore}</span>
            <span className="text-lg font-extrabold font-mono-num text-amber-300">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/10">
            <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              {t.best}
            </span>
            <span className="text-lg font-extrabold font-mono-num">
              {bestScore.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              {t.coins}
            </span>
            <span className="text-lg font-extrabold font-mono-num text-amber-300">
              {coins.toLocaleString()}
            </span>
          </div>
        </div>

        {isNewHighScore && (
          <div className="mt-2 text-xs font-bold text-emerald-300">{t.newHighScore}</div>
        )}

        {/* Dedicated 300x250 Adsterra Container (Highlighted during 30s Sponsored Ad countdown) */}
        <div
          className={`mt-3.5 w-[300px] h-[250px] shrink-0 rounded-xl border flex flex-col items-center justify-center overflow-hidden relative transition-all duration-300 ${
            isAdPlaying
              ? 'border-2 border-emerald-400 bg-emerald-950/35 shadow-[0_0_28px_rgba(52,211,153,0.45)]'
              : 'border-dashed border-amber-300/35 bg-black/60'
          }`}
        >
          <div
            id="adsterra-gameover-slot"
            className="w-[300px] h-[250px] flex flex-col items-center justify-center p-4 text-center"
          >
            <span
              className={`text-[11px] font-semibold ${
                isAdPlaying ? 'text-emerald-300' : 'text-amber-200/70'
              }`}
            >
              {isAdPlaying ? `${t.reviveAdPlaying}: ${adTimer}s` : t.adSlotLabel}
            </span>
            <span className="text-xs font-mono-num text-amber-300/60 mt-1">300 × 250</span>
            <span className="text-[11px] text-slate-400 mt-1.5">{t.adSlotReady}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 mt-4">
          <button
            type="button"
            disabled={reviveUsedInRun || isAdPlaying}
            onClick={handleStartAdRevive}
            className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              reviveUsedInRun
                ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                : isAdPlaying
                ? 'bg-emerald-600/80 text-white border border-emerald-300/60 cursor-wait'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md active:scale-[0.98]'
            }`}
          >
            {isAdPlaying ? (
              <>
                <Timer className="w-4 h-4 shrink-0 animate-spin" />
                <span className="font-mono-num">
                  {t.reviveAdPlaying}: {adTimer}s...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{reviveUsedInRun ? t.reviveUsed : t.reviveBoard}</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isAdPlaying}
            onClick={onPlayAgain}
            className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              isAdPlaying
                ? 'bg-white/10 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 active:scale-[0.98]'
            }`}
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>{t.playAgain}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
