
import { useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import gsap from "gsap";
import "./MenuOverlay.css";

const menuItems = [
  {
    number: "01",
    label: "HOME",
    href: "#home",
  },
  {
    number: "02",
    label: "ABOUT",
    href: "#about",
  },
  {
    number: "03",
    label: "SKILLS",
    href: "#skills",
  },
  {
    number: "04",
    label: "PROJECTS",
    href: "#projects",
  },
  {
    number: "05",
    label: "CONTACT",
    href: "#contact",
  },
];

const MenuOverlay = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".menu-overlay",
        {
          clipPath: "inset(0 0 100% 0)",
        },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power4.inOut",
        }
      );

      tl.fromTo(
        ".menu-item",
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.35"
      );
    });

    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="menu-overlay">
      {/* HEADER */}

      <div className="menu-overlay-header">
        <span>RITESH RAJ SINGH</span>

        <button
          className="menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <span>CLOSE</span>

          <X size={22} />
        </button>
      </div>

      {/* MENU */}

      <nav className="menu-list">
        {menuItems.map((item) => (
          <a
            href={item.href}
            className="menu-item"
            key={item.number}
            onClick={onClose}
          >
            <span className="menu-number">
              {item.number}
            </span>

            <span className="menu-label">
              {item.label}
            </span>

            <ArrowUpRight
              className="menu-item-arrow"
              size={30}
            />
          </a>
        ))}
      </nav>

      {/* FOOTER */}

      <div className="menu-overlay-footer">
        <span>FULL STACK DEVELOPER</span>

        <span>INDIA — 2026</span>

        <span>© RITESH RAJ SINGH</span>
      </div>
    </div>
  );
};

export default MenuOverlay;
