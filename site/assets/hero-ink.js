/* ==========================================================================
   DLI living ink — a small metaball field behind the Continuum loop.
   Inspired by the organic ink silhouette treatment, rebuilt dependency-free
   as a single WebGL pass. Tune or disable via window.DLI_INK.
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.DLI_INK || {};
  if (cfg.enabled === false) return;

  var NUM = Math.max(8, Math.min(36, cfg.balls || 20));
  var OPACITY = typeof cfg.opacity === "number" ? cfg.opacity : 0.9;
  var canvas = null, gl = null, program = null, buffer = null;
  var uRes = null, uTime = null, uBalls = null;
  var balls = [], flat = new Float32Array(NUM * 3);
  var raf = 0, last = 0, visible = true, reduced = false;

  var VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 u_res;",
    "uniform float u_time;",
    "uniform vec3 u_balls[" + NUM + "];",
    "void main() {",
    "  vec2 p = gl_FragCoord.xy / u_res;",
    "  p = p * 2.0 - 1.0;",
    "  p.x *= u_res.x / max(u_res.y, 1.0);",
    "  float v = 0.0;",
    "  for (int i = 0; i < " + NUM + "; i++) {",
    "    vec2 d = p - u_balls[i].xy;",
    "    float r = u_balls[i].z;",
    "    v += (r * r) / (dot(d, d) + 0.0008);",
    "  }",
    "  float a = smoothstep(1.38, 1.44, v);",
    "  float rim = smoothstep(1.18, 1.38, v) * (1.0 - smoothstep(1.38, 1.62, v));",
    "  vec3 col = vec3(0.010, 0.018, 0.038) + vec3(0.035, 0.15, 0.23) * rim * 0.55;",
    "  gl_FragColor = vec4(col, a * " + OPACITY.toFixed(2) + ");",
    "}"
  ].join("\n");

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      if (window.console) console.warn("DLI ink shader:", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function initGL() {
    gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) { canvas.style.display = "none"; return false; }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (window.console) console.warn("DLI ink link:", gl.getProgramInfoLog(program));
      return false;
    }
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uRes = gl.getUniformLocation(program, "u_res");
    uTime = gl.getUniformLocation(program, "u_time");
    uBalls = gl.getUniformLocation(program, "u_balls") || gl.getUniformLocation(program, "u_balls[0]");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    seed();
    fill();
    resize();
    return true;
  }

  function seed() {
    balls = [];
    for (var i = 0; i < NUM; i++) {
      var a = Math.random() * Math.PI * 2;
      var r = Math.random() * 0.5;
      balls.push({
        x: Math.cos(a) * r,
        y: Math.sin(a) * r * 0.72,
        r: 0.24 + Math.random() * 0.16,
        tx: 0, ty: 0, vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function fill() {
    for (var i = 0; i < balls.length; i++) {
      flat[i * 3] = balls[i].x;
      flat[i * 3 + 1] = balls[i].y;
      flat[i * 3 + 2] = balls[i].r;
    }
  }

  function resize() {
    if (!canvas || !gl) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }

  function draw() {
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, last * 0.001);
    gl.uniform3fv(uBalls, flat);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function step(t) {
    var dt = Math.min(32, t - (last || t));
    last = t;
    var time = t * 0.001;
    for (var i = 0; i < balls.length; i++) {
      var b = balls[i];
      b.tx = Math.cos(time * 0.00022 + b.phase) * (0.42 + 0.18 * Math.sin(b.phase * 3));
      b.ty = Math.sin(time * 0.00018 + b.phase * 1.7) * (0.34 + 0.14 * Math.cos(b.phase * 2));
      var ax = (b.tx - b.x) * 0.0016;
      var ay = (b.ty - b.y) * 0.0016;
      b.vx = (b.vx + ax * dt) * 0.965;
      b.vy = (b.vy + ay * dt) * 0.965;
      b.x += b.vx * dt * 0.05;
      b.y += b.vy * dt * 0.05;
    }
    fill();
    draw();
    raf = visible && !reduced ? requestAnimationFrame(step) : 0;
  }

  function start() {
    if (!gl || raf || reduced) return;
    last = 0;
    raf = requestAnimationFrame(step);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function attach() {
    var c = document.querySelector(".hero-ink");
    if (!c) return;
    if (c === canvas) { resize(); return; }
    stop();
    canvas = c;
    if (!initGL()) return;
    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced = mq.matches || document.documentElement.classList.contains("a11y-reduce-motion");
    if (reduced) { draw(); } else {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible) start(); else stop();
        }, { threshold: 0 }).observe(canvas);
      }
      start();
    }
    var syncMotion = function () {
      var next = mq.matches || document.documentElement.classList.contains("a11y-reduce-motion");
      if (next === reduced) return;
      reduced = next;
      if (reduced) { stop(); draw(); } else { start(); }
    };
    if (mq.addEventListener) mq.addEventListener("change", syncMotion);
    new MutationObserver(syncMotion).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }

  attach();
  if (document.body) {
    var mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
  }
  setInterval(attach, 1200);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });
})();
