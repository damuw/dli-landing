/* ==========================================================================
   DLI hero window hover — apply the same push-in/brighten to a single world
   when the pointer is inside its actual mask, not the whole hero rectangle.
   Mask alpha is sampled from the four cached window plates.
   ========================================================================== */
(function () {
  "use strict";

  var names = ["city", "globe", "wave", "code"];
  var masks = {};
  var current = null;
  var last = null;
  var ticking = false;

  function clear() {
    current = null;
    var lit = document.querySelectorAll(".hero-ap-world.is-hovered");
    for (var i = 0; i < lit.length; i++) lit[i].classList.remove("is-hovered");
  }

  function apply(name) {
    if (name === current) return;
    clear();
    if (!name) return;
    var el = document.querySelector(".hero-ap-world--" + name);
    if (!el) return;
    el.classList.add("is-hovered");
    current = name;
  }

  function hit(clientX, clientY) {
    var art = document.querySelector(".hero-live-art");
    if (!art) return null;
    var rect = art.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return null;
    var x = (clientX - rect.left) / rect.width;
    var y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;

    var best = null;
    var bestAlpha = 96;
    for (var k = 0; k < names.length; k++) {
      var mask = masks[names[k]];
      if (!mask) continue;
      var px = Math.min(mask.w - 1, Math.max(0, Math.round(x * (mask.w - 1))));
      var py = Math.min(mask.h - 1, Math.max(0, Math.round(y * (mask.h - 1))));
      var alpha = mask.a[py * mask.w + px];
      if (alpha > bestAlpha) {
        bestAlpha = alpha;
        best = names[k];
      }
    }
    return best;
  }

  function process() {
    ticking = false;
    if (!last) return;
    var event = last;
    last = null;
    if (!document.documentElement.classList.contains("hero-aperture") ||
        !document.documentElement.classList.contains("hero-ready")) {
      clear();
      return;
    }
    apply(hit(event.clientX, event.clientY));
  }

  function onMove(event) {
    if (event.pointerType && event.pointerType !== "mouse") return;
    last = event;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(process);
    }
  }

  function loadMasks() {
    for (var i = 0; i < names.length; i++) {
      (function (name) {
        var img = new Image();
        img.decoding = "async";
        img.onload = function () {
          try {
            var canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var context = canvas.getContext("2d", { willReadFrequently: true });
            context.drawImage(img, 0, 0);
            var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            var alpha = new Uint8Array(canvas.width * canvas.height);
            for (var p = 0, q = 3; p < alpha.length; p++, q += 4) alpha[p] = data[q];
            masks[name] = { w: canvas.width, h: canvas.height, a: alpha };
          } catch (error) {
            /* Canvas unavailable or blocked: hover stays off. */
          }
        };
        img.src = "/assets/continuum-ap-" + name + ".png?v=1";
      })(names[i]);
    }
  }

  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", clear);
  document.addEventListener("pointerout", function (event) {
    if (!event.relatedTarget) clear();
  });
  window.addEventListener("blur", clear);
  window.addEventListener("scroll", clear, { passive: true });
  loadMasks();
})();
