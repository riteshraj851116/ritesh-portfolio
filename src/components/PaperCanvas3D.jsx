import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { subscribeAudioActivity, playClickSound } from "../utils/audio";
import "./PaperCanvas3D.css";

const PaperCanvas3D = () => {
  const mountRef = useRef(null);
  const [hudStats, setHudStats] = useState({ fps: 60, particles: 360, mode: "AUTONOMOUS" });
  const [interactiveMode, setInteractiveMode] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const terracottaLight = new THREE.PointLight(0xc03f13, 3.5, 50);
    terracottaLight.position.set(15, 8, 12);
    scene.add(terracottaLight);

    const inkLight = new THREE.PointLight(0x1d1d1b, 2.0, 40);
    inkLight.position.set(-15, -10, 8);
    scene.add(inkLight);

    // 3. MASTER 3D ASTROLABE ARMILLARY CORE (Broadside Engineering Codex)
    const astrolabeGroup = new THREE.Group();
    // Default position aligned with broadsheet editorial column
    astrolabeGroup.position.set(window.innerWidth > 1024 ? 9.5 : 0, 0.5, -2);
    scene.add(astrolabeGroup);

    // Ring 1: Celestial Equator (Terracotta Red-Orange)
    const ring1Geo = new THREE.TorusGeometry(5.2, 0.045, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xc03f13,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xc03f13,
      emissiveIntensity: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    astrolabeGroup.add(ring1);

    // Ring 2: Meridian Ring (Dark Ink)
    const ring2Geo = new THREE.TorusGeometry(6.0, 0.04, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x1d1d1b,
      roughness: 0.4,
      metalness: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    astrolabeGroup.add(ring2);

    // Ring 3: Ecliptic Angled Zodiac Ring (Fine Wireframe)
    const ring3Geo = new THREE.TorusGeometry(6.8, 0.035, 12, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x787873,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 4;
    ring3.rotation.y = Math.PI / 6;
    astrolabeGroup.add(ring3);

    // Ring 4: Outer Navigational Hour Ring
    const ring4Geo = new THREE.TorusGeometry(7.6, 0.025, 8, 80);
    const ring4Mat = new THREE.MeshBasicMaterial({
      color: 0xc03f13,
      transparent: true,
      opacity: 0.25,
    });
    const ring4 = new THREE.Mesh(ring4Geo, ring4Mat);
    ring4.rotation.y = Math.PI / 3;
    astrolabeGroup.add(ring4);

    // Central 3D Geodesic Dodecahedron Core
    const coreGeo = new THREE.DodecahedronGeometry(2.4, 0);
    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: 0x1d1d1b,
      transparent: true,
      opacity: 0.45,
      linewidth: 2,
    });
    const coreWireframe = new THREE.LineSegments(coreEdges, coreMat);
    astrolabeGroup.add(coreWireframe);

    // Inner Glowing Octahedral Crystal
    const crystalGeo = new THREE.OctahedronGeometry(1.3, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xd8d1c9,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xc03f13,
      emissiveIntensity: 0.35,
      wireframe: false,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    astrolabeGroup.add(crystal);

    // 4. DYNAMIC MAGNETIC INK & TERRACOTTA PARTICLE FIELD (360 Particles)
    const particleCount = 360;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    const colInk = new THREE.Color("#1d1d1b");
    const colTerracotta = new THREE.Color("#c03f13");
    const colWarmPaper = new THREE.Color("#9e9488");

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 22;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      const roll = Math.random();
      const chosenColor = roll > 0.65 ? colTerracotta : roll > 0.35 ? colInk : colWarmPaper;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });

    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    // 5. INTERACTIVE AUDIO SHOCKWAVE RING
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.25, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xc03f13,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.position.set(0, 0, 0);
    scene.add(shockwaveMesh);

    let shockwaveRadius = 0;
    let shockwaveActive = false;

    // Trigger explosive 3D shockwave on audio click
    const triggerShockwave = (intensity = 1) => {
      shockwaveRadius = 0.5;
      shockwaveActive = true;
      shockwaveMat.opacity = Math.min(0.85, 0.4 + intensity * 0.45);
      shockwaveMesh.position.copy(astrolabeGroup.position);
      shockwaveMesh.scale.set(1, 1, 1);
    };

    const unsubscribeAudio = subscribeAudioActivity((intensity) => {
      triggerShockwave(intensity);
      // Temporary boost to core rotation
      astrolabeGroup.rotation.y += 0.08 * intensity;
      crystal.scale.setScalar(1 + intensity * 0.35);
      setTimeout(() => {
        crystal.scale.setScalar(1);
      }, 250);
    });

    // 6. MOUSE & SCROLL TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollProgress = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const onWindowClick = (e) => {
      // Create local mouse shockwave point in 3D
      triggerShockwave(0.9);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onWindowClick, { passive: true });

    // 7. WINDOW RESIZE
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (astrolabeGroup) {
        astrolabeGroup.position.x = window.innerWidth > 1024 ? 9.5 : 0;
      }
    };
    window.addEventListener("resize", onResize);

    // 8. RENDER LOOP
    let animationFrameId;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS Calculation for HUD
      frameCount++;
      if (time - lastFpsUpdate > 1000) {
        setHudStats((prev) => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (time - lastFpsUpdate)),
        }));
        frameCount = 0;
        lastFpsUpdate = time;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse interpolation
      targetMouseX += (mouseX - targetMouseX) * 0.05;
      targetMouseY += (mouseY - targetMouseY) * 0.05;

      // Gyroscopic Counter-Rotation of Astrolabe Armillary Rings
      ring1.rotation.y += 0.006;
      ring1.rotation.x += 0.003;

      ring2.rotation.z += 0.008;
      ring2.rotation.y -= 0.004;

      ring3.rotation.x -= 0.005;
      ring3.rotation.z += 0.005;

      ring4.rotation.y += 0.004;

      coreWireframe.rotation.x += 0.005;
      coreWireframe.rotation.y += 0.007;

      crystal.rotation.x -= 0.01;
      crystal.rotation.y += 0.012;

      // Dynamic Astrolabe Parallax following Mouse & Scroll
      const baseX = window.innerWidth > 1024 ? 9.5 - scrollProgress * 18 : 0;
      const baseY = 0.5 + Math.sin(time * 0.001) * 0.6 - scrollProgress * 4;
      const baseZ = -2 + Math.cos(time * 0.0008) * 1.5;

      astrolabeGroup.position.x = baseX + targetMouseX * 2.2;
      astrolabeGroup.position.y = baseY + targetMouseY * 2.0;
      astrolabeGroup.position.z = baseZ;

      astrolabeGroup.rotation.y = targetMouseX * 0.55 + scrollProgress * Math.PI;
      astrolabeGroup.rotation.x = -targetMouseY * 0.45;

      // Dynamic 3D Particle Swarm Physics
      const posAttr = particleGeo.attributes.position;
      const pArr = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Autonomous gentle orbital drift
        pArr[i3] += particleVelocities[i3];
        pArr[i3 + 1] += particleVelocities[i3 + 1];
        pArr[i3 + 2] += particleVelocities[i3 + 2];

        // Magnetic Attraction / Swirl towards 3D Astrolabe center
        const dx = astrolabeGroup.position.x - pArr[i3];
        const dy = astrolabeGroup.position.y - pArr[i3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 12.0) {
          pArr[i3] += dx * 0.0008;
          pArr[i3 + 1] += dy * 0.0008;
        }

        // Boundary wrap
        if (Math.abs(pArr[i3]) > 26) pArr[i3] = -pArr[i3] * 0.95;
        if (Math.abs(pArr[i3 + 1]) > 20) pArr[i3 + 1] = -pArr[i3 + 1] * 0.95;
        if (Math.abs(pArr[i3 + 2]) > 14) pArr[i3 + 2] = -pArr[i3 + 2] * 0.95;
      }
      posAttr.needsUpdate = true;

      // Animate Expanding Shockwave
      if (shockwaveActive) {
        shockwaveRadius += 18 * delta;
        shockwaveMesh.scale.set(shockwaveRadius, shockwaveRadius, 1);
        shockwaveMat.opacity = Math.max(0, shockwaveMat.opacity - 1.8 * delta);
        if (shockwaveMat.opacity <= 0) {
          shockwaveActive = false;
        }
      }

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // 9. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubscribeAudio();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("resize", onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Geometries and Materials
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      ring4Geo.dispose();
      ring4Mat.dispose();
      coreGeo.dispose();
      coreEdges.dispose();
      coreMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shockwaveGeo.dispose();
      shockwaveMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handlePulseClick = () => {
    try { playClickSound(); } catch (e) {}
    setInteractiveMode((prev) => !prev);
  };

  return (
    <div className="paper-3d-canvas-container" ref={mountRef} aria-hidden="true">
      {/* DISCREET EDITORIAL 3D HUD BADGE */}
      <div className="threejs-broadsheet-hud" onClick={handlePulseClick} title="Interactive 3D Three.js Astrolabe Engine">
        <span className="hud-indicator-dot"></span>
        <span className="hud-code">THREE.JS CODEX // 60 FPS</span>
        <span className="hud-metric">{hudStats.particles} PARTICLES</span>
        <span className="hud-action">TAP TO PULSE</span>
      </div>
    </div>
  );
};

export default PaperCanvas3D;
