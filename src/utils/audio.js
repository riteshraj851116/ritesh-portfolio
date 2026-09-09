// Web Audio API Studio-Grade Acoustic & Haptic Sound Engine
// Designed for High-End Archival & Engineering Portfolio
// 100% real-time synthesis - Zero external audio file dependencies

let audioCtx = null;
let soundEnabled = true;
let ambientDroneNode = null;
let ambientGainNode = null;
let isAmbientActive = false;

// Cooldown limiter to prevent hover sound spamming
let lastHoverTime = 0;
const HOVER_COOLDOWN_MS = 65;

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

// Global user interaction unlock & intelligent tactile click delegation
if (typeof window !== "undefined") {
  const unlock = () => {
    initAudioContext();
  };
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("mousemove", unlock, { once: true, passive: true });

  // Intelligent global click sound on all interactive broadsheet elements
  window.addEventListener(
    "click",
    (e) => {
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
            navigator.vibrate(12);
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
        playTouchSound();
      }
    },
    { passive: true }
  );
}

export const isSoundEnabled = () => soundEnabled;

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  initAudioContext();
  if (soundEnabled) {
    playClickSound();
  } else {
    stopAmbientDrone();
  }
  return soundEnabled;
};

/**
 * 1. TACTILE TOUCH PULSE (Mobile taps)
 * Ultra-subtle Apple-style Taptic haptic pulse: warm, low-frequency damped impulse.
 */
export const playTouchSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm sub-frequency thump (mimicking mechanical linear resonance)
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.045);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(240, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
    notifySoundPlayed(0.4);
  } catch {
    // Ignore
  }
};

/**
 * 2. REFINED ACOUSTIC HOVER TICK
 * Subtle, warm wooden/glass micro-tap (like a high-end camera wheel or tactile dial).
 * Rate-limited so mouse movements never create a chaotic buzz.
 */
export const playHoverSound = (pitchOffset = 0) => {
  if (!soundEnabled) return;

  const nowMs = performance.now();
  if (nowMs - lastHoverTime < HOVER_COOLDOWN_MS) return;
  lastHoverTime = nowMs;

  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Body tone: warm resonant sine blip
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const baseFreq = Math.min(420, Math.max(180, 240 + pitchOffset * 0.4));
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, now + 0.03);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);

    // Very gentle volume envelope
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
    notifySoundPlayed(0.25);
  } catch {
    // Ignore
  }
};

/**
 * 3. ADVANCED TACTILE MECHANICAL / EDITORIAL CLICK SOUND ENGINE
 * Real-time physical modeling with organic micro-pitch detuning (±3.5%)
 * Supports 3 high-fidelity tactile profiles: "mechanical", "leica", "press".
 */
export const playClickSound = (overrideMode = null) => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const mode = overrideMode || clickMode;
    const now = ctx.currentTime;
    // Organic micro-pitch detuning prevents the repetitive "machine-gun" buzz
    const detune = 1 + (Math.random() * 0.07 - 0.035);

    if (mode === "mechanical") {
      // PROFILE 1: TACTILE MECHANICAL TYPEWRITER / KEY SWITCH STRIKE
      // Layer A: Crisp mechanical contact transient snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      const snapFilter = ctx.createBiquadFilter();

      snapOsc.type = "triangle";
      snapOsc.frequency.setValueAtTime(1850 * detune, now);
      snapOsc.frequency.exponentialRampToValueAtTime(420 * detune, now + 0.012);

      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(1450 * detune, now);
      snapFilter.Q.setValueAtTime(2.6, now);

      snapGain.gain.setValueAtTime(0.24, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      snapOsc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.012);

      // Layer B: Metallic leaf-spring click ping
      const pingOsc = ctx.createOscillator();
      const pingGain = ctx.createGain();
      pingOsc.type = "sine";
      pingOsc.frequency.setValueAtTime(2900 * detune, now);
      pingOsc.frequency.exponentialRampToValueAtTime(1900 * detune, now + 0.009);

      pingGain.gain.setValueAtTime(0.12, now);
      pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.009);

      pingOsc.connect(pingGain);
      pingGain.connect(ctx.destination);
      pingOsc.start(now);
      pingOsc.stop(now + 0.009);

      // Layer C: Resonant oak typewriter plinth thud
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();

      bodyOsc.type = "sine";
      bodyOsc.frequency.setValueAtTime(135 * detune, now + 0.002);
      bodyOsc.frequency.exponentialRampToValueAtTime(42, now + 0.045);

      bodyGain.gain.setValueAtTime(0.26, now + 0.002);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now + 0.002);
      bodyOsc.stop(now + 0.045);

      notifySoundPlayed(0.75);
    } else if (mode === "leica") {
      // PROFILE 2: PRECISION LEICA RANGEFINDER SHUTTER CLICK (Dual-stage)
      const t1 = now;
      const t2 = now + 0.014;

      // First stage: contact release micro-tick
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tickOsc.type = "triangle";
      tickOsc.frequency.setValueAtTime(2400 * detune, t1);
      tickOsc.frequency.exponentialRampToValueAtTime(800, t1 + 0.006);
      tickGain.gain.setValueAtTime(0.18, t1);
      tickGain.gain.exponentialRampToValueAtTime(0.001, t1 + 0.006);
      tickOsc.connect(tickGain);
      tickGain.connect(ctx.destination);
      tickOsc.start(t1);
      tickOsc.stop(t1 + 0.006);

      // Second stage: mechanical curtain snap & body
      const curtainOsc = ctx.createOscillator();
      const curtainGain = ctx.createGain();
      curtainOsc.type = "sine";
      curtainOsc.frequency.setValueAtTime(620 * detune, t2);
      curtainOsc.frequency.exponentialRampToValueAtTime(110, t2 + 0.035);
      curtainGain.gain.setValueAtTime(0.25, t2);
      curtainGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.035);
      curtainOsc.connect(curtainGain);
      curtainGain.connect(ctx.destination);
      curtainOsc.start(t2);
      curtainOsc.stop(t2 + 0.035);

      notifySoundPlayed(0.7);
    } else {
      // PROFILE 3: BROADSHEET HEAVY LETTERPRESS INK THUD
      const pressOsc = ctx.createOscillator();
      const pressGain = ctx.createGain();
      const pressFilter = ctx.createBiquadFilter();

      pressOsc.type = "triangle";
      pressOsc.frequency.setValueAtTime(450 * detune, now);
      pressOsc.frequency.exponentialRampToValueAtTime(50, now + 0.065);

      pressFilter.type = "lowpass";
      pressFilter.frequency.setValueAtTime(750, now);

      pressGain.gain.setValueAtTime(0.32, now);
      pressGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      pressOsc.connect(pressFilter);
      pressFilter.connect(pressGain);
      pressGain.connect(ctx.destination);

      pressOsc.start(now);
      pressOsc.stop(now + 0.065);

      notifySoundPlayed(0.85);
    }
  } catch {
    // Ignore audio engine failures
  }
};

/**
 * 4. PRECISION TURBINE / SPEED ACCELERATION SOUND (Replacing harsh raw noise)
 * Warm, aerodynamic frequency whoosh with rich harmonic resonance.
 */
export const playEngineRevSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.6;

    // Fundamental warm turbine hum
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(220, now + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
    filter.frequency.exponentialRampToValueAtTime(500, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    oscGain.gain.setValueAtTime(0.04, now);
    oscGain.gain.linearRampToValueAtTime(0.22, now + 0.22);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Warm sub-bass body
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(65, now);
    subOsc.frequency.exponentialRampToValueAtTime(190, now + 0.25);
    subOsc.frequency.exponentialRampToValueAtTime(110, now + duration);

    subGain.gain.setValueAtTime(0.02, now);
    subGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(ctx.destination);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

    subOsc.start(now);
    subOsc.stop(now + duration);

    notifySoundPlayed(0.85);
  } catch {
    // Ignore
  }
};

/**
 * 5. WARM ANALOG TELEMETRY CASCADE (Replacing piercing robotic beeps)
 * Soft, tranquil pentatonic glass marimba trickle.
 */
export const playTelemetryScan = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Warm mid-range acoustic frequencies: F4, A4, C5, E5
    const steps = [349.23, 440.0, 523.25, 659.25];

    steps.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const noteTime = now + i * 0.045;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, noteTime);

      gain.gain.setValueAtTime(0.08, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.12);
    });

    notifySoundPlayed(0.5);
  } catch {
    // Ignore
  }
};

/**
 * 6. SILKY AERODYNAMIC AIR DISPLACEMENT WHOOSH
 * Warm, organic air sweep for card reveals and page transitions.
 */
export const playCockpitWhoosh = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.26;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Warm pink-ish noise texture
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.4;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(980, now + 0.11);
    filter.frequency.exponentialRampToValueAtTime(260, now + duration);
    filter.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    notifySoundPlayed(0.4);
  } catch {
    // Ignore
  }
};

/**
 * 7. TRANSMISSION SUCCESS CHIME (Warm acoustic dual bell)
 */
export const playSuccessSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Rich harmonic chord: D4 + A4 + F#5
    const notes = [
      { freq: 293.66, time: 0.0, dur: 0.5, vol: 0.15 },
      { freq: 440.0, time: 0.06, dur: 0.6, vol: 0.16 },
      { freq: 739.99, time: 0.14, dur: 0.8, vol: 0.12 },
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const noteTime = now + time;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, noteTime);

      gain.gain.setValueAtTime(vol, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + dur);
    });

    notifySoundPlayed(0.75);
  } catch {
    // Ignore
  }
};

/**
 * 8. TEXT SCRAMBLE SHUFFLING TICK (Tactile typewriter parchment key-strike)
 */
export const playScrambleTick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const randomFreq = 420 + Math.random() * 240;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(randomFreq, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(2.0, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
    notifySoundPlayed(0.35);
  } catch {
    // Ignore
  }
};

/**
 * 9. AMBIENT ARCHIVAL BED (Soft, soothing warm room presence)
 */
export const startAmbientDrone = () => {
  if (!soundEnabled || isAmbientActive) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Warm analog sub-bed
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(65.41, now); // C2 warm tone

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(160, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 2.0); // Ultra-gentle background presence

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

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
      ambientGainNode.gain.linearRampToValueAtTime(0.001, now + 0.6);
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
      }, 700);
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
 * Multi-layer tactile parchment friction + gentle air displacement puff.
 * Designed to sound like genuine heavy rag paper turning in a luxury leather dossier.
 */
export const playPaperFlipSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.28;

    // Layer 1: Filtered parchment surface rustle
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.95 * b0 + white * 0.15;
      b1 = 0.90 * b1 + white * 0.25;
      output[i] = (b0 + b1) * 0.5;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Resonant bandpass filter sweeping to mimic sliding paper grain
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(1400, now);
    bandpass.frequency.exponentialRampToValueAtTime(650, now + duration);
    bandpass.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // Layer 2: Subtle low-frequency air puff as page turns over
    const puffOsc = ctx.createOscillator();
    const puffGain = ctx.createGain();
    const puffFilter = ctx.createBiquadFilter();

    puffOsc.type = "sine";
    puffOsc.frequency.setValueAtTime(120, now);
    puffOsc.frequency.exponentialRampToValueAtTime(50, now + duration);

    puffFilter.type = "lowpass";
    puffFilter.frequency.setValueAtTime(160, now);

    puffGain.gain.setValueAtTime(0.01, now);
    puffGain.gain.linearRampToValueAtTime(0.11, now + 0.035);
    puffGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    puffOsc.connect(puffFilter);
    puffFilter.connect(puffGain);
    puffGain.connect(ctx.destination);

    puffOsc.start(now);
    puffOsc.stop(now + duration);

    notifySoundPlayed(0.55);
  } catch {
    // Ignore audio failures
  }
};

/**
 * 11. DELICATE WOODEN ESCAPEMENT TICK (Precision horology micro-click)
 * Fired cleanly on loader language cycles and milestones.
 */
export const playLoaderTick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Crisp mechanical horology click
    osc.type = "triangle";
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(190, now + 0.03);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(750, now);
    filter.Q.setValueAtTime(1.8, now);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
    notifySoundPlayed(0.25);
  } catch {
    // ignore
  }
};

/**
 * 12. LUXURY STUDIO BOOT CHORD (Rich D-Major 9th Analog Harmonic Chime)
 * World-class initialization chord: warm, spacious, breathtaking.
 */
export const playBootSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // D Major 9th Chord: D3 (146.83Hz), A3 (220.00Hz), F#4 (369.99Hz), C#5 (554.37Hz), E5 (659.25Hz)
    const chordVoices = [
      { freq: 146.83, delay: 0.0, dur: 1.4, vol: 0.16 },
      { freq: 220.0, delay: 0.05, dur: 1.3, vol: 0.14 },
      { freq: 369.99, delay: 0.1, dur: 1.2, vol: 0.12 },
      { freq: 554.37, delay: 0.16, dur: 1.1, vol: 0.1 },
      { freq: 659.25, delay: 0.22, dur: 1.0, vol: 0.08 },
    ];

    chordVoices.forEach(({ freq, delay, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const startTime = now + delay;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });

    notifySoundPlayed(0.9);
  } catch {
    // ignore
  }
};

/**
 * 13. BROADSHEET HOVER BLIP (Gentle acoustic micro-tap for vintage newspaper cards)
 */
export const playHoverBlip = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
    notifySoundPlayed(0.2);
  } catch {
    // ignore
  }
};

/**
 * 14. VINTAGE POSTAGE RUBBER STAMP THUD
 * Crisp mechanical contact followed by heavy ink-soaked rubber resonance
 */
export const playStampThud = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Contact punch
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = "triangle";
    snapOsc.frequency.setValueAtTime(600, now);
    snapOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    snapGain.gain.setValueAtTime(0.25, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.04);

    // Deep wooden desk & rubber thud resonance
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = "sine";
    thudOsc.frequency.setValueAtTime(95, now + 0.005);
    thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    thudGain.gain.setValueAtTime(0.35, now + 0.005);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now + 0.005);
    thudOsc.stop(now + 0.12);

    notifySoundPlayed(0.85);
  } catch {
    // ignore
  }
};

