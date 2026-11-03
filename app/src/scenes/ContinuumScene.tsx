import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const DURATION = 24;

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRibbonTexture(kind: "city" | "network" | "data") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const random = seeded(kind === "city" ? 17 : kind === "network" ? 41 : 83);
  const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
  gradient.addColorStop(0, kind === "city" ? "#261d38" : "#041426");
  gradient.addColorStop(0.52, kind === "city" ? "#8e5d7a" : "#0b3c67");
  gradient.addColorStop(1, "#06101f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  if (kind === "city") {
    const glow = ctx.createRadialGradient(690, 170, 10, 690, 170, 330);
    glow.addColorStop(0, "rgba(255,220,183,.85)");
    glow.addColorStop(1, "rgba(255,180,140,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1024, 512);
    let x = -20;
    while (x < 1040) {
      const width = 22 + random() * 55;
      const height = 65 + random() * 230;
      const y = 500 - height;
      ctx.fillStyle = `rgba(7,16,32,${0.74 + random() * 0.22})`;
      ctx.fillRect(x, y, width, height);
      if (random() > 0.72) ctx.fillRect(x + width * 0.46, y - 65, 3, 65);
      ctx.fillStyle = "rgba(133,220,244,.58)";
      for (let wy = y + 15; wy < 485; wy += 18) {
        for (let wx = x + 8; wx < x + width - 5; wx += 13) {
          if (random() > 0.58) ctx.fillRect(wx, wy, 3, 5);
        }
      }
      x += width + 7;
    }
  } else if (kind === "network") {
    ctx.strokeStyle = "rgba(101,216,244,.24)";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath();
      ctx.ellipse(520, 270, 390, 50 + i * 15, -0.24, 0, Math.PI * 2);
      ctx.stroke();
    }
    const points = Array.from({ length: 72 }, () => ({ x: random() * 1024, y: random() * 512 }));
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      const b = points[(i * 7 + 13) % points.length];
      ctx.strokeStyle = `rgba(89,157,255,${0.08 + random() * 0.2})`;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.fillStyle = random() > 0.78 ? "#c2f6ff" : "#4c9df8";
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.5 + random() * 3, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    ctx.strokeStyle = "rgba(101,216,244,.13)";
    for (let x = 0; x < 1024; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke(); }
    for (let y = 0; y < 512; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke(); }
    for (let row = 0; row < 18; row += 1) {
      const y = 26 + row * 27;
      ctx.fillStyle = row % 3 === 0 ? "rgba(154,131,247,.75)" : "rgba(101,216,244,.48)";
      ctx.fillRect(40 + (row % 4) * 22, y, 90 + random() * 260, 3);
      ctx.fillStyle = "rgba(224,244,255,.25)";
      ctx.fillRect(420, y, 50 + random() * 310, 2);
    }
    ctx.strokeStyle = "#65d8f4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= 1024; x += 16) {
      const y = 385 + Math.sin(x * 0.025) * 32 + Math.sin(x * 0.009) * 45;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function continuumFrame(u: number) {
  const exponent = 0.58;
  const signedPower = (value: number) => Math.sign(value) * Math.pow(Math.abs(value), exponent);
  const center = new THREE.Vector3(1.36 * signedPower(Math.cos(u)), 1.25 * signedPower(Math.sin(u)), 0.46 * Math.sin(u * 2));
  const outward = new THREE.Vector3(center.x / 1.36, center.y / 1.25, 0).normalize();
  const tangent = new THREE.Vector3(
    -1.36 * exponent * Math.pow(Math.max(Math.abs(Math.cos(u)), 1e-5), exponent - 1) * Math.sin(u),
    1.25 * exponent * Math.pow(Math.max(Math.abs(Math.sin(u)), 1e-5), exponent - 1) * Math.cos(u),
    0.92 * Math.cos(u * 2)
  ).normalize();
  const binormal = new THREE.Vector3().crossVectors(tangent, outward).normalize();
  const twist = u + Math.PI * 0.2;
  const across = outward.clone().multiplyScalar(Math.cos(twist)).addScaledVector(binormal, Math.sin(twist)).normalize();
  const normal = new THREE.Vector3().crossVectors(tangent, across).normalize();
  return { center, across, normal };
}

function createContinuumGeometry() {
  const segmentsU = 256;
  const segmentsV = 28;
  const width = 1.18;
  const positions: number[] = [];
  const uvs: number[] = [];
  const buckets: number[][] = [[], [], [], []];
  const pattern = [0, 1, 0, 2, 0, 3, 0, 1, 0, 2, 0, 3];

  for (let iu = 0; iu <= segmentsU; iu += 1) {
    const u = (iu / segmentsU) * Math.PI * 2;
    const { center, across, normal } = continuumFrame(u);
    for (let iv = 0; iv <= segmentsV; iv += 1) {
      const v = (iv / segmentsV - 0.5) * width;
      const crown = Math.cos((iv / segmentsV - 0.5) * Math.PI) * 0.055;
      const point = center.clone().addScaledVector(across, v).addScaledVector(normal, crown);
      positions.push(point.x, point.y, point.z);
      uvs.push(iu / segmentsU, iv / segmentsV);
    }
  }
  for (let iu = 0; iu < segmentsU; iu += 1) {
    const material = pattern[Math.floor((iu / segmentsU) * pattern.length)];
    for (let iv = 0; iv < segmentsV; iv += 1) {
      const a = iu * (segmentsV + 1) + iv;
      const b = a + segmentsV + 1;
      buckets[material].push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const indices = buckets.flat();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  let offset = 0;
  buckets.forEach((bucket, material) => { geometry.addGroup(offset, bucket.length, material); offset += bucket.length; });
  geometry.computeVertexNormals();
  return geometry;
}

function createContinuumEdges() {
  const group = new THREE.Group();
  const material = new THREE.MeshPhysicalMaterial({ color: 0xf5f1ee, metalness: 0.64, roughness: 0.24, clearcoat: 0.8 });
  const segments = 256;
  const sides = 6;
  [-0.59, 0.59].forEach((edge) => {
    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i < segments; i += 1) {
      const { center, across, normal } = continuumFrame((i / segments) * Math.PI * 2);
      const edgeCenter = center.clone().addScaledVector(across, edge);
      for (let j = 0; j < sides; j += 1) {
        const angle = (j / sides) * Math.PI * 2;
        const point = edgeCenter.clone().addScaledVector(across, Math.cos(angle) * 0.026).addScaledVector(normal, Math.sin(angle) * 0.026);
        positions.push(point.x, point.y, point.z);
        const nextI = (i + 1) % segments;
        const nextJ = (j + 1) % sides;
        const a = i * sides + j;
        const b = nextI * sides + j;
        const c = nextI * sides + nextJ;
        const d = i * sides + nextJ;
        indices.push(a, b, d, b, c, d);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    group.add(new THREE.Mesh(geometry, material));
  });
  return { group, material };
}

function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(18,35,55,.24)");
  gradient.addColorStop(0.45, "rgba(18,35,55,.10)");
  gradient.addColorStop(1, "rgba(18,35,55,0)");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function ContinuumScene({ progress }: { progress: React.MutableRefObject<number> }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const visible = useSceneVisibility(hostRef);
  visibleRef.current = visible;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      host.style.display = "none";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(0, 0.05, 7.2);
    camera.lookAt(0, 0, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    const envMap = pmrem.fromScene(environment, 0.04).texture;
    scene.environment = envMap;

    const pearl = new THREE.MeshPhysicalMaterial({ color: 0xe9edf2, metalness: 0.82, roughness: 0.2, clearcoat: 0.75, clearcoatRoughness: 0.18, side: THREE.DoubleSide });
    const textures = [createRibbonTexture("city"), createRibbonTexture("network"), createRibbonTexture("data")];
    const imagery = textures.map((map) => new THREE.MeshPhysicalMaterial({ map, emissiveMap: map, emissive: 0x4377aa, emissiveIntensity: 0.25, metalness: 0.58, roughness: 0.3, clearcoat: 0.5, side: THREE.DoubleSide }));
    const group = new THREE.Group();
    const geometry = createContinuumGeometry();
    const ribbon = new THREE.Mesh(geometry, [pearl, ...imagery]);
    const edges = createContinuumEdges();
    group.add(ribbon, edges.group);
    group.rotation.set(0.28, -0.22, -0.15);
    group.scale.set(1.12, 1.12, 1.12);
    scene.add(group);

    const shadowTexture = createShadowTexture();
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 4.8), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.8 }));
    shadow.position.set(0.35, -0.35, -1.6);
    scene.add(shadow);
    scene.add(new THREE.HemisphereLight(0xf5f7ff, 0x33445c, 2.2));
    const key = new THREE.DirectionalLight(0xfff0df, 4.2); key.position.set(-3, 5, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(0x8fdfff, 2.1); fill.position.set(5, -1, 4); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xb19aff, 2.4); rim.position.set(1, 3, -4); scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let seekTime: number | null = null;
    let firstFrame = true;
    const start = performance.now();
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visibleRef.current || document.hidden) return;
      const time = seekTime ?? ((now - start) / 1000) % DURATION;
      const phase = (time / DURATION) * Math.PI * 2;
      if (!reduceMotion || seekTime !== null || firstFrame) {
        group.rotation.y += ((-0.22 + pointer.x * 0.09 + Math.sin(phase) * 0.035) - group.rotation.y) * 0.045;
        group.rotation.x += ((0.28 - pointer.y * 0.045 + Math.cos(phase) * 0.022) - group.rotation.x) * 0.045;
        group.rotation.z = -0.15 + Math.sin(phase) * 0.025;
        group.position.y = Math.sin(phase) * 0.055 + progress.current * 0.35;
        const scale = 1.12 * (1 - progress.current * 0.08);
        group.scale.setScalar(scale);
        textures.forEach((texture, index) => { texture.offset.x = (time / DURATION + index * 0.17) % 1; });
        renderer.render(scene, camera);
        firstFrame = false;
        const target = window as unknown as { __SCENE_READY__?: boolean };
        target.__SCENE_READY__ = true;
      }
    };
    (window as unknown as { __seek?: (time: number) => void }).__seek = (time: number) => {
      seekTime = time;
      const phase = (time / DURATION) * Math.PI * 2;
      group.rotation.set(0.28 - pointer.y * 0.045 + Math.cos(phase) * 0.022, -0.22 + pointer.x * 0.09 + Math.sin(phase) * 0.035, -0.15 + Math.sin(phase) * 0.025);
      group.position.y = Math.sin(phase) * 0.055 + progress.current * 0.35;
      group.scale.setScalar(1.12 * (1 - progress.current * 0.08));
      textures.forEach((texture, index) => { texture.offset.x = (time / DURATION + index * 0.17) % 1; });
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose(); pearl.dispose(); imagery.forEach((material) => material.dispose()); textures.forEach((texture) => texture.dispose());
      edges.group.children.forEach((child) => { if (child instanceof THREE.Mesh) child.geometry.dispose(); });
      edges.material.dispose();
      shadow.geometry.dispose(); (shadow.material as THREE.Material).dispose(); shadowTexture.dispose();
      envMap.dispose(); pmrem.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [progress]);

  return <div ref={hostRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
