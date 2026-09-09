import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered safely in browser environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initialize GSAP ScrollTrigger reveals across broadsheet components
 */
export const initBroadsheetScrollTriggers = () => {
  if (typeof window === "undefined") return;

  // Refresh ScrollTrigger to ensure accurate positions with Lenis
  ScrollTrigger.refresh();

  // 1. Projects Section Header & Cards Stagger
  const projectCards = document.querySelectorAll(".project-broadsheet-card");
  if (projectCards.length > 0) {
    gsap.fromTo(
      projectCards,
      {
        y: 45,
        opacity: 0,
        scale: 0.98,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-broadsheet-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      }
    );
  }

  // 2. Playbook Credentials Stitched Cards Stagger
  const ticketCards = document.querySelectorAll(".stitched-ticket-card");
  if (ticketCards.length > 0) {
    gsap.fromTo(
      ticketCards,
      {
        y: 35,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stitched-cards-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }

  // 3. Section Headers Reveal
  const sectionHeaders = document.querySelectorAll(
    ".projects-editorial-header, .playbook-statement-spread, .three-d-lab-header"
  );
  sectionHeaders.forEach((header) => {
    gsap.fromTo(
      header,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });
};

/**
 * Attach GSAP 3D perspective tilt to interactive cards
 * @param {HTMLElement} element 
 * @param {number} maxTiltDeg 
 */
export const attach3DTilt = (element, maxTiltDeg = 8) => {
  if (!element) return () => {};

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateY = (x / (rect.width / 2)) * maxTiltDeg;
    const rotateX = -(y / (rect.height / 2)) * maxTiltDeg;

    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: 900,
      duration: 0.35,
      ease: "power2.out",
      boxShadow: "0 18px 36px rgba(29, 29, 27, 0.12)",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
      boxShadow: "0 0 0 rgba(29, 29, 27, 0)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

/**
 * Attach GSAP magnetic cursor pull to interactive buttons
 * @param {HTMLElement} element 
 * @param {number} strength 
 */
export const attachMagnetic = (element, strength = 0.35) => {
  if (!element) return () => {};

  const xTo = gsap.quickTo(element, "x", { duration: 0.3, ease: "power3" });
  const yTo = gsap.quickTo(element, "y", { duration: 0.3, ease: "power3" });

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    xTo(x);
    yTo(y);
  };

  const handleMouseLeave = () => {
    xTo(0);
    yTo(0);
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};
