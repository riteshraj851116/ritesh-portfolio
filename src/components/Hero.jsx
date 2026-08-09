
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import HeroScene from "./HeroScene";
import profileImage from "../assets/Adobe Express - file.png";

import "./Hero.css";

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.25,
      });

      tl.fromTo(
        ".hero-top-item",
        {
          opacity: 0,
          y: -15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        }
      )
        .fromTo(
          ".hero-title-line",
          {
            y: 140,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".hero-description",
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .fromTo(
          imageRef.current,
          {
            y: 100,
            scale: 0.82,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .fromTo(
          sceneRef.current,
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 0.7,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1"
        )
        .fromTo(
          ".hero-floating-label",
          {
            opacity: 0,
            x: 20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .fromTo(
          ".hero-bottom",
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (window.innerWidth <= 768) return;

      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(imageRef.current, {
        x: x * 18,
        y: y * 18,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(sceneRef.current, {
        x: x * -30,
        y: y * -30,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  return (
    <section
      className="hero"
      id="home"
      ref={heroRef}
    >
      {/* TOP INFORMATION */}

      <div className="hero-top">
        <div className="hero-top-item">
          <span>BASED IN</span>
          <strong>BIHAR / INDIA</strong>
        </div>

        <div className="hero-top-item hero-top-center">
          <span>PORTFOLIO</span>
          <strong>2026</strong>
        </div>

        <div className="hero-top-item hero-availability">
          <span className="hero-status-dot"></span>
          <strong>AVAILABLE FOR WORK</strong>
        </div>
      </div>

      {/* MAIN HERO */}

      <div className="hero-content">

        {/* LEFT */}

        <div className="hero-left">

          <div className="hero-title">

            <div className="hero-title-mask">
              <div className="hero-title-line">
                RITESH
              </div>
            </div>

            <div className="hero-title-mask">
              <div className="hero-title-line hero-outline">
                RAJ 
              </div>
            </div>

          </div>

          <div className="hero-description">
            <span className="description-number">
              01
            </span>

            <p>
              I build full-stack digital
              experiences using MongoDB,
              Express, React and Node.js.
              I focus on clean interfaces,
              scalable backend logic and
              products that feel simple to use.
            </p>
          </div>

        </div>

        {/* RIGHT */}

        <div className="hero-right">

          {/* 3D SCENE */}

          <div
            className="hero-scene-wrapper"
            ref={sceneRef}
          >
            <HeroScene />
          </div>

          {/* PROFILE IMAGE */}

          <div
            className="hero-image-wrapper"
            ref={imageRef}
          >
            <div className="hero-image-frame">

              <img
                src={profileImage}
                alt="Ritesh Raj Singh"
              />

              <div className="hero-image-overlay">
                <span>RRS / 01</span>

                <span>FULL STACK</span>
              </div>

              <div className="hero-image-corner top-left"></div>
              <div className="hero-image-corner top-right"></div>
              <div className="hero-image-corner bottom-left"></div>
              <div className="hero-image-corner bottom-right"></div>

            </div>
          </div>

          {/* FLOATING LABEL */}

          <div className="hero-floating-label">
            <span>VIEW WORK</span>

            <ArrowUpRight size={15} />
          </div>

        </div>
      </div>

      {/* BOTTOM */}

      <div className="hero-bottom">

        <span>
          MERN STACK DEVELOPER
        </span>

        <div className="hero-scroll">
          <ArrowDown size={15} />

          <span>
            SCROLL TO EXPLORE
          </span>
        </div>

        <span>
          RRS / 2026
        </span>

      </div>
    </section>
  );
};

export default Hero;
