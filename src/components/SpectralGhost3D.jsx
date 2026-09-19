import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  Eye,
  Zap,
  Activity,
  Compass,
  RotateCcw,
  Palette,
  Tv,
  Flame,
} from "lucide-react";
import { playClickSound, playHoverBlip } from "../utils/audio";
import "./SpectralGhost3D.css";

// Fluorescent color palette matching the demo
const FLUORESCENT_COLORS = {
  orange: { label: "Terracotta", hex: 0xff4500, color: "#ff4500" },
  cyan: { label: "Neon Cyan", hex: 0x00ffff, color: "#00ffff" },
  lime: { label: "Electric Lime", hex: 0x00ff00, color: "#00ff00" },
  magenta: { label: "Cyber Magenta", hex: 0xff00ff, color: "#ff00ff" },
  yellow: { label: "Amber Glow", hex: 0xffff00, color: "#ffff00" },
  purple: { label: "Void Purple", hex: 0x9400d3, color: "#9400d3" },
  blue: { label: "Cobalt Blue", hex: 0x0080ff, color: "#0080ff" },
  green: { label: "Emerald Green", hex: 0x00ff80, color: "#00ff80" },
  teal: { label: "Ghost Teal", hex: 0x00ffaa, color: "#00ffaa" },
  violet: { label: "Arcane Violet", hex: 0x8a2be2, color: "#8a2be2" },
};

// Analog Decay Shader Definition (VHS scanlines, jitter, color bleeding, film grain, limbo mode)
const analogDecayShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(800, 600) },
    uAnalogGrain: { value: 0.4 },
    uAnalogBleeding: { value: 1.0 },
    uAnalogVSync: { value: 1.0 },
    uAnalogScanlines: { value: 1.0 },
    uAnalogVignette: { value: 1.0 },
    uAnalogJitter: { value: 0.4 },
    uAnalogIntensity: { value: 0.6 },
    uLimboMode: { value: 0.0 },
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
    uniform float uAnalogGrain;
    uniform float uAnalogBleeding;
    uniform float uAnalogVSync;
    uniform float uAnalogScanlines;
    uniform float uAnalogVignette;
    uniform float uAnalogJitter;
    uniform float uAnalogIntensity;
    uniform float uLimboMode;
    
    varying vec2 vUv;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float random(float x) {
      return fract(sin(x) * 43758.5453123);
    }
    
    float gaussian(float z, float u, float o) {
      return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
    }
    
    vec3 grain(vec2 uv, float time, float intensity) {
      float seed = dot(uv, vec2(12.9898, 78.233));
      float noise = fract(sin(seed) * 43758.5453 + time * 2.0);
      noise = gaussian(noise, 0.0, 0.5 * 0.5);
      return vec3(noise) * intensity;
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 1.8;
      
      // Analog Jitter - temporal instability
      vec2 jitteredUV = uv;
      if (uAnalogJitter > 0.01) {
        float jitterAmount = (random(vec2(floor(time * 60.0))) - 0.5) * 0.003 * uAnalogJitter * uAnalogIntensity;
        jitteredUV.x += jitterAmount;
        jitteredUV.y += (random(vec2(floor(time * 30.0) + 1.0)) - 0.5) * 0.001 * uAnalogJitter * uAnalogIntensity;
      }
      
      // VHS-style vertical sync roll
      if (uAnalogVSync > 0.01) {
        float vsyncRoll = sin(time * 2.0 + uv.y * 100.0) * 0.02 * uAnalogVSync * uAnalogIntensity;
        float vsyncChance = step(0.95, random(vec2(floor(time * 4.0))));
        jitteredUV.y += vsyncRoll * vsyncChance;
      }
      
      vec4 color = texture2D(tDiffuse, jitteredUV);
      
      // Color bleeding / RGB channel separation
      if (uAnalogBleeding > 0.01) {
        float bleedAmount = 0.012 * uAnalogBleeding * uAnalogIntensity;
        float offsetPhase = time * 1.5 + uv.y * 20.0;
        
        vec2 redOffset = vec2(sin(offsetPhase) * bleedAmount, 0.0);
        vec2 blueOffset = vec2(-sin(offsetPhase * 1.1) * bleedAmount * 0.8, 0.0);
        
        float r = texture2D(tDiffuse, jitteredUV + redOffset).r;
        float g = texture2D(tDiffuse, jitteredUV).g;
        float b = texture2D(tDiffuse, jitteredUV + blueOffset).b;
        
        color = vec4(r, g, b, color.a);
      }
      
      // Procedural film grain
      if (uAnalogGrain > 0.01) {
        vec3 grainEffect = grain(uv, time, 0.075 * uAnalogGrain * uAnalogIntensity);
        grainEffect *= (1.0 - color.rgb);
        color.rgb += grainEffect;
      }
      
      // Scanlines
      if (uAnalogScanlines > 0.01) {
        float scanlineFreq = 600.0 + uAnalogScanlines * 400.0;
        float scanlinePattern = sin(uv.y * scanlineFreq) * 0.5 + 0.5;
        float scanlineIntensity = 0.1 * uAnalogScanlines * uAnalogIntensity;
        color.rgb *= (1.0 - scanlinePattern * scanlineIntensity);
        
        float horizontalLines = sin(uv.y * scanlineFreq * 0.1) * 0.02 * uAnalogScanlines * uAnalogIntensity;
        color.rgb *= (1.0 - horizontalLines);
      }
      
      // Vignetting
      if (uAnalogVignette > 0.01) {
        vec2 vignetteUV = (uv - 0.5) * 2.0;
        float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3 * uAnalogVignette * uAnalogIntensity;
        color.rgb *= vignette;
      }
      
      // Limbo Mode (Black and White)
      if (uLimboMode > 0.5) {
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = vec3(gray);
      }
      
      gl_FragColor = color;
    }
  `,
};

const SpectralGhost3D = () => {
  const mountRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Active tweakable parameters
  const [glowColor, setGlowColor] = useState("orange");
  const [eyeGlowColor, setEyeGlowColor] = useState("green");
  const [limboMode, setLimboMode] = useState(false);
  const [analogIntensity, setAnalogIntensity] = useState(0.6);
  const [filmGrain, setFilmGrain] = useState(0.4);
  const [colorBleeding, setColorBleeding] = useState(1.0);
  const [scanlines, setScanlines] = useState(1.0);
  const [fps, setFps] = useState(60);

  // Internal mutable refs for 60fps loop
  const ghostMaterialRef = useRef(null);
  const eyesRef = useRef(null);
  const analogPassRef = useRef(null);
  const composerRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;
    cameraRef.current = camera;

    // 2. ENHANCED RENDERER WITH ALPHA TRANSPARENCY
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
      premultipliedAlpha: false,
      stencil: false,
      depth: true,
      preserveDrawingBuffer: false,
    });
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.setClearColor(0x000000, 0); // Transparent so broadsheet paper remains!
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. EFFECT COMPOSER PIPELINE
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.3,
      1.25,
      0.0
    );
    composer.addPass(bloomPass);

    const analogDecayPass = new ShaderPass(analogDecayShader);
    analogDecayPass.uniforms.uResolution.value.set(width, height);
    analogDecayPass.uniforms.uAnalogIntensity.value = analogIntensity;
    analogDecayPass.uniforms.uAnalogGrain.value = filmGrain;
    analogDecayPass.uniforms.uAnalogBleeding.value = colorBleeding;
    analogDecayPass.uniforms.uAnalogScanlines.value = scanlines;
    analogDecayPass.uniforms.uLimboMode.value = limboMode ? 1.0 : 0.0;
    composer.addPass(analogDecayPass);
    analogPassRef.current = analogDecayPass;

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // 4. ATMOSPHERE MATERIAL WITH DYNAMIC REVEAL
    const atmosphereGeometry = new THREE.PlaneGeometry(300, 300);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ghostPosition: { value: new THREE.Vector3(0, 0, 0) },
        revealRadius: { value: 43.0 },
        fadeStrength: { value: 2.2 },
        baseOpacity: { value: 0.35 },
        revealOpacity: { value: 0.0 },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 ghostPosition;
        uniform float revealRadius;
        uniform float fadeStrength;
        uniform float baseOpacity;
        uniform float revealOpacity;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        void main() {
          float dist = distance(vWorldPosition.xy, ghostPosition.xy);
          float dynamicRadius = revealRadius + sin(time * 2.0) * 5.0;
          float reveal = smoothstep(dynamicRadius * 0.2, dynamicRadius, dist);
          reveal = pow(reveal, fadeStrength);
          float opacity = mix(revealOpacity, baseOpacity, reveal);
          gl_FragColor = vec4(0.001, 0.001, 0.002, opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.z = -50;
    atmosphere.renderOrder = -100;
    scene.add(atmosphere);

    // Minimal Ambient & Rim Lights
    const ambientLight = new THREE.AmbientLight(0x0a0a2e, 0.08);
    scene.add(ambientLight);

    const rimLight1 = new THREE.DirectionalLight(0x4a90e2, 1.8);
    rimLight1.position.set(-8, 6, -4);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x50e3c2, 1.25);
    rimLight2.position.set(8, -4, -6);
    scene.add(rimLight2);

    // 5. GHOST MESH WITH PROCEDURAL WAVY BOTTOM
    const ghostGroup = new THREE.Group();
    scene.add(ghostGroup);

    const ghostGeometry = new THREE.SphereGeometry(2, 40, 40);
    const positionAttribute = ghostGeometry.getAttribute("position");
    const positions = positionAttribute.array;
    for (let i = 0; i < positions.length; i += 3) {
      if (positions[i + 1] < -0.2) {
        const x = positions[i];
        const z = positions[i + 2];
        const noise1 = Math.sin(x * 5) * 0.35;
        const noise2 = Math.cos(z * 4) * 0.25;
        const noise3 = Math.sin((x + z) * 3) * 0.15;
        positions[i + 1] = -2.0 + (noise1 + noise2 + noise3);
      }
    }
    ghostGeometry.computeVertexNormals();

    const initialGlowHex = FLUORESCENT_COLORS[glowColor].hex;
    const ghostMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f2027,
      transparent: true,
      opacity: 0.88,
      emissive: initialGlowHex,
      emissiveIntensity: 5.8,
      roughness: 0.02,
      metalness: 0.0,
      side: THREE.DoubleSide,
      alphaTest: 0.1,
    });
    ghostMaterialRef.current = ghostMaterial;

    const ghostBody = new THREE.Mesh(ghostGeometry, ghostMaterial);
    ghostGroup.add(ghostBody);

    // 6. EYE SOCKETS & GLOWING EYES
    const eyeGroup = new THREE.Group();
    ghostGroup.add(eyeGroup);

    const socketGeometry = new THREE.SphereGeometry(0.45, 16, 16);
    const socketMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const leftSocket = new THREE.Mesh(socketGeometry, socketMaterial);
    leftSocket.position.set(-0.7, 0.6, 1.9);
    leftSocket.scale.set(1.1, 1.0, 0.6);
    eyeGroup.add(leftSocket);

    const rightSocket = new THREE.Mesh(socketGeometry, socketMaterial);
    rightSocket.position.set(0.7, 0.6, 1.9);
    rightSocket.scale.set(1.1, 1.0, 0.6);
    eyeGroup.add(rightSocket);

    const eyeGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    const initialEyeHex = FLUORESCENT_COLORS[eyeGlowColor].hex;

    const leftEyeMaterial = new THREE.MeshBasicMaterial({
      color: initialEyeHex,
      transparent: true,
      opacity: 0,
    });
    const leftEye = new THREE.Mesh(eyeGeometry, leftEyeMaterial);
    leftEye.position.set(-0.7, 0.6, 2.0);
    eyeGroup.add(leftEye);

    const rightEyeMaterial = new THREE.MeshBasicMaterial({
      color: initialEyeHex,
      transparent: true,
      opacity: 0,
    });
    const rightEye = new THREE.Mesh(eyeGeometry, rightEyeMaterial);
    rightEye.position.set(0.7, 0.6, 2.0);
    eyeGroup.add(rightEye);

    const outerGlowGeometry = new THREE.SphereGeometry(0.525, 12, 12);
    const leftOuterGlowMaterial = new THREE.MeshBasicMaterial({
      color: initialEyeHex,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });
    const leftOuterGlow = new THREE.Mesh(outerGlowGeometry, leftOuterGlowMaterial);
    leftOuterGlow.position.set(-0.7, 0.6, 1.95);
    eyeGroup.add(leftOuterGlow);

    const rightOuterGlowMaterial = new THREE.MeshBasicMaterial({
      color: initialEyeHex,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
    });
    const rightOuterGlow = new THREE.Mesh(outerGlowGeometry, rightOuterGlowMaterial);
    rightOuterGlow.position.set(0.7, 0.6, 1.95);
    eyeGroup.add(rightOuterGlow);

    eyesRef.current = {
      leftEyeMaterial,
      rightEyeMaterial,
      leftOuterGlowMaterial,
      rightOuterGlowMaterial,
    };

    // 7. FIREFLIES SWARM
    const fireflies = [];
    const fireflyGroup = new THREE.Group();
    scene.add(fireflyGroup);

    for (let i = 0; i < 20; i++) {
      const fGeo = new THREE.SphereGeometry(0.02, 4, 4);
      const fMat = new THREE.MeshBasicMaterial({ color: 0xffff44, transparent: true, opacity: 0.9 });
      const firefly = new THREE.Mesh(fGeo, fMat);

      firefly.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 18
      );

      const glowGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffff88,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      firefly.add(glow);

      const fLight = new THREE.PointLight(0xffff44, 0.8, 3, 2);
      firefly.add(fLight);

      firefly.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04
        ),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 2 + Math.random() * 3,
        glowMat,
        fMat,
        fLight,
      };

      fireflyGroup.add(firefly);
      fireflies.push(firefly);
    }

    // 8. PARTICLE POOL
    const particles = [];
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particlePool = [];
    const particleGeometries = [
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.TetrahedronGeometry(0.04, 0),
      new THREE.OctahedronGeometry(0.045, 0),
    ];
    const particleBaseMaterial = new THREE.MeshBasicMaterial({
      color: initialGlowHex,
      transparent: true,
      opacity: 0,
      alphaTest: 0.1,
    });

    for (let i = 0; i < 80; i++) {
      const gIndex = Math.floor(Math.random() * particleGeometries.length);
      const p = new THREE.Mesh(particleGeometries[gIndex], particleBaseMaterial.clone());
      p.visible = false;
      particleGroup.add(p);
      particlePool.push(p);
    }

    const createParticle = () => {
      let p;
      if (particlePool.length > 0) {
        p = particlePool.pop();
        p.visible = true;
      } else if (particles.length < 250) {
        const gIndex = Math.floor(Math.random() * particleGeometries.length);
        p = new THREE.Mesh(particleGeometries[gIndex], particleBaseMaterial.clone());
        particleGroup.add(p);
      } else {
        return;
      }

      p.position.copy(ghostGroup.position);
      p.position.z -= 0.8 + Math.random() * 0.6;
      p.position.x += (Math.random() - 0.5) * 3.5;
      p.position.y += (Math.random() - 0.5) * 3.5 - 0.8;

      const sz = 0.6 + Math.random() * 0.7;
      p.scale.set(sz, sz, sz);
      p.userData = {
        life: 1.0,
        decay: Math.random() * 0.003 + 0.005,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.015,
        },
        velocity: {
          x: (Math.random() - 0.5) * 0.012,
          y: (Math.random() - 0.5) * 0.012 - 0.002,
          z: (Math.random() - 0.5) * 0.012 - 0.006,
        },
      };
      p.material.opacity = Math.random() * 0.9;
      particles.push(p);
    };

    // 9. MOUSE TRACKING
    const mouse = new THREE.Vector2();
    const prevMouse = new THREE.Vector2();
    const mouseSpeed = new THREE.Vector2();
    let isMouseMoving = false;
    let mouseTimer = null;
    let currentMovement = 0;

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseSpeed.x = mouse.x - prevMouse.x;
      mouseSpeed.y = mouse.y - prevMouse.y;
      isMouseMoving = true;

      if (mouseTimer) clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        isMouseMoving = false;
      }, 80);
    };

    const targetEl = renderer.domElement;
    targetEl.addEventListener("mousemove", onPointerMove, { passive: true });

    // 10. RESIZE HANDLER
    const onResize = () => {
      if (!container || !renderer || !camera || !composer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
      analogDecayPass.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    // 11. ANIMATION LOOP
    let animId;
    let time = 0;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let lastParticleTime = 0;
    let lastFpsUpdate = performance.now();
    let framesThisSecond = 0;

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      // FPS Calculation
      framesThisSecond++;
      if (timestamp - lastFpsUpdate >= 1000) {
        setFps(Math.round((framesThisSecond * 1000) / (timestamp - lastFpsUpdate)));
        framesThisSecond = 0;
        lastFpsUpdate = timestamp;
      }

      const deltaTime = timestamp - lastFrameTime;
      lastFrameTime = timestamp;
      if (deltaTime > 100) return;

      const timeIncrement = (deltaTime / 16.67) * 0.01;
      time += timeIncrement;
      frameCount++;

      // Update Shader Times
      atmosphereMaterial.uniforms.time.value = time;
      analogDecayPass.uniforms.uTime.value = time;

      // Smooth Ghost Movement towards Mouse Target
      const targetX = mouse.x * 11;
      const targetY = mouse.y * 7;
      const prevGhostPos = ghostGroup.position.clone();

      ghostGroup.position.x += (targetX - ghostGroup.position.x) * 0.075;
      ghostGroup.position.y += (targetY - ghostGroup.position.y) * 0.075;

      atmosphereMaterial.uniforms.ghostPosition.value.copy(ghostGroup.position);

      const moveDist = prevGhostPos.distanceTo(ghostGroup.position);
      currentMovement = currentMovement * 0.95 + moveDist * 0.05;

      // Floating Sinusoidal Elevation
      const float1 = Math.sin(time * 2.4) * 0.03;
      const float2 = Math.cos(time * 1.12) * 0.018;
      const float3 = Math.sin(time * 3.68) * 0.008;
      ghostGroup.position.y += float1 + float2 + float3;

      // Pulsing Emissive Material
      const pulse1 = Math.sin(time * 1.6) * 0.6;
      const breathe = Math.sin(time * 0.6) * 0.12;
      ghostMaterial.emissiveIntensity = 5.8 + pulse1 + breathe;

      // Update Fireflies
      fireflies.forEach((ff) => {
        const u = ff.userData;
        const pulse = Math.sin(time + u.phase * u.pulseSpeed) * 0.4 + 0.6;
        u.glowMat.opacity = 2.6 * 0.4 * pulse;
        u.fMat.opacity = 2.6 * 0.9 * pulse;
        u.fLight.intensity = 2.6 * 0.8 * pulse;

        u.velocity.x += (Math.random() - 0.5) * 0.001;
        u.velocity.y += (Math.random() - 0.5) * 0.001;
        u.velocity.z += (Math.random() - 0.5) * 0.001;
        u.velocity.clampLength(0, 0.04);
        ff.position.add(u.velocity);

        if (Math.abs(ff.position.x) > 26) u.velocity.x *= -0.5;
        if (Math.abs(ff.position.y) > 18) u.velocity.y *= -0.5;
        if (Math.abs(ff.position.z) > 14) u.velocity.z *= -0.5;
      });

      // Directional Body Tilt & Dynamic Wobble
      const mouseDir = new THREE.Vector2(
        targetX - ghostGroup.position.x,
        targetY - ghostGroup.position.y
      ).normalize();

      const tiltStrength = 0.035;
      ghostBody.rotation.z = ghostBody.rotation.z * 0.95 + -mouseDir.x * tiltStrength * 0.05;
      ghostBody.rotation.x = ghostBody.rotation.x * 0.95 + mouseDir.y * tiltStrength * 0.05;
      ghostBody.rotation.y = Math.sin(time * 1.4) * 0.05 * 0.35;

      // Scale Variations
      const scaleBreath = 1 + Math.sin(time * 0.8) * 0.012;
      const finalScale = (1 + pulse1 * 0.015) * scaleBreath;
      ghostBody.scale.set(finalScale, finalScale, finalScale);

      // Dynamic Eye Glow (Ignites on velocity)
      const isMoving = currentMovement > 0.07;
      const targetGlow = isMoving ? 1.0 : 0.0;
      const glowSpeed = isMoving ? 0.62 : 0.31;
      const newOpacity =
        leftEyeMaterial.opacity + (targetGlow - leftEyeMaterial.opacity) * glowSpeed;

      leftEyeMaterial.opacity = newOpacity;
      rightEyeMaterial.opacity = newOpacity;
      leftOuterGlowMaterial.opacity = newOpacity * 0.35;
      rightOuterGlowMaterial.opacity = newOpacity * 0.35;

      // Particle Trail Spawning
      if (currentMovement > 0.005 && timestamp - lastParticleTime > 90) {
        createParticle();
        createParticle();
        lastParticleTime = timestamp;
      }

      // Particle Updates
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.userData.life -= p.userData.decay;
        p.material.opacity = p.userData.life * 0.85;

        p.position.x += p.userData.velocity.x;
        p.position.y += p.userData.velocity.y;
        p.position.z += p.userData.velocity.z;

        p.rotation.x += p.userData.rotationSpeed.x;
        p.rotation.y += p.userData.rotationSpeed.y;
        p.rotation.z += p.userData.rotationSpeed.z;

        if (p.userData.life <= 0) {
          p.visible = false;
          particlePool.push(p);
          particles.splice(i, 1);
          i--;
        }
      }

      // Render via EffectComposer (Analog Decay + Bloom Pass)
      composer.render();
    };

    animate(performance.now());

    // 12. CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (targetEl) targetEl.removeEventListener("mousemove", onPointerMove);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      ghostGeometry.dispose();
      ghostMaterial.dispose();
      socketGeometry.dispose();
      socketMaterial.dispose();
      eyeGeometry.dispose();
      leftEyeMaterial.dispose();
      rightEyeMaterial.dispose();
      outerGlowGeometry.dispose();
      leftOuterGlowMaterial.dispose();
      rightOuterGlowMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Glow Color
  useEffect(() => {
    if (ghostMaterialRef.current) {
      const hex = FLUORESCENT_COLORS[glowColor].hex;
      ghostMaterialRef.current.emissive.setHex(hex);
    }
  }, [glowColor]);

  // Update Eye Glow Color
  useEffect(() => {
    if (eyesRef.current) {
      const hex = FLUORESCENT_COLORS[eyeGlowColor].hex;
      eyesRef.current.leftEyeMaterial.color.setHex(hex);
      eyesRef.current.rightEyeMaterial.color.setHex(hex);
      eyesRef.current.leftOuterGlowMaterial.color.setHex(hex);
      eyesRef.current.rightOuterGlowMaterial.color.setHex(hex);
    }
  }, [eyeGlowColor]);

  // Update Analog Decay Uniforms
  useEffect(() => {
    if (analogPassRef.current) {
      analogPassRef.current.uniforms.uAnalogIntensity.value = analogIntensity;
      analogPassRef.current.uniforms.uAnalogGrain.value = filmGrain;
      analogPassRef.current.uniforms.uAnalogBleeding.value = colorBleeding;
      analogPassRef.current.uniforms.uAnalogScanlines.value = scanlines;
      analogPassRef.current.uniforms.uLimboMode.value = limboMode ? 1.0 : 0.0;
    }
  }, [analogIntensity, filmGrain, colorBleeding, scanlines, limboMode]);

  return (
    <section
      className={`spectral-ghost-section ${isFullscreen ? "is-fullscreen-active" : ""}`}
      id="spectral-lab"
    >
      {/* SECTION EDITORIAL MASTHEAD */}
      <div className="spectral-header">
        <div className="spectral-meta-bar">
          <span className="spectral-tag">SECTION 03 // 3D SPECTRAL LAB</span>
          <span className="spectral-dot">◈</span>
          <span className="spectral-shader-tag">ANALOG DECAY & ORGANIC MESH</span>
          <span className="spectral-fps-badge">● {fps} FPS V-SYNC</span>
        </div>

        <h2 className="spectral-headline">THE SPECTRAL ENTITY</h2>

        <p className="spectral-subhead">
          Interactive WebGL experiment featuring procedural vertex wave noise, dynamic
          velocity-responsive glowing eyes, organic fireflies, particle trailing, and a custom CRT
          analog decay postprocessing pipeline.
        </p>
      </div>

      {/* 3D WORKBENCH VIEWPORT CONTAINER */}
      <div className="spectral-workbench-card">
        {/* Top Window Bar */}
        <div className="spectral-window-bar">
          <div className="window-dots">
            <span className="dot dot-close"></span>
            <span className="dot dot-min"></span>
            <span className="dot dot-max"></span>
          </div>

          <div className="window-address">
            <Compass size={12} className="compass-icon" />
            <span>threejs://spectral-ghost.render/analog-decay-pipeline</span>
          </div>

          <div className="window-actions">
            <button
              type="button"
              className={`action-toggle-btn ${showControls ? "active" : ""}`}
              onClick={() => {
                playClickSound();
                setShowControls((prev) => !prev);
              }}
              title="Toggle Parameters Drawer"
            >
              <Sliders size={12} />
              <span>{showControls ? "HIDE CONTROLS" : "TWEAK PARAMS"}</span>
            </button>

            <button
              type="button"
              className={`action-toggle-btn ${limboMode ? "active" : ""}`}
              onClick={() => {
                playClickSound();
                setLimboMode((prev) => !prev);
              }}
              title="Toggle B&W Limbo Shader Mode"
            >
              <Tv size={12} />
              <span>{limboMode ? "LIMBO ON" : "COLOR"}</span>
            </button>

            <button
              type="button"
              className="action-icon-btn"
              onClick={() => {
                playClickSound();
                setIsFullscreen((prev) => !prev);
              }}
              title={isFullscreen ? "Exit Fullscreen View" : "Expand to Fullscreen View"}
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          </div>
        </div>

        {/* THREE.JS CANVAS CONTAINER */}
        <div className="spectral-canvas-viewport" ref={mountRef}>
          {/* Subtle Instruction Overlay */}
          <div className="canvas-guidance-pill">
            <Activity size={12} className="guidance-dot" />
            <span>MOVE CURSOR TO DIRECT SPECTRAL ENTITY · WATCH EYES IGNITE ON VELOCITY</span>
          </div>

          {/* Quick Color Swatches Bar */}
          <div className="floating-swatches-strip">
            <span className="swatch-title">GLOW TINT:</span>
            {["orange", "cyan", "lime", "magenta", "yellow", "purple"].map((colKey) => (
              <button
                key={colKey}
                type="button"
                className={`color-swatch-dot ${glowColor === colKey ? "is-selected" : ""}`}
                style={{ backgroundColor: FLUORESCENT_COLORS[colKey].color }}
                onClick={() => {
                  playClickSound();
                  setGlowColor(colKey);
                }}
                onMouseEnter={playHoverBlip}
                title={FLUORESCENT_COLORS[colKey].label}
              />
            ))}
          </div>
        </div>

        {/* BOTTOM TELEMETRY BAR */}
        <div className="spectral-footer-bar">
          <div className="footer-metric">
            <span className="metric-lbl">ACTIVE PARTICLES</span>
            <span className="metric-num">250 POOLED</span>
          </div>
          <span className="metric-sep">/</span>
          <div className="footer-metric">
            <span className="metric-lbl">EYE GLOW RESPONSE</span>
            <span className="metric-num">VELOCITY-LOCKED</span>
          </div>
          <span className="metric-sep">/</span>
          <div className="footer-metric">
            <span className="metric-lbl">POSTPROCESSING</span>
            <span className="metric-num">BLOOM + ANALOG DECAY</span>
          </div>
          <span className="metric-sep">/</span>
          <div className="footer-metric">
            <span className="metric-lbl">3D FIREFLIES</span>
            <span className="metric-num">20 HARMONIC</span>
          </div>
        </div>

        {/* TWEAK CONTROLS DRAWER (Expandable) */}
        {showControls && (
          <div className="spectral-controls-drawer">
            <div className="drawer-section">
              <span className="drawer-heading">GLOW & EYE PALETTE</span>
              <div className="swatches-grid">
                {Object.entries(FLUORESCENT_COLORS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    className={`palette-chip ${glowColor === key ? "active" : ""}`}
                    onClick={() => {
                      playClickSound();
                      setGlowColor(key);
                    }}
                  >
                    <span className="chip-color-dot" style={{ backgroundColor: item.color }} />
                    <span className="chip-name">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="drawer-section">
              <span className="drawer-heading">ANALOG VHS DECAY PIPELINE</span>
              <div className="sliders-stack">
                <label className="slider-row">
                  <span className="slider-label">FILM GRAIN ({filmGrain.toFixed(1)})</span>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={filmGrain}
                    onChange={(e) => setFilmGrain(parseFloat(e.target.value))}
                  />
                </label>

                <label className="slider-row">
                  <span className="slider-label">RGB BLEEDING ({colorBleeding.toFixed(1)})</span>
                  <input
                    type="range"
                    min="0"
                    max="2.0"
                    step="0.1"
                    value={colorBleeding}
                    onChange={(e) => setColorBleeding(parseFloat(e.target.value))}
                  />
                </label>

                <label className="slider-row">
                  <span className="slider-label">CRT SCANLINES ({scanlines.toFixed(1)})</span>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={scanlines}
                    onChange={(e) => setScanlines(parseFloat(e.target.value))}
                  />
                </label>

                <label className="slider-row">
                  <span className="slider-label">OVERALL INTENSITY ({analogIntensity.toFixed(1)})</span>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={analogIntensity}
                    onChange={(e) => setAnalogIntensity(parseFloat(e.target.value))}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpectralGhost3D;
