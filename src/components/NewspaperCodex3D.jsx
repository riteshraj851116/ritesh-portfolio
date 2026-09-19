import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Layers,
  Cpu,
  Compass,
  Zap,
  Maximize2,
  RefreshCw,
  Eye,
  Radio,
  ExternalLink,
  Code2,
  Database,
  Bot,
  Flame,
  Activity,
} from "lucide-react";
import { playClickSound, playHoverBlip } from "../utils/audio";
import "./NewspaperCodex3D.css";

// 5 Core Subsystems with synchronized resume technical specs
const SUBSYSTEMS = [
  {
    id: "cineai",
    name: "CineAI Multimodal Core",
    label: "AI ENGINE",
    category: "AI & MULTIMODAL",
    color: "#c03f13", // Terracotta
    position: [4.2, 1.2, 2.5],
    tier: "LLM Orchestration & WebSocket Gateway",
    stats: {
      latency: "<180ms Stream",
      throughput: "Gemini 2.5 Flash",
      audio: "Dolby Atmos 64-Ch",
      efficiency: "99.4% Token Cache",
    },
    description:
      "Multimodal cinema platform integrating Google Gemini 2.5 Flash for conversational movie discovery, real-time interactive seat heatmaps, and spatial acoustic seat indexing.",
    link: "https://cineai-pi-steel.vercel.app",
    repo: "https://github.com/riteshraj851116/cineai",
  },
  {
    id: "jobsphere",
    name: "JobSphere Event Mesh",
    label: "REAL-TIME BUS",
    category: "DISTRIBUTED WEBSOCKET",
    color: "#1d1d1b", // Ink Black
    position: [-4.0, 1.8, -2.2],
    tier: "Full-Stack MERN & Event Broker",
    stats: {
      latency: "<50ms Socket.IO",
      throughput: "40+ RESTful APIs",
      security: "Argon2 / JWT Cookie",
      traffic: "Bi-directional Duplex",
    },
    description:
      "Enterprise recruitment ecosystem with dual role-based workflows, 40+ modular endpoints, live applicant messaging via Socket.IO, and optimistic UI state caching.",
    link: "https://jobsphere-vercel.vercel.app",
    repo: "https://github.com/riteshraj851116/jobsphere",
  },
  {
    id: "teracar",
    name: "TeraCar WebGL Monocoque",
    label: "3D TELEMETRY",
    category: "WEBGL & GRAPHICS",
    color: "#8c3210", // Deep Rust
    position: [2.8, -2.6, -3.2],
    tier: "Three.js & High-Rate Sensor Bus",
    stats: {
      latency: "60 FPS V-Sync",
      throughput: "12 Sensor Channels",
      rendering: "PBR Metallic Shaders",
      geometry: "3D Procedural Mesh",
    },
    description:
      "Interactive 3D vehicle engineering configurator with custom GLSL lighting shaders, real-time aerodynamic particle streamlines, and dynamic component explosion.",
    link: "https://teracar-tan.vercel.app",
    repo: "https://github.com/riteshraj851116",
  },
  {
    id: "dsa",
    name: "Java DSA Algorithmic Core",
    label: "ALGORITHMIC ENGINE",
    category: "DATA STRUCTURES",
    color: "#2a2723", // Dark Charcoal
    position: [-3.2, -2.4, 2.8],
    tier: "Apna College Certified Engine",
    stats: {
      latency: "O(1) / O(log N)",
      throughput: "200+ Solved",
      coverage: "Trees, Graphs, DP",
      paradigm: "Pure Java 21",
    },
    description:
      "Rigorous problem-solving engine encompassing advanced graph traversals (Dijkstra, BFS/DFS), dynamic programming, binary search trees, and optimal heap allocation.",
    link: "https://github.com/riteshraj851116",
    repo: "https://github.com/riteshraj851116",
  },
  {
    id: "database",
    name: "MongoDB Sharded Cluster",
    label: "PERSISTENCE",
    category: "INDEXED CLUSTER",
    color: "#c03f13", // Terracotta
    position: [0.0, 3.8, -1.8],
    tier: "Mongoose ODM & Aggregation Pipeline",
    stats: {
      latency: "<12ms IXSCAN",
      throughput: "Compound Indexes",
      isolation: "ACID Transactions",
      replication: "Atlas Replica Set",
    },
    description:
      "Optimized persistence tier with composite index strategies, aggregation pipelines for real-time analytics, and automated connection pooling under high concurrency.",
    link: "https://github.com/riteshraj851116",
    repo: "https://github.com/riteshraj851116",
  },
];

const NewspaperCodex3D = () => {
  const mountRef = useRef(null);
  const [activeSubsystem, setActiveSubsystem] = useState(SUBSYSTEMS[0]);
  const [renderMode, setRenderMode] = useState("solid"); // "solid" | "wireframe" | "exploded" | "streams"
  const [isRotating, setIsRotating] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [fps, setFps] = useState(60);

  // References for Three.js state
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const codexGroupRef = useRef(null);
  const nodeMeshesRef = useRef([]);
  const explodedFactorRef = useRef(0);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Transparent Clear Color (Preserves --paper-bg!)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3, 16);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent to retain broadsheet paper!
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. OrbitControls (Smooth Damping & Constrained Zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 7;
    controls.maxDistance = 24;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;
    controlsRef.current = controls;

    // 3. Lighting Rig (Editorial Terracotta & Dark Charcoal Contrast)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    const terracottaKeyLight = new THREE.DirectionalLight(0xc03f13, 2.8);
    terracottaKeyLight.position.set(8, 12, 10);
    scene.add(terracottaKeyLight);

    const inkFillLight = new THREE.DirectionalLight(0x23211e, 2.0);
    inkFillLight.position.set(-10, -6, -8);
    scene.add(inkFillLight);

    const pointGlow = new THREE.PointLight(0xc03f13, 2.5, 25);
    pointGlow.position.set(0, 0, 0);
    scene.add(pointGlow);

    // 4. MAIN CODEX HIERARCHY
    const codexGroup = new THREE.Group();
    codexGroupRef.current = codexGroup;
    scene.add(codexGroup);

    // --- A. CENTRAL GYROSCOPIC GIMBAL (Astrolabe Linotype Rings) ---
    const gimbalGroup = new THREE.Group();
    codexGroup.add(gimbalGroup);

    // Ring 1: Equatorial Brass/Terracotta Outer Ring
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.05, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xc03f13,
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    gimbalGroup.add(ring1Mesh);

    // Ring 2: Polar Ink Ring
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.045, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x1d1d1b,
      roughness: 0.35,
      metalness: 0.7,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 2;
    gimbalGroup.add(ring2Mesh);

    // Ring 3: Oblique Meridian Ring
    const ring3Geo = new THREE.TorusGeometry(2.6, 0.04, 16, 80);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x6e685f,
      roughness: 0.3,
      metalness: 0.6,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.x = Math.PI / 4;
    ring3Mesh.rotation.y = Math.PI / 4;
    gimbalGroup.add(ring3Mesh);

    // --- B. CENTRAL DODECAHEDRAL QUANTUM PROCESSOR ---
    const coreGeo = new THREE.DodecahedronGeometry(1.4, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x22201d,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    gimbalGroup.add(coreMesh);

    const coreEdges = new THREE.EdgesGeometry(coreGeo);
    const coreLineMat = new THREE.LineBasicMaterial({
      color: 0xc03f13,
      linewidth: 2,
    });
    const coreWireframe = new THREE.LineSegments(coreEdges, coreLineMat);
    gimbalGroup.add(coreWireframe);

    // Inner Glowing Octahedron Crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.75, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xc03f13,
      emissive: 0xc03f13,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    gimbalGroup.add(crystalMesh);

    // --- C. 5 INTERACTIVE SUBSYSTEM SATELLITE NODES ---
    const nodeMeshes = [];

    SUBSYSTEMS.forEach((sub, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.userData = { id: sub.id, subsystem: sub, basePos: [...sub.position] };
      nodeGroup.position.set(...sub.position);

      // Node Geometry: Geometric Orb with Outer Ring
      const nodeGeo = new THREE.IcosahedronGeometry(0.55, 1);
      const isTerracotta = sub.color === "#c03f13";
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isTerracotta ? 0xc03f13 : 0x1d1d1b,
        emissive: isTerracotta ? 0xc03f13 : 0x2b2823,
        emissiveIntensity: 0.4,
        roughness: 0.25,
        metalness: 0.8,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeGroup.add(nodeMesh);

      // Satellite Orbiting Ring
      const satRingGeo = new THREE.TorusGeometry(0.85, 0.02, 12, 48);
      const satRingMat = new THREE.MeshBasicMaterial({
        color: isTerracotta ? 0xc03f13 : 0x5a5751,
        transparent: true,
        opacity: 0.7,
      });
      const satRingMesh = new THREE.Mesh(satRingGeo, satRingMat);
      satRingMesh.rotation.x = Math.PI / (2 + idx * 0.4);
      nodeGroup.add(satRingMesh);

      // Connecting Telemetry Vector Line to Core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(sub.position[0], sub.position[1], sub.position[2]),
      ]);
      const lineMat = new THREE.LineDashedMaterial({
        color: isTerracotta ? 0xc03f13 : 0x5a5751,
        dashSize: 0.25,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.5,
      });
      const tetherLine = new THREE.Line(lineGeo, lineMat);
      tetherLine.computeLineDistances();
      codexGroup.add(tetherLine);

      nodeGroup.userData.tether = tetherLine;
      nodeGroup.userData.nodeMesh = nodeMesh;
      nodeGroup.userData.satRingMesh = satRingMesh;

      codexGroup.add(nodeGroup);
      nodeMeshes.push(nodeGroup);
    });

    nodeMeshesRef.current = nodeMeshes;

    // --- D. AMBIENT CODEX INK PARTICLES FIELD ---
    const partCount = 200;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    const partColors = new Float32Array(partCount * 3);

    const cInk = new THREE.Color(0x1d1d1b);
    const cTerra = new THREE.Color(0xc03f13);
    const cPaper = new THREE.Color(0x8a8377);

    for (let i = 0; i < partCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 16;
      partPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const pick = Math.random();
      const col = pick > 0.6 ? cTerra : pick > 0.3 ? cInk : cPaper;
      partColors[i * 3] = col.r;
      partColors[i * 3 + 1] = col.g;
      partColors[i * 3 + 2] = col.b;
    }

    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partColors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });
    const particleCloud = new THREE.Points(partGeo, partMat);
    codexGroup.add(particleCloud);

    // 5. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 6. RAYCASTING & INTERACTION ON CANVAS CLICK
    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const hitCandidates = [];
      nodeMeshes.forEach((g) => {
        hitCandidates.push(g.userData.nodeMesh);
      });

      const intersects = raycasterRef.current.intersectObjects(hitCandidates, false);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const parentGroup = hitMesh.parent;
        if (parentGroup && parentGroup.userData.subsystem) {
          playClickSound();
          setActiveSubsystem(parentGroup.userData.subsystem);
        }
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener("click", handleCanvasClick);

    // 7. ANIMATION LOOP
    let animId;
    let lastTime = performance.now();
    let frameTally = 0;
    let lastFpsStamp = performance.now();

    const renderLoop = (now) => {
      animId = requestAnimationFrame(renderLoop);

      // Compute FPS
      frameTally++;
      if (now - lastFpsStamp >= 1000) {
        setFps(Math.round((frameTally * 1000) / (now - lastFpsStamp)));
        frameTally = 0;
        lastFpsStamp = now;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update OrbitControls
      controls.update();

      // Autonomous Gyroscopic Counter-Rotation
      if (isRotating) {
        const rate = delta * speedMultiplier;
        ring1Mesh.rotation.y += rate * 0.45;
        ring1Mesh.rotation.x += rate * 0.25;

        ring2Mesh.rotation.z += rate * 0.55;
        ring2Mesh.rotation.y -= rate * 0.35;

        ring3Mesh.rotation.x -= rate * 0.4;
        ring3Mesh.rotation.z += rate * 0.4;

        coreMesh.rotation.x += rate * 0.6;
        coreMesh.rotation.y += rate * 0.8;
        coreWireframe.rotation.copy(coreMesh.rotation);

        crystalMesh.rotation.x -= rate * 0.9;
        crystalMesh.rotation.y += rate * 1.1;

        // Subtle Group Breathing Drift
        codexGroup.rotation.y += rate * 0.15;
      }

      // Smooth Exploded View Animation Interpolation
      const targetExplode = renderMode === "exploded" ? 1.75 : 1.0;
      explodedFactorRef.current += (targetExplode - explodedFactorRef.current) * 0.08;
      const expFactor = explodedFactorRef.current;

      nodeMeshes.forEach((ng, i) => {
        const base = ng.userData.basePos;
        ng.position.set(base[0] * expFactor, base[1] * expFactor, base[2] * expFactor);

        // Spin satellite rings
        if (ng.userData.satRingMesh) {
          ng.userData.satRingMesh.rotation.z += delta * 0.8;
        }

        // Pulse scale if this is the active subsystem
        const isActive = activeSubsystem && ng.userData.id === activeSubsystem.id;
        const targetScale = isActive ? 1.35 + Math.sin(now * 0.005) * 0.1 : 1.0;
        ng.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Update tether line endpoints
        if (ng.userData.tether) {
          const posArr = ng.userData.tether.geometry.attributes.position.array;
          posArr[3] = ng.position.x;
          posArr[4] = ng.position.y;
          posArr[5] = ng.position.z;
          ng.userData.tether.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Ambient Particle Drift
      const posArr = partGeo.attributes.position.array;
      for (let i = 0; i < partCount; i++) {
        posArr[i * 3 + 1] += Math.sin(now * 0.001 + i) * 0.004;
      }
      partGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderLoop(performance.now());

    // 8. CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (canvasEl) {
        canvasEl.removeEventListener("click", handleCanvasClick);
      }
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
      coreGeo.dispose();
      coreMat.dispose();
      coreEdges.dispose();
      coreLineMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, [isRotating, speedMultiplier]);

  // Apply Render Mode Changes (Wireframe vs Solid vs Exploded vs Streams)
  useEffect(() => {
    if (!nodeMeshesRef.current || !codexGroupRef.current) return;

    const isWire = renderMode === "wireframe";

    nodeMeshesRef.current.forEach((ng) => {
      if (ng.userData.nodeMesh && ng.userData.nodeMesh.material) {
        ng.userData.nodeMesh.material.wireframe = isWire;
      }
    });

    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (child.geometry.type !== "TorusGeometry") {
            child.material.wireframe = isWire;
          }
        }
      });
    }
  }, [renderMode]);

  // Camera Presets
  const setCameraPreset = (view) => {
    playClickSound();
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (view) {
      case "isometric":
        camera.position.set(11, 9, 11);
        break;
      case "top":
        camera.position.set(0, 16, 0.1);
        break;
      case "front":
        camera.position.set(0, 1.5, 14);
        break;
      case "reset":
      default:
        camera.position.set(0, 3, 16);
        break;
    }
    controls.target.set(0, 0, 0);
    controls.update();
  };

  const handleSubsystemSelect = (sub) => {
    playClickSound();
    setActiveSubsystem(sub);
  };

  return (
    <section className="newspaper-codex-section" id="codex-3d">
      {/* SECTION EDITORIAL MASTHEAD */}
      <div className="codex-section-header">
        <div className="codex-header-meta">
          <span className="codex-edition-tag">SECTION 03 // 3D KINETIC CODEX</span>
          <span className="codex-bullet-sep">◈</span>
          <span className="codex-protocol">WEBGL ARCHITECTURAL ENGINE</span>
          <span className="codex-fps-badge">● {fps} FPS</span>
        </div>

        <h2 className="codex-title">THE ARCHITECTURAL CORE</h2>

        <p className="codex-subtitle">
          Direct WebGL manipulation of the multi-tier engineering codex. Orbit 360° in real-time,
          inspect subsystem telemetry, expand exploded assemblies, or switch to vector wireframe
          schematics.
        </p>
      </div>

      {/* 3D BROADSHEET WORKBENCH CONTAINER */}
      <div className="codex-workbench-grid">
        {/* LEFT / CENTER: INTERACTIVE 3D WEBGL STAGE */}
        <div className="codex-canvas-frame">
          {/* Top Frame Window Bar */}
          <div className="codex-canvas-topbar">
            <div className="canvas-traffic-lights">
              <span className="c-dot dot-close"></span>
              <span className="c-dot dot-min"></span>
              <span className="c-dot dot-max"></span>
            </div>

            <div className="canvas-address-bar">
              <Compass size={12} className="canvas-compass-icon" />
              <span>codex://webgl.viewport/astrolabe-armillary-core</span>
            </div>

            <div className="canvas-status-pill">
              <Activity size={12} className="pulse-icon" />
              <span>INTERACTIVE // DRAG TO ORBIT</span>
            </div>
          </div>

          {/* THREE.JS MOUNT POINT */}
          <div className="codex-webgl-mount" ref={mountRef} />

          {/* HUD OVERLAY CONTROLS (Top-Right of Canvas) */}
          <div className="codex-hud-overlay">
            {/* RENDER MODE SWITCHER */}
            <div className="hud-control-group">
              <span className="hud-group-label">RENDER SHADER</span>
              <div className="hud-buttons-row">
                <button
                  className={`hud-btn ${renderMode === "solid" ? "active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setRenderMode("solid");
                  }}
                  title="Solid PBR Materials"
                >
                  <Eye size={12} />
                  <span>SOLID</span>
                </button>

                <button
                  className={`hud-btn ${renderMode === "wireframe" ? "active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setRenderMode("wireframe");
                  }}
                  title="Vector Wireframe Blueprint"
                >
                  <Code2 size={12} />
                  <span>WIREFRAME</span>
                </button>

                <button
                  className={`hud-btn ${renderMode === "exploded" ? "active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setRenderMode("exploded");
                  }}
                  title="Exploded Component Assembly"
                >
                  <Layers size={12} />
                  <span>EXPLODED</span>
                </button>
              </div>
            </div>

            {/* CAMERA PRESETS */}
            <div className="hud-control-group">
              <span className="hud-group-label">CAMERA ORTHOGONAL</span>
              <div className="hud-buttons-row">
                <button className="hud-btn" onClick={() => setCameraPreset("isometric")}>
                  <span>ISO 45°</span>
                </button>
                <button className="hud-btn" onClick={() => setCameraPreset("top")}>
                  <span>PLAN</span>
                </button>
                <button className="hud-btn" onClick={() => setCameraPreset("reset")}>
                  <RefreshCw size={11} />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* ROTATION SPEED */}
            <div className="hud-control-group">
              <span className="hud-group-label">GYRO ROTATION</span>
              <div className="hud-buttons-row">
                <button
                  className={`hud-btn ${isRotating ? "active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setIsRotating(!isRotating);
                  }}
                >
                  <Zap size={11} />
                  <span>{isRotating ? "ACTIVE" : "PAUSED"}</span>
                </button>
                <button
                  className={`hud-btn ${speedMultiplier === 2 ? "active" : ""}`}
                  onClick={() => {
                    playClickSound();
                    setSpeedMultiplier(speedMultiplier === 1 ? 2 : 1);
                  }}
                >
                  <span>{speedMultiplier}X</span>
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM INSTRUCTION STRIP */}
          <div className="codex-canvas-footer-strip">
            <span className="strip-item">
              <Compass size={11} /> CLICK & DRAG TO ORBIT 360°
            </span>
            <span className="strip-sep">//</span>
            <span className="strip-item">PINCH OR SCROLL WHEEL TO ZOOM</span>
            <span className="strip-sep">//</span>
            <span className="strip-item">CLICK ANY NODE TO INSPECT TELEMETRY</span>
          </div>
        </div>

        {/* RIGHT SIDE: SUBSYSTEM TELEMETRY INSPECTOR */}
        <div className="codex-telemetry-sidebar">
          {/* SUBSYSTEM TAB SELECTOR */}
          <div className="subsystem-tabs-bar">
            {SUBSYSTEMS.map((sub) => (
              <button
                key={sub.id}
                className={`subsystem-tab-btn ${
                  activeSubsystem.id === sub.id ? "active" : ""
                }`}
                onClick={() => handleSubsystemSelect(sub)}
                onMouseEnter={playHoverBlip}
              >
                <span className="tab-indicator">●</span>
                <span className="tab-name">{sub.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* ACTIVE SUBSYSTEM DOSSIER CARD */}
          <div className="subsystem-dossier-card">
            <div className="dossier-header">
              <div className="dossier-meta">
                <span className="dossier-tag">{activeSubsystem.category}</span>
                <span className="dossier-tier">{activeSubsystem.label}</span>
              </div>
              <h3 className="dossier-name">{activeSubsystem.name}</h3>
              <p className="dossier-tier-desc">{activeSubsystem.tier}</p>
            </div>

            {/* LIVE TELEMETRY MATRIX */}
            <div className="dossier-metrics-grid">
              {Object.entries(activeSubsystem.stats).map(([key, value]) => (
                <div key={key} className="dossier-metric-cell">
                  <span className="metric-cell-label">{key.toUpperCase()}</span>
                  <span className="metric-cell-val">{value}</span>
                </div>
              ))}
            </div>

            {/* ARCHITECTURAL DESCRIPTION */}
            <div className="dossier-body">
              <p className="dossier-narrative">{activeSubsystem.description}</p>
            </div>

            {/* DIRECT ACTION BAR */}
            <div className="dossier-actions">
              {activeSubsystem.link && (
                <a
                  href={activeSubsystem.link}
                  target="_blank"
                  rel="noreferrer"
                  className="dossier-action-btn primary"
                  onClick={playClickSound}
                >
                  <span>LAUNCH PRODUCTION INSTANCE</span>
                  <ExternalLink size={13} />
                </a>
              )}

              {activeSubsystem.repo && (
                <a
                  href={activeSubsystem.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="dossier-action-btn secondary"
                  onClick={playClickSound}
                >
                  <span>VIEW REPOSITORY</span>
                  <Code2 size={13} />
                </a>
              )}
            </div>

            {/* VERIFICATION SEAL */}
            <div className="dossier-seal-footer">
              <span className="seal-txt">
                ARCHITECTURAL SPECIFICATION // VERIFIED BY RITESH RAJ
              </span>
              <span className="seal-code">EST. 2026 // BIHAR, INDIA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewspaperCodex3D;
