import { useState, useEffect } from "react";
import { Volume2, VolumeX, Radio, Zap } from "lucide-react";
import {
  isSoundEnabled,
  toggleSound,
  playClickSound,
  playHoverSound,
  playEngineRevSound,
  toggleAmbientDrone,
  isAmbientPlaying,
  subscribeAudioActivity,
} from "../utils/audio";
import "./AudioController.css";

const AudioController = () => {
  const [enabled, setEnabled] = useState(true);
  const [ambientActive, setAmbientActive] = useState(false);
  const [activityLevels, setActivityLevels] = useState([20, 45, 30, 60]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setEnabled(isSoundEnabled());
    setAmbientActive(isAmbientPlaying());

    // Subscribe to real-time sound events to dance the equalizer bars
    const unsubscribe = subscribeAudioActivity((intensity) => {
      const boost = Math.min(100, Math.round(intensity * 100));
      setActivityLevels([
        Math.min(100, 20 + Math.random() * boost),
        Math.min(100, 30 + Math.random() * boost),
        Math.min(100, 25 + Math.random() * boost),
        Math.min(100, 35 + Math.random() * boost),
      ]);

      setTimeout(() => {
        setActivityLevels([15, 35, 20, 40]);
      }, 350);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setEnabled(newState);
    if (!newState) {
      setAmbientActive(false);
    }
  };

  const handleToggleAmbient = (e) => {
    e.stopPropagation();
    const state = toggleAmbientDrone();
    setAmbientActive(state);
    playClickSound();
  };

  const handleTestRev = (e) => {
    e.stopPropagation();
    playEngineRevSound();
  };

  return (
    <div
      className={`ln-audio-controller ${enabled ? "is-enabled" : "is-muted"}`}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* EQUALIZER CAPSULE BUTTON */}
      <button
        className="ln-audio-pill-btn"
        onClick={handleToggleSound}
        onMouseEnter={playHoverSound}
        title={enabled ? "Mute Web Audio Engine" : "Enable Web Audio Engine"}
        aria-label="Toggle Sound Effects"
      >
        <div className="audio-eq-bars">
          <span
            className="eq-bar"
            style={{
              height: enabled ? `${activityLevels[0]}%` : "20%",
            }}
          ></span>
          <span
            className="eq-bar"
            style={{
              height: enabled ? `${activityLevels[1]}%` : "20%",
            }}
          ></span>
          <span
            className="eq-bar"
            style={{
              height: enabled ? `${activityLevels[2]}%` : "20%",
            }}
          ></span>
          <span
            className="eq-bar"
            style={{
              height: enabled ? `${activityLevels[3]}%` : "20%",
            }}
          ></span>
        </div>

        <div className="audio-label-wrap">
          <span className="audio-mode-tag">
            {enabled ? (ambientActive ? "ARCHIVAL BED" : "HAPTIC ON") : "MUTED"}
          </span>
        </div>

        {enabled ? (
          <Volume2 size={13} className="audio-icon text-brown" />
        ) : (
          <VolumeX size={13} className="audio-icon text-muted" />
        )}
      </button>

      {/* FLYOUT QUICK SOUND PANEL ON HOVER */}
      <div className={`ln-audio-flyout ${showMenu ? "is-visible" : ""}`}>
        <div className="flyout-header">
          <span className="flyout-title">ACOUSTIC HAPTIC SUITE</span>
          <span className="flyout-badge">WEB AUDIO API</span>
        </div>

        <div className="flyout-actions">
          <button
            className="flyout-btn rev-test"
            onClick={handleTestRev}
            onMouseEnter={playHoverSound}
          >
            <Zap size={13} className="text-brown" />
            <span>STUDIO CHORUS REV</span>
          </button>

          <button
            className={`flyout-btn ambient-toggle ${ambientActive ? "active" : ""}`}
            onClick={handleToggleAmbient}
            onMouseEnter={playHoverSound}
          >
            <Radio size={13} className={ambientActive ? "text-brown" : ""} />
            <span>{ambientActive ? "STOP AMBIENT BED" : "ARCHIVAL AMBIENCE"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioController;
