import { Layers, Sparkles, Terminal, Cpu } from "lucide-react";
import { playClickSound, playHoverSound, playTelemetryScan } from "../utils/audio";
import "./TechCollabs.css";

const techPartners = [
  { name: "REACT.JS", category: "FRONTEND CORE", level: "ADVANCED", desc: "Hooks, Concurrent UI, Context State, React 19" },
  { name: "NODE.JS", category: "BACKEND RUNTIME", level: "PRODUCTION", desc: "Non-blocking I/O, Event Loop, Server Architecture" },
  { name: "EXPRESS.JS", category: "API FRAMEWORK", level: "PRODUCTION", desc: "40+ REST Endpoints, Middleware Shields, Routing" },
  { name: "MONGODB", category: "DATABASE ENGINE", level: "ADVANCED", desc: "Mongoose ODM, Schema Aggregation, Indexing" },
  { name: "SOCKET.IO", category: "REAL-TIME WEBSOCKETS", level: "SPECIALIST", desc: "Bidirectional Events, Sub-50ms Message Latency" },
  { name: "THREE.JS", category: "3D WEBGL GRAPHICS", level: "INTERMEDIATE", desc: "Particles, Shaders, Spatial Viewport Canvas" },
  { name: "JAVA (DSA)", category: "ALGORITHMIC RIGOR", level: "200+ PROBLEMS", desc: "Apna College Certified, Big-O Optimization" },
  { name: "JWT & BCRYPT", category: "SECURITY ARCHITECTURE", level: "ENCRYPTED", desc: "Stateless Auth, Password Hashing, CSRF Defense" },
  { name: "VITE", category: "BUILD TOOLCHAIN", level: "PRODUCTION", desc: "ESM Rollup Bundler, 90+ Lighthouse Delivery" },
  { name: "TAILWIND CSS", category: "STYLING SYSTEM", level: "ADVANCED", desc: "Mobile-First Responsive Grid & Flex Layouts" },
  { name: "GIT & GITHUB", category: "VERSION CONTROL", level: "DAILY DRIVER", desc: "CI/CD Workflows, Branching, GH-Pages Deploy" },
  { name: "REST APIS", category: "COMMUNICATION PROTOCOL", level: "PRODUCTION", desc: "Clean CRUD Design, HTTP Status Logic, Postman" },
];

const TechCollabs = () => {
  return (
    <section className="ln-collabs-section" id="tech-stack">
      <div className="lando-container">
        {/* HEADER */}
        <div className="ln-collabs-header">
          <div className="collabs-header-left">
            <span className="collabs-eyebrow">05 // TECHNICAL ECOSYSTEM</span>
            <h2 className="collabs-title">
              TECH STACK
              <br />
              <span className="font-display text-lime">&amp; TOOLCHAIN</span>
            </h2>
          </div>

          <div className="collabs-header-right">
            <p className="collabs-desc">
              Engineered with modern, production-tested technologies across the full stack. Every library, runtime, and database is selected for maximum velocity and architectural reliability.
            </p>
            <div className="collabs-badge">
              <span className="pulse-beacon"></span>
              <span>12 VERIFIED PRODUCTION CAPABILITIES</span>
            </div>
          </div>
        </div>

        {/* TECH CARDS GRID */}
        <div className="ln-collabs-grid">
          {techPartners.map((tech, idx) => (
            <div
              key={idx}
              className="ln-tech-card"
              onMouseEnter={() => playHoverSound((idx % 6) * 35)}
              onClick={() => {
                playTelemetryScan();
              }}
            >
              <div className="tech-card-top">
                <span className="tech-badge-cat">{tech.category}</span>
                <span className="tech-badge-level text-lime">{tech.level}</span>
              </div>

              <h3 className="tech-card-title">{tech.name}</h3>
              <p className="tech-card-desc">{tech.desc}</p>

              <div className="tech-card-footer">
                <span className="tech-card-num">0{idx + 1}</span>
                <div className="tech-card-dot"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechCollabs;
