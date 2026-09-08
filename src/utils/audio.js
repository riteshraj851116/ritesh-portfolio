// Web Audio API micro-sound synthesis (zero external asset dependencies)

let audioCtx = null;
let soundEnabled = true;

export const initAudioContext = () => {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  } catch {
    // Ignore
  }
  return audioCtx;
};

// Global unlock on any user interaction so browser autoplay policy allows audio immediately
if (typeof window !== "undefined") {
  const unlock = () => {
    initAudioContext();
  };
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("mousemove", unlock, { once: true, passive: true });
}

export const isSoundEnabled = () => soundEnabled;

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  initAudioContext();
  if (soundEnabled) {
    playSuccessSound();
  }
  return soundEnabled;
};

export const playHoverSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.055);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  } catch {
    // Ignore
  }
};

export const playClickSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Ignore
  }
};

export const playSuccessSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Note 1: C5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Note 2: E5
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.07);
    gain2.gain.setValueAtTime(0.2, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.19);

    // Note 3: G5
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(783.99, now + 0.14);
    gain3.gain.setValueAtTime(0.24, now + 0.14);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.14);
    osc3.stop(now + 0.35);
  } catch {
    // Ignore
  }
};
