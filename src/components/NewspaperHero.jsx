import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import DynamicTextRotater from "./DynamicTextRotater";
import ScrambleText from "./ScrambleText";
import PostageStamp from "./PostageStamp";
import riteshPortrait from "../assets/Adobe Express - file.png";
import riteshPastelPoster from "../assets/ritesh-pastel-poster.jpg";
import { playClickSound, playHoverBlip } from "../utils/audio";
import "./NewspaperHero.css";

const NewspaperHero = () => {
  const heroRef = useRef(null);
  const portraitRef = useRef(null);
  const [heroView, setHeroView] = useState("poster"); // default to pastel art poster
  const btnFillRef = useRef(null);
  const btnOutlineRef = useRef(null);

  // 1. GSAP Hero Entrance Sequence
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".broadsheet-triptych .triptych-col",
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }
      )
        .fromTo(
          ".inverted-black-banner",
          { opacity: 0, scaleY: 0.92 },
          { opacity: 1, scaleY: 1, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          [".artisan-left-col", ".artisan-right-col"],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.15 },
          "-=0.2"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 2. GSAP Magnetic Cursor Pull for Buttons
  useEffect(() => {
    const setupMagnetic = (el) => {
      if (!el) return () => {};
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
        xTo(x);
        yTo(y);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    };

    const clean1 = setupMagnetic(btnFillRef.current);
    const clean2 = setupMagnetic(btnOutlineRef.current);
    return () => {
      clean1();
      clean2();
    };
  }, []);

  // GSAP 3D Tilt for the Portrait
  const handlePortraitMouseMove = (e) => {
    if (!portraitRef.current || heroView !== "portrait") return;
    const rect = portraitRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 7;
    const rotateX = -(y / (rect.height / 2)) * 7;

    gsap.to(portraitRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handlePortraitMouseLeave = () => {
    if (!portraitRef.current) return;
    gsap.to(portraitRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <section className="newspaper-hero-section" id="hero" ref={heroRef}>
      {/* 01 — TOP BROADSHEET ROW: ALL WORK! SELECTION */}
      <div className="broadsheet-triptych">
        {/* LEFT COLUMN: PROJECT 01 - JOBSPHERE */}
        <a
          href="https://jobsphere-vercel.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="triptych-col project-preview-col preview-anchor-link"
          title="Launch JobSphere Live Application"
        >
          <div className="preview-img-frame">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop"
              alt="JobSphere preview"
              className="preview-img"
              loading="lazy"
            />
          </div>
          <div className="preview-caption">
            <div className="caption-head">
              <h3 className="project-brand">JOBSPHERE</h3>
              <span className="badge-new">LIVE ↗</span>
            </div>
            <p className="project-desc">
              Production-ready recruitment portal connecting applicants & hiring teams. Features JWT authentication, 40+ modular RESTful APIs, and sub-50ms Socket.IO live messaging.
            </p>
          </div>
        </a>

        {/* CENTER COLUMN: EDITORIAL ANNOUNCEMENT */}
        <div className="triptych-col editorial-title-col">
          <span className="editorial-kicker font-blackletter">The Chronicle</span>
          <h1 className="editorial-all-work">ALL WORK!</h1>
          <p className="editorial-lead">
            A Featured selection of full-stack systems, RESTful APIs & real-time applications — 2024 to 2026.
          </p>
          <span className="editorial-tip">TIP! Explore below for verified live demonstrations</span>
        </div>

        {/* RIGHT COLUMN: PROJECT 02 - TERACAR (VELOCEDRIVE) */}
        <a
          href="https://teracar-tan.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="triptych-col project-preview-col preview-anchor-link"
          title="Launch TeraCar Live Application"
        >
          <div className="preview-img-frame">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"
              alt="TeraCar VeloceDrive preview"
              className="preview-img"
              loading="lazy"
            />
          </div>
          <div className="preview-caption">
            <div className="caption-head">
              <h3 className="project-brand">TERACAR</h3>
              <span className="badge-new">LIVE ↗</span>
            </div>
            <p className="project-desc">
              End-to-end vehicle rental management platform with Mongoose indexing achieving complex fleet filter queries in &lt;200ms and custom auth middleware.
            </p>
          </div>
        </a>
      </div>

      {/* 02 — INVERTED BLACK BANNER: RITESH RAJ (AUTHENTIC OLD ENGLISH BLACKLETTER WITH DECODE EFFECT) */}
      <div className="inverted-black-banner">
        <h2 className="banner-gigantic-title font-blackletter" title="Ritesh Raj — Hover or tap to decode">
          <ScrambleText text="Ritesh Raj" as="span" />
        </h2>
      </div>

      {/* 03 — SOFTWARE ARTISAN & PORTRAIT SPREAD */}
      <div className="broadsheet-artisan-spread">
        {/* LEFT: ARTISAN EDITORIAL */}
        <div className="artisan-left-col">
          <DynamicTextRotater />

          <h2 className="artisan-headline">
            <span className="headline-word-tech">SOFTWARE</span>
            <span className="artisan-accent font-blackletter">Artisan</span>
          </h2>
          <div className="artisan-pullquote">
            <p>
              Engineering <strong>high-throughput MERN stack systems</strong>, sub-50ms real-time Socket.IO pipelines, and resilient web applications. Computer Science graduate from <strong>Galgotias University</strong> with 200+ algorithm challenges solved.
            </p>
          </div>
          <div className="artisan-action-links">
            <a
              href="#work"
              className="broadsheet-btn-fill"
              ref={btnFillRef}
              onClick={() => {
                try {
                  playClickSound();
                } catch (e) {}
              }}
            >
              EXPLORE WORKS →
            </a>
            <a
              href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/"
              target="_blank"
              rel="noreferrer"
              className="broadsheet-btn-outline"
              ref={btnOutlineRef}
              onClick={() => {
                try {
                  playClickSound();
                } catch (e) {}
              }}
            >
              LINKEDIN PROFILE ↗
            </a>
          </div>
        </div>

        {/* RIGHT: PORTRAIT / 3D CORE DUAL PRESENTATION */}
        <div className="artisan-right-col">
          <div
            className="portrait-editorial-frame"
            ref={portraitRef}
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
          >
            {/* STAGE HEADER CONTROLS */}
            <div className="frame-toggle-bar">
              <div className="frame-toggle-left">
                <span className="frame-status-dot"></span>
                <span className="frame-title-text">
                  {heroView === "poster" ? "ARTISAN PASTEL POSTER // BROADSIDE" : "OFFICIAL PHOTOGRAPH"}
                </span>
              </div>
              <div className="frame-toggle-buttons">
                <button
                  type="button"
                  className={`frame-switch-btn ${heroView === "poster" ? "active" : ""}`}
                  onClick={() => {
                    try {
                      playClickSound();
                    } catch (e) {}
                    setHeroView("poster");
                  }}
                  onMouseEnter={() => {
                    try {
                      playHoverBlip();
                    } catch (e) {}
                  }}
                >
                  PASTEL POSTER ✦
                </button>
                <button
                  type="button"
                  className={`frame-switch-btn ${heroView === "portrait" ? "active" : ""}`}
                  onClick={() => {
                    try {
                      playClickSound();
                    } catch (e) {}
                    setHeroView("portrait");
                  }}
                  onMouseEnter={() => {
                    try {
                      playHoverBlip();
                    } catch (e) {}
                  }}
                >
                  PHOTO
                </button>
              </div>
            </div>

            {/* CONTENT: PASTEL DRAWING POSTER OR PHOTOGRAPH */}
            <div className="portrait-image-wrapper">
              {heroView === "poster" ? (
                <img
                  src={riteshPastelPoster}
                  alt="Ritesh Raj - Artisan Pastel Drawing Poster"
                  className="portrait-editorial-img pastel-poster-img"
                />
              ) : (
                <img
                  src={riteshPortrait}
                  alt="Ritesh Raj - Full Stack Engineer Portrait"
                  className="portrait-editorial-img"
                />
              )}
            </div>

            {/* CAPTION BAR */}
            <div className="portrait-caption-bar">
              <span className="portrait-label">RITESH RAJ</span>
              <span className="portrait-sub">B.TECH CSE · GALGOTIAS UNIV (CGPA 7.3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 04 — SECOND INVERTED BANNER WITH POSTAGE STAMP */}
      <div className="inverted-banner-stamp-row">
        <div className="inverted-black-banner banner-engineer">
          <h2 className="banner-gigantic-title font-blackletter" title="Full Stack Engineer">
            Engineer
          </h2>
        </div>
        <div className="hero-stamp-slot">
          <PostageStamp />
        </div>
      </div>
    </section>
  );
};

export default NewspaperHero;
