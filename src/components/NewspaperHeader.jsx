import { useState, useEffect, useRef } from "react";
import {
  playClickSound,
  toggleSound,
  isSoundEnabled,
  getClickMode,
  setClickMode,
  subscribeAudioActivity,
} from "../utils/audio";
import ScrambleText from "./ScrambleText";
import "./NewspaperHeader.css";

const CLICK_MODES = [
  { id: "mechanical", label: "MECHANICAL SWITCH", icon: "⌨" },
  { id: "leica", label: "LEICA SHUTTER", icon: "📷" },
  { id: "press", label: "LETTERPRESS STAMP", icon: "📰" },
];

const NewspaperHeader = ({ onOpenMenu }) => {
  const [timeStr, setTimeStr] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [currentMode, setCurrentMode] = useState("mechanical");
  const [eqLevels, setEqLevels] = useState([20, 35, 25, 40]);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const menuTimeoutRef = useRef(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    setCurrentMode(getClickMode());

    // Subscribe to live Web Audio engine activity to animate equalizer bars
    const unsubscribe = subscribeAudioActivity((intensity) => {
      const boost = Math.min(100, Math.round(intensity * 90));
      setEqLevels([
        Math.min(100, 25 + Math.random() * boost),
        Math.min(100, 35 + Math.random() * boost),
        Math.min(100, 20 + Math.random() * boost),
        Math.min(100, 40 + Math.random() * boost),
      ]);

      setTimeout(() => {
        setEqLevels([15, 30, 18, 25]);
      }, 320);
    });

    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setTimeStr(istTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleSelectMode = (modeId, e) => {
    e.stopPropagation();
    setClickMode(modeId);
    setCurrentMode(modeId);
    playClickSound(modeId);
  };

  const handleMenuClick = () => {
    try { playClickSound(); } catch (e) {}
    if (onOpenMenu) onOpenMenu();
  };

  return (
    <header className="paper-header">
      {/* LEFT: LOCATION & LIVE IST TIME */}
      <div className="header-location">
        <span className="location-edition">EDITION NO. 04</span>
        <span className="location-rule">•</span>
        <span className="location-name">Greater Noida, IN</span>
        <span className="location-time">{timeStr ? `${timeStr} IST` : "IST"}</span>
      </div>

      {/* CENTER: AUTHENTIC OLD ENGLISH / BLACKLETTER MASTHEAD */}
      <div className="header-masthead">
        <a href="#hero" className="masthead-title font-blackletter" title="The Broadside Portfolio — Hover or tap to decode">
          <ScrambleText text="Ritesh Raj" as="span" />
        </a>
        <span className="masthead-edition-subtitle">THE BROADSHEET GAZETTE</span>
      </div>

      {/* RIGHT: ADVANCED TACTILE AUDIO CONTROLLER & HAMBURGER */}
      <div className="header-actions">
        {/* ADVANCED AUDIO SUITE CAPSULE */}
        <div
          className="header-audio-wrapper"
          onMouseEnter={() => {
            if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            setShowAudioMenu(true);
          }}
          onMouseLeave={() => {
            menuTimeoutRef.current = setTimeout(() => setShowAudioMenu(false), 300);
          }}
        >
          <button
            className={`paper-sound-capsule ${soundOn ? "is-active" : "is-muted"}`}
            onClick={handleSoundToggle}
            title={soundOn ? "Mute audio engine" : "Enable tactile broadsheet click audio"}
            aria-label="Toggle Sound Effects"
          >
            {/* LIVE DANCING EQUALIZER BARS */}
            <div className="audio-eq-bars" aria-hidden="true">
              <span className="eq-bar" style={{ height: soundOn ? `${eqLevels[0]}%` : "15%" }}></span>
              <span className="eq-bar" style={{ height: soundOn ? `${eqLevels[1]}%` : "15%" }}></span>
              <span className="eq-bar" style={{ height: soundOn ? `${eqLevels[2]}%` : "15%" }}></span>
              <span className="eq-bar" style={{ height: soundOn ? `${eqLevels[3]}%` : "15%" }}></span>
            </div>

            <span className="sound-text">
              {soundOn ? currentMode.toUpperCase() : "MUTED"}
            </span>

            <span className="sound-state-dot"></span>
          </button>

          {/* ADVANCED AUDIO PROFILE FLYOUT PANEL */}
          {showAudioMenu && (
            <div className="audio-mode-popover" role="dialog" aria-label="Audio Sound Profiles">
              <div className="popover-title-row">
                <span className="popover-title">TACTILE CLICK SUITE</span>
                <span className="popover-badge">SYNTHESIZER</span>
              </div>
              <p className="popover-hint">Select your preferred mechanical click profile:</p>

              <div className="popover-modes-list">
                {CLICK_MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`mode-select-btn ${currentMode === m.id ? "is-selected" : ""}`}
                    onClick={(e) => handleSelectMode(m.id, e)}
                  >
                    <span className="mode-btn-icon">{m.icon}</span>
                    <span className="mode-btn-label">{m.label}</span>
                    {currentMode === m.id && <span className="mode-active-mark">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2-LINE BROADSHEET HAMBURGER */}
        <button
          className="paper-menu-trigger"
          onClick={handleMenuClick}
          aria-label="Toggle Fullscreen Menu"
        >
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </button>
      </div>
    </header>
  );
};

export default NewspaperHeader;
