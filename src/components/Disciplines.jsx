import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Code, Radio, Box, Sparkles, Terminal } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./Disciplines.css";

gsap.registerPlugin(ScrollTrigger);

const disciplinesData = [
  {
    number: "01",
    tag: "Full-Stack Web Applications",
    icon: Code,
    headline: "Production MERN platforms engineered for reliability & scale",
    description:
      "Your flagship web systems built with MongoDB, Express, React, and Node.js. Clean modular architectures, 40+ secured REST endpoints, bcrypt/JWT authorization, and optimized indexing delivering sub-200ms database response times.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Auth", "Tailwind CSS"],
    actionLabel: "Explore MERN Projects",
    actionHref: "#projects",
  },
  {
    number: "02",
    tag: "Low-Latency Event Pipelines",
    icon: Radio,
    headline: "Sub-50ms bidirectional streaming & live chat microservices",
    description:
      "Engineered real-time socket channels using Socket.IO and WebSockets for instant message dispatching, recruiter-candidate live negotiation, and synchronized presence with automated heartbeat reconnects.",
    tags: ["Socket.IO", "WebSockets", "Event Systems", "Live Messaging", "Node Server", "Sub-50ms"],
    actionLabel: "Launch Architecture Terminal",
    actionHref: "#architecture",
  },
  {
    number: "03",
    tag: "Interactive 3D & Creative Web",
    icon: Box,
    headline: "Immersive WebGL canvases, Three.js & GSAP choreography",
    description:
      "Transforming static user interfaces into memorable digital moments. Custom Three.js particle constellation universes, 3D rotating cylinder rings, GSAP timeline physics, velocity cursor tracking, and procedural Web Audio synthesizers.",
    tags: ["Three.js", "WebGL", "GSAP Motion", "ScrollTrigger", "Web Audio API", "60+ FPS"],
    actionLabel: "Interact with 3D Core",
    actionHref: "#skills",
  },
];

const Disciplines = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".discipline-header-reveal",
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      const items = gsap.utils.toArray(".discipline-card");
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="disciplines-section" id="disciplines" ref={sectionRef}>
      {/* SECTION HEADER */}
      <div className="disciplines-header">
        <div className="disciplines-header-top discipline-header-reveal">
          <span className="disciplines-tag">[ Disciplines ]</span>
          <span className="disciplines-count">03 disciplines · MERN & Creative Frontend</span>
        </div>

        <h2 className="disciplines-title discipline-header-reveal">
          WHAT I CAN<br />BUILD FOR YOU
        </h2>

        <p className="disciplines-subtext discipline-header-reveal">
          From high-throughput backend APIs to interactive 3D frontend architectures.
        </p>
      </div>

      {/* DISCIPLINE CARDS LIST */}
      <div className="disciplines-list">
        {disciplinesData.map((d) => {
          const IconComp = d.icon;
          return (
            <article key={d.number} className="discipline-card">
              {/* TOP META ROW */}
              <div className="discipline-top-row">
                <div className="discipline-badge-group">
                  <span className="discipline-dot"></span>
                  <span className="discipline-tag-name">{d.tag}</span>
                </div>

                <div className="discipline-num-group">
                  <span className="discipline-num">[ {d.number} ]</span>
                </div>
              </div>

              {/* MAIN HEADLINE */}
              <h3 className="discipline-headline">{d.headline}</h3>

              {/* DESCRIPTION */}
              <p className="discipline-desc">{d.description}</p>

              {/* TECH CHIP TAGS */}
              <div className="discipline-tags-list">
                {d.tags.map((tag, idx) => (
                  <span key={idx} className="discipline-tech-chip">
                    {tag}
                  </span>
                ))}
              </div>

              {/* ACTION BUTTON WITH SWEEP */}
              <div className="discipline-action-wrapper">
                <a
                  href={d.actionHref}
                  className="discipline-btn"
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                >
                  <span className="btn-sweep"></span>
                  <span className="btn-label">{d.actionLabel}</span>
                  <ArrowUpRight size={14} className="btn-arrow" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Disciplines;
