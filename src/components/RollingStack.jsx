import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Terminal, Database, Layers, Sparkles } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./RollingStack.css";

const technologies = [
  "MERN",
  "REACT",
  "NODE.JS",
  "EXPRESS",
  "MONGODB",
  "JAVASCRIPT",
  "SOCKET.IO",
  "GSAP",
  "THREE.JS",
  "REST APIS",
  "GITHUB",
];

const skillCategories = [
  { id: "all", label: "ALL TECH", icon: Sparkles },
  { id: "frontend", label: "FRONTEND & 3D", icon: Layers },
  { id: "backend", label: "BACKEND & APIS", icon: Terminal },
  { id: "data", label: "DATA & REALTIME", icon: Database },
];

const detailedSkills = [
  { name: "React.js (19)", category: "frontend", proficiency: "Expert", role: "SPA Architecture & Hooks" },
  { name: "Node.js", category: "backend", proficiency: "Advanced", role: "Event-Driven Runtime & APIs" },
  { name: "Express.js", category: "backend", proficiency: "Advanced", role: "REST Endpoints & Middleware" },
  { name: "MongoDB", category: "data", proficiency: "Advanced", role: "Document Modeling & Aggregation" },
  { name: "Socket.IO", category: "data", proficiency: "Proficient", role: "Sub-50ms Real-Time WebSockets" },
  { name: "Three.js & R3F", category: "frontend", proficiency: "Creative", role: "3D Viewports & Shaders" },
  { name: "GSAP & ScrollTrigger", category: "frontend", proficiency: "Creative", role: "Fluid Choreographed Motion" },
  { name: "JavaScript (ES6+)", category: "frontend", proficiency: "Core", role: "Async, Event Loop, Closures" },
  { name: "JWT & Bcrypt", category: "backend", proficiency: "Secure", role: "Token Authorization & Hashing" },
  { name: "Mongoose ODM", category: "data", proficiency: "Advanced", role: "Schema Validation & Indexing" },
  { name: "Git & GitHub", category: "tools", proficiency: "Standard", role: "Version Control & CI/CD" },
  { name: "RESTful API Architecture", category: "backend", proficiency: "Advanced", role: "40+ Production Endpoints" },
];

const RollingStack = () => {
  const cylinderRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    const animation = gsap.to(cylinder, {
      rotateY: 360,
      duration: 24,
      repeat: -1,
      ease: "none",
    });

    return () => {
      animation.kill();
    };
  }, []);

  const handleCategorySelect = (id) => {
    playClickSound();
    setActiveCategory(id);
  };

  const filteredSkills = detailedSkills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section className="rolling-stack" id="skills">
      {/* HEADER */}
      <div className="rolling-stack-header">
        <span>02 / TECHNOLOGY</span>
        <span>MY STACK & TOOLING</span>
      </div>

      {/* 3D VIEWPORT */}
      <div className="cylinder-viewport">
        {/* 3D SCENE */}
        <div className="cylinder-scene">
          {/* Glow */}
          <div className="cylinder-glow"></div>

          {/* Cylinder */}
          <div className="technology-cylinder" ref={cylinderRef}>
            {technologies.map((tech, index) => {
              const angle = (360 / technologies.length) * index;

              return (
                <div
                  className="cylinder-item"
                  key={tech}
                  style={{
                    transform: `
                      rotateY(${angle}deg)
                      translateZ(420px)
                    `,
                  }}
                >
                  <span>{tech}</span>
                </div>
              );
            })}
          </div>

          {/* Center */}
          <div className="cylinder-center">
            <span className="center-small">FULL STACK</span>
            <span className="center-main">MERN</span>
            <span className="center-small">SPECIALIST</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SKILL DIRECTORY */}
      <div className="skills-interactive-container">
        <div className="skills-filter-bar">
          {skillCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className={`skill-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => handleCategorySelect(cat.id)}
                onMouseEnter={playHoverSound}
              >
                <Icon size={12} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="skills-grid">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="skill-badge-card"
              onMouseEnter={playHoverSound}
            >
              <div className="badge-card-top">
                <span className="badge-name">{skill.name}</span>
                <span className="badge-level">{skill.proficiency}</span>
              </div>
              <span className="badge-role">{skill.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="rolling-stack-footer">
        <span>MERN SPECIALIST</span>
        <span>EVENT-DRIVEN ARCHITECTURES</span>
        <span>HIGH-FIDELITY WEB APPS</span>
      </div>
    </section>
  );
};

export default RollingStack;