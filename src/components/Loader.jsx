
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Loader.css";

const Loader = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".loader-name-line",
      {
        y: "110%",
      },
      {
        y: "0%",
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out",
      }
    )
      .fromTo(
        ".loader-icon",
        {
          scale: 0,
          opacity: 0,
          rotate: -180,
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.7"
      )
      .fromTo(
        ".loader-small-text",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.4"
      )
      .to({}, { duration: 1 })
      .to(".loader-name-line", {
        y: "-110%",
        duration: 0.9,
        stagger: 0.05,
        ease: "power4.in",
      })
      .to(
        ".loader-icon",
        {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in",
        },
        "-=0.7"
      )
      .to(
        ".loader-small-text",
        {
          opacity: 0,
          duration: 0.3,
        },
        "-=0.5"
      )
      .to(
        loaderRef.current,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.1"
      )
      .set(loaderRef.current, {
        display: "none",
      });

    return () => tl.kill();
  }, []);

  return (
    <div
      className="loader"
      ref={loaderRef}
    >
      <div className="loader-top">
        <span>RRS / 2026</span>

        <span>PORTFOLIO</span>
      </div>

      <div className="loader-center">
        <div className="loader-name">
          <div className="loader-name-line">
            RITESH
          </div>

          <div className="loader-name-line loader-outline">
            RAJ 
          </div>
        </div>

        <div className="loader-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="loader-small-text">
          <span>LOADING</span>
          <span>FULL STACK DEVELOPER</span>
        </div>
      </div>

      <div className="loader-bottom">
        <span>DESIGN / CODE / MOTION</span>

        <span>INDIA</span>

        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </div>
  );
};

export default Loader;

