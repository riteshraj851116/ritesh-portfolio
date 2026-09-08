import { useState } from "react";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import ScrollHUD from "./components/ScrollHUD";
import Hero from "./components/Hero";
import RollingStack from "./components/RollingStack";
import About from "./components/About";
import Projects from "./components/Projects";
import TerminalSimulator from "./components/TerminalSimulator";
import Contact from "./components/Contact";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* CUSTOM CURSOR */}
      <CustomCursor />

      {/* FLOATING SCROLL HUD */}
      <ScrollHUD />

      {/* LOADER */}
      {loading && (
        <Loader onComplete={() => setLoading(false)} />
      )}

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN PORTFOLIO */}
      <main>
        {/* 01 — HERO */}
        <Hero />

        {/* 02 — SKILLS / 3D CYLINDER */}
        <RollingStack />

        {/* 03 — ABOUT */}
        <About />

        {/* 04 — PROJECTS */}
        <Projects />

        {/* 04.1 — LIVE ARCHITECTURE ENGINE / TERMINAL SIMULATOR */}
        <TerminalSimulator />

        {/* 05 — CONTACT */}
        <Contact />
      </main>
    </>
  );
}

export default App;
