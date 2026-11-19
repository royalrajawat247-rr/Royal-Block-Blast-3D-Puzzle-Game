import React, { useState } from 'react';
import {
  Check,
  Copy,
  Languages,
  Mail,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trees,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { Language, ThemeMode } from '../types/game';
import type { Translations } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  onResetBoard: () => void;
  t: Translations;
}

const SUPPORT_EMAIL = 'royalrajawat247@gmail.com';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  hapticsEnabled,
  onToggleHaptics,
  onResetBoard,
  t,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setConfirmReset(false);
    onResetBoard();
    onClose();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback copy method if clipboard API is restricted
      const input = document.createElement('input');
      input.value = SUPPORT_EMAIL;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[88dvh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-[#0D0819]/95 text-white border border-amber-300/30 shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-bold tracking-tight">{t.settingsTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Audio & Haptics */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300">{t.audioAndTouch}</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onToggleSound}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                  soundEnabled
                    ? 'border-amber-400/50 bg-amber-500/15 text-amber-200'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 shrink-0" />
                )}
                <span>{soundEnabled ? t.soundOn : t.soundOff}</span>
              </button>

              <button
                type="button"
                onClick={onToggleHaptics}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                  hapticsEnabled
                    ? 'border-amber-400/50 bg-amber-500/15 text-amber-200'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>{hapticsEnabled ? t.hapticsOn : t.hapticsOff}</span>
              </button>
            </div>
          </section>

          {/* Scenic Theme & Language */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300">{t.appearanceAndLang}</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onToggleTheme}
                className="min-h-[48px] px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                {theme === 'cosmic' ? (
                  <Trees className="w-4 h-4 text-emerald-300 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                )}
                <span className="truncate">
                  {theme === 'cosmic' ? t.themeSwitchToDark : t.themeSwitchToLight}
                </span>
              </button>

              <button
                type="button"
                onClick={onToggleLanguage}
                className="min-h-[48px] px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Languages className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{language === 'en' ? 'English · हिंदी' : 'हिंदी · English'}</span>
              </button>
            </div>
          </section>

          {/* Match Controls */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300">{t.gameControls}</h3>
            <button
              type="button"
              onClick={handleResetClick}
              className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                confirmReset
                  ? 'border-rose-400 bg-rose-600 text-white'
                  : 'border-white/15 bg-white/5 text-rose-300 hover:bg-rose-950/40'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>{confirmReset ? t.resetBoardConfirm : t.resetBoardAction}</span>
            </button>
          </section>

          <hr className="border-white/10" />

          {/* RR Tech Labs Support with Direct Mailto + 1-Click Copy */}
          <section className="space-y-3 p-4 rounded-2xl border border-amber-400/25 bg-amber-500/10">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-300 shrink-0" />
              <h3 className="text-sm font-bold text-amber-100">{t.supportTitle}</h3>
            </div>
            <p className="text-xs text-slate-200/85 leading-relaxed">{t.supportDesc}</p>

            <div className="text-xs font-mono-num font-bold text-amber-300 select-all">
              {SUPPORT_EMAIL}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Royal%20Block%20Blast%20Support`}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{t.sendEmailAction}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-amber-300/35 bg-white/10 hover:bg-white/15 text-amber-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="text-emerald-300">{t.emailCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.copyEmailAction}</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* 100% Offline Zero Data Collection Privacy Policy */}
          <section className="p-4 rounded-2xl border border-emerald-400/30 bg-emerald-950/35 space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <h3 className="text-sm font-bold text-emerald-200">{t.privacyTitle}</h3>
            </div>
            <p className="text-xs text-emerald-100/85 leading-relaxed">{t.privacyDesc}</p>
            <ul className="space-y-1.5 text-xs text-emerald-100/75 list-disc pl-4">
              {t.privacyBullets.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
