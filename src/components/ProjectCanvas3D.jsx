import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./ProjectCanvas3D.css";

const ProjectCanvas3D = ({ projectId }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;

    // 1. Scene & Transparent Background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.minPolarAngle = Math.PI * 0.25;

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xc03f13, 2.5, 20);
    pointLight.position.set(5, 6, 6);
    scene.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0x23211e, 1.5);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    // Group for the 3D model
    const group = new THREE.Group();
    scene.add(group);

    // Geometries & materials to dispose
    const disposables = [];

    // ==========================================
    // BUILD SPECIFIC 3D SCENE BASED ON PROJECT
    // ==========================================
    if (projectId === "cineai") {
      // --- CINEAI: 3D CURVED CINEMA SCREEN + SEATING MATRIX + DOLBY SOUNDWAVES ---
      // 1. Curved IMAX Screen
      const screenGeo = new THREE.CylinderGeometry(4.5, 4.5, 2.2, 32, 1, true, -Math.PI / 4, Math.PI / 2);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x1d1d1b,
        emissive: 0xc03f13,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.8,
        side: THREE.DoubleSide,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0.4, -1.8);
      group.add(screenMesh);
      disposables.push(screenGeo, screenMat);

      // Screen Border Frame
      const screenWireGeo = new THREE.WireframeGeometry(screenGeo);
      const screenWireMat = new THREE.LineBasicMaterial({ color: 0xc03f13, linewidth: 1 });
      const screenWire = new THREE.LineSegments(screenWireGeo, screenWireMat);
      screenWire.position.copy(screenMesh.position);
      group.add(screenWire);
      disposables.push(screenWireGeo, screenWireMat);

      // 2. 3D Seating Grid (Tiered rows)
      const seatGeo = new THREE.BoxGeometry(0.22, 0.18, 0.22);
      const seatNormalMat = new THREE.MeshStandardMaterial({ color: 0x2e2c28, roughness: 0.4 });
      const seatVipMat = new THREE.MeshStandardMaterial({
        color: 0xc03f13,
        emissive: 0xc03f13,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      disposables.push(seatGeo, seatNormalMat, seatVipMat);

      for (let r = 0; r < 4; r++) {
        const count = 7 + r;
        for (let c = 0; c < count; c++) {
          const angle = ((c - (count - 1) / 2) / count) * 0.9;
          const radius = 2.4 + r * 0.55;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius - 0.4;
          const y = -0.7 + r * 0.18;

          const isVip = r >= 2 && c >= 2 && c <= count - 3;
          const seat = new THREE.Mesh(seatGeo, isVip ? seatVipMat : seatNormalMat);
          seat.position.set(x, y, z);
          seat.rotation.y = angle;
          group.add(seat);
        }
      }

      // 3. Floating 3D Dolby Atmos Soundwave Orb
      const dolbyGeo = new THREE.IcosahedronGeometry(0.5, 2);
      const dolbyMat = new THREE.MeshStandardMaterial({
        color: 0xc03f13,
        wireframe: true,
        emissive: 0xc03f13,
        emissiveIntensity: 0.8,
      });
      const dolbyOrb = new THREE.Mesh(dolbyGeo, dolbyMat);
      dolbyOrb.position.set(0, 1.2, 0.4);
      group.add(dolbyOrb);
      disposables.push(dolbyGeo, dolbyMat);

      // Concentric soundwave rings
      const waveGeo = new THREE.TorusGeometry(0.9, 0.02, 12, 48);
      const waveMat = new THREE.MeshBasicMaterial({ color: 0xc03f13, transparent: true, opacity: 0.6 });
      const wave1 = new THREE.Mesh(waveGeo, waveMat);
      wave1.position.copy(dolbyOrb.position);
      group.add(wave1);
      disposables.push(waveGeo, waveMat);

      group.userData.anim = (t) => {
        dolbyOrb.rotation.y = t * 0.8;
        dolbyOrb.rotation.x = t * 0.4;
        const pulse = 1 + Math.sin(t * 4) * 0.15;
        dolbyOrb.scale.set(pulse, pulse, pulse);
        wave1.rotation.z = t * 0.6;
        wave1.scale.set(pulse * 1.3, pulse * 1.3, 1);
      };
    } else if (projectId === "jobsphere") {
      // --- JOBSPHERE: 3D WIREFRAME NETWORK GLOBE + DATA ARCS + REAL-TIME NODES ---
      const globeGeo = new THREE.SphereGeometry(1.8, 20, 16);
      const globeMat = new THREE.MeshBasicMaterial({
        color: 0x1d1d1b,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      group.add(globe);
      disposables.push(globeGeo, globeMat);

      // Inner Core
      const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xc03f13,
        wireframe: true,
        emissive: 0xc03f13,
        emissiveIntensity: 0.6,
      });
      const innerCore = new THREE.Mesh(coreGeo, coreMat);
      group.add(innerCore);
      disposables.push(coreGeo, coreMat);

      // Orbiting Satellite Nodes (Hiring teams & Applicants)
      const satNodes = [];
      const satGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0xc03f13,
        emissive: 0xc03f13,
        emissiveIntensity: 0.9,
      });
      disposables.push(satGeo, satMat);

      for (let i = 0; i < 8; i++) {
        const sat = new THREE.Mesh(satGeo, satMat);
        const theta = (i / 8) * Math.PI * 2;
        sat.userData = { theta, speed: 0.4 + (i % 3) * 0.2, radius: 2.2 + (i % 2) * 0.4, yOffset: ((i % 4) - 1.5) * 0.6 };
        group.add(sat);
        satNodes.push(sat);
      }

      group.userData.anim = (t) => {
        globe.rotation.y = t * 0.2;
        innerCore.rotation.x = t * 0.35;
        innerCore.rotation.y = t * 0.5;

        satNodes.forEach((s) => {
          const angle = s.userData.theta + t * s.userData.speed;
          s.position.x = Math.cos(angle) * s.userData.radius;
          s.position.z = Math.sin(angle) * s.userData.radius;
          s.position.y = s.userData.yOffset + Math.sin(t * 2 + s.userData.theta) * 0.2;
        });
      };
    } else {
      // --- TERACAR: 3D AERODYNAMIC MONOCOQUE CHASSIS & WIND STREAMLINES ---
      // Chassis Body (Aerodynamic wedge)
      const bodyGeo = new THREE.BoxGeometry(3.6, 0.45, 1.4);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x1d1d1b,
        roughness: 0.2,
        metalness: 0.9,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 0.2, 0);
      group.add(body);
      disposables.push(bodyGeo, bodyMat);

      // Cockpit Canopy
      const canopyGeo = new THREE.ConeGeometry(0.9, 1.8, 4);
      const canopyMat = new THREE.MeshStandardMaterial({
        color: 0xc03f13,
        roughness: 0.1,
        metalness: 0.95,
        wireframe: false,
      });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.rotation.z = Math.PI / 2;
      canopy.position.set(0.2, 0.6, 0);
      group.add(canopy);
      disposables.push(canopyGeo, canopyMat);

      // Wheels (4 cylinders)
      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 24);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x2b2823, roughness: 0.4 });
      disposables.push(wheelGeo, wheelMat);

      const wheels = [];
      const wheelOffsets = [
        [-1.3, 0, 0.8],
        [1.3, 0, 0.8],
        [-1.3, 0, -0.8],
        [1.3, 0, -0.8],
      ];

      wheelOffsets.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        group.add(wheel);
        wheels.push(wheel);
      });

      // Wind Tunnel Streamline Particles
      const pCount = 70;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 6;
        pPos[i * 3 + 1] = 0.1 + Math.random() * 0.9;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xc03f13,
        size: 0.12,
        transparent: true,
        opacity: 0.8,
      });
      const streamPoints = new THREE.Points(pGeo, pMat);
      group.add(streamPoints);
      disposables.push(pGeo, pMat);

      group.userData.anim = (t, delta) => {
        wheels.forEach((w) => {
          w.rotation.y += delta * 6;
        });

        const arr = pGeo.attributes.position.array;
        for (let i = 0; i < pCount; i++) {
          arr[i * 3] -= delta * 5.5;
          if (arr[i * 3] < -3) {
            arr[i * 3] = 3;
            arr[i * 3 + 1] = 0.1 + Math.random() * 0.9;
          }
        }
        pGeo.attributes.position.needsUpdate = true;
      };
    }

    // 4. Resize listener
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 5. Render loop
    let animId;
    let prevTime = performance.now();

    const loop = (now) => {
      animId = requestAnimationFrame(loop);
      const delta = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      controls.update();

      // Slow gentle orbit
      group.rotation.y += delta * 0.35;

      if (group.userData.anim) {
        group.userData.anim(now * 0.001, delta);
      }

      renderer.render(scene, camera);
    };

    loop(performance.now());

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
      disposables.forEach((d) => {
        if (d && typeof d.dispose === "function") d.dispose();
      });
    };
  }, [projectId]);

  return (
    <div className="project-3d-canvas-wrap" ref={mountRef}>
      <div className="project-3d-hud-pill">
        <span className="p3d-dot"></span>
        <span className="p3d-txt">3D WEBGL // DRAG TO ROTATE</span>
      </div>
    </div>
  );
};

export default ProjectCanvas3D;
