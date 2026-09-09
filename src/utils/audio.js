// Web Audio API High-Performance Motorsport & Cyber Sound Engine
// 100% synthesized in real-time - Zero external asset dependencies

let audioCtx = null;
let soundEnabled = true;
let ambientDroneNode = null;
let ambientGainNode = null;
let isAmbientActive = false;

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

// Global user interaction unlock
if (typeof window !== "undefined") {
  const unlock = () => {
    initAudioContext();
  };
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("mousemove", unlock, { once: true, passive: true });

  // Dedicated touch sound on any interactive element
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
          target.closest(".ln-helmet-frame-box") ||
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
    playSuccessSound();
  } else {
    stopAmbientDrone();
  }
  return soundEnabled;
};

// 1. TACTILE TOUCH SOUND (Mobile taps)
export const playTouchSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
    notifySoundPlayed(0.6);
  } catch {
    // Ignore
  }
};

// 2. HIGH-TECH HOVER TICK (Subtle cyber blip)
export const playHoverSound = (pitchOffset = 0) => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 540 + pitchOffset;
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
    notifySoundPlayed(0.4);
  } catch {
    // Ignore
  }
};

// 3. MECHANICAL RELAY / SHUTTER CLICK
export const playClickSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Transient noise click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
    notifySoundPlayed(0.8);
  } catch {
    // Ignore
  }
};

// 4. F1 RACING ENGINE THROTTLE REV (Visceral Motorsport Power Unit Synth)
export const playEngineRevSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.55;

    // Low-end combustion rumble (Sawtooth)
    const engineOsc = ctx.createOscillator();
    const engineGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    engineOsc.type = "sawtooth";
    // Pitch rev from 95Hz to 520Hz then decelerate to 310Hz
    engineOsc.frequency.setValueAtTime(95, now);
    engineOsc.frequency.exponentialRampToValueAtTime(540, now + 0.28);
    engineOsc.frequency.exponentialRampToValueAtTime(280, now + duration);

    // Turbocharger whine (Square / high harmonic)
    const turboOsc = ctx.createOscillator();
    const turboGain = ctx.createGain();
    turboOsc.type = "sine";
    turboOsc.frequency.setValueAtTime(450, now);
    turboOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.28);
    turboOsc.frequency.exponentialRampToValueAtTime(900, now + duration);

    turboGain.gain.setValueAtTime(0.01, now);
    turboGain.gain.linearRampToValueAtTime(0.08, now + 0.24);
    turboGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Dynamic low-pass filter sweep for roaring open throttle
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(3600, now + 0.26);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);
    filter.Q.setValueAtTime(4.5, now);

    // Overall engine amplitude envelope
    engineGain.gain.setValueAtTime(0.05, now);
    engineGain.gain.linearRampToValueAtTime(0.35, now + 0.22);
    engineGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Exhaust crackle pop towards end
    const crackleOsc = ctx.createOscillator();
    const crackleGain = ctx.createGain();
    crackleOsc.type = "triangle";
    crackleOsc.frequency.setValueAtTime(140, now + 0.32);
    crackleOsc.frequency.linearRampToValueAtTime(60, now + 0.44);
    crackleGain.gain.setValueAtTime(0, now);
    crackleGain.gain.setValueAtTime(0.18, now + 0.32);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    // Routing
    engineOsc.connect(filter);
    filter.connect(engineGain);
    engineGain.connect(ctx.destination);

    turboOsc.connect(turboGain);
    turboGain.connect(ctx.destination);

    crackleOsc.connect(crackleGain);
    crackleGain.connect(ctx.destination);

    engineOsc.start(now);
    engineOsc.stop(now + duration);

    turboOsc.start(now);
    turboOsc.stop(now + duration);

    crackleOsc.start(now + 0.32);
    crackleOsc.stop(now + 0.45);

    notifySoundPlayed(1.0);
  } catch {
    // Ignore
  }
};

// 5. CYBER TELEMETRY SCAN (For switching tabs, milestones, inspection)
export const playTelemetryScan = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const steps = [880, 1174.66, 1479.98, 1760];

    steps.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + i * 0.035;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.14, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.08);
    });

    notifySoundPlayed(0.7);
  } catch {
    // Ignore
  }
};

// 6. AERODYNAMIC COCKPIT WHOOSH (Card hover & modal entry)
export const playCockpitWhoosh = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.22);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.22);

    notifySoundPlayed(0.5);
  } catch {
    // Ignore
  }
};

// 7. TRANSMISSION SUCCESS CHIME (Form dispatched or copied)
export const playSuccessSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [587.33, 739.99, 880.0, 1174.66]; // D-major cyber arpeggio

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.06;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });

    notifySoundPlayed(0.9);
  } catch {
    // Ignore
  }
};

// 8. MATRIX / TEXT SCRAMBLE SHUFFLING TICK
export const playScrambleTick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const randomFreq = 850 + Math.random() * 750;
    osc.type = "sine";
    osc.frequency.setValueAtTime(randomFreq, now);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
    notifySoundPlayed(0.2);
  } catch {
    // Ignore
  }
};

// 9. AMBIENT COCKPIT IDLE DRONE (Optional subtle racecar / spaceship cockpit background hum)
export const startAmbientDrone = () => {
  if (!soundEnabled || isAmbientActive) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // 55Hz sub-bass engine idle
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(55, now);

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(110, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(180, now);
    filter.Q.setValueAtTime(2.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 1.5); // Very soft, non-intrusive

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);

    ambientDroneNode = { osc, subOsc, filter };
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
            ambientDroneNode.subOsc.stop();
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
 * High-fidelity tactile paper flip / page turn sound effect
 * Synthesized using filtered noise burst with resonant bandpass sweep and air whoosh.
 */
export const playPaperFlipSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.28;

    // 1. Noise buffer for paper texture & friction rustle
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Dynamic bandpass filter simulating the sliding paper sheet
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(700, now + duration);
    filter.Q.setValueAtTime(3.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.24, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // 2. Air displacement tone (subtle low-frequency whoosh)
    const airOsc = ctx.createOscillator();
    const airGain = ctx.createGain();
    airOsc.type = "sine";
    airOsc.frequency.setValueAtTime(220, now);
    airOsc.frequency.exponentialRampToValueAtTime(65, now + duration);

    airGain.gain.setValueAtTime(0.02, now);
    airGain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    airGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Routing
    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    airOsc.connect(airGain);
    airGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);

    airOsc.start(now);
    airOsc.stop(now + duration);
    notifySoundPlayed(0.45);
  } catch {
    // Ignore audio failures
  }
};

/**
 * High-speed loader telemetry progress tick
 */
export const playLoaderTick = (percentage = 0) => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const freq = 440 + percentage * 6; // ascends with progress
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
    notifySoundPlayed(0.2);
  } catch {
    // ignore
  }
};

/**
 * System boot / 100% completion chime
 */
export const playBootSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C-major chord
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.06;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.4);
    });

    notifySoundPlayed(0.85);
  } catch {
    // ignore
  }
};
