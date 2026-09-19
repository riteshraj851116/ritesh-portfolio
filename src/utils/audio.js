// Web Audio API Studio-Grade Acoustic & Haptic Sound Engine
// Designed for High-End Archival & Engineering Portfolio
// 100% real-time synthesis - Zero external audio file dependencies
// Resilient scheduling using setTargetAtTime & master gain routing

let audioCtx = null;
let masterGainNode = null;
let soundEnabled = true;
let ambientDroneNode = null;
let ambientGainNode = null;
let isAmbientActive = false;

// Cooldown limiters to prevent click echo, double-firing, and hover spamming
let lastClickTime = 0;
const CLICK_COOLDOWN_MS = 55;

let lastHoverTime = 0;
const HOVER_COOLDOWN_MS = 50;

let lastHoverBlipTime = 0;
const HOVER_BLIP_COOLDOWN_MS = 50;

let lastTouchTime = 0;

// Event listeners for UI Equalizer animation
const audioListeners = new Set();

const notifySoundPlayed = (intensity = 1) => {
  audioListeners.forEach((fn) => {
    try {
      fn(intensity);
    } catch {
      // ignore
    }
  });
};

export const subscribeAudioActivity = (callback) => {
  audioListeners.add(callback);
  return () => audioListeners.delete(callback);
};

export const getMasterGain = (ctx) => {
  if (!ctx) return null;
  if (!masterGainNode || masterGainNode.context !== ctx) {
    try {
      masterGainNode = ctx.createGain();
      masterGainNode.gain.setValueAtTime(soundEnabled ? 0.95 : 0.0, ctx.currentTime);
      masterGainNode.connect(ctx.destination);
    } catch {
      return ctx.destination;
    }
  }
  return masterGainNode;
};

export const initAudioContext = () => {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass({ latencyHint: "interactive" });
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  } catch {
    // Ignore
  }
  return audioCtx;
};

let clickMode = "mechanical"; // "mechanical" | "leica" | "press"

export const getClickMode = () => clickMode;

export const setClickMode = (mode) => {
  if (["mechanical", "leica", "press"].includes(mode)) {
    clickMode = mode;
  }
  return clickMode;
};

export const cycleClickMode = () => {
  const modes = ["mechanical", "leica", "press"];
  const nextIdx = (modes.indexOf(clickMode) + 1) % modes.length;
  clickMode = modes[nextIdx];
  playClickSound();
  return clickMode;
};

// Global user interaction unlock & zero-latency tactile click delegation
if (typeof window !== "undefined") {
  const unlock = () => {
    const ctx = initAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  };

  // Pre-warm AudioContext on earliest possible interaction
  window.addEventListener("pointerdown", unlock, { passive: true, capture: true });
  window.addEventListener("touchstart", unlock, { passive: true, capture: true });
  window.addEventListener("keydown", unlock, { passive: true, capture: true });
  window.addEventListener("click", unlock, { passive: true, capture: true });

  // Intelligent global click sound on all interactive broadsheet elements
  window.addEventListener(
    "click",
    (e) => {
      // If this click was synthesized by a touch event that already played sound, skip to prevent echo
      if (performance.now() - lastTouchTime < 380) return;
      unlock();
      const target = e.target;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("[role='button']") ||
          target.closest(".project-broadsheet-card") ||
          target.closest(".paper-postage-stamp") ||
          target.closest(".preset-btn") ||
          target.closest(".skill-filter-btn") ||
          target.closest(".about-tab-btn") ||
          target.closest(".contact-link") ||
          target.closest(".playbook-card") ||
          target.closest(".sound-mode-btn") ||
          target.closest(".interactive") ||
          target.closest("input") ||
          target.closest("summary"))
      ) {
        playClickSound();
        try {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(8);
          }
        } catch {
          // ignore
        }
      }
    },
    { passive: true }
  );

  // Dedicated touch sound on mobile taps
  window.addEventListener(
    "touchstart",
    (e) => {
      const target = e.target;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest(".preset-btn") ||
          target.closest(".skill-filter-btn") ||
          target.closest(".about-tab-btn") ||
          target.closest(".contact-link") ||
          target.closest(".project-card") ||
          target.closest(".project-broadsheet-card") ||
          target.closest(".playbook-turn-btn") ||
          target.closest("[role='button']"))
      ) {
        lastTouchTime = performance.now();
        unlock();
        playClickSound();
      }
    },
    { passive: true }
  );
}

export const isSoundEnabled = () => soundEnabled;

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  const ctx = initAudioContext();
  if (ctx && masterGainNode) {
    masterGainNode.gain.setValueAtTime(soundEnabled ? 0.95 : 0.0, ctx.currentTime);
  }
  if (soundEnabled) {
    // Play warm confirmation chime indicating sound is ACTIVE
    playToggleChime(true);
  } else {
    playToggleChime(false);
    stopAmbientDrone();
  }
  return soundEnabled;
};

// Confirmation chime when sound is turned on/off
const playToggleChime = (turnOn) => {
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime + 0.015;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const dest = getMasterGain(ctx) || ctx.destination;

    osc.type = "sine";
    if (turnOn) {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.07); // G5
    } else {
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(392.0, now + 0.07); // G4
    }

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.setTargetAtTime(0.0001, now + 0.04, 0.035);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.18);
    notifySoundPlayed(turnOn ? 0.8 : 0.3);
  } catch {
    // ignore
  }
};

/**
 * 1. TACTILE TOUCH PULSE (Mobile taps)
 */
export const playTouchSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.012;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.045);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.setTargetAtTime(0.0001, now + 0.01, 0.02);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.06);
    notifySoundPlayed(0.4);
  } catch {
    // Ignore
  }
};

/**
 * 2. REFINED ACOUSTIC HOVER TICK
 */
export const playHoverSound = (pitchOffset = 0) => {
  if (!soundEnabled) return;

  const nowMs = performance.now();
  if (nowMs - lastHoverTime < HOVER_COOLDOWN_MS) return;
  lastHoverTime = nowMs;

  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.012;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const baseFreq = Math.min(520, Math.max(220, 320 + pitchOffset * 0.4));
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + 0.035);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.setTargetAtTime(0.0001, now + 0.008, 0.015);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.05);
    notifySoundPlayed(0.3);
  } catch {
    // Ignore
  }
};

/**
 * 3. ADVANCED TACTILE MECHANICAL / EDITORIAL CLICK SOUND ENGINE
 * Guaranteed audible, crisp, satisfying click across all browsers & devices.
 */
export const playClickSound = (overrideMode = null) => {
  if (!soundEnabled) return;

  const nowMs = performance.now();
  if (nowMs - lastClickTime < CLICK_COOLDOWN_MS) return;
  lastClickTime = nowMs;

  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    // If suspended, resume immediately
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const mode = overrideMode || clickMode;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;
    const detune = 1 + (Math.random() * 0.06 - 0.03);

    if (mode === "mechanical") {
      // PROFILE 1: TACTILE MECHANICAL KEY SWITCH STRIKE (Cherry MX Blue / Model M)
      // Layer A: Crisp high-transient tactile snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      const snapFilter = ctx.createBiquadFilter();

      snapOsc.type = "triangle";
      snapOsc.frequency.setValueAtTime(2100 * detune, now);
      snapOsc.frequency.exponentialRampToValueAtTime(480 * detune, now + 0.02);

      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(1600 * detune, now);
      snapFilter.Q.setValueAtTime(2.2, now);

      snapGain.gain.setValueAtTime(0.65, now);
      snapGain.gain.setTargetAtTime(0.0001, now + 0.005, 0.012);

      snapOsc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(dest);

      snapOsc.start(now);
      snapOsc.stop(now + 0.05);

      // Layer B: Metallic leaf-spring ping
      const pingOsc = ctx.createOscillator();
      const pingGain = ctx.createGain();

      pingOsc.type = "sine";
      pingOsc.frequency.setValueAtTime(3100 * detune, now);
      pingOsc.frequency.exponentialRampToValueAtTime(1800 * detune, now + 0.018);

      pingGain.gain.setValueAtTime(0.35, now);
      pingGain.gain.setTargetAtTime(0.0001, now + 0.006, 0.014);

      pingOsc.connect(pingGain);
      pingGain.connect(dest);

      pingOsc.start(now);
      pingOsc.stop(now + 0.05);

      // Layer C: Plinth key bottom-out thud
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();

      bodyOsc.type = "sine";
      bodyOsc.frequency.setValueAtTime(155 * detune, now + 0.003);
      bodyOsc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

      bodyGain.gain.setValueAtTime(0.55, now + 0.003);
      bodyGain.gain.setTargetAtTime(0.0001, now + 0.015, 0.022);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(dest);

      bodyOsc.start(now + 0.003);
      bodyOsc.stop(now + 0.07);

      notifySoundPlayed(0.85);
    } else if (mode === "leica") {
      // PROFILE 2: PRECISION LEICA RANGEFINDER SHUTTER (Dual-stage)
      const t1 = now;
      const t2 = now + 0.022;

      // Stage 1: Shutter release micro-tick
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tickOsc.type = "triangle";
      tickOsc.frequency.setValueAtTime(2600 * detune, t1);
      tickOsc.frequency.exponentialRampToValueAtTime(950, t1 + 0.015);
      tickGain.gain.setValueAtTime(0.55, t1);
      tickGain.gain.setTargetAtTime(0.0001, t1 + 0.004, 0.01);
      tickOsc.connect(tickGain);
      tickGain.connect(dest);
      tickOsc.start(t1);
      tickOsc.stop(t1 + 0.04);

      // Stage 2: Mechanical curtain snap
      const curtainOsc = ctx.createOscillator();
      const curtainGain = ctx.createGain();
      curtainOsc.type = "sine";
      curtainOsc.frequency.setValueAtTime(720 * detune, t2);
      curtainOsc.frequency.exponentialRampToValueAtTime(140, t2 + 0.045);
      curtainGain.gain.setValueAtTime(0.6, t2);
      curtainGain.gain.setTargetAtTime(0.0001, t2 + 0.01, 0.02);
      curtainOsc.connect(curtainGain);
      curtainGain.connect(dest);
      curtainOsc.start(t2);
      curtainOsc.stop(t2 + 0.07);

      notifySoundPlayed(0.8);
    } else {
      // PROFILE 3: BROADSHEET HEAVY LETTERPRESS INK THUD
      const pressOsc = ctx.createOscillator();
      const pressGain = ctx.createGain();
      const pressFilter = ctx.createBiquadFilter();

      pressOsc.type = "triangle";
      pressOsc.frequency.setValueAtTime(520 * detune, now);
      pressOsc.frequency.exponentialRampToValueAtTime(65, now + 0.075);

      pressFilter.type = "lowpass";
      pressFilter.frequency.setValueAtTime(850, now);

      pressGain.gain.setValueAtTime(0.75, now);
      pressGain.gain.setTargetAtTime(0.0001, now + 0.015, 0.035);

      pressOsc.connect(pressFilter);
      pressFilter.connect(pressGain);
      pressGain.connect(dest);

      pressOsc.start(now);
      pressOsc.stop(now + 0.095);

      notifySoundPlayed(0.9);
    }
  } catch {
    // Ignore audio engine failures
  }
};

/**
 * 4. PRECISION TURBINE / SPEED ACCELERATION SOUND
 */
export const playEngineRevSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;
    const duration = 0.55;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(220, now + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(500, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    oscGain.gain.setValueAtTime(0.05, now);
    oscGain.gain.linearRampToValueAtTime(0.35, now + 0.2);
    oscGain.gain.setTargetAtTime(0.0001, now + duration - 0.1, 0.05);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(dest);

    osc.start(now);
    osc.stop(now + duration);
    notifySoundPlayed(0.8);
  } catch {
    // Ignore
  }
};

/**
 * 5. WARM ANALOG TELEMETRY CASCADE
 */
export const playTelemetryScan = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;
    const steps = [349.23, 440.0, 523.25, 659.25];

    steps.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + i * 0.045;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.setTargetAtTime(0.0001, noteTime + 0.02, 0.04);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(noteTime);
      osc.stop(noteTime + 0.14);
    });

    notifySoundPlayed(0.6);
  } catch {
    // Ignore
  }
};

/**
 * 6. SILKY AERODYNAMIC AIR DISPLACEMENT WHOOSH
 */
export const playCockpitWhoosh = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;
    const duration = 0.25;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.96 * b0 + white * 0.12;
      b1 = 0.91 * b1 + white * 0.18;
      data[i] = (b0 + b1) * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(980, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(260, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.06);
    gain.gain.setTargetAtTime(0.0001, now + 0.12, 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(now);
    noise.stop(now + duration);
    notifySoundPlayed(0.45);
  } catch {
    // Ignore
  }
};

/**
 * 7. TRANSMISSION SUCCESS CHIME
 */
export const playSuccessSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;
    const notes = [
      { freq: 293.66, time: 0.0, dur: 0.45, vol: 0.35 },
      { freq: 440.0, time: 0.06, dur: 0.55, vol: 0.38 },
      { freq: 739.99, time: 0.13, dur: 0.75, vol: 0.32 },
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + time;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(vol, noteTime);
      gain.gain.setTargetAtTime(0.0001, noteTime + 0.05, 0.12);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(noteTime);
      osc.stop(noteTime + dur);
    });

    notifySoundPlayed(0.85);
  } catch {
    // Ignore
  }
};

/**
 * 8. TEXT SCRAMBLE SHUFFLING TICK
 */
export const playScrambleTick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.012;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const randomFreq = 480 + Math.random() * 260;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(randomFreq, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.025);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.setTargetAtTime(0.0001, now + 0.006, 0.01);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.035);
    notifySoundPlayed(0.35);
  } catch {
    // Ignore
  }
};

/**
 * 9. AMBIENT ARCHIVAL BED
 */
export const startAmbientDrone = () => {
  if (!soundEnabled || isAmbientActive) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.02;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(65.41, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(160, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);

    ambientDroneNode = { osc, filter };
    ambientGainNode = gain;
    isAmbientActive = true;
  } catch {
    // Ignore
  }
};

export const stopAmbientDrone = () => {
  if (!isAmbientActive || !ambientGainNode) return;
  try {
    const ctx = initAudioContext();
    if (ctx && ambientGainNode) {
      const now = ctx.currentTime;
      ambientGainNode.gain.linearRampToValueAtTime(0.001, now + 0.5);
      setTimeout(() => {
        try {
          if (ambientDroneNode) {
            ambientDroneNode.osc.stop();
          }
        } catch {
          // Ignore
        }
        ambientDroneNode = null;
        ambientGainNode = null;
        isAmbientActive = false;
      }, 600);
    }
  } catch {
    isAmbientActive = false;
  }
};

export const toggleAmbientDrone = () => {
  if (isAmbientActive) {
    stopAmbientDrone();
    return false;
  } else {
    startAmbientDrone();
    return true;
  }
};

export const isAmbientPlaying = () => isAmbientActive;

/**
 * 10. REALISTIC JAPANESE ARCHIVAL PAPER FLIP SOUND
 */
export const playPaperFlipSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;
    const duration = 0.28;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.95 * b0 + white * 0.18;
      b1 = 0.90 * b1 + white * 0.28;
      output[i] = (b0 + b1) * 0.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1400, now);
    bandpass.frequency.exponentialRampToValueAtTime(650, now + duration);
    bandpass.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.04);
    noiseGain.gain.setTargetAtTime(0.0001, now + 0.08, 0.05);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(dest);

    noiseSource.start(now);
    noiseSource.stop(now + duration);

    notifySoundPlayed(0.65);
  } catch {
    // Ignore
  }
};

export const playPaperTurnSound = playPaperFlipSound;

/**
 * 11. DELICATE WOODEN ESCAPEMENT TICK
 */
export const playLoaderTick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.012;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.03);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.setTargetAtTime(0.0001, now + 0.006, 0.01);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.04);
    notifySoundPlayed(0.35);
  } catch {
    // ignore
  }
};

/**
 * 12. LUXURY STUDIO BOOT CHORD
 */
export const playBootSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.02;

    // D Major 9th Chord: D3 (146.83Hz), A3 (220.00Hz), F#4 (369.99Hz), C#5 (554.37Hz), E5 (659.25Hz)
    const chordVoices = [
      { freq: 146.83, delay: 0.0, dur: 1.4, vol: 0.35 },
      { freq: 220.0, delay: 0.05, dur: 1.3, vol: 0.32 },
      { freq: 369.99, delay: 0.1, dur: 1.2, vol: 0.28 },
      { freq: 554.37, delay: 0.16, dur: 1.1, vol: 0.24 },
      { freq: 659.25, delay: 0.22, dur: 1.0, vol: 0.2 },
    ];

    chordVoices.forEach(({ freq, delay, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + delay;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.setTargetAtTime(0.0001, startTime + 0.25, dur * 0.3);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });

    notifySoundPlayed(0.95);
  } catch {
    // ignore
  }
};

/**
 * 13. BROADSHEET HOVER BLIP (Gentle acoustic micro-tap for vintage newspaper cards)
 */
export const playHoverBlip = () => {
  if (!soundEnabled) return;

  const nowMs = performance.now();
  if (nowMs - lastHoverBlipTime < HOVER_BLIP_COOLDOWN_MS) return;
  lastHoverBlipTime = nowMs;

  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.012;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.025);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.setTargetAtTime(0.0001, now + 0.006, 0.012);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.035);
    notifySoundPlayed(0.3);
  } catch {
    // ignore
  }
};

/**
 * 14. VINTAGE POSTAGE RUBBER STAMP THUD
 */
export const playStampThud = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const dest = getMasterGain(ctx) || ctx.destination;
    const now = ctx.currentTime + 0.015;

    // Contact punch
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = "triangle";
    snapOsc.frequency.setValueAtTime(650, now);
    snapOsc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

    snapGain.gain.setValueAtTime(0.55, now);
    snapGain.gain.setTargetAtTime(0.0001, now + 0.008, 0.015);

    snapOsc.connect(snapGain);
    snapGain.connect(dest);
    snapOsc.start(now);
    snapOsc.stop(now + 0.05);

    // Deep wooden desk & rubber thud resonance
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = "sine";
    thudOsc.frequency.setValueAtTime(110, now + 0.004);
    thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    thudGain.gain.setValueAtTime(0.75, now + 0.004);
    thudGain.gain.setTargetAtTime(0.0001, now + 0.02, 0.04);

    thudOsc.connect(thudGain);
    thudGain.connect(dest);
    thudOsc.start(now + 0.004);
    thudOsc.stop(now + 0.14);

    notifySoundPlayed(0.9);
  } catch {
    // ignore
  }
};
