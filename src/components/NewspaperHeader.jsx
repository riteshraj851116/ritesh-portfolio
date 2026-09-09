import { useState, useEffect } from "react";
import { playClickSound, toggleSound, isSoundEnabled } from "../utils/audio";
import "./NewspaperHeader.css";

const NewspaperHeader = ({ onOpenMenu }) => {
  const [timeStr, setTimeStr] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
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
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleMenuClick = () => {
    try { playClickSound(); } catch (e) {}
    if (onOpenMenu) onOpenMenu();
  };

  return (
    <header className="paper-header">
      {/* LEFT: LOCATION & LIVE IST TIME */}
      <div className="header-location">
        <span className="location-name">Greater Noida, IN</span>
        <span className="location-time">{timeStr ? `${timeStr} IST` : "IST"}</span>
      </div>

      {/* CENTER: GOTHIC BLACKLETTER MASTHEAD */}
      <div className="header-masthead">
        <a href="#hero" className="masthead-title">The Paper Portfolio</a>
      </div>

      {/* RIGHT: SOUND TOGGLE & MINIMAL 2-LINE HAMBURGER */}
      <div className="header-actions">
        <button
          className={`paper-sound-btn ${soundOn ? "is-active" : ""}`}
          onClick={handleSoundToggle}
          title={soundOn ? "Mute audio" : "Enable tactile broadsheet audio"}
          aria-label="Toggle Sound"
        >
          <span className="sound-pulse-icon">{soundOn ? "🔊" : "🔇"}</span>
          <span className="sound-text">{soundOn ? "AUDIO ON" : "MUTED"}</span>
        </button>

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
