import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  varying float vHeight;
  varying float vDepth;
  void main() {
    vec3 p = position;
    float phase = uTime * 0.2617993878;
    p.y = sin(p.x * 0.72 + phase) * 0.65 + cos(p.z * 1.05 - phase) * 0.35 + sin((p.x + p.z) * 0.42 + phase) * 0.32;
    p.y += sin(p.x * 1.7 - phase * 2.0) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (32.0 / -mv.z);
    vHeight = p.y;
    vDepth = clamp((-mv.z - 3.0) / 10.0, 0.0, 1.0);
  }
`;

const fragmentShader = `
  varying float vHeight;
  varying float vDepth;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, d) * (1.0 - vDepth * 0.65);
    vec3 cyan = vec3(0.396, 0.847, 0.957);
    vec3 violet = vec3(0.604, 0.514, 0.969);
    vec3 color = mix(cyan, violet, smoothstep(-0.6, 0.8, vHeight));
    gl_FragColor = vec4(color, alpha * 0.82);
  }
`;

export function ParticleWave() {
  const hostRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const visible = useSceneVisibility(hostRef);
  visibleRef.current = visible;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" }); }
    catch { host.style.display = "none"; return; }
    const pixelRatio = Math.min(window.devicePixelRatio, 1.35);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 2.7, 6.8);
    camera.lookAt(0, -0.2, -1.2);

    const columns = window.innerWidth < 768 ? 72 : 124;
    const rows = window.innerWidth < 768 ? 30 : 48;
    const positions = new Float32Array(columns * rows * 3);
    const scales = new Float32Array(columns * rows);
    let index = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        positions[index * 3] = (column / (columns - 1) - 0.5) * 15;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = (row / (rows - 1) - 0.5) * 9 - 1.4;
        scales[index] = 1.2 + ((column * 17 + row * 31) % 11) / 10;
        index += 1;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    const uniforms = { uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } };
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geometry, material);
    points.position.x = window.innerWidth < 768 ? 1.2 : 2.4;
    points.rotation.z = -0.08;
    scene.add(points);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
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
      if (!reduce) uniforms.uTime.value = (now - start) / 1000;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 pointer-events-none opacity-90" aria-hidden="true" />;
}
