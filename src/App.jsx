import { useEffect, useState } from "react";
import Lenis from "lenis";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import ScrollHUD from "./components/ScrollHUD";
import GlobalCanvas from "./components/GlobalCanvas";
import Hero from "./components/Hero";
import MarqueeStream from "./components/MarqueeStream";
import CareerTrack from "./components/CareerTrack";
import OnTrackOffTrack from "./components/OnTrackOffTrack";
import Projects from "./components/Projects";
import FeaturedFlagship from "./components/FeaturedFlagship";
import EngineeringPlaybook from "./components/EngineeringPlaybook";
import TechCollabs from "./components/TechCollabs";
import Contact from "./components/Contact";
import KentaAbout from "./components/KentaAbout";
import {
  initScrollVelocitySkew,
  initMagneticElements,
  initSectionKineticEntrances,
} from "./utils/gsapKinematics";

function App() {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(() => {
    if (typeof window !== "undefined" && window.location.hash === "#work") {
      return "work";
    }
    // Default to Kenta Toshikura 100% About replica per user request
    return "about";
  });

  // Listen to hash changes for smooth back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#work") {
        setView("work");
      } else if (window.location.hash === "#about") {
        setView("about");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Initialize Lenis smooth scroll for Work portfolio
  useEffect(() => {
    if (view !== "work") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initialize Advanced GSAP Kinematics
    const cleanupSkew = initScrollVelocitySkew();
    const cleanupMagnetic = initMagneticElements();
    const cleanupKinetic = initSectionKineticEntrances();

    return () => {
      lenis.destroy();
      cleanupSkew();
      cleanupMagnetic();
      cleanupKinetic();
    };
  }, [view]);

  // View: Kenta Toshikura 100% Copy
  if (view === "about") {
    return (
      <>
        {/* CUSTOM VELOCITY-STRETCH CURSOR */}
        <CustomCursor />

        {/* KENTA TOSHIKURA 1:1 ABOUT REPLICA */}
        <KentaAbout
          onSwitchToWork={() => {
            setView("work");
            window.location.hash = "#work";
          }}
        />
      </>
    );
  }

  // View: Work Portfolio Showcase
  return (
    <>
      {/* 3D PAGE FLIP DOSSIER INITIALIZATION LOADER */}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* AMBIENT 3D SLIPSTREAM UNIVERSE */}
      <GlobalCanvas />

      {/* CUSTOM VELOCITY-STRETCH CURSOR */}
      <CustomCursor />

      {/* FLOATING SCROLL HUD */}
      <ScrollHUD />

      {/* FLOATING PILL NAVBAR */}
      <Navbar
        onOpenAbout={() => {
          setView("about");
          window.location.hash = "#about";
        }}
      />

      {/* MAIN LANDO NORRIS INSPIRED PORTFOLIO */}
      <main>
        {/* 01 — HERO (CINEMATIC ATHLETIC SHOWCASE) */}
        <Hero />

        {/* 02 — MARQUEE STREAM & MANIFESTO */}
        <MarqueeStream />

        {/* 03 — CAREER TRACK (HORIZONTAL MILESTONES & CREDENTIALS) */}
        <CareerTrack />

        {/* 04 — ON CODE / OFF CODE (INTERACTIVE SPLIT) */}
        <OnTrackOffTrack />

        {/* 05 — PROJECTS HALL OF FAME (NOTCHED POLYGON FRAMES) */}
        <Projects />

        {/* 06 — FEATURED FLAGSHIP (JOBSPHERE RECRUITMENT ENGINE) */}
        <FeaturedFlagship />

        {/* 07 — 3D INTERACTIVE FLIPPING PAPER DOSSIER & PLAYBOOK */}
        <EngineeringPlaybook />

        {/* 08 — TECH STACK & TOOLCHAIN (PARTNERS STYLE) */}
        <TechCollabs />

        {/* 09 — SOCIALS, DISPATCH & MASKED FOOTER */}
        <Contact />
      </main>
    </>
  );
}

export default App;
