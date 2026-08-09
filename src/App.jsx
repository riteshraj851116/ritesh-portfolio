
import { useState } from "react";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RollingStack from "./components/RollingStack";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
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

        {/* 05 — CONTACT */}
        <Contact />
      </main>
    </>
  );
}

export default App;
