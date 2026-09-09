import { useRef } from "react";
import gsap from "gsap";
import DynamicTextRotater from "./DynamicTextRotater";
import ScrambleText from "./ScrambleText";
import PostageStamp from "./PostageStamp";
import riteshPortrait from "../assets/Adobe Express - file.png";
import "./NewspaperHero.css";

const NewspaperHero = () => {
  const portraitRef = useRef(null);

  const handlePortraitMouseMove = (e) => {
    if (!portraitRef.current) return;
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
    <section className="newspaper-hero-section" id="hero">
      {/* 01 — TOP BROADSHEET ROW: ALL WORK! SELECTION */}
      <div className="broadsheet-triptych">
        {/* LEFT COLUMN: PROJECT 01 - JOBSPHERE */}
        <article className="triptych-col project-preview-col">
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
              <span className="badge-new">NEW</span>
            </div>
            <p className="project-desc">
              Production-ready recruitment portal connecting applicants & hiring teams. Features JWT authentication, 40+ modular RESTful APIs, and sub-50ms Socket.IO live messaging.
            </p>
          </div>
        </article>

        {/* CENTER COLUMN: EDITORIAL ANNOUNCEMENT */}
        <div className="triptych-col editorial-title-col">
          <h1 className="editorial-all-work">ALL WORK!</h1>
          <p className="editorial-lead">
            A Featured selection of full-stack systems, RESTful APIs & real-time applications — 2024 to 2026.
          </p>
          <span className="editorial-tip">TIP! Explore below for verified live demonstrations</span>
        </div>

        {/* RIGHT COLUMN: PROJECT 02 - VELOCEDRIVE */}
        <article className="triptych-col project-preview-col">
          <div className="preview-img-frame">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"
              alt="VeloceDrive preview"
              className="preview-img"
              loading="lazy"
            />
          </div>
          <div className="preview-caption">
            <div className="caption-head">
              <h3 className="project-brand">VELOCEDRIVE</h3>
              <span className="badge-new">NEW</span>
            </div>
            <p className="project-desc">
              End-to-end vehicle rental management platform with Mongoose indexing achieving complex fleet filter queries in &lt;200ms and custom auth middleware.
            </p>
          </div>
        </article>
      </div>

      {/* 02 — INVERTED BLACK BANNER: RITESH */}
      <div className="inverted-black-banner">
        <h2 className="banner-gigantic-title">
          <ScrambleText text="RITESH" as="span" />
        </h2>
      </div>

      {/* 03 — SOFTWARE ARTISAN & PORTRAIT SPREAD */}
      <div className="broadsheet-artisan-spread">
        {/* LEFT: ARTISAN EDITORIAL */}
        <div className="artisan-left-col">
          {/* GSAP ANIMATED ROLE CHANGER */}
          <DynamicTextRotater />

          <h2 className="artisan-headline">
            <span>
              <ScrambleText text="SOFTWARE" as="span" />
            </span>
            <span className="artisan-accent">
              <ScrambleText text="ARTISAN!" as="span" />
            </span>
          </h2>
          <div className="artisan-pullquote">
            <p>
              Engineering <strong>high-throughput MERN stack systems</strong>, sub-50ms real-time Socket.IO pipelines, and resilient web applications. Computer Science graduate from <strong>Galgotias University</strong> with 200+ algorithm challenges solved.
            </p>
          </div>
          <div className="artisan-action-links">
            <a href="#work" className="broadsheet-btn-fill">
              EXPLORE WORKS →
            </a>
            <a href="https://www.linkedin.com/in/ritesh-raj-9b52162a7/" target="_blank" rel="noreferrer" className="broadsheet-btn-outline">
              LINKEDIN PROFILE ↗
            </a>
          </div>
        </div>

        {/* RIGHT: PORTRAIT PRESENTATION WITH GSAP 3D TILT */}
        <div className="artisan-right-col">
          <div
            className="portrait-editorial-frame"
            ref={portraitRef}
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
          >
            <div className="portrait-image-wrapper">
              <img
                src={riteshPortrait}
                alt="Ritesh Raj - Full Stack Engineer Portrait"
                className="portrait-editorial-img"
              />
            </div>
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
          <h2 className="banner-gigantic-title">
            <ScrambleText text="ENGINEER" as="span" />
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
