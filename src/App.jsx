import { useState, useEffect } from "react";
import Lenis from "lenis";

import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import NewspaperHeader from "./components/NewspaperHeader";
import NewspaperMenu from "./components/NewspaperMenu";
import NewspaperHero from "./components/NewspaperHero";
import NewspaperSkills3D from "./components/NewspaperSkills3D";
import NewspaperProjects from "./components/NewspaperProjects";
import NewspaperMetrics from "./components/NewspaperMetrics";
import NewspaperPlaybook from "./components/NewspaperPlaybook";
import NewspaperMarquee from "./components/NewspaperMarquee";
import NewspaperFooter from "./components/NewspaperFooter";

function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Initialize Lenis smooth scroll for effortless broadsheet reading
  useEffect(() => {
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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* 00 — HELLO MULTILINGUAL BROADSHEET LOADER */}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* INK CUSTOM CURSOR */}
      <CustomCursor />

      {/* PINNED NEWSPAPER HEADER (Masthead, Location & Menu Trigger) */}
      <NewspaperHeader onOpenMenu={() => setMenuOpen(true)} />

      {/* FULLSCREEN DARK NEWSPAPER NAVIGATION OVERLAY */}
      <NewspaperMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* MAIN BROADSHEET EDITORIAL PORTFOLIO */}
      <main className="paper-portfolio-main">
        {/* 01 — ALL WORK! SELECTION, INVERTED BANNER 'RITESH', ARTISAN SPREAD & STAMP */}
        <NewspaperHero />

        {/* 02 — 3D MOVING SKILLS MATRIX */}
        <NewspaperSkills3D />

        {/* 03 — BROADSHEET PROJECTS CATALOG */}
        <NewspaperProjects />

        {/* 03 — EDITORIAL METRICS & STATS STRIP */}
        <NewspaperMetrics />

        {/* 04 — ARCHITECT INVERTED BANNER & STITCHED COUPON CARDS */}
        <NewspaperPlaybook />

        {/* 05 — CONTINUOUS EMAIL ME MARQUEE RIBBON */}
        <NewspaperMarquee />

        {/* 06 — BROADSHEET COLOPHON FOOTER */}
        <NewspaperFooter />
      </main>
    </>
  );
}

export default App;
