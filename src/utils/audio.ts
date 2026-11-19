class SoundAndHapticsEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private hapticsEnabled = true;

  public configure(sound: boolean, haptics: boolean) {
    this.soundEnabled = sound;
    this.hapticsEnabled = haptics;
  }

  private getContext(): AudioContext | null {
    if (!this.soundEnabled || typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private vibrate(pattern: number | number[]) {
    if (!this.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore unsupported environments
    }
  }

  public playPickup() {
    this.vibrate(10);
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playSnap() {
    this.vibrate(18);
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Crisp tactile pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.075);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.085);
  }

  public playInvalid() {
    this.vibrate([12, 24, 12]);
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.095);
  }

  public playLineClear(linesCount: number, comboCount: number) {
    if (linesCount >= 2 || comboCount >= 2) {
      this.vibrate([25, 25, 45]);
    } else {
      this.vibrate([22, 18, 28]);
    }

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseSemitones = Math.min(comboCount - 1, 6);
    const rootMultiplier = Math.pow(2, baseSemitones / 12);
    const notes =
      linesCount >= 3
        ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
        : linesCount === 2
        ? [523.25, 659.25, 783.99, 1046.5]
        : [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.042;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * rootMultiplier, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.13, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  public playCoinReward() {
    this.vibrate([15, 20, 25]);
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [987.77, 1318.51].forEach((freq, idx) => {
      const start = now + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.11, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.24);
    });
  }

  public playGameOver() {
    this.vibrate([60, 40, 80]);
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392.0, 349.23, 311.13, 261.63];
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.28);
    });
  }
}

export const soundEngine = new SoundAndHapticsEngine();
