import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ExternalLink, Award, Sparkles } from "lucide-react";
import { playClickSound, playHoverSound } from "../utils/audio";
import "./TabularIndex.css";

gsap.registerPlugin(ScrollTrigger);

const indexRows = [
  {
    number: "01",
    title: "JobSphere",
    category: "Full Stack Job Portal & Real-time Chat",
    tech: "MERN Stack · Socket.IO · JWT · RESTful APIs",
    year: "2026",
    link: "https://jobsphere-vercel.vercel.app",
    linkType: "LIVE DEMO",
    badge: "PRODUCTION BUILD",
  },
  {
    number: "02",
    title: "TeraCar (VeloceDrive)",
    category: "Car Rental Management Engine",
    tech: "React.js · Node.js · Express · MongoDB Mongoose",
    year: "2026",
    link: "https://teracar-tan.vercel.app/",
    linkType: "LIVE DEMO",
    badge: "PRODUCTION BUILD",
  },
  {
    number: "03",
    title: "RCB Fan Portal",
    category: "Sports Franchise Interactive Hub",
    tech: "React · State Management · Dynamic Roster",
    year: "2026",
    link: "https://riteshraj851116.github.io/RCB/",
    linkType: "LIVE DEMO",
    badge: "INTERACTIVE SPA",
  },
  {
    number: "04",
    title: "CodeHelp (Love Babbar)",
    category: "MERN Stack Web Development Certified",
    tech: "150+ Hours Full Stack Architecture & REST APIs",
    year: "2025",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492473688705875968-sIML",
    linkType: "CREDENTIAL",
    badge: "CERTIFICATION",
  },
  {
    number: "05",
    title: "Apna College (Shradha Khapra)",
    category: "Data Structures & Algorithms in Java",
    tech: "200+ Algorithmic Problems Solved · Core CS",
    year: "2025",
    link: "https://www.linkedin.com/posts/ritesh-raj-9b52162a7_share-7492476226008358913-u7y5",
    linkType: "CREDENTIAL",
    badge: "CERTIFICATION",
  },
  {
    number: "06",
    title: "Galgotias University",
    category: "B.Tech in Computer Science and Engineering",
    tech: "Greater Noida · CGPA: 7.3 / 10 · Core Algorithms & DBMS",
    year: "2023—27",
    link: "https://www.galgotiasuniversity.edu.in/",
    linkType: "UNIVERSITY",
    badge: "UNDERGRADUATE",
  },
];

const TabularIndex = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tabular-header-reveal",
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

      const rows = gsap.utils.toArray(".tabular-row");
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tabular-index-section" ref={sectionRef}>
      {/* HEADER */}
      <div className="tabular-header">
        <div className="tabular-header-top tabular-header-reveal">
          <span className="tabular-tag">[ Index & Credentials ]</span>
          <span className="tabular-count">06 verified records</span>
        </div>

        <h2 className="tabular-title tabular-header-reveal">
          SELECTED WORK<br />& CREDENTIALS
        </h2>

        <p className="tabular-subtitle tabular-header-reveal">
          A tabular index of deployed full-stack products, real-time architectures, and certified CS milestones.
        </p>
      </div>

      {/* TABLE */}
      <div className="tabular-table">
        {/* TABLE HEAD */}
        <div className="tabular-table-head" aria-hidden="true">
          <span className="col-no">[ No ]</span>
          <span className="col-title">[ Project / Institution ]</span>
          <span className="col-tech">[ Architecture / Focus ]</span>
          <span className="col-year">[ Year ]</span>
          <span className="col-action">[ Action ]</span>
        </div>

        {/* ROWS */}
        <div className="tabular-rows-container">
          {indexRows.map((row) => (
            <a
              key={row.number}
              href={row.link}
              target="_blank"
              rel="noopener noreferrer"
              className="tabular-row"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            >
              {/* COL 1: NUMBER */}
              <span className="col-no tabular-mono-num">{row.number}</span>

              {/* COL 2: TITLE & CATEGORY */}
              <div className="col-title tabular-title-group">
                <span className="tabular-row-title">{row.title}</span>
                <span className="tabular-row-category">{row.category}</span>
              </div>

              {/* COL 3: TECH / ARCHITECTURE */}
              <div className="col-tech tabular-tech-group">
                <span className="tabular-tech-text">{row.tech}</span>
                <span className="tabular-badge">{row.badge}</span>
              </div>

              {/* COL 4: YEAR */}
              <span className="col-year tabular-year">{row.year}</span>

              {/* COL 5: ACTION */}
              <div className="col-action tabular-action">
                <span className="tabular-action-label">{row.linkType}</span>
                <ArrowUpRight size={14} className="tabular-arrow" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TabularIndex;
