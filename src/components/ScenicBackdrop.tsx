import React, { useEffect, useRef } from 'react';
import type { ThemeMode } from '../types/game';

interface ScenicBackdropProps {
  theme: ThemeMode;
}

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
  kind: 'star' | 'dust' | 'firefly';
  hue: string;
}

export const ScenicBackdrop: React.FC<ScenicBackdropProps> = React.memo(({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: AmbientParticle[] = [];
    if (theme === 'cosmic') {
      // Twinkling stars
      for (let i = 0; i < 65; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.72,
          vx: 0,
          vy: 0,
          r: 0.7 + Math.random() * 1.4,
          alpha: 0.35 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          kind: 'star',
          hue: i % 5 === 0 ? '#FDE68A' : '#E9D5FF',
        });
      }
      // Floating golden-purple cosmic dust
      for (let i = 0; i < 28; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -0.15 - Math.random() * 0.28,
          r: 1.4 + Math.random() * 2.2,
          alpha: 0.25 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          kind: 'dust',
          hue: i % 2 === 0 ? '#FBBF24' : '#C084FC',
        });
      }
    } else {
      // Emerald Jungle fireflies & mist motes
      for (let i = 0; i < 36; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.12 - Math.random() * 0.22,
          r: 1.6 + Math.random() * 2.4,
          alpha: 0.3 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          kind: 'firefly',
          hue: i % 3 === 0 ? '#FDE047' : '#34D399',
        });
      }
    }

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.025;

      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx + (p.kind === 'firefly' ? Math.sin(t + p.phase) * 0.2 : 0);
          p.y += p.vy;

          if (p.y < -12) p.y = height + 12;
          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;
        }

        const pulse = 0.55 + 0.45 * Math.sin(t * 1.4 + p.phase);
        const currentAlpha = p.alpha * pulse;

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        if (p.kind === 'star') {
          ctx.fillStyle = p.hue;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.6);
          grad.addColorStop(0, p.hue);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (!prefersReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {theme === 'cosmic' ? (
        <>
          {/* Royal Cosmic Temple Base Sky */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse 90% 65% at 50% 15%, #2D1657 0%, #14092E 48%, #060312 100%)',
            }}
          />
          {/* Golden-Purple Horizon Nebula */}
          <div
            className="absolute inset-x-0 bottom-[18%] h-[42%]"
            style={{
              background:
                'radial-gradient(ellipse 75% 55% at 50% 75%, rgba(245, 158, 11, 0.22) 0%, rgba(147, 51, 234, 0.25) 42%, transparent 78%)',
            }}
          />
          {/* Distant Crystalline Mountains & Cosmic Temple Silhouettes */}
          <svg
            viewBox="0 0 1440 520"
            preserveAspectRatio="none"
            className="absolute bottom-0 inset-x-0 w-full h-[46vh] opacity-90"
          >
            <defs>
              <linearGradient id="cosmicMtnBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4C1D95" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#090418" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="cosmicMtnFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B0764" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#04020B" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="goldRidge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Back mountain peaks */}
            <path
              d="M0,360 L180,190 L330,295 L520,145 L720,275 L910,130 L1110,255 L1290,175 L1440,280 L1440,520 L0,520 Z"
              fill="url(#cosmicMtnBack)"
            />
            {/* Temple Spire Silhouette in center */}
            <path
              d="M665,280 L690,175 L720,115 L750,175 L775,280 Z"
              fill="#1E0B3B"
              stroke="#FBBF24"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            {/* Front crystalline mountains with golden edge gleam */}
            <path
              d="M0,410 L210,250 L410,365 L610,235 L830,360 L1060,220 L1270,340 L1440,260 L1440,520 L0,520 Z"
              fill="url(#cosmicMtnFront)"
            />
            <path
              d="M0,410 L210,250 L410,365 L610,235 L830,360 L1060,220 L1270,340 L1440,260"
              fill="none"
              stroke="url(#goldRidge)"
              strokeWidth="2.2"
            />
          </svg>
        </>
      ) : (
        <>
          {/* Emerald Jungle Waterfall Twilight Sky */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse 95% 65% at 50% 10%, #0D4B38 0%, #05261C 48%, #020E0A 100%)',
            }}
          />
          {/* Moonlit Forest Mist Glow */}
          <div
            className="absolute inset-x-0 top-[14%] h-[40%]"
            style={{
              background:
                'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.12) 45%, transparent 80%)',
            }}
          />
          {/* Shimmering Moonlit Waterfall Cascade */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[8%] w-[160px] sm:w-[220px] h-[54vh] opacity-55 overflow-hidden">
            <div
              className="w-full h-full animate-waterfall-shimmer"
              style={{
                background:
                  'linear-gradient(180deg, rgba(167,243,208,0.05) 0%, rgba(110,231,183,0.45) 35%, rgba(52,211,153,0.6) 75%, rgba(16,185,129,0.08) 100%)',
                filter: 'blur(6px)',
              }}
            />
          </div>
          {/* Jungle Cliffs & Canopy Silhouettes */}
          <svg
            viewBox="0 0 1440 520"
            preserveAspectRatio="none"
            className="absolute bottom-0 inset-x-0 w-full h-[48vh] opacity-95"
          >
            <defs>
              <linearGradient id="jungleCliff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#064E3B" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#02140E" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Left Cliff & Canopy */}
            <path
              d="M0,160 Q140,180 260,250 T540,340 L620,520 L0,520 Z"
              fill="url(#jungleCliff)"
            />
            {/* Right Cliff & Canopy */}
            <path
              d="M1440,150 Q1280,190 1160,255 T880,340 L810,520 L1440,520 Z"
              fill="url(#jungleCliff)"
            />
            {/* Foreground Lagoon Pool */}
            <rect x="0" y="445" width="1440" height="75" fill="#021912" fillOpacity="0.92" />
          </svg>
          {/* Water Reflections at base */}
          <div
            className="absolute bottom-0 inset-x-0 h-[12vh] animate-water-ripple"
            style={{
              background:
                'radial-gradient(ellipse 55% 45% at 50% 60%, rgba(110, 231, 183, 0.28) 0%, rgba(16, 185, 129, 0.1) 55%, transparent 85%)',
            }}
          />
        </>
      )}

      {/* Animated Canvas Particles (Stars, Cosmic Dust, or Jungle Fireflies) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
});

ScenicBackdrop.displayName = 'ScenicBackdrop';
