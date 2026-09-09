import { useEffect } from "react";
import { playClickSound, playHoverBlip } from "../utils/audio";
import ScrambleText from "./ScrambleText";
import "./NewspaperMenu.css";

const navItems = [
  { label: "INDEX", href: "#hero", active: true },
  { label: "WORK", href: "#work", active: false },
  { label: "ABOUT", href: "#about", active: false },
  { label: "PLAYBOOK", href: "#playbook", active: false },
  { label: "CONTACT", href: "#contact", active: false },
];

const NewspaperMenu = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNav = (href) => {
    try { playClickSound(); } catch (e) {}
    onClose();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="newspaper-menu-overlay" role="dialog" aria-modal="true">
      {/* TOP BAR */}
      <div className="menu-topbar">
        <span className="menu-masthead">Ritesh Raj</span>
        <button className="menu-close-btn" onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      {/* GIANT CONDENSED LINKS */}
      <nav className="menu-links-container">
        {navItems.map((item) => (
          <div key={item.label} className={`menu-link-wrapper ${item.active ? "is-active" : ""}`}>
            <a
              href={item.href}
              className="menu-link-item"
              onMouseEnter={() => {
                try { playHoverBlip(); } catch (e) {}
              }}
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.href);
              }}
            >
              <span className="link-text">
                <ScrambleText text={item.label} as="span" />
              </span>
              {item.active && <span className="link-strikethrough"></span>}
            </a>
          </div>
        ))}
      </nav>

      {/* FOOTER SOCIAL LINKS */}
      <div className="menu-footer">
        <a href="https://github.com/riteshraj851116" target="_blank" rel="noreferrer" className="menu-footer-link">
          GITHUB
        </a>
        <span className="bullet">•</span>
        <a href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/" target="_blank" rel="noreferrer" className="menu-footer-link">
          LINKEDIN
        </a>
        <span className="bullet">•</span>
        <a href="mailto:riteshraj851116@gmail.com" className="menu-footer-link">
          EMAIL
        </a>
        <span className="bullet">•</span>
        <a href="tel:+919709721676" className="menu-footer-link">
          +91-9709721676
        </a>
      </div>
    </div>
  );
};

export default NewspaperMenu;
