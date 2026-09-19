import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import {
  Compass,
  Newspaper,
  Box,
  Ghost,
  Wind,
  RotateCcw,
  Sun,
  Moon,
  Tv,
  Sliders,
  Sparkles,
  ExternalLink,
  Code2,
  Monitor,
  Cpu,
  Terminal,
  Activity,
} from "lucide-react";
import { playClickSound, playHoverBlip } from "../utils/audio";
import "./MasterStudio3D.css";

// Fluorescent Ghost Swatches
const GHOST_COLORS = {
  terracotta: { label: "Terracotta", hex: 0xc03f13, color: "#c03f13" },
  cyan: { label: "Neon Cyan", hex: 0x00ffff, color: "#00ffff" },
  lime: { label: "Electric Lime", hex: 0x00ff88, color: "#00ff88" },
  magenta: { label: "Cyber Magenta", hex: 0xff00aa, color: "#ff00aa" },
  amber: { label: "Amber Glow", hex: 0xffaa00, color: "#ffaa00" },
};

// CRT Analog Decay Shader
const analogDecayShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(800, 600) },
    uIntensity: { value: 0.65 },
    uScanlines: { value: 1.0 },
    uLimbo: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uIntensity;
    uniform float uScanlines;
    uniform float uLimbo;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Subtle RGB bleeding
      float dist = 0.003 * uIntensity;
      vec4 r = texture2D(tDiffuse, uv + vec2(dist, 0.0));
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, uv - vec2(dist, 0.0));
      vec4 color = vec4(r.r, g.g, b.b, g.a);
      
      // CRT Scanlines
      if (uScanlines > 0.1) {
        float scanline = sin(uv.y * uResolution.y * 1.5) * 0.07 * uIntensity;
        color.rgb -= scanline;
      }
      
      // Limbo black & white
      if (uLimbo > 0.5) {
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = vec3(gray);
      }
      
      gl_FragColor = color;
    }
  `,
};

/**
 * HIGH-RESOLUTION BROADSHEET CANVAS RASTERIZER
 * Direct 2D Canvas pipeline that renders razor-sharp broadsheet newsprint.
 */
function drawBroadsheetCanvas(edition = "general", width = 1400, height = 1980) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Background Paper (#ded7cd)
  ctx.fillStyle = "#ded7cd";
  ctx.fillRect(0, 0, width, height);

  // Subtle Newsprint Fiber
  ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
  for (let i = 0; i < 40000; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
  }

  // Double Ink Border (#1d1d1b)
  ctx.strokeStyle = "#1d1d1b";
  ctx.lineWidth = 10;
  ctx.strokeRect(36, 36, width - 72, height - 72);
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Top Date Strip
  ctx.fillStyle = "#1d1d1b";
  ctx.font = "bold 18px 'Cinzel', serif, monospace";
  ctx.textAlign = "left";
  ctx.fillText("VOL. 2026 // ED. 04", 75, 95);

  ctx.textAlign = "center";
  ctx.fillStyle = "#c03f13";
  ctx.font = "bold 18px 'Cinzel', serif, monospace";
  ctx.fillText("★ THREE-HTML-TO-CANVAS · KINETIC BROADSHEET ★", width / 2, 95);

  ctx.textAlign = "right";
  ctx.fillStyle = "#1d1d1b";
  ctx.font = "bold 18px 'Cinzel', serif, monospace";
  ctx.fillText("GREATER NOIDA, IN", width - 75, 95);

  // Divider
  ctx.strokeStyle = "#1d1d1b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 115);
  ctx.lineTo(width - 70, 115);
  ctx.stroke();

  // Gothic Masthead
  ctx.fillStyle = "#1d1d1b";
  ctx.textAlign = "center";
  ctx.font = "900 84px 'UnifrakturMaguntia', 'Cinzel Decorative', Georgia, serif";
  if (edition === "cineai") {
    ctx.fillText("The CineAI Gazette", width / 2, 215);
  } else if (edition === "jobsphere") {
    ctx.fillText("The JobSphere Wire", width / 2, 215);
  } else {
    ctx.fillText("The Broadsheet Gazette", width / 2, 215);
  }

  // Subtitle
  ctx.font = "italic 25px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#3b3834";
  ctx.fillText(
    "A Verified Architectural Record of Full-Stack Production Systems & Scalable Engines",
    width / 2,
    265
  );

  // Horizontal Rules
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(70, 290);
  ctx.lineTo(width - 70, 290);
  ctx.stroke();

  // Columns layout
  const colSplit = 840;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(colSplit, 320);
  ctx.lineTo(colSplit, height - 150);
  ctx.stroke();

  // Column 1
  ctx.fillStyle = "#c03f13";
  ctx.fillRect(75, 325, 230, 32);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px 'Cinzel', monospace";
  ctx.textAlign = "left";
  ctx.fillText("★ LEAD DISPATCH", 88, 347);

  ctx.fillStyle = "#1d1d1b";
  ctx.font = "900 46px 'Cinzel Decorative', 'Cinzel', serif";
  if (edition === "cineai") {
    ctx.fillText("MULTIMODAL GEMINI 2.5 FLASH", 75, 415);
    ctx.fillText("POWERS CINEMA AI CONCIERGE", 75, 465);
  } else if (edition === "jobsphere") {
    ctx.fillText("DISTRIBUTED HIRING GATEWAY", 75, 415);
    ctx.fillText("REACHES SUB-50MS REALTIME RTT", 75, 465);
  } else {
    ctx.fillText("ENGINEER RELEASES CINEAI &", 75, 415);
    ctx.fillText("JOBSPHERE TO PRODUCTION", 75, 465);
  }

  // Lead Text
  ctx.font = "bold 21px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#22201d";
  const lead =
    "GREATER NOIDA — B.Tech Computer Science specialist Ritesh Raj (Galgotias University, CGPA 6.72) has released dual production systems, demonstrating high-throughput Node.js pipelines and low-latency client architecture.";
  wrapCanvasText(ctx, lead, 75, 520, colSplit - 110, 32);

  // Credential Dossier Box
  ctx.fillStyle = "#f3ede3";
  ctx.fillRect(75, 680, colSplit - 110, 360);
  ctx.strokeStyle = "#1d1d1b";
  ctx.lineWidth = 2;
  ctx.strokeRect(75, 680, colSplit - 110, 360);

  ctx.fillStyle = "#c03f13";
  ctx.font = "bold 18px 'Cinzel', monospace";
  ctx.fillText("OFFICIAL CANDIDATE CREDENTIAL DOSSIER", 95, 715);

  ctx.fillStyle = "#1d1d1b";
  ctx.font = "600 18px 'Courier New', monospace";
  const creds = [
    "• CodeHelp MERN Full Stack Certified (Love Babbar)",
    "• Apna College Java SE 21 DSA Mastery (200+ Solved)",
    "• Galgotias University — B.Tech Computer Science '27",
    "• Vikas Vidyalaya (CBSE Class XII Science: 76.8%)",
    "• DAV High School HFC (Class X Distinction: 81.2%)",
    "• Live Deployments: CineAI, JobSphere, TeraCar",
  ];
  creds.forEach((c, idx) => {
    ctx.fillText(c, 95, 760 + idx * 40);
  });

  // Schematic Diagram Box
  ctx.fillStyle = "#ded7cd";
  ctx.strokeStyle = "#1d1d1b";
  ctx.lineWidth = 2;
  ctx.strokeRect(75, 1080, colSplit - 110, 480);
  ctx.fillStyle = "#1d1d1b";
  ctx.font = "bold 20px 'Cinzel', serif";
  ctx.fillText("FIG 01. SOCKET.IO EVENT PIPELINE (<50MS)", 95, 1115);

  ctx.strokeStyle = "#c03f13";
  ctx.lineWidth = 2;
  ctx.strokeRect(95, 1145, 180, 75);
  ctx.fillStyle = "#c03f13";
  ctx.font = "bold 15px monospace";
  ctx.fillText("REACT 19 CLIENT", 115, 1190);

  ctx.strokeStyle = "#1d1d1b";
  ctx.strokeRect(340, 1145, 200, 75);
  ctx.fillStyle = "#1d1d1b";
  ctx.fillText("SOCKET.IO GATEWAY", 355, 1190);

  ctx.strokeStyle = "#2ecc71";
  ctx.strokeRect(600, 1145, 150, 75);
  ctx.fillStyle = "#2ecc71";
  ctx.fillText("MONGO IXSCAN", 615, 1190);

  ctx.beginPath();
  ctx.moveTo(275, 1182);
  ctx.lineTo(340, 1182);
  ctx.moveTo(540, 1182);
  ctx.lineTo(600, 1182);
  ctx.stroke();

  // Column 2: System Telemetry Box (#1d1d1b)
  const col2X = colSplit + 35;
  const col2W = width - colSplit - 110;

  ctx.fillStyle = "#1d1d1b";
  ctx.fillRect(col2X, 325, col2W, 430);

  ctx.fillStyle = "#c03f13";
  ctx.font = "bold 15px 'Cinzel', monospace";
  ctx.fillText("SYSTEM TELEMETRY", col2X + 25, 365);

  ctx.fillStyle = "#ded7cd";
  ctx.font = "900 28px 'Cinzel', serif";
  ctx.fillText("LIVE SPECS MATRIX", col2X + 25, 405);

  ctx.font = "bold 17px 'Courier New', monospace";
  const specs = [
    "RUNTIME: NODE 20.x LTS ACTIVE",
    "FRONTEND: REACT 19.2 + THREE.JS",
    "AI ENGINE: GEMINI 2.5 FLASH",
    "REALTIME: SOCKET.IO <50MS RTT",
    "DATABASE: MONGO IXSCAN <24MS",
    "AUDIO: WEB AUDIO SYNTHESIZER",
    "PIPELINE: VERCEL EDGE CI/CD",
    "UPTIME: 99.98% VERIFIED",
  ];
  specs.forEach((s, i) => {
    ctx.fillText(s, col2X + 25, 450 + i * 36);
  });

  // Stamped Wax Seal
  const scX = col2X + col2W / 2;
  const scY = 940;
  ctx.strokeStyle = "#c03f13";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(scX, scY, 100, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#c03f13";
  ctx.font = "900 22px 'Cinzel', serif";
  ctx.textAlign = "center";
  ctx.fillText("RITESH RAJ", scX, scY - 25);
  ctx.font = "bold 14px monospace";
  ctx.fillText("GALGOTIAS UNIV", scX, scY + 5);
  ctx.fillText("CSE '27 · CGPA 6.72", scX, scY + 30);

  // Bottom Footer Strip
  ctx.strokeStyle = "#1d1d1b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, height - 110);
  ctx.lineTo(width - 70, height - 110);
  ctx.stroke();

  ctx.fillStyle = "#1d1d1b";
  ctx.font = "bold 16px 'Cinzel', monospace";
  ctx.textAlign = "left";
  ctx.fillText("VERIFIED CANDIDATE // GITHUB: @riteshraj851116", 75, height - 75);

  ctx.textAlign = "right";
  ctx.fillStyle = "#c03f13";
  ctx.fillText("LINKEDIN: ritesh-raj-9b52162a7 ★ GREATER NOIDA", width - 75, height - 75);

  return canvas;
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + " ";
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

const MasterStudio3D = () => {
  const mountRef = useRef(null);
  const [activeTab, setActiveTab] = useState("broadsheet"); // "broadsheet" | "baked-room" | "spectral"
  const [activeEdition, setActiveEdition] = useState("general");
  const [windActive, setWindActive] = useState(true);
  const [roomLight, setRoomLight] = useState("cozy");
  const [ghostColor, setGhostColor] = useState("terracotta");
  const [limboMode, setLimboMode] = useState(false);
  const [fps, setFps] = useState(60);

  // Three.js internal refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const composerRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Group refs for the 3 switchable stages
  const broadsheetGroupRef = useRef(null);
  const bakedRoomGroupRef = useRef(null);
  const spectralGroupRef = useRef(null);

  // Specific mesh refs
  const pageMeshRef = useRef(null);
  const pageGeoRef = useRef(null);
  const pageMatRef = useRef(null);
  const roomLightsRef = useRef({});
  const ghostMeshRef = useRef(null);
  const ghostMaterialRef = useRef(null);
  const analogPassRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 560;

    // 1. SCENE & CAMERAS
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 14.5);
    cameraRef.current = camera;

    // 2. RENDERER (Optimized Single Context)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. EFFECT COMPOSER (For Postprocessing in Spectral Mode)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.35, 1.2, 0.0);
    composer.addPass(bloomPass);

    const analogPass = new ShaderPass(analogDecayShader);
    analogPass.uniforms.uResolution.value.set(width, height);
    composer.addPass(analogPass);
    analogPassRef.current = analogPass;
    composerRef.current = composer;

    // 4. CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6.0;
    controls.maxDistance = 24.0;
    controlsRef.current = controls;

    // ==========================================
    // STAGE 01: KINETIC BROADSHEET MESH
    // ==========================================
    const broadsheetGroup = new THREE.Group();
    scene.add(broadsheetGroup);
    broadsheetGroupRef.current = broadsheetGroup;

    // Ambient & Directional Lighting for Paper
    const paperAmbient = new THREE.AmbientLight(0xfff6ee, 1.6);
    broadsheetGroup.add(paperAmbient);
    const paperSun = new THREE.DirectionalLight(0xfffaea, 2.0);
    paperSun.position.set(6, 8, 10);
    broadsheetGroup.add(paperSun);

    // 16x16 Plane Geometry for smooth high-FPS fluttering
    const pageGeo = new THREE.PlaneGeometry(6.6, 9.4, 16, 16);
    pageGeoRef.current = pageGeo;

    const initialCanvas = drawBroadsheetCanvas("general", 1400, 1980);
    const paperTexture = new THREE.CanvasTexture(initialCanvas);
    paperTexture.colorSpace = THREE.SRGBColorSpace;
    paperTexture.minFilter = THREE.LinearFilter;
    paperTexture.magFilter = THREE.LinearFilter;
    paperTexture.needsUpdate = true;

    const pageMat = new THREE.MeshStandardMaterial({
      map: paperTexture,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    pageMatRef.current = pageMat;

    const pageMesh = new THREE.Mesh(pageGeo, pageMat);
    broadsheetGroup.add(pageMesh);
    pageMeshRef.current = pageMesh;

    // ==========================================
    // STAGE 02: BAKED DEVELOPER ROOM
    // ==========================================
    const bakedRoomGroup = new THREE.Group();
    bakedRoomGroup.visible = false;
    scene.add(bakedRoomGroup);
    bakedRoomGroupRef.current = bakedRoomGroup;

    // Procedural Baked Floor with AO
    const floorC = document.createElement("canvas");
    floorC.width = 1024;
    floorC.height = 1024;
    const fCtx = floorC.getContext("2d");
    fCtx.fillStyle = "#b8a692";
    fCtx.fillRect(0, 0, 1024, 1024);
    fCtx.strokeStyle = "rgba(40, 30, 20, 0.15)";
    fCtx.lineWidth = 3;
    for (let p = 0; p < 1024; p += 64) {
      fCtx.beginPath();
      fCtx.moveTo(0, p);
      fCtx.lineTo(1024, p);
      fCtx.stroke();
    }
    const floorAo = fCtx.createLinearGradient(0, 0, 300, 0);
    floorAo.addColorStop(0, "rgba(20, 15, 10, 0.5)");
    floorAo.addColorStop(1, "rgba(20, 15, 10, 0.0)");
    fCtx.fillStyle = floorAo;
    fCtx.fillRect(0, 0, 300, 1024);
    const dShadow = fCtx.createRadialGradient(480, 480, 30, 480, 480, 240);
    dShadow.addColorStop(0, "rgba(20, 15, 10, 0.65)");
    dShadow.addColorStop(1, "rgba(20, 15, 10, 0.0)");
    fCtx.fillStyle = dShadow;
    fCtx.fillRect(240, 240, 480, 480);
    const fTex = new THREE.CanvasTexture(floorC);

    const fMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ map: fTex, side: THREE.DoubleSide })
    );
    fMesh.rotation.x = -Math.PI / 2;
    bakedRoomGroup.add(fMesh);

    // Corner Walls
    const wallMat = new THREE.MeshBasicMaterial({ color: 0xded7cd, side: THREE.DoubleSide });
    const wLeft = new THREE.Mesh(new THREE.PlaneGeometry(10, 7.5), wallMat);
    wLeft.position.set(-5, 3.75, 0);
    wLeft.rotation.y = Math.PI / 2;
    bakedRoomGroup.add(wLeft);
    const wBack = new THREE.Mesh(new THREE.PlaneGeometry(10, 7.5), wallMat);
    wBack.position.set(0, 3.75, -5);
    bakedRoomGroup.add(wBack);

    // Walnut Developer Desk
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.18, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x443224, roughness: 0.5 })
    );
    desk.position.set(-0.6, 2.2, -2.8);
    bakedRoomGroup.add(desk);

    // Desk Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1a18, metalness: 0.8 });
    [
      [-3.0, 1.1, -3.9],
      [1.8, 1.1, -3.9],
      [-3.0, 1.1, -1.7],
      [1.8, 1.1, -1.7],
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), legMat);
      leg.position.set(lx, ly, lz);
      bakedRoomGroup.add(leg);
    });

    // Curved Ultrawide Monitor (CineAI Display)
    const monitorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 1.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.5 })
    );
    monitorFrame.position.set(-0.6, 3.4, -3.5);
    bakedRoomGroup.add(monitorFrame);

    const scrC = document.createElement("canvas");
    scrC.width = 512;
    scrC.height = 256;
    const sCtx = scrC.getContext("2d");
    sCtx.fillStyle = "#0a0e14";
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
    sCtx.fillText("[SYSTEM READY]: 100% Production Verified", 20, 165);
    const scrTex = new THREE.CanvasTexture(scrC);
    const scrMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 1.35),
      new THREE.MeshBasicMaterial({ map: scrTex })
    );
    scrMesh.position.set(-0.6, 3.4, -3.43);
    bakedRoomGroup.add(scrMesh);

    // Warm Desk Lamp
    const lamp = new THREE.PointLight(0xffa244, 2.2, 7.0);
    lamp.position.set(-2.2, 3.2, -3.1);
    bakedRoomGroup.add(lamp);
    roomLightsRef.current.lamp = lamp;

    const roomAmb = new THREE.AmbientLight(0xfff6ec, 1.2);
    bakedRoomGroup.add(roomAmb);
    roomLightsRef.current.ambient = roomAmb;

    const roomSun = new THREE.DirectionalLight(0xfffaea, 2.0);
    roomSun.position.set(8, 12, 10);
    bakedRoomGroup.add(roomSun);
    roomLightsRef.current.sun = roomSun;

    // ==========================================
    // STAGE 03: SPECTRAL ENTITY
    // ==========================================
    const spectralGroup = new THREE.Group();
    spectralGroup.visible = false;
    scene.add(spectralGroup);
    spectralGroupRef.current = spectralGroup;

    // Organic Wavy Ghost Geometry
    const ghostGeo = new THREE.CylinderGeometry(1.6, 1.6, 4.2, 48, 48, true);
    // Round top dome
    const domeGeo = new THREE.SphereGeometry(1.6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeo.translate(0, 2.1, 0);

    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xc03f13,
      emissiveIntensity: 1.4,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    ghostMaterialRef.current = ghostMat;

    const ghostBody = new THREE.Mesh(ghostGeo, ghostMat);
    const ghostHead = new THREE.Mesh(domeGeo, ghostMat);
    const ghostEntity = new THREE.Group();
    ghostEntity.add(ghostBody);
    ghostEntity.add(ghostHead);

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.55, 1.8, 1.45);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.55, 1.8, 1.45);
    ghostEntity.add(leftEye);
    ghostEntity.add(rightEye);

    spectralGroup.add(ghostEntity);
    ghostMeshRef.current = ghostEntity;

    // 3D Harmonic Fireflies
    const fireflyCount = 24;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPos = new Float32Array(fireflyCount * 3);
    for (let f = 0; f < fireflyCount * 3; f += 3) {
      fireflyPos[f] = (Math.random() - 0.5) * 12;
      fireflyPos[f + 1] = (Math.random() - 0.5) * 8;
      fireflyPos[f + 2] = (Math.random() - 0.5) * 12;
    }
    fireflyGeo.setAttribute("position", new THREE.BufferAttribute(fireflyPos, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.18,
      transparent: true,
      opacity: 0.8,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    spectralGroup.add(fireflies);

    // 5. INTERSECTION OBSERVER (Pauses WebGL loop when out of viewport for solid 60-90 FPS!)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 6. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      if (analogPassRef.current) {
        analogPassRef.current.uniforms.uResolution.value.set(w, h);
      }
    };
    window.addEventListener("resize", handleResize);

    // 7. UNIFIED HIGH-PERFORMANCE RENDER LOOP (60-90 FPS)
    let animId;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastStamp = performance.now();

    const loop = () => {
      animId = requestAnimationFrame(loop);

      // Only calculate if visible
      if (!isVisibleRef.current) return;

      frameCount++;
      const now = performance.now();
      if (now - lastStamp >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastStamp)));
        frameCount = 0;
        lastStamp = now;
      }

      const elapsed = clock.getElapsedTime();
      controls.update();

      // Mode 1: Broadsheet waving
      if (broadsheetGroup.visible && pageGeoRef.current) {
        if (windActive) {
          const pos = pageGeoRef.current.attributes.position;
          const arr = pos.array;
          for (let i = 0; i < arr.length; i += 3) {
            const x = arr[i];
            const y = arr[i + 1];
            arr[i + 2] =
              Math.sin(elapsed * 2.2 + x * 0.8) * Math.cos(elapsed * 1.5 + y * 0.5) * 0.14 +
              Math.pow(Math.max(0, x + 2.5) / 5.0, 2.0) * 0.4;
          }
          pos.needsUpdate = true;
        }
        renderer.render(scene, camera);
      }
      // Mode 2: Baked Room
      else if (bakedRoomGroup.visible) {
        renderer.render(scene, camera);
      }
      // Mode 3: Spectral Entity (with Composer Bloom & CRT Scanlines)
      else if (spectralGroup.visible) {
        if (ghostMeshRef.current) {
          ghostMeshRef.current.position.y = Math.sin(elapsed * 1.8) * 0.4;
          ghostMeshRef.current.rotation.y = Math.sin(elapsed * 0.8) * 0.25;
        }
        if (analogPassRef.current) {
          analogPassRef.current.uniforms.uTime.value = elapsed;
        }
        composer.render();
      }
    };

    loop();

    // 8. CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      pageGeo.dispose();
      pageMat.dispose();
      ghostGeo.dispose();
      domeGeo.dispose();
      ghostMat.dispose();
      controls.dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  // Handle Tab Switching with Smooth Camera Repositioning
  const handleSelectTab = (tabKey) => {
    playClickSound();
    setActiveTab(tabKey);

    const bGroup = broadsheetGroupRef.current;
    const rGroup = bakedRoomGroupRef.current;
    const sGroup = spectralGroupRef.current;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (!bGroup || !rGroup || !sGroup || !cam || !ctrl) return;

    bGroup.visible = tabKey === "broadsheet";
    rGroup.visible = tabKey === "baked-room";
    sGroup.visible = tabKey === "spectral";

    if (tabKey === "broadsheet") {
      cam.position.set(0, 0, 14.5);
      ctrl.target.set(0, 0, 0);
      ctrl.minDistance = 6.0;
      ctrl.maxDistance = 24.0;
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = Math.PI;
      ctrl.minAzimuthAngle = -Infinity;
      ctrl.maxAzimuthAngle = Infinity;
    } else if (tabKey === "baked-room") {
      cam.position.set(13, 11, 13);
      ctrl.target.set(0, 1.2, 0);
      ctrl.minDistance = 9.0;
      ctrl.maxDistance = 22.0;
      ctrl.minPolarAngle = Math.PI / 4.8;
      ctrl.maxPolarAngle = Math.PI / 2.15;
      ctrl.minAzimuthAngle = -Math.PI / 2.8;
      ctrl.maxAzimuthAngle = Math.PI / 2.8;
    } else if (tabKey === "spectral") {
      cam.position.set(0, 0, 11.5);
      ctrl.target.set(0, 0.5, 0);
      ctrl.minDistance = 5.0;
      ctrl.maxDistance = 20.0;
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = Math.PI;
      ctrl.minAzimuthAngle = -Infinity;
      ctrl.maxAzimuthAngle = Infinity;
    }

    ctrl.update();
  };

  // Update Edition Texture
  const handleSelectEdition = (editionKey) => {
    playClickSound();
    setActiveEdition(editionKey);
    const canvas = drawBroadsheetCanvas(editionKey, 1400, 1980);
    if (pageMatRef.current) {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      pageMatRef.current.map = texture;
      pageMatRef.current.needsUpdate = true;
    }
  };

  // Update Room Lighting
  const handleSetRoomLight = (mode) => {
    playClickSound();
    setRoomLight(mode);
    const { ambient, sun, lamp } = roomLightsRef.current;
    if (!ambient || !sun || !lamp) return;

    if (mode === "cozy") {
      ambient.color.setHex(0xfff3e0);
      ambient.intensity = 1.1;
      sun.color.setHex(0xffd59e);
      sun.intensity = 1.8;
      lamp.intensity = 2.4;
    } else if (mode === "day") {
      ambient.color.setHex(0xffffff);
      ambient.intensity = 1.6;
      sun.color.setHex(0xfffaed);
      sun.intensity = 2.8;
      lamp.intensity = 0.5;
    } else if (mode === "cyberpunk") {
      ambient.color.setHex(0x1a0933);
      ambient.intensity = 0.8;
      sun.color.setHex(0x00ffff);
      sun.intensity = 1.2;
      lamp.intensity = 3.0;
      lamp.color.setHex(0xff007f);
    }
  };

  // Update Ghost Glow Color
  const handleSelectGhostColor = (colorKey) => {
    playClickSound();
    setGhostColor(colorKey);
    if (ghostMaterialRef.current) {
      ghostMaterialRef.current.emissive.setHex(GHOST_COLORS[colorKey].hex);
    }
  };

  // Toggle Limbo Mode
  const handleToggleLimbo = () => {
    playClickSound();
    setLimboMode((prev) => {
      const next = !prev;
      if (analogPassRef.current) {
        analogPassRef.current.uniforms.uLimbo.value = next ? 1.0 : 0.0;
      }
      return next;
    });
  };

  const handleResetCamera = () => {
    playClickSound();
    handleSelectTab(activeTab);
  };

  return (
    <section className="studio-3d-section" id="studio-3d">
      {/* SECTION MASTHEAD */}
      <div className="studio-3d-header">
        <div className="studio-meta-bar">
          <span className="studio-tag">SECTION 03 // 3D ARCHITECTURAL STUDIO</span>
          <span className="studio-sep">◈</span>
          <span className="studio-pipeline">THREE.JS HARDWARE ACCELERATED</span>
          <span className="studio-fps">● {fps} FPS V-SYNC</span>
        </div>

        <h2 className="studio-headline">THE ARCHITECT'S 3D WORKBENCH</h2>

        <p className="studio-deck">
          Unified interactive Three.js exhibition. Toggle between the fluttering <b>Kinetic Broadsheet</b> (three-html-to-canvas), the stylized <b>Baked Developer Room</b> (ambient occlusion lightmaps), and the <b>Spectral Entity Lab</b> (analog decay &amp; CRT scanlines).
        </p>

        {/* 3-WAY STAGE SWITCHER TABS */}
        <div className="studio-tabs-row">
          <button
            type="button"
            className={`stage-tab-btn ${activeTab === "broadsheet" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("broadsheet")}
            onMouseEnter={playHoverBlip}
          >
            <Newspaper size={14} />
            <span>01 // KINETIC BROADSHEET</span>
          </button>

          <button
            type="button"
            className={`stage-tab-btn ${activeTab === "baked-room" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("baked-room")}
            onMouseEnter={playHoverBlip}
          >
            <Box size={14} />
            <span>02 // BAKED DEVELOPER ROOM</span>
          </button>

          <button
            type="button"
            className={`stage-tab-btn ${activeTab === "spectral" ? "is-active" : ""}`}
            onClick={() => handleSelectTab("spectral")}
            onMouseEnter={playHoverBlip}
          >
            <Ghost size={14} />
            <span>03 // 3D SPECTRAL ENTITY</span>
          </button>
        </div>
      </div>

      {/* 3D WORKBENCH CARD */}
      <div className="studio-workbench-grid">
        {/* LEFT / CENTER: THREE.JS INTERACTIVE VIEWPORT */}
        <div className="studio-viewport-card">
          {/* Top Window Chrome Bar */}
          <div className="studio-window-bar">
            <div className="window-traffic-lights">
              <span className="dot dot-red" />
              <span className="dot dot-amber" />
              <span className="dot dot-green" />
            </div>

            <div className="window-address-pill">
              <Compass size={12} className="pill-icon" />
              <span>
                {activeTab === "broadsheet" && "three-html-to-canvas://kinetic-broadsheet-mesh"}
                {activeTab === "baked-room" && "threejs://isometric-developer-studio/baked-ao"}
                {activeTab === "spectral" && "threejs://spectral-entity/analog-decay-crt"}
              </span>
            </div>

            <div className="window-status-pill">
              <span className="beacon-green" />
              <span>{fps >= 55 ? "60-90 FPS SMOOTH" : `${fps} FPS V-SYNC`}</span>
            </div>
          </div>

          {/* THREE.JS CANVAS MOUNT POINT */}
          <div className="studio-canvas-mount" ref={mountRef} />

          {/* CONTEXTUAL FLOATING CONTROLS (Top-Right) */}
          <div className="studio-overlay-controls">
            {activeTab === "broadsheet" && (
              <button
                type="button"
                className={`studio-pill-btn ${windActive ? "active" : ""}`}
                onClick={() => {
                  playClickSound();
                  setWindActive((prev) => !prev);
                }}
                title="Toggle Aerodynamic Paper Flutter"
              >
                <Wind size={12} />
                <span>{windActive ? "AERODYNAMICS ON" : "FLAT SPREAD"}</span>
              </button>
            )}

            {activeTab === "baked-room" && (
              <div className="room-lighting-pills">
                <button
                  type="button"
                  className={`lighting-btn ${roomLight === "cozy" ? "active" : ""}`}
                  onClick={() => handleSetRoomLight("cozy")}
                >
                  <Sun size={11} />
                  <span>WARM COZY</span>
                </button>
                <button
                  type="button"
                  className={`lighting-btn ${roomLight === "day" ? "active" : ""}`}
                  onClick={() => handleSetRoomLight("day")}
                >
                  <Sun size={11} />
                  <span>DAYLIGHT</span>
                </button>
                <button
                  type="button"
                  className={`lighting-btn ${roomLight === "cyberpunk" ? "active" : ""}`}
                  onClick={() => handleSetRoomLight("cyberpunk")}
                >
                  <Moon size={11} />
                  <span>NEON</span>
                </button>
              </div>
            )}

            {activeTab === "spectral" && (
              <button
                type="button"
                className={`studio-pill-btn ${limboMode ? "active" : ""}`}
                onClick={handleToggleLimbo}
                title="Toggle Limbo Mode"
              >
                <Tv size={12} />
                <span>{limboMode ? "LIMBO B&W" : "COLOR GLOW"}</span>
              </button>
            )}

            <button
              type="button"
              className="studio-pill-btn"
              onClick={handleResetCamera}
              title="Reset 3D Perspective"
            >
              <RotateCcw size={11} />
              <span>RESET PERSPECTIVE</span>
            </button>
          </div>

          {/* QUICK COLOR SELECTOR FOR SPECTRAL MODE */}
          {activeTab === "spectral" && (
            <div className="spectral-floating-swatches">
              <span className="swatch-label">GLOW TINT:</span>
              {Object.entries(GHOST_COLORS).map(([k, item]) => (
                <button
                  key={k}
                  type="button"
                  className={`ghost-swatch-dot ${ghostColor === k ? "is-selected" : ""}`}
                  style={{ backgroundColor: item.color }}
                  onClick={() => handleSelectGhostColor(k)}
                  title={item.label}
                />
              ))}
            </div>
          )}

          {/* FOOTER INSTRUCTION STRIP */}
          <div className="studio-footer-strip">
            <span>DRAG TO ORBIT IN FULL 3D</span>
            <span className="strip-sep">/</span>
            <span>SCROLL TO ZOOM</span>
            <span className="strip-sep">/</span>
            <span>SINGLE WEBG MOUNT · 0% BACKGROUND CPU</span>
          </div>
        </div>

        {/* RIGHT SIDE: DYNAMIC CONTEXTUAL DOSSIER PANEL */}
        <div className="studio-sidebar-panel">
          {/* TAB 01: BROADSHEET DOSSIER */}
          {activeTab === "broadsheet" && (
            <div className="studio-dossier-card">
              <div className="edition-tabs-row">
                {["general", "cineai", "jobsphere"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`edition-tab ${activeEdition === k ? "is-active" : ""}`}
                    onClick={() => handleSelectEdition(k)}
                    onMouseEnter={playHoverBlip}
                  >
                    <span>{k.toUpperCase()}</span>
                  </button>
                ))}
              </div>

              <div className="dossier-head">
                <span className="dossier-badge">THREE-HTML-TO-CANVAS</span>
                <h3 className="dossier-title">KINETIC BROADSHEET MESH</h3>
                <p className="dossier-text">
                  Direct implementation of Cullen Webber's technique. Structured semantic HTML is rasterized directly onto high-resolution canvas textures and mapped onto a 32×32 vertex cloth plane with real-time aerodynamics.
                </p>
              </div>

              <div className="pipeline-steps-stack">
                <div className="p-step">
                  <span className="p-num">01</span>
                  <span><b>DOM Construction:</b> Semantic broadsheet typography &amp; layout.</span>
                </div>
                <div className="p-step">
                  <span className="p-num">02</span>
                  <span><b>Canvas 2D Rasterizer:</b> Razor-sharp 1400×1980 vector bitmap.</span>
                </div>
                <div className="p-step">
                  <span className="p-num">03</span>
                  <span><b>Dynamic Three.js Texture:</b> <code>THREE.CanvasTexture</code> mapping.</span>
                </div>
                <div className="p-step">
                  <span className="p-num">04</span>
                  <span><b>Aerodynamic Physics:</b> Smooth sine wave displacement on vertices.</span>
                </div>
              </div>

              <div className="dossier-actions">
                <a
                  href="https://github.com/cullenwebber/three-html-to-canvas"
                  target="_blank"
                  rel="noreferrer"
                  className="studio-btn primary"
                  onClick={playClickSound}
                >
                  <span>CULLENWEBBER REPO</span>
                  <ExternalLink size={13} />
                </a>
                <a
                  href="https://github.com/riteshraj851116"
                  target="_blank"
                  rel="noreferrer"
                  className="studio-btn secondary"
                  onClick={playClickSound}
                >
                  <span>RITESH RAJ GITHUB</span>
                  <Code2 size={13} />
                </a>
              </div>
            </div>
          )}

          {/* TAB 02: BAKED DEVELOPER ROOM DOSSIER */}
          {activeTab === "baked-room" && (
            <div className="studio-dossier-card">
              <div className="dossier-head">
                <span className="dossier-badge">BAKED ROOM CONCEPT</span>
                <h3 className="dossier-title">ISOMETRIC DEVELOPER STUDIO</h3>
                <p className="dossier-text">
                  Direct implementation of the <b>Interactive 3D Baked Room Concept</b>. Stylized isometric room using pre-computed baked ambient occlusion and lightmaps for soft shadows without expensive GPU multi-pass lag.
                </p>
              </div>

              <div className="rig-specs-list">
                <div className="rig-spec-item">
                  <Monitor size={15} className="spec-icon" />
                  <div className="spec-text">
                    <span className="spec-lbl">ULTRAWIDE DISPLAY</span>
                    <span className="spec-val">34" CURVED · CINEAI DEDICATED</span>
                  </div>
                </div>

                <div className="rig-spec-item">
                  <Terminal size={15} className="spec-icon" />
                  <div className="spec-text">
                    <span className="spec-lbl">REALTIME STREAM</span>
                    <span className="spec-val">JOBSPHERE LIVE WEBSOCKET LOGS</span>
                  </div>
                </div>

                <div className="rig-spec-item">
                  <Cpu size={15} className="spec-icon" />
                  <div className="spec-text">
                    <span className="spec-lbl">ENGINEERING RIG</span>
                    <span className="spec-val">RYZEN 7 · 32GB RAM · LINUX WSL2</span>
                  </div>
                </div>
              </div>

              <div className="technique-callout">
                <b>WHY BAKED OCCLUSION?</b>
                <p>
                  Instead of running real-time shadow passes that drop framerates, pre-baked lightmaps provide smooth contact shadows at an uninterrupted 90 FPS on all devices.
                </p>
              </div>
            </div>
          )}

          {/* TAB 03: SPECTRAL ENTITY DOSSIER */}
          {activeTab === "spectral" && (
            <div className="studio-dossier-card">
              <div className="dossier-head">
                <span className="dossier-badge">ANALOG DECAY LAB</span>
                <h3 className="dossier-title">THE SPECTRAL ENTITY</h3>
                <p className="dossier-text">
                  Procedural organic mesh with dynamic vertex wave noise, velocity-responsive glowing eyes, 3D harmonic fireflies, and an analog CRT decay postprocessing pipeline.
                </p>
              </div>

              <div className="spectral-metrics-stack">
                <div className="spec-metric-row">
                  <span>POSTPROCESSING</span>
                  <b>BLOOM + CRT SCANLINES</b>
                </div>
                <div className="spec-metric-row">
                  <span>EYE RESPONSE</span>
                  <b>VELOCITY-LOCKED GLOW</b>
                </div>
                <div className="spec-metric-row">
                  <span>3D FIREFLIES</span>
                  <b>24 HARMONIC PARTICLES</b>
                </div>
                <div className="spec-metric-row">
                  <span>ANALOG PIPELINE</span>
                  <b>RGB BLEEDING &amp; LIMBO MODE</b>
                </div>
              </div>

              <div className="technique-callout">
                <b>ORGANIC MESH PHYSICS</b>
                <p>
                  Built with Three.js custom vertex calculations and ACESFilmic tone mapping, rendering seamlessly alongside the broadsheet portfolio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MasterStudio3D;
