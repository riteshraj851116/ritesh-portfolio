import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./PaperCanvas3D.css";

const PaperCanvas3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Floating Ink & Terracotta Particles
    const particleCount = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const inkColor = new THREE.Color("#1d1d1b");
    const terracottaColor = new THREE.Color("#c03f13");
    const paperTint = new THREE.Color("#8f877f");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const choice = Math.random();
      const col = choice > 0.7 ? terracottaColor : choice > 0.4 ? inkColor : paperTint;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle 3D Wireframe Origami Paper Ribbon
    const ribbonGeo = new THREE.IcosahedronGeometry(4, 1);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0x1d1d1b,
      wireframe: true,
      transparent: true,
      opacity: 0.045,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(12, -2, -5);
    scene.add(ribbon);

    // Mouse Tracking for Interactive Drift
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;

      particles.rotation.y += 0.0006;
      particles.rotation.x = targetY * 0.15;
      particles.position.x = targetX * 1.5;

      ribbon.rotation.x += 0.002;
      ribbon.rotation.y += 0.003;
      ribbon.position.x = 12 + targetX * 2;
      ribbon.position.y = -2 + targetY * 2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="paper-3d-canvas-container" ref={mountRef} aria-hidden="true" />;
};

export default PaperCanvas3D;
