import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Terminal, Database, Layers, Sparkles, Wrench } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./RollingStack.css";

const technologies = [
  "REACT.JS",
  "NODE.JS",
  "EXPRESS",
  "MONGODB",
  "SOCKET.IO",
  "JAVASCRIPT",
  "JAVA (DSA)",
  "REST APIS",
  "TAILWIND",
  "THREE.JS",
];

const skillCategories = [
  { id: "all", label: "ALL TECH", icon: Sparkles },
  { id: "frontend", label: "FRONTEND & UI", icon: Layers },
  { id: "backend", label: "BACKEND & APIS", icon: Terminal },
  { id: "data", label: "DATA & REALTIME", icon: Database },
  { id: "tools", label: "TOOLS & CORE CS", icon: Wrench },
];

const detailedSkills = [
  // Frontend
  { name: "React.js", category: "frontend", proficiency: "Expert", role: "SPA, Hooks, Virtual DOM" },
  { name: "React Router", category: "frontend", proficiency: "Advanced", role: "Client-side Routing & Guards" },
  { name: "Vite", category: "frontend", proficiency: "Advanced", role: "Lightning Fast ESM Bundling" },
  { name: "Tailwind CSS", category: "frontend", proficiency: "Advanced", role: "Responsive Modern Utility Styling" },
  { name: "Three.js & GSAP", category: "frontend", proficiency: "Creative", role: "Interactive 3D & Web Motion" },
  { name: "JavaScript (ES6+)", category: "frontend", proficiency: "Core", role: "Async/Await, Closures, Event Loop" },

  // Backend & APIs
  { name: "Node.js", category: "backend", proficiency: "Advanced", role: "Event-Driven Scalable Runtime" },
  { name: "Express.js", category: "backend", proficiency: "Advanced", role: "40+ REST API Endpoints & Middleware" },
  { name: "Socket.IO", category: "data", proficiency: "Advanced", role: "Sub-50ms Real-Time Chat Channels" },
  { name: "JWT Authentication", category: "backend", proficiency: "Secure", role: "Stateless Tokens & Route Guards" },
  { name: "Bcrypt Hashing", category: "backend", proficiency: "Secure", role: "Salted Password Encryption" },

  // Database
  { name: "MongoDB", category: "data", proficiency: "Advanced", role: "NoSQL Schemas & Aggregation" },
  { name: "Mongoose ORM", category: "data", proficiency: "Advanced", role: "Optimized Indexing (<200ms)" },
  { name: "SQL", category: "data", proficiency: "Proficient", role: "Relational Queries & Tables" },

  // Tools & Core CS
  { name: "Java (DSA)", category: "tools", proficiency: "200+ Solved", role: "Apna College Certified Algorithmics" },
  { name: "Git & GitHub", category: "tools", proficiency: "Advanced", role: "Version Control & Git Workflows" },
  { name: "Postman", category: "tools", proficiency: "Advanced", role: "API Testing & Mocking" },
  { name: "Vercel & Render", category: "tools", proficiency: "Production", role: "Cloud Deployment & Continuous CI" },
  { name: "OOP & DBMS", category: "tools", proficiency: "Core CS", role: "Academic Grounding (Galgotias Univ)" },
];

const RollingStack = () => {
  const cylinderRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    const animation = gsap.to(cylinder, {
      rotateY: 360,
      duration: 26,
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
        <span>02 / TECHNICAL MATRIX</span>
        <span>MERN · REAL-TIME · CORE CS</span>
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
                    transform: `rotateY(${angle}deg) translateZ(460px)`,
                  }}
                >
                  <span className="cylinder-pill">{tech}</span>
                </div>
              );
            })}
          </div>

          {/* Center */}
          <div className="cylinder-center">
            <span className="center-small">FULL STACK</span>
            <span className="center-main">MERN</span>
            <span className="center-small">ENGINEER</span>
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
        <span>GALGOTIAS UNIVERSITY · CSE (2023-2027)</span>
        <span>PRODUCTION-GRADE MERN ARCHITECTURES</span>
        <span>LATENCY OPTIMIZED · SUB-50MS</span>
      </div>
    </section>
  );
};

export default RollingStack;