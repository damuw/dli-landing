import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const NODE_COUNT = 32;
const palette = [0x65d8f4, 0x9a83f7, 0x3d7df2, 0xa9eaf6];

function targetPosition(index: number, mode: number, target: THREE.Vector3) {
  const ring = index % 3;
  const angle = (index / NODE_COUNT) * Math.PI * 2 * (mode === 1 ? 2 : 1) + ring * 0.35;
  const radius = 2.15 + ring * 0.55 - (mode === 2 ? (index % 4) * 0.12 : 0);
  if (mode === 2) {
    const lane = (index % 4) - 1.5;
    target.set(Math.cos(angle) * radius * 0.9, lane * 0.62 + Math.sin(angle * 2) * 0.28, Math.sin(angle) * radius * 0.62);
  } else if (mode === 3) {
    target.set(Math.cos(angle) * radius, Math.sin(angle * 0.5) * 1.2, Math.sin(angle) * radius * 0.72);
  } else {
    target.set(Math.cos(angle) * radius, Math.sin(angle * 2 + mode) * (0.8 + ring * 0.22), Math.sin(angle) * radius * 0.7);
  }
  return target;
}

export function ArchitectureScene({ mode }: { mode: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef(mode);
  const visibleRef = useRef(true);
  modeRef.current = mode;
  const visible = useSceneVisibility(hostRef);
  visibleRef.current = visible;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); }
    catch { host.style.display = "none"; return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.6, 7.2);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0x9edfff, 0x081729, 2.4));
    const key = new THREE.DirectionalLight(0xd9f7ff, 3.5); key.position.set(-3, 4, 6); scene.add(key);
    const fill = new THREE.DirectionalLight(0x9a83f7, 2); fill.position.set(4, -2, 3); scene.add(fill);

    const group = new THREE.Group(); scene.add(group);
    const coreMaterial = new THREE.MeshPhysicalMaterial({ color: 0x65d8f4, emissive: 0x1d6a91, emissiveIntensity: 1.2, metalness: 0.7, roughness: 0.22 });
    const core = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.075, 16, 96), coreMaterial); group.add(core);
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.018, 8, 96), new THREE.MeshBasicMaterial({ color: 0x9a83f7, transparent: true, opacity: 0.65 }));
    orbit.rotation.x = Math.PI * 0.46; orbit.rotation.y = Math.PI * 0.2; group.add(orbit);
    const center = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 2), new THREE.MeshPhysicalMaterial({ color: 0x132c46, emissive: 0x164d73, emissiveIntensity: 0.8, metalness: 0.55, roughness: 0.28, wireframe: true })); group.add(center);

    const nodeGeometry = new THREE.IcosahedronGeometry(0.075, 1);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x65d8f4 });
    const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, NODE_COUNT); group.add(nodes);
    const current = Array.from({ length: NODE_COUNT }, () => new THREE.Vector3());
    const desired = new THREE.Vector3();
    const matrix = new THREE.Matrix4();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    for (let i = 0; i < NODE_COUNT; i += 1) targetPosition(i, 0, current[i]);

    const linePositions = new Float32Array(NODE_COUNT * 6 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3d7df2, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial); group.add(lines);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const start = performance.now();
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visibleRef.current || document.hidden) return;
      const time = reduce ? 0 : (now - start) / 1000;
      const activeMode = modeRef.current;
      coreMaterial.color.setHex(palette[activeMode]); lineMaterial.color.setHex(palette[activeMode]);
      let cursor = 0;
      for (let i = 0; i < NODE_COUNT; i += 1) {
        targetPosition(i, activeMode, desired);
        current[i].lerp(desired, reduce ? 1 : 0.045);
        const pulse = 0.85 + Math.sin(time * 1.4 + i * 0.7) * 0.18;
        scale.setScalar(pulse * (i % 5 === activeMode ? 1.8 : 1));
        matrix.compose(current[i], quaternion, scale); nodes.setMatrixAt(i, matrix);
        linePositions[cursor++] = 0; linePositions[cursor++] = 0; linePositions[cursor++] = 0;
        linePositions[cursor++] = current[i].x; linePositions[cursor++] = current[i].y; linePositions[cursor++] = current[i].z;
        const next = current[(i + 1) % NODE_COUNT];
        linePositions[cursor++] = current[i].x; linePositions[cursor++] = current[i].y; linePositions[cursor++] = current[i].z;
        linePositions[cursor++] = next.x; linePositions[cursor++] = next.y; linePositions[cursor++] = next.z;
      }
      nodes.instanceMatrix.needsUpdate = true; lineGeometry.attributes.position.needsUpdate = true;
      group.rotation.y = time * 0.075; group.rotation.x = Math.sin(time * 0.18) * 0.09;
      core.rotation.z = time * 0.16; orbit.rotation.z = -time * 0.1; center.rotation.y = time * 0.22;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf); observer.disconnect();
      core.geometry.dispose(); coreMaterial.dispose(); orbit.geometry.dispose(); (orbit.material as THREE.Material).dispose();
      center.geometry.dispose(); (center.material as THREE.Material).dispose(); nodeGeometry.dispose(); nodeMaterial.dispose(); lineGeometry.dispose(); lineMaterial.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
