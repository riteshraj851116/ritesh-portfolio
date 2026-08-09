import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    name: "CAR RENTAL",
    category: "FULL STACK WEB APPLICATION",
    description:
      "A complete car rental platform where users can explore available cars, view details, make bookings and manage their rental activity. Includes authentication, owner dashboard, car management and booking management.",
    tech: "MERN · JWT · IMAGEKIT · REST API",
  },
  {
    number: "02",
    name: "CODECREW",
    category: "DEVELOPER COLLABORATION PLATFORM",
    description:
      "A developer networking and collaboration platform where developers can discover other developers, connect with teammates and collaborate on projects.",
    tech: "MERN · SOCKET.IO · JWT",
  },
  {
    number: "03",
    name: "EXPENSE TRACKER",
    category: "FINANCE MANAGEMENT APPLICATION",
    description:
      "A modern expense tracking application for managing income and expenses, monitoring spending and keeping personal financial records organized.",
    tech: "REACT · JAVASCRIPT · CSS",
  },
];

const Projects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".project-row");

      rows.forEach((row, index) => {
        gsap.fromTo(
          row,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            delay: index * 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (event) => {
    if (window.innerWidth <= 768) return;

    const row = event.currentTarget;
    const card = row.querySelector(".project-card");
    const cardContent = row.querySelector(".project-card-content");
    const giantText = row.querySelector(".project-giant-text");

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;

    const rotateY = percentX * 18;
    const rotateX = percentY * -14;

    gsap.to(card, {
      rotateX,
      rotateY,
      rotateZ: percentX * 2,
      scale: 1.035,
      duration: 0.5,
      ease: "power3.out",
      overwrite: true,
    });

    if (cardContent) {
      gsap.to(cardContent, {
        x: percentX * 22,
        y: percentY * 22,
        z: 70,
        duration: 0.65,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (giantText) {
      gsap.to(giantText, {
        x: percentX * -12,
        y: percentY * -8,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  const handleMouseEnter = (event) => {
    if (window.innerWidth <= 768) return;

    const row = event.currentTarget;
    const card = row.querySelector(".project-card");

    if (!card) return;

    gsap.to(card, {
      scale: 1.035,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = (event) => {
    const row = event.currentTarget;

    const card = row.querySelector(".project-card");
    const cardContent = row.querySelector(".project-card-content");
    const giantText = row.querySelector(".project-giant-text");

    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      duration: 1.1,
      ease: "power4.out",
      overwrite: true,
    });

    if (cardContent) {
      gsap.to(cardContent, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power4.out",
        overwrite: true,
      });
    }

    if (giantText) {
      gsap.to(giantText, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power4.out",
        overwrite: true,
      });
    }
  };

  return (
    <section
      className="projects-section"
      id="projects"
      ref={sectionRef}
    >
      <div className="projects-top">
        <span>03 / SELECTED WORK</span>

        <span>PROJECTS / 2026</span>
      </div>

      <div className="projects-list">
        {projects.map((project) => (
          <article
            className="project-row"
            key={project.number}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="project-number">
              {project.number}
            </div>

            <div className="project-details">
              <div className="project-heading">
                <h2>{project.name}</h2>

                <span className="project-round-arrow">
                  ↗
                </span>
              </div>

              <span className="project-category">
                {project.category}
              </span>

              <div className="project-description">
                <p>{project.description}</p>

                <span className="project-tech">
                  {project.tech}
                </span>
              </div>
            </div>

            <div className="project-visual">
              <div className="project-card">
                <div className="project-card-background"></div>

                <div className="project-lines"></div>

                <div className="project-glow"></div>

                <div className="project-giant-text">
                  {project.name}
                </div>

                <div className="project-card-content">
                  <div className="card-top">
                    <span>RRS / {project.number}</span>

                    <span>SELECTED WORK</span>
                  </div>

                  <div className="card-center">
                    <span className="card-number">
                      {project.number}
                    </span>

                    <h3>{project.name}</h3>

                    <p>{project.category}</p>
                  </div>

                  <div className="card-bottom">
                    <span>FULL STACK</span>

                    <span>2026 ↗</span>
                  </div>
                </div>

                <div className="card-corner"></div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="projects-bottom">
        <span>03 PROJECTS</span>

        <span>MORE DETAILS IN RESUME ↓</span>
      </div>
    </section>
  );
};

export default Projects;