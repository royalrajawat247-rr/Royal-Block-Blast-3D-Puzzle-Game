import React from 'react';
import type { BlockColorId, BlockStyleId, ThemeMode } from '../types/game';

interface BlockTileProps {
  color: BlockColorId;
  blockStyle: BlockStyleId;
  theme: ThemeMode;
  isGhost?: boolean;
  isClearHighlight?: boolean;
  isDragging?: boolean;
  className?: string;
}

interface GemPalette {
  bodyGradient: string;
  facetTop: string;
  facetBottom: string;
  topHighlight: string;
  borderBevel: string;
  bevelShadow: string;
  neonGlow: string;
  particleHex: string;
}

const GEM_PALETTE: Record<BlockColorId, GemPalette> = {
  royal: {
    // Deep Sapphire Crystal
    bodyGradient: 'from-sky-300 via-blue-600 to-indigo-900',
    facetTop: 'from-white/55 via-sky-200/25 to-transparent',
    facetBottom: 'from-transparent via-blue-950/35 to-indigo-950/80',
    topHighlight: 'border-t-sky-200/80 border-l-sky-200/60 border-r-indigo-900/70 border-b-indigo-950/90',
    borderBevel: 'border-sky-300/40',
    bevelShadow: 'shadow-[0_4px_0_rgba(30,27,75,0.9),0_6px_12px_rgba(37,99,235,0.4)]',
    neonGlow: 'shadow-[inset_0_0_12px_rgba(56,189,248,0.75),0_0_14px_rgba(59,130,246,0.65)]',
    particleHex: '#38BDF8',
  },
  emerald: {
    // Rich Emerald Gem
    bodyGradient: 'from-emerald-200 via-emerald-500 to-teal-900',
    facetTop: 'from-white/55 via-emerald-100/25 to-transparent',
    facetBottom: 'from-transparent via-emerald-950/35 to-teal-950/80',
    topHighlight: 'border-t-emerald-100/80 border-l-emerald-200/60 border-r-teal-900/70 border-b-teal-950/90',
    borderBevel: 'border-emerald-200/40',
    bevelShadow: 'shadow-[0_4px_0_rgba(4,47,46,0.92),0_6px_12px_rgba(16,185,129,0.4)]',
    neonGlow: 'shadow-[inset_0_0_12px_rgba(52,211,153,0.75),0_0_14px_rgba(16,185,129,0.65)]',
    particleHex: '#34D399',
  },
  gold: {
    // 24k Royal Gold Bullion / Citrine
    bodyGradient: 'from-amber-100 via-amber-400 to-amber-800',
    facetTop: 'from-white/70 via-amber-100/35 to-transparent',
    facetBottom: 'from-transparent via-amber-900/30 to-amber-950/80',
    topHighlight: 'border-t-amber-50/90 border-l-amber-100/70 border-r-amber-800/70 border-b-amber-950/90',
    borderBevel: 'border-amber-200/50',
    bevelShadow: 'shadow-[0_4px_0_rgba(120,53,15,0.92),0_6px_14px_rgba(245,158,11,0.45)]',
    neonGlow: 'shadow-[inset_0_0_12px_rgba(253,224,71,0.8),0_0_14px_rgba(245,158,11,0.65)]',
    particleHex: '#FBBF24',
  },
  ruby: {
    // Faceted Crimson Ruby
    bodyGradient: 'from-rose-200 via-rose-600 to-red-950',
    facetTop: 'from-white/55 via-rose-200/25 to-transparent',
    facetBottom: 'from-transparent via-red-950/35 to-rose-950/85',
    topHighlight: 'border-t-rose-100/80 border-l-rose-200/60 border-r-red-900/70 border-b-rose-950/90',
    borderBevel: 'border-rose-200/40',
    bevelShadow: 'shadow-[0_4px_0_rgba(76,5,25,0.92),0_6px_12px_rgba(225,29,72,0.45)]',
    neonGlow: 'shadow-[inset_0_0_12px_rgba(251,113,133,0.75),0_0_14px_rgba(244,63,94,0.65)]',
    particleHex: '#FB7185',
  },
  violet: {
    // Royal Amethyst Gem
    bodyGradient: 'from-fuchsia-200 via-purple-600 to-violet-950',
    facetTop: 'from-white/55 via-fuchsia-100/25 to-transparent',
    facetBottom: 'from-transparent via-purple-950/35 to-violet-950/85',
    topHighlight: 'border-t-fuchsia-100/80 border-l-purple-200/60 border-r-violet-900/70 border-b-violet-950/90',
    borderBevel: 'border-purple-200/40',
    bevelShadow: 'shadow-[0_4px_0_rgba(46,16,101,0.92),0_6px_12px_rgba(168,85,247,0.45)]',
    neonGlow: 'shadow-[inset_0_0_12px_rgba(216,180,254,0.75),0_0_14px_rgba(168,85,247,0.65)]',
    particleHex: '#C084FC',
  },
};

export function getParticleHex(color: BlockColorId, _theme: ThemeMode): string {
  return GEM_PALETTE[color].particleHex;
}

export const BlockTile: React.FC<BlockTileProps> = React.memo(
  ({
    color,
    blockStyle,
    theme,
    isGhost = false,
    isClearHighlight = false,
    isDragging = false,
    className = '',
  }) => {
    const gem = GEM_PALETTE[color];

    if (isGhost) {
      return (
        <div
          className={`relative w-full h-full rounded-[7px] border-2 transition-opacity duration-75 ${
            theme === 'cosmic'
              ? 'bg-amber-300/20 border-amber-300/75 shadow-[inset_0_0_8px_rgba(251,191,36,0.4)]'
              : 'bg-emerald-300/20 border-emerald-300/80 shadow-[inset_0_0_8px_rgba(52,211,153,0.4)]'
          } ${className}`}
        />
      );
    }

    const highlightClass = isClearHighlight
      ? 'ring-2 ring-white brightness-125 scale-[1.04] z-10'
      : '';

    const dragShadow = isDragging
      ? 'shadow-[0_14px_24px_rgba(0,0,0,0.75)]'
      : gem.bevelShadow;

    // Style 2: Neon Cyber 3D Prism
    if (blockStyle === 'neon') {
      return (
        <div
          className={`relative w-full h-full rounded-[7px] border-[1.5px] overflow-hidden bg-slate-950/90 ${
            gem.topHighlight
          } ${isDragging ? 'shadow-[0_14px_24px_rgba(0,0,0,0.8)]' : gem.neonGlow} ${highlightClass} ${className}`}
        >
          <div
            className={`absolute inset-[3px] rounded-[4px] bg-gradient-to-br ${gem.bodyGradient} opacity-85`}
          />
          <div className="absolute inset-[5px] rounded-[3px] border border-white/60 pointer-events-none" />
          <div className="absolute top-[3px] left-[4px] right-[4px] h-[28%] rounded-t-[3px] bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
        </div>
      );
    }

    // Style 3: Gold Ingot 3D Bullion + Inset Gem
    if (blockStyle === 'gold') {
      return (
        <div
          className={`relative w-full h-full rounded-[7px] border-[1.5px] overflow-hidden bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 border-t-amber-50/90 border-l-amber-100/80 border-r-amber-800/80 border-b-amber-950/95 ${
            isDragging
              ? 'shadow-[0_14px_24px_rgba(0,0,0,0.78)]'
              : 'shadow-[0_4px_0_rgba(120,53,15,0.92),0_6px_12px_rgba(245,158,11,0.4)]'
          } ${highlightClass} ${className}`}
        >
          {/* Bullion chamfer frame */}
          <div className="absolute inset-[3px] rounded-[4px] border border-amber-100/75 bg-gradient-to-b from-amber-100/40 via-transparent to-amber-950/30 pointer-events-none" />
          {/* Inset faceted gem */}
          <div
            className={`absolute inset-[22%] rounded-[4px] bg-gradient-to-br ${gem.bodyGradient} border border-white/55 shadow-inner pointer-events-none`}
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/55 to-transparent rounded-t-[3px]" />
          </div>
          {/* Specular top glint */}
          <div className="absolute top-[2px] left-[4px] right-[4px] h-[2px] rounded-full bg-white/85 pointer-events-none" />
        </div>
      );
    }

    // Style 1 (Default): Realistic 3D Glossy Crystal Gem
    return (
      <div
        className={`relative w-full h-full rounded-[7px] border-[1.5px] overflow-hidden bg-gradient-to-br ${gem.bodyGradient} ${gem.topHighlight} ${dragShadow} ${highlightClass} ${className}`}
      >
        {/* Top crystal bevel plane */}
        <div
          className={`absolute inset-x-0 top-0 h-[44%] bg-gradient-to-b ${gem.facetTop} pointer-events-none`}
        />
        {/* Bottom bevel shadow */}
        <div
          className={`absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-b ${gem.facetBottom} pointer-events-none`}
        />
        {/* Faceted inner octahedron table */}
        <div
          className={`absolute inset-[18%] rounded-[3px] border ${gem.borderBevel} bg-gradient-to-br from-white/25 via-transparent to-black/25 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] pointer-events-none`}
        />
        {/* Diagonal glossy specular streak */}
        <div
          className="absolute -top-1 -left-1 w-[65%] h-[36%] bg-gradient-to-br from-white/75 via-white/20 to-transparent -rotate-12 pointer-events-none"
        />
        {/* Corner diamond glint */}
        <div className="absolute top-[3px] left-[3px] w-[5px] h-[5px] rounded-full bg-white/85 blur-[0.4px] pointer-events-none" />
      </div>
    );
  }
);

BlockTile.displayName = 'BlockTile';
