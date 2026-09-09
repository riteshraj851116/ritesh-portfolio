import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function KentaCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060506, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 19);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Optical Lighting for obsidian crystal refraction
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe0f0ff, 3.5);
    keyLight.position.set(12, 16, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xaaccff, 2.0);
    rimLight.position.set(-15, -12, -6);
    scene.add(rimLight);

    const specularGlance = new THREE.PointLight(0xffffff, 2.2, 30);
    specularGlance.position.set(0, 4, 8);
    scene.add(specularGlance);

    // Glass Shards Group
    const shardsGroup = new THREE.Group();
    scene.add(shardsGroup);

    // Kenta Toshikura style dark refractive obsidian glass material
    const obsidianGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x141418,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.82,
      thickness: 1.8,
      ior: 1.6,
      specularIntensity: 1.2,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Sharp chromatic edge outline
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x6688aa,
      transparent: true,
      opacity: 0.25,
    });

    // Geometries: Slender elongated prisms, octahedrons, faceted diamonds
    const geometries = [
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.TetrahedronGeometry(1.2, 0),
      new THREE.IcosahedronGeometry(0.95, 0),
      new THREE.ConeGeometry(0.7, 2.8, 4),
      new THREE.CylinderGeometry(0.1, 0.8, 3.0, 4),
    ];

    const shards = [];
    const shardCount = 28;

    for (let i = 0; i < shardCount; i++) {
      const geom = geometries[i % geometries.length];
      const mesh = new THREE.Mesh(geom, obsidianGlassMat);

      // Add wireframe / edge geometry for refractive facet lines
      const wireGeom = new THREE.WireframeGeometry(geom);
      const wire = new THREE.LineSegments(wireGeom, edgeMaterial);
      mesh.add(wire);

      // Scatter outward around the edges (leaving center clearer for typography)
      const angle = (i / shardCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const radius = 6.5 + Math.random() * 8.5; // push away from center

      const posX = Math.cos(angle) * radius;
      const posY = (Math.random() - 0.5) * 22;
      const posZ = (Math.random() - 0.5) * 12 - 2;

      mesh.position.set(posX, posY, posZ);

      // Elongated scale for sharp glass shards
      const scaleBase = 0.5 + Math.random() * 0.7;
      mesh.scale.set(
        scaleBase * (0.6 + Math.random() * 0.5),
        scaleBase * (1.2 + Math.random() * 2.0),
        scaleBase * (0.5 + Math.random() * 0.5)
      );

      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const rotSpeed = {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.0025,
      };

      shardsGroup.add(mesh);
      shards.push({ mesh, rotSpeed, basePos: mesh.position.clone() });
    }

    // Micro dust / film scratches
    const dustCount = 220;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 32;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 32;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xbbddff,
      size: 0.05,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // Mouse & Scroll interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // RAF Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia lerp
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      shardsGroup.rotation.y = mouseX * 0.18;
      shardsGroup.rotation.x = -mouseY * 0.12;
      shardsGroup.position.y = (scrollY * 0.0025) % 12;

      // Shards slow tumble
      shards.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;

        item.mesh.position.y =
          item.basePos.y + Math.sin(elapsedTime * 0.5 + idx * 0.4) * 0.3;
      });

      // Dust slow float
      dust.rotation.y = elapsedTime * 0.01;
      dust.rotation.x = mouseX * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="js-back"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "#060506",
      }}
    />
  );
}
