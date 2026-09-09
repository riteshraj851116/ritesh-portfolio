import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playClickSound, playHoverBlip } from "../utils/audio";
import "./NewspaperSkills3D.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const skillsData = [
  {
    id: "mern",
    category: "FULL STACK CORE",
    title: "MERN Stack Systems",
    icon: "⚡",
    rating: "98% PROFICIENT",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    desc: "Architecting end-to-end full stack web platforms with role-based JWT auth, custom middleware, and modular MVC architecture.",
    highlight: "40+ Production REST APIs",
  },
  {
    id: "algorithms",
    category: "LOGIC & COMPUTATION",
    title: "Data Structures & Java",
    icon: "✦",
    rating: "200+ PROBLEMS",
    tech: ["Java", "Binary Trees", "Graphs", "Dynamic Programming"],
    desc: "Rigorous computational problem solving covering asymptotic complexity, recursion, memoization, and graph traversal algorithms.",
    highlight: "200+ LeetCode / Curated Solved",
  },
  {
    id: "realtime",
    category: "NETWORKING & STREAMS",
    title: "Socket.IO & Real-Time",
    icon: "📡",
    rating: "<50ms LATENCY",
    tech: ["WebSockets", "Socket.IO", "Event Pipelines", "State Sync"],
    desc: "Bi-directional event-driven architecture streaming live messages, multi-user rooms, and notifications with zero polling overhead.",
    highlight: "Sub-50ms Event Delivery",
  },
  {
    id: "threejs-gsap",
    category: "SPATIAL & ANIMATION",
    title: "Three.js & GSAP Motion",
    icon: "⬡",
    rating: "60 FPS OPTIMIZED",
    tech: ["Three.js", "WebGL 2.0", "GSAP ScrollTrigger", "Lenis"],
    desc: "Crafting immersive 3D viewports, procedural particle matrices, armillary geometries, and fluid kinetic scroll interactions.",
    highlight: "Hardware Accelerated 3D",
  },
  {
    id: "database",
    category: "DATA ARCHITECTURE",
    title: "MongoDB & Mongoose",
    icon: "◈",
    rating: "<200ms QUERIES",
    tech: ["Aggregation Pipelines", "Indexing", "Atlas", "Relational Schemas"],
    desc: "Designing robust NoSQL schemas with indexing strategies achieving high-throughput document lookups under 200ms.",
    highlight: "Schema Indexing & Performance",
  },
  {
    id: "devops",
    category: "SHIPPING & TOOLING",
    title: "Cloud, Git & Vercel",
    icon: "🚀",
    rating: "100% AUTOMATED",
    tech: ["Git / GitHub", "Vercel CI/CD", "Vite", "Postman"],
    desc: "Modern deployment workflows with automated build triggers, semantic versioning, and environment-isolated cloud hosting.",
    highlight: "Verified Live Deployments",
  },
];

const NewspaperSkills3D = () => {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [hoveredCard, setHoveredCard] = useState(null);

  // 1. ScrollTrigger entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skills-editorial-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-editorial-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".skill-3d-card",
        { opacity: 0, y: 50, rotateX: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skills-3d-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Interactive 3D Spatial Mouse Tilt for the Entire Grid
  const handleGridMouseMove = (e) => {
    if (!cardsContainerRef.current) return;
    const rect = cardsContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotY = (x / (rect.width / 2)) * 4;
    const rotX = -(y / (rect.height / 2)) * 4;

    gsap.to(cardsContainerRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1200,
    });
  };

  const handleGridMouseLeave = () => {
    if (!cardsContainerRef.current) return;
    gsap.to(cardsContainerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  };

  // 3. Individual 3D Card Interactive Tilt & Lift
  const handleCardMouseMove = (e, idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltY = (x / (rect.width / 2)) * 10;
    const tiltX = -(y / (rect.height / 2)) * 10;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      translateZ: 28,
      duration: 0.25,
      ease: "power2.out",
      transformPerspective: 800,
    });
  };

  const handleCardMouseLeave = (idx) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  return (
    <section className="newspaper-skills-section" id="skills" ref={sectionRef}>
      {/* EDITORIAL HEADER */}
      <div className="skills-editorial-header">
        <div className="skills-header-left">
          <span className="skills-kicker font-blackletter">Department of Technical Craft</span>
          <h2 className="skills-headline">TECHNICAL EXPERTISE // 3D CARDS</h2>
          <p className="skills-lead">
            Interactive spatial matrix of core competencies across modern full-stack development, distributed architecture, and computational algorithms. Hover and explore cards in full 3D perspective.
          </p>
        </div>
        <div className="skills-header-right">
          <div className="skills-meta-capsule">
            <span className="meta-dot"></span>
            <span className="meta-text">6 DOMAINS // VERIFIED MASTERY</span>
          </div>
        </div>
      </div>

      {/* 3D SPATIAL CARDS MATRIX */}
      <div
        className="skills-3d-stage"
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
      >
        <div className="skills-3d-grid" ref={cardsContainerRef}>
          {skillsData.map((skill, index) => (
            <div
              key={skill.id}
              className={`skill-3d-card ${hoveredCard === skill.id ? "card-hovered" : ""}`}
              ref={(el) => (cardRefs.current[index] = el)}
              onMouseMove={(e) => handleCardMouseMove(e, index)}
              onMouseLeave={() => {
                handleCardMouseLeave(index);
                setHoveredCard(null);
              }}
              onMouseEnter={() => {
                setHoveredCard(skill.id);
                try {
                  playHoverBlip();
                } catch (e) {}
              }}
              onClick={() => {
                try {
                  playClickSound();
                } catch (e) {}
              }}
            >
              <div className="card-3d-inner">
                {/* CARD TOP STATUS BAR */}
                <div className="card-3d-header">
                  <span className="card-3d-cat">{skill.category}</span>
                  <span className="card-3d-icon">{skill.icon}</span>
                </div>

                {/* CARD TITLE & RATING */}
                <h3 className="card-3d-title">{skill.title}</h3>
                <div className="card-3d-rating-badge">
                  <span className="rating-pill">{skill.rating}</span>
                </div>

                {/* DESCRIPTION */}
                <p className="card-3d-desc">{skill.desc}</p>

                {/* TECH STACK CHIPS */}
                <div className="card-3d-tech-chips">
                  {skill.tech.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>

                {/* BOTTOM METRIC STRIP */}
                <div className="card-3d-footer">
                  <span className="footer-label">BENCHMARK:</span>
                  <span className="footer-highlight">{skill.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDITORIAL DISPATCH BOTTOM STRIP */}
      <div className="skills-footer-strip">
        <div className="strip-item">
          <span className="strip-num">01 // CODE INTEGRITY</span>
          <p>Clean architecture, strict type discipline, and modular patterns applied across 40+ endpoints.</p>
        </div>
        <div className="strip-item">
          <span className="strip-num">02 // LOW LATENCY</span>
          <p>Sub-50ms Socket.IO events and database index optimization for complex queries under 200ms.</p>
        </div>
        <div className="strip-item">
          <span className="strip-num">03 // PROBLEM SOLVING</span>
          <p>200+ algorithm challenges solved spanning graph structures, dynamic programming & recursion.</p>
        </div>
      </div>
    </section>
  );
};

export default NewspaperSkills3D;
