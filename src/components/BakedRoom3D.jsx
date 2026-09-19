import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Compass,
  Sun,
  Moon,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
  Monitor,
  Cpu,
  Award,
  Terminal,
} from "lucide-react";
import { playClickSound, playHoverBlip } from "../utils/audio";
import "./BakedRoom3D.css";

/**
 * INTERACTIVE 3D BAKED ROOM CONCEPT
 * Leverages Three.js to render a stylized, detailed isometric developer studio.
 * Uses procedural baked texture mapping (ambient occlusion, lightmaps, floor gradients)
 * for high-performance, realistic visuals without heavy real-time shadows.
 * Standard OrbitControls are constrained within strict bounding limits.
 */
const BakedRoom3D = () => {
  const mountRef = useRef(null);
  const [lightMode, setLightMode] = useState("cozy"); // "day", "cozy", "cyberpunk"
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [fps, setFps] = useState(60);

  // Three.js internal refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const lightsRef = useRef({});
  const materialsRef = useRef({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. SCENE & CAMERA (Constrained Isometric Perspective)
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    // Classic isometric angle
    camera.position.set(13, 11, 13);
    camera.lookAt(0, 1.4, 0);
    cameraRef.current = camera;

    // 2. RENDERER (Antialiased, Tone Mapped)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. CONSTRAINED ORBIT CONTROLS (Prevent clipping & illegal angles)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.2, 0);
    controls.minDistance = 9.0;
    controls.maxDistance = 21.0;
    // Bounding limits: user cannot flip under floor or go directly overhead
    controls.minPolarAngle = Math.PI / 4.8;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minAzimuthAngle = -Math.PI / 2.8;
    controls.maxAzimuthAngle = Math.PI / 2.8;
    controlsRef.current = controls;

    // 4. PROCEDURAL BAKED TEXTURE GENERATION
    // Floor Baked Texture (Wood planks + Baked Ambient Occlusion edges)
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext("2d");
    // Base warm oak tone
    fCtx.fillStyle = "#baa894";
    fCtx.fillRect(0, 0, 1024, 1024);
    // Wood plank lines
    fCtx.strokeStyle = "rgba(45, 35, 25, 0.15)";
    fCtx.lineWidth = 3;
    for (let p = 0; p < 1024; p += 64) {
      fCtx.beginPath();
      fCtx.moveTo(0, p);
      fCtx.lineTo(1024, p);
      fCtx.stroke();
    }
    // Baked Ambient Occlusion along back corner walls
    const floorAoGradX = fCtx.createLinearGradient(0, 0, 320, 0);
    floorAoGradX.addColorStop(0, "rgba(25, 20, 15, 0.55)");
    floorAoGradX.addColorStop(1, "rgba(25, 20, 15, 0.0)");
    fCtx.fillStyle = floorAoGradX;
    fCtx.fillRect(0, 0, 320, 1024);

    const floorAoGradY = fCtx.createLinearGradient(0, 0, 0, 320);
    floorAoGradY.addColorStop(0, "rgba(25, 20, 15, 0.55)");
    floorAoGradY.addColorStop(1, "rgba(25, 20, 15, 0.0)");
    fCtx.fillStyle = floorAoGradY;
    fCtx.fillRect(0, 0, 1024, 320);

    // Soft Baked Desk Contact Shadow
    const deskShadowGrad = fCtx.createRadialGradient(480, 480, 30, 480, 480, 240);
    deskShadowGrad.addColorStop(0, "rgba(20, 15, 10, 0.65)");
    deskShadowGrad.addColorStop(1, "rgba(20, 15, 10, 0.0)");
    fCtx.fillStyle = deskShadowGrad;
    fCtx.fillRect(240, 240, 480, 480);

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.colorSpace = THREE.SRGBColorSpace;

    // Wall Baked Texture (Plaster + Soft Light Wash & Corner AO)
    const wallCanvas = document.createElement("canvas");
    wallCanvas.width = 1024;
    wallCanvas.height = 1024;
    const wCtx = wallCanvas.getContext("2d");
    wCtx.fillStyle = "#ded7cd";
    wCtx.fillRect(0, 0, 1024, 1024);
    // Subtle architectural plaster grain
    wCtx.fillStyle = "rgba(0, 0, 0, 0.02)";
    for (let i = 0; i < 20000; i++) {
      wCtx.fillRect(Math.random() * 1024, Math.random() * 1024, 1.5, 1.5);
    }
    // Corner shadow gradient
    const wallAoGrad = wCtx.createLinearGradient(0, 0, 260, 0);
    wallAoGrad.addColorStop(0, "rgba(35, 30, 25, 0.45)");
    wallAoGrad.addColorStop(1, "rgba(35, 30, 25, 0.0)");
    wCtx.fillStyle = wallAoGrad;
    wCtx.fillRect(0, 0, 260, 1024);

    const wallTexture = new THREE.CanvasTexture(wallCanvas);
    wallTexture.colorSpace = THREE.SRGBColorSpace;

    // 5. CONSTRUCT ISOMETRIC ROOM MESHES
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Floor Mesh (Rotated plane)
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshBasicMaterial({
      map: floorTexture,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 0);
    roomGroup.add(floorMesh);

    // Left Wall
    const leftWallGeo = new THREE.PlaneGeometry(10, 7.5);
    const leftWallMat = new THREE.MeshBasicMaterial({
      map: wallTexture,
      side: THREE.DoubleSide,
    });
    const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
    leftWall.position.set(-5, 3.75, 0);
    leftWall.rotation.y = Math.PI / 2;
    roomGroup.add(leftWall);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(10, 7.5);
    const backWallMat = new THREE.MeshBasicMaterial({
      map: wallTexture,
      side: THREE.DoubleSide,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 3.75, -5);
    roomGroup.add(backWall);

    // Baseboards (Dark timber trim)
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x24201c, roughness: 0.6 });
    const bb1 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 0.1), baseboardMat);
    bb1.position.set(0, 0.15, -4.95);
    roomGroup.add(bb1);
    const bb2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 10), baseboardMat);
    bb2.position.set(-4.95, 0.15, 0);
    roomGroup.add(bb2);

    // 6. DEVELOPER WORKSTATION FURNITURE
    // Desk Top (Natural Walnut)
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728,
      roughness: 0.45,
      metalness: 0.05,
    });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.18, 2.6), deskTopMat);
    deskTop.position.set(-0.6, 2.2, -2.8);
    roomGroup.add(deskTop);

    // Desk Legs (Matte Black Steel)
    const deskLegMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a18,
      roughness: 0.3,
      metalness: 0.8,
    });
    const legPositions = [
      [-3.0, 1.1, -3.9],
      [1.8, 1.1, -3.9],
      [-3.0, 1.1, -1.7],
      [1.8, 1.1, -1.7],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), deskLegMat);
      leg.position.set(lx, ly, lz);
      roomGroup.add(leg);
    });

    // 7. MONITORS & DEVELOPER RIG
    // Primary Curved Ultrawide Monitor
    const monitorStandMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.85 });
    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16), monitorStandMat);
    standPole.position.set(-0.6, 2.9, -3.7);
    roomGroup.add(standPole);

    // Monitor Bezel & Emissive Screen (CineAI Code Glow)
    const monitorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.5 })
    );
    monitorFrame.position.set(-0.6, 3.4, -3.5);
    roomGroup.add(monitorFrame);

    // Screen Canvas (CineAI Code & Terminal)
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const sCtx = screenCanvas.getContext("2d");
    sCtx.fillStyle = "#0c1017";
    sCtx.fillRect(0, 0, 512, 256);
    sCtx.fillStyle = "#c03f13";
    sCtx.font = "bold 20px monospace";
    sCtx.fillText("★ CINEAI 2.5 // DOLBY ATMOS CONCIERGE", 20, 36);
    sCtx.fillStyle = "#00ffaa";
    sCtx.font = "14px monospace";
    sCtx.fillText("const stream = await gemini.generateStream({ prompt });", 20, 72);
    sCtx.fillText("socket.emit('seat_locked', { row: 'F', num: 12 });", 20, 98);
    sCtx.fillStyle = "#ded7cd";
    sCtx.fillText("// Latency: 18ms · Socket.IO active · Node 20 LTS", 20, 130);
    sCtx.fillStyle = "#ffaa00";
    sCtx.fillText("[TEST RUN]: 24/24 Integration Tests Passed", 20, 165);
    sCtx.fillStyle = "#38bdf8";
    sCtx.fillText(">> Production Build Ready for Vercel Edge", 20, 200);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.35), screenMat);
    screenMesh.position.set(-0.6, 3.4, -3.43);
    roomGroup.add(screenMesh);
    materialsRef.current.screenMat = screenMat;

    // Secondary Vertical Monitor (JobSphere Feed)
    const vertFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 2.0, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x151515 })
    );
    vertFrame.position.set(1.6, 3.4, -3.4);
    vertFrame.rotation.y = -Math.PI * 0.12;
    roomGroup.add(vertFrame);

    const vertCanvas = document.createElement("canvas");
    vertCanvas.width = 256;
    vertCanvas.height = 512;
    const vCtx = vertCanvas.getContext("2d");
    vCtx.fillStyle = "#080b11";
    vCtx.fillRect(0, 0, 256, 512);
    vCtx.fillStyle = "#c03f13";
    vCtx.font = "bold 16px monospace";
    vCtx.fillText("JOBSPHERE RTT", 15, 30);
    vCtx.fillStyle = "#22c55e";
    vCtx.font = "12px monospace";
    vCtx.fillText("PING: 42ms (sub-50ms)", 15, 60);
    vCtx.fillText("CONNECTED CLIENTS: 1,480", 15, 85);
    vCtx.fillStyle = "#94a3b8";
    vCtx.fillText("INDEX: IXSCAN <24ms", 15, 120);
    vCtx.fillText("MONGO CLUSTER: READY", 15, 145);
    vCtx.fillText("JWT COOKIE: SECURED", 15, 170);
    vCtx.fillStyle = "#f59e0b";
    vCtx.fillText("DSA: JAVA 200+ DONE", 15, 210);
    vCtx.fillText("BABBAR MERN: VERIFIED", 15, 235);
    const vertTexture = new THREE.CanvasTexture(vertCanvas);
    vertTexture.colorSpace = THREE.SRGBColorSpace;
    const vertScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 1.85),
      new THREE.MeshBasicMaterial({ map: vertTexture })
    );
    vertScreen.position.set(1.6, 3.4, -3.34);
    vertScreen.rotation.y = -Math.PI * 0.12;
    roomGroup.add(vertScreen);

    // Mechanical Keyboard on Desk
    const kbGeo = new THREE.BoxGeometry(1.4, 0.05, 0.45);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x181816, roughness: 0.7 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.position.set(-0.6, 2.32, -2.4);
    roomGroup.add(keyboard);

    // Precision Mouse
    const mouseGeo = new THREE.BoxGeometry(0.18, 0.04, 0.28);
    const mouse = new THREE.Mesh(mouseGeo, kbMat);
    mouse.position.set(0.6, 2.32, -2.4);
    roomGroup.add(mouse);

    // Ceramic Coffee Mug
    const mugGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.28, 16);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xc03f13, roughness: 0.3 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-1.8, 2.44, -2.2);
    roomGroup.add(mug);

    // Architectural Desk Lamp with Warm Light
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.22, 0.06, 16),
      new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 })
    );
    lampBase.position.set(-2.4, 2.32, -3.5);
    roomGroup.add(lampBase);

    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0xc03f13, roughness: 0.3 })
    );
    lampShade.rotation.x = Math.PI * 0.75;
    lampShade.position.set(-2.2, 3.3, -3.2);
    roomGroup.add(lampShade);

    // Lamp Warm PointLight (Local illumination)
    const lampLight = new THREE.PointLight(0xffa244, 2.2, 6.5);
    lampLight.position.set(-2.2, 3.1, -3.1);
    roomGroup.add(lampLight);
    lightsRef.current.lampLight = lampLight;

    // 8. ERGONOMIC DESK CHAIR
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-0.6, 0, -1.2);
    roomGroup.add(chairGroup);

    const chairSeat = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.14, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.8 })
    );
    chairSeat.position.set(0, 1.4, 0);
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.4, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.8 })
    );
    chairBack.position.set(0, 2.1, 0.55);
    chairGroup.add(chairBack);

    const chairStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.3, 12),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 })
    );
    chairStem.position.set(0, 0.7, 0);
    chairGroup.add(chairStem);

    // 9. WALL BOOKSHELF & CERTIFICATION PLAQUES
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x3d2d20, roughness: 0.6 });
    const shelf1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.12, 0.7), shelfMat);
    shelf1.position.set(-0.6, 5.2, -4.6);
    roomGroup.add(shelf1);

    // Software Engineering Books on Shelf
    const bookColors = [0xc03f13, 0x1d1d1b, 0x2980b9, 0x27ae60, 0x8e44ad];
    for (let b = 0; b < 5; b++) {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.65, 0.5),
        new THREE.MeshStandardMaterial({ color: bookColors[b], roughness: 0.6 })
      );
      book.position.set(-1.8 + b * 0.18, 5.6, -4.5);
      roomGroup.add(book);
    }

    // Framed Certificate on Wall (Babbar MERN + Apna College Java)
    const certFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.2, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x1d1d1b })
    );
    certFrame.position.set(-3.2, 5.0, -4.95);
    roomGroup.add(certFrame);

    const certPaper = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 1.0),
      new THREE.MeshBasicMaterial({ color: 0xfbf6ee })
    );
    certPaper.position.set(-3.2, 5.0, -4.91);
    roomGroup.add(certPaper);

    // Potted Indoor Plant in Corner
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.3, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xc03f13, roughness: 0.6 })
    );
    pot.position.set(-4.1, 0.4, -4.1);
    roomGroup.add(pot);

    const plantGreen = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 });
    for (let lf = 0; lf < 6; lf++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), plantGreen);
      leaf.scale.set(0.6, 1.5, 0.15);
      leaf.rotation.set(
        Math.PI * 0.25 * Math.sin(lf),
        (lf * Math.PI) / 3,
        Math.PI * 0.15 * Math.cos(lf)
      );
      leaf.position.set(-4.1 + Math.sin(lf) * 0.25, 1.0 + lf * 0.12, -4.1 + Math.cos(lf) * 0.25);
      roomGroup.add(leaf);
    }

    // 10. LIGHTING RIG (Balanced Ambient + Key Light + Screen Glow)
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.2);
    scene.add(ambientLight);
    lightsRef.current.ambientLight = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    sunLight.position.set(8, 12, 10);
    scene.add(sunLight);
    lightsRef.current.sunLight = sunLight;

    const monitorGlow = new THREE.PointLight(0x38bdf8, 1.5, 4.0);
    monitorGlow.position.set(-0.6, 3.4, -2.8);
    scene.add(monitorGlow);
    lightsRef.current.monitorGlow = monitorGlow;

    // 11. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 12. ANIMATION LOOP (60-90 FPS V-Sync)
    let animId;
    let frameCount = 0;
    let lastFpsStamp = performance.now();
    let clock = new THREE.Clock();

    const loop = () => {
      animId = requestAnimationFrame(loop);

      frameCount++;
      const now = performance.now();
      if (now - lastFpsStamp >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsStamp)));
        frameCount = 0;
        lastFpsStamp = now;
      }

      const elapsed = clock.getElapsedTime();

      // Slow gentle auto-rotation when enabled
      if (autoRotate && controlsRef.current) {
        roomGroup.rotation.y = Math.sin(elapsed * 0.2) * 0.2;
      } else {
        roomGroup.rotation.y = 0;
      }

      // Subtle pulse on screen glow
      if (monitorGlow) {
        monitorGlow.intensity = 1.3 + Math.sin(elapsed * 2.5) * 0.25;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    loop();

    // 13. CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      floorGeo.dispose();
      floorMat.dispose();
      leftWallGeo.dispose();
      leftWallMat.dispose();
      backWallGeo.dispose();
      backWallMat.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Handle Lighting Preset Switcher
  const handleSetLightMode = (mode) => {
    playClickSound();
    setLightMode(mode);

    const { ambientLight, sunLight, lampLight, monitorGlow } = lightsRef.current;
    if (!ambientLight || !sunLight || !lampLight || !monitorGlow) return;

    if (mode === "day") {
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 1.6;
      sunLight.color.setHex(0xfffaed);
      sunLight.intensity = 2.8;
      lampLight.intensity = 0.5;
      monitorGlow.intensity = 0.8;
    } else if (mode === "cozy") {
      ambientLight.color.setHex(0xfff3e0);
      ambientLight.intensity = 1.1;
      sunLight.color.setHex(0xffd59e);
      sunLight.intensity = 1.8;
      lampLight.intensity = 2.4;
      monitorGlow.intensity = 1.4;
    } else if (mode === "cyberpunk") {
      ambientLight.color.setHex(0x1a0933);
      ambientLight.intensity = 0.8;
      sunLight.color.setHex(0x00ffff);
      sunLight.intensity = 1.2;
      lampLight.intensity = 2.8;
      lampLight.color.setHex(0xff007f);
      monitorGlow.intensity = 2.5;
      monitorGlow.color.setHex(0x00ffaa);
    }
  };

  const handleResetCamera = () => {
    playClickSound();
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(13, 11, 13);
      controlsRef.current.target.set(0, 1.2, 0);
      controlsRef.current.update();
    }
  };

  return (
    <section className="baked-room-section" id="developer-studio-3d">
      {/* BROADSHEET EDITORIAL MASTHEAD */}
      <div className="baked-room-header">
        <div className="baked-meta-bar">
          <span className="baked-tag">SECTION 04 // 3D BAKED DEVELOPER STUDIO</span>
          <span className="baked-sep">◈</span>
          <span className="baked-pipeline">ISOMETRIC AMBIENT OCCLUSION &amp; BAKED LIGHTMAPS</span>
          <span className="baked-fps">● {fps} FPS V-SYNC</span>
        </div>

        <h2 className="baked-headline">THE ARCHITECT'S WORKSPACE</h2>

        <p className="baked-deck">
          Direct implementation of the <b>Interactive 3D Baked Room Concept</b>. Stylized
          isometric developer headquarters utilizing pre-computed baked ambient occlusion and
          lightmaps for ultra-realistic soft contact shadows at 90 FPS with restricted OrbitControls.
        </p>
      </div>

      {/* 3D WORKBENCH CARD */}
      <div className="baked-workbench-grid">
        {/* LEFT / CENTER: THREE.JS ISOMETRIC CANVAS */}
        <div className="baked-viewport-card">
          {/* Top Window Chrome Bar */}
          <div className="baked-window-bar">
            <div className="window-dots">
              <span className="dot dot-red" />
              <span className="dot dot-amber" />
              <span className="dot dot-green" />
            </div>

            <div className="window-address">
              <Compass size={12} className="compass-icon" />
              <span>threejs://isometric-developer-studio/baked-occlusion-matrix</span>
            </div>

            <div className="window-status-pill">
              <span className="beacon-green" />
              <span>ISOMETRIC ORBIT ACTIVE</span>
            </div>
          </div>

          {/* THREE.JS CANVAS MOUNT POINT */}
          <div className="baked-canvas-mount" ref={mountRef} />

          {/* FLOATING HUD CONTROLS (Top-Right) */}
          <div className="baked-overlay-hud">
            {/* LIGHTING PRESET BUTTONS */}
            <div className="lighting-preset-pills">
              <button
                type="button"
                className={`hud-pill-btn ${lightMode === "cozy" ? "is-active" : ""}`}
                onClick={() => handleSetLightMode("cozy")}
                title="Warm Incandescent Lighting"
              >
                <Sun size={12} />
                <span>WARM COZY</span>
              </button>

              <button
                type="button"
                className={`hud-pill-btn ${lightMode === "day" ? "is-active" : ""}`}
                onClick={() => handleSetLightMode("day")}
                title="Studio Daylight"
              >
                <Sun size={12} />
                <span>DAYLIGHT</span>
              </button>

              <button
                type="button"
                className={`hud-pill-btn ${lightMode === "cyberpunk" ? "is-active" : ""}`}
                onClick={() => handleSetLightMode("cyberpunk")}
                title="Cyberpunk Neon Mode"
              >
                <Moon size={12} />
                <span>NEON NIGHT</span>
              </button>
            </div>

            <button
              type="button"
              className="hud-action-btn"
              onClick={handleResetCamera}
              title="Reset Isometric Angle"
            >
              <RotateCcw size={11} />
              <span>RESET ISOMETRIC</span>
            </button>
          </div>

          {/* INSTRUCTION FOOTER */}
          <div className="baked-footer-strip">
            <span>DRAG TO ORBIT WITHIN BOUNDS</span>
            <span className="strip-sep">/</span>
            <span>SCROLL TO ZOOM</span>
            <span className="strip-sep">/</span>
            <span>BAKED AMBIENT OCCLUSION (ZERO GPU OVERHEAD)</span>
          </div>
        </div>

        {/* RIGHT SIDE: ARCHITECTURAL DOSSIER & TELEMETRY */}
        <div className="baked-sidebar-panel">
          {/* HARDWARE & SYSTEM SPECS */}
          <div className="baked-dossier-card">
            <div className="dossier-card-head">
              <div className="dossier-tags-row">
                <span className="dossier-badge">BAKED ROOM SPEC</span>
                <span className="dossier-iso-badge">RESTRICTED BOUNDS</span>
              </div>
              <h3 className="dossier-main-title">HARDWARE &amp; SYSTEM RIG</h3>
              <p className="dossier-lead-text">
                Physical workstation setup where CineAI (Gemini 2.5 Flash) and JobSphere (sub-50ms
                distributed WebSocket) were authored and deployed.
              </p>
            </div>

            {/* INTERACTIVE WORKBENCH RIG ITEMS */}
            <div className="studio-rig-grid">
              <div className="rig-item-card">
                <div className="rig-card-icon">
                  <Monitor size={16} />
                </div>
                <div className="rig-card-body">
                  <span className="rig-label">ULTRAWIDE DISPLAY</span>
                  <span className="rig-val">34" CURVED HDR · CINEAI DEDICATED</span>
                </div>
              </div>

              <div className="rig-item-card">
                <div className="rig-card-icon">
                  <Cpu size={16} />
                </div>
                <div className="rig-card-body">
                  <span className="rig-label">DEVELOPMENT MACHINE</span>
                  <span className="rig-val">AMD RYZEN 7 · 32GB RAM · LINUX/WSL2</span>
                </div>
              </div>

              <div className="rig-item-card">
                <div className="rig-card-icon">
                  <Terminal size={16} />
                </div>
                <div className="rig-card-body">
                  <span className="rig-label">SECONDARY VERTICAL</span>
                  <span className="rig-val">JOBSPHERE LIVE WEBSOCKET LOGS</span>
                </div>
              </div>

              <div className="rig-item-card">
                <div className="rig-card-icon">
                  <Award size={16} />
                </div>
                <div className="rig-card-body">
                  <span className="rig-label">NOTARY CERTIFICATIONS</span>
                  <span className="rig-val">BABBAR MERN + APNA COLLEGE DSA 200+</span>
                </div>
              </div>
            </div>

            {/* THREE.JS TECHNIQUE HIGHLIGHT */}
            <div className="technique-box">
              <span className="technique-box-title">WHY BAKED TEXTURE MAPPING?</span>
              <p className="technique-desc">
                Real-time dynamic shadow maps require costly multi-pass depth rendering. By baking
                ambient occlusion directly into lightmaps, this 3D isometric room delivers photoreal
                soft shadow gradients and contact edges at a steady 90 FPS on all devices.
              </p>
            </div>

            {/* VERIFICATION SEAL */}
            <div className="baked-seal-footer">
              <span className="seal-text">ENGINEERING STUDIO // GREATER NOIDA, IN</span>
              <span className="seal-sub">GALGOTIAS UNIVERSITY · CSE '27</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BakedRoom3D;
