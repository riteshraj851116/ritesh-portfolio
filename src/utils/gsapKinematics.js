import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 1. Scroll-Velocity Inertia Skew Engine
 * Tracks scroll velocity and smoothly applies aerodynamic inertia skew (G-Force tilt)
 * to cards and typography.
 */
export const initScrollVelocitySkew = () => {
  if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
    return () => {};
  }

  const skewTargets = document.querySelectorAll(
    ".ln-project-card, .flagship-glass-card, .career-track-card, .ln-hero-left, .on-track-panel, .off-track-panel"
  );

  if (!skewTargets.length) return () => {};

  let currentSkew = 0;
  const proxy = { skew: 0 };

  const skewSetter = gsap.quickSetter(skewTargets, "skewY", "deg");
  const clamp = gsap.utils.clamp(-3.5, 3.5);

  const scrollTriggerInstance = ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      const targetSkew = clamp(velocity / -350);

      // Interpolate with power damping
      gsap.to(proxy, {
        skew: targetSkew,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => {
          currentSkew = proxy.skew;
          skewSetter(currentSkew);
        },
        onComplete: () => {
          gsap.to(proxy, {
            skew: 0,
            duration: 0.6,
            ease: "power3.out",
            onUpdate: () => skewSetter(proxy.skew),
          });
        },
      });
    },
  });

  return () => {
    scrollTriggerInstance.kill();
    gsap.set(skewTargets, { skewY: 0 });
  };
};

/**
 * 2. 3D Card Tilt with Dynamic Specular Glare (GSAP 3D Matrix Lerp)
 * Attaches interactive 3D physics to a card element with dynamic specular radial shine.
 */
export const attach3DCardTilt = (element, options = {}) => {
  if (!element || window.matchMedia("(pointer: coarse)").matches) return () => {};

  const { maxTilt = 12, perspective = 1000, speed = 400, glare = true } = options;

  let glareElement = null;
  if (glare) {
    glareElement = document.createElement("div");
    glareElement.className = "gsap-specular-glare";
    glareElement.style.position = "absolute";
    glareElement.style.inset = "0";
    glareElement.style.pointerEvents = "none";
    glareElement.style.borderRadius = "inherit";
    glareElement.style.opacity = "0";
    glareElement.style.background =
      "radial-gradient(circle 320px at 50% 50%, rgba(210, 255, 0, 0.22), transparent 70%)";
    glareElement.style.transition = "opacity 0.3s ease";
    glareElement.style.zIndex = "3";
    element.style.position = "relative";
    element.style.transformStyle = "preserve-3d";
    element.appendChild(glareElement);
  }

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    const rotateY = normalizedX * maxTilt;
    const rotateX = -normalizedY * maxTilt;

    gsap.to(element, {
      rotateX,
      rotateY,
      transformPerspective: perspective,
      duration: speed / 1000,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (glareElement) {
      glareElement.style.opacity = "1";
      glareElement.style.background = `radial-gradient(circle 380px at ${x}px ${y}px, rgba(210, 255, 0, 0.25), rgba(255, 255, 255, 0.08) 35%, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });

    if (glareElement) {
      glareElement.style.opacity = "0";
    }
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
    if (glareElement && glareElement.parentNode) {
      glareElement.parentNode.removeChild(glareElement);
    }
    gsap.set(element, { rotateX: 0, rotateY: 0 });
  };
};

/**
 * 3. Magnetic Physics on Action Buttons & Navigation Pills
 */
export const initMagneticElements = () => {
  if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
    return () => {};
  }

  const magneticBtns = document.querySelectorAll(
    ".ln-nav-cta, .ln-btn-lime, .ln-btn-dark, .ln-drawer-rev-btn, .ln-audio-pill-btn"
  );

  const cleanups = [];

  magneticBtns.forEach((btn) => {
    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.35;
      const deltaY = (e.clientY - centerY) * 0.35;

      gsap.to(btn, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1.1, 0.35)",
        overwrite: "auto",
      });
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    cleanups.push(() => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
      gsap.set(btn, { x: 0, y: 0 });
    });
  });

  return () => {
    cleanups.forEach((c) => c());
  };
};

/**
 * 4. Section Entrance Telemetry & Kinetic Scrub
 */
export const initSectionKineticEntrances = () => {
  if (typeof window === "undefined") return () => {};

  const sections = document.querySelectorAll("section[id]");
  const cleanups = [];

  sections.forEach((sec) => {
    const heading = sec.querySelector("h2, .ln-section-title, .b-d-hero-title");
    if (!heading) return;

    const st = ScrollTrigger.create({
      trigger: sec,
      start: "top 78%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          heading,
          { letterSpacing: "0.15em", opacity: 0.6, y: 15 },
          { letterSpacing: "normal", opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      },
    });

    cleanups.push(() => st.kill());
  });

  return () => {
    cleanups.forEach((c) => c());
  };
};
