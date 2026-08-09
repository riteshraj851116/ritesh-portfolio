
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import MenuOverlay from "./MenuOverlay";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        {/* LOGO */}
        <a href="#home" className="navbar-logo">
          <span>RITESH</span>
          <span>RAJ </span>
        </a>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          <span className="navbar-location">
            INDIA — 2026
          </span>

          <button
            className={`menu-button ${
              menuOpen ? "active" : ""
            }`}
            onClick={() => setMenuOpen(true)}
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

