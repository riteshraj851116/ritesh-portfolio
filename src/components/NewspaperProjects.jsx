import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playHoverBlip, playClickSound } from "../utils/audio";
import "./NewspaperProjects.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projectsData = [
  {
    id: "jobsphere",
    badge: "NEW",
    title: "JOBSPHERE",
    subtitle: "Full Stack Job Portal (2026)",
    desc: "Production-ready recruitment ecosystem connecting applicants and hiring teams with role-based dashboards. Built with JWT & bcrypt stateless authentication, 40+ modular RESTful API endpoints, and sub-50ms Socket.IO live messaging.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=900&auto=format&fit=crop",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.IO", "REST APIs"],
    demoUrl: "https://jobsphere-vercel.vercel.app",
    githubUrl: "https://github.com/riteshraj851116/jobsphere",
  },
  {
    id: "velocedrive",
    badge: "NEW",
    title: "TERACAR (VELOCEDRIVE)",
    subtitle: "Car Rental Management System (2026)",
    desc: "End-to-end car rental platform managing fleet discovery, real-time availability checks, and booking pipelines. Features Mongoose query optimization under 200ms, 15+ atomic React components, and custom auth middleware.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900&auto=format&fit=crop",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Tailwind CSS"],
    demoUrl: "https://teracar-tan.vercel.app/",
    githubUrl: "https://github.com/riteshraj851116/teracar",
  },
  {
    id: "rcbfan",
    badge: "LIGHTHOUSE 90+",
    title: "RCB FAN PORTAL",
    subtitle: "Frontend Sports Web Application (2026)",
    desc: "Responsive sports platform achieving a 90+ Lighthouse performance score. Features dynamic client-side state streaming live match feeds, player rosters, and statistics without page reloads using fluid CSS Grid & Flexbox.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=900&auto=format&fit=crop",
    tech: ["React.js", "JavaScript ES6+", "HTML5", "CSS3", "Vite", "CSS Grid"],
    demoUrl: "https://riteshraj851116.github.io/rcb-fan-website/",
    githubUrl: "https://github.com/riteshraj851116/rcb-fan-website",
  },
];

const NewspaperProjects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Editorial Header Reveal
      gsap.fromTo(
        ".projects-editorial-header",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".projects-editorial-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Project Cards Stagger Entrance
      gsap.fromTo(
        ".project-broadsheet-card",
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-broadsheet-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP 3D Perspective Tilt on Mouse Movement
  const handleCardMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * 6;
    const rotateX = -(y / (rect.height / 2)) * 6;

    gsap.to(cardEl, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = (cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section className="newspaper-projects-section" id="work" ref={sectionRef}>
      {/* SECTION HEADER EDITORIAL SPREAD */}
      <div className="projects-editorial-header">
        <div className="header-column-left">
          <span className="section-label font-blackletter" style={{ fontSize: "1.1rem", color: "var(--terracotta)", letterSpacing: "0.02em" }}>
            The Gazette of Works
          </span>
          <h2 className="projects-headline-lead">
            Fresh entries — A curated catalog of full-stack engineering releases.
          </h2>
        </div>
        <div className="header-column-right">
          <h2 className="projects-headline-huge">
            <span>THINK, CODE</span>
            <span className="deliver-word font-blackletter">Delivered</span>
          </h2>
        </div>
      </div>

      {/* BROADSHEET PROJECT GRID WITH GSAP 3D TILT */}
      <div className="projects-broadsheet-grid">
        {projectsData.map((project, index) => (
          <article
            key={project.id}
            className="project-broadsheet-card"
            onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
            onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
            onMouseEnter={() => {
              try { playHoverBlip(); } catch (e) {}
            }}
          >
            <div className="card-top-bar">
              <span className="card-edition-num">EDITION 0{index + 1} // RELEASE</span>
              <span className="card-badge">{project.badge}</span>
            </div>

            <div className="card-visual-frame">
              <img src={project.image} alt={project.title} className="card-visual-img" loading="lazy" />
              <div className="visual-overlay-stamp">
                <span>VERIFIED BUILD</span>
              </div>
            </div>

            <div className="card-body">
              <h3 className="card-title">{project.title}</h3>
              <h4 className="card-subtitle">{project.subtitle}</h4>
              <p className="card-description">{project.desc}</p>

              <div className="card-tech-strip">
                {project.tech.map((t) => (
                  <span key={t} className="tech-pill">
                    {t}
                  </span>
                ))}
              </div>

              <div className="card-actions-bar">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="action-link-fill"
                  onClick={() => {
                    try { playClickSound(); } catch (e) {}
                  }}
                >
                  LIVE LAUNCH ↗
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="action-link-line"
                  onClick={() => {
                    try { playClickSound(); } catch (e) {}
                  }}
                >
                  SOURCE CODE ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewspaperProjects;
