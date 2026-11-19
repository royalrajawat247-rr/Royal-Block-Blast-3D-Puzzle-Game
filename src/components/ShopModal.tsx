import React from 'react';
import { Check, Coins, Flame, Lock, X } from 'lucide-react';
import type { BlockColorId, BlockStyleId, ThemeMode } from '../types/game';
import type { Translations } from '../utils/i18n';
import { DAILY_STREAK_REWARDS } from '../utils/storage';
import { BlockTile } from './BlockTile';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  t: Translations;
  coins: number;
  dailyStreak: number;
  canClaimToday: boolean;
  onClaimDaily: () => void;
  unlockedStyles: BlockStyleId[];
  equippedStyle: BlockStyleId;
  onUnlockStyle: (style: BlockStyleId, price: number) => void;
  onEquipStyle: (style: BlockStyleId) => void;
}

const SHOP_STYLES: {
  id: BlockStyleId;
  price: number;
  previewColors: BlockColorId[];
}[] = [
  { id: 'crystal', price: 0, previewColors: ['royal', 'emerald', 'gold', 'ruby'] },
  { id: 'neon', price: 120, previewColors: ['violet', 'ruby', 'emerald', 'gold'] },
  { id: 'gold', price: 250, previewColors: ['gold', 'royal', 'gold', 'emerald'] },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  theme,
  t,
  coins,
  dailyStreak,
  canClaimToday,
  onClaimDaily,
  unlockedStyles,
  equippedStyle,
  onUnlockStyle,
  onEquipStyle,
}) => {
  if (!isOpen) return null;

  const activeDayIndex = canClaimToday ? dailyStreak % 7 : (dailyStreak - 1 + 7) % 7;

  const getStyleTitle = (id: BlockStyleId) => {
    if (id === 'crystal') return t.styleCrystalName;
    if (id === 'neon') return t.styleNeonName;
    return t.styleGoldName;
  };

  const getStyleDesc = (id: BlockStyleId) => {
    if (id === 'crystal') return t.styleCrystalDesc;
    if (id === 'neon') return t.styleNeonDesc;
    return t.styleGoldDesc;
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
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-lg font-bold tracking-tight truncate">{t.shopTitle}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-300 font-mono-num">
              <Coins className="w-4 h-4 shrink-0" />
              <span>{coins}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Daily Streak Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-base font-bold">{t.dailyStreakTitle}</h3>
              </div>
              <span className="text-xs font-semibold text-slate-300 font-mono-num">
                {dailyStreak} {t.streakDaysCount}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{t.streakInfo}</p>

            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {DAILY_STREAK_REWARDS.map((reward, idx) => {
                const isPast = canClaimToday ? idx < activeDayIndex : idx <= activeDayIndex;
                const isTodayClaimable = canClaimToday && idx === activeDayIndex;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-between py-2 px-1 rounded-xl border text-center transition-colors ${
                      isTodayClaimable
                        ? 'border-amber-400 bg-amber-500/20'
                        : isPast
                        ? 'border-emerald-500/50 bg-emerald-950/40 opacity-85'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-slate-300">
                      {t.dayLabel} {idx + 1}
                    </span>
                    <span className="text-xs font-bold font-mono-num text-amber-300 my-1">
                      +{reward}
                    </span>
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!canClaimToday}
              onClick={onClaimDaily}
              className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                canClaimToday
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md active:scale-[0.99]'
                  : 'bg-white/10 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Coins className="w-4 h-4 shrink-0" />
              <span>
                {canClaimToday
                  ? `${t.claimReward} +${DAILY_STREAK_REWARDS[activeDayIndex]}`
                  : t.claimedToday}
              </span>
            </button>
          </section>

          <hr className="border-white/10" />

          {/* Block Styles Shop */}
          <section className="space-y-3">
            <h3 className="text-base font-bold">{t.blockStylesTitle}</h3>
            <div className="space-y-3">
              {SHOP_STYLES.map((item) => {
                const isUnlocked = unlockedStyles.includes(item.id);
                const isEquipped = equippedStyle === item.id;
                const canAfford = coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-colors ${
                      isEquipped
                        ? 'border-amber-400/60 bg-amber-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    {/* Live 2x2 3D Gem Preview */}
                    <div className="w-12 h-12 shrink-0 grid grid-cols-2 gap-1 p-1.5 rounded-xl bg-black/70 border border-amber-300/25">
                      {item.previewColors.map((c, idx) => (
                        <BlockTile
                          key={idx}
                          color={c}
                          blockStyle={item.id}
                          theme={theme}
                        />
                      ))}
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{getStyleTitle(item.id)}</div>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                        {getStyleDesc(item.id)}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      {isEquipped ? (
                        <button
                          type="button"
                          disabled
                          className="min-h-[44px] px-3.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t.equipped}</span>
                        </button>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => onEquipStyle(item.id)}
                          className="min-h-[44px] px-4 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors whitespace-nowrap"
                        >
                          {t.equip}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => onUnlockStyle(item.id, item.price)}
                          className={`min-h-[44px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                              : 'bg-white/10 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span className="font-mono-num">{item.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
