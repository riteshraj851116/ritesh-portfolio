import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import MenuOverlay from "./MenuOverlay";
import { isSoundEnabled, toggleSound, playClickSound, playHoverSound } from "../utils/audio";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleOpenMenu = () => {
    playClickSound();
    setMenuOpen(true);
  };

  return (
    <>
      <header className="navbar">
        {/* LOGO */}
        <a
          href="#home"
          className="navbar-logo"
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
        >
          <span>RITESH</span>
          <span>RAJ</span>
        </a>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          {/* SOUND TOGGLE */}
          <button
            type="button"
            className={`navbar-sound-btn ${soundOn ? "active" : "muted"}`}
            onClick={handleToggleSound}
            onMouseEnter={playHoverSound}
            aria-label={soundOn ? "Mute audio" : "Unmute audio"}
            title={soundOn ? "Mute interface sounds" : "Enable interface sounds"}
          >
            <span className="sound-bars">
              <span className="sound-bar b1"></span>
              <span className="sound-bar b2"></span>
              <span className="sound-bar b3"></span>
            </span>
            <span className="sound-text">SOUND {soundOn ? "ON" : "OFF"}</span>
          </button>

          <span className="navbar-location">
            INDIA — 2026
          </span>

          <button
            className={`menu-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={handleOpenMenu}
            onMouseEnter={playHoverSound}
            aria-label="Open menu"
          >
            <span className="menu-button-text">
              MENU
            </span>

            <span className="menu-icon">
              <span></span>
              <span></span>
            </span>

            <ArrowUpRight className="menu-arrow" size={16} />
          </button>
        </div>
      </header>

      {/* MENU OVERLAY */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;

