/* ==========================================================================
   DLI site UI: cookie consent + accessibility menu
   Self-contained, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var CONSENT_KEY = "dli_cookie_consent";
  var A11Y_KEY = "dli_a11y";
  function readStore(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* storage may be unavailable */
    }
  }

  function cookieValue(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=" + days * 86400 + "; Path=/; SameSite=Lax" + secure;
  }

  /* ---------------------------------------------------------------- consent */
  function hasConsent() {
    var stored = readStore(CONSENT_KEY);
    if (stored) {
      try {
        return !!JSON.parse(stored).accepted;
      } catch (e) {
        return stored === "accepted" || stored === "1";
      }
    }
    return cookieValue("dli_consent") === "1";
  }

  function saveConsent() {
    var payload = JSON.stringify({ accepted: true, at: new Date().toISOString() });
    writeStore(CONSENT_KEY, payload);
    setCookie("dli_consent", "1", 365);
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "dli_consent_accept" });
    } catch (e) {
      /* ignore analytics */
    }
  }

  function buildConsent() {
    if (hasConsent()) return;

    var wrap = document.createElement("div");
    wrap.className = "dli-consent";
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "Cookie notice");

    var inner = document.createElement("div");
    inner.className = "dli-consent__inner";

    var eyebrow = document.createElement("p");
    eyebrow.className = "dli-consent__eyebrow";
    eyebrow.textContent = "Privacy";

    var text = document.createElement("p");
    text.className = "dli-consent__text";
    text.innerHTML = 'We value your privacy. We use cookies to keep the site working and remember your preferences. With your consent we also measure how it is used to improve the product. Read our <a href="/privacy/">privacy policy</a>.';

    var actions = document.createElement("div");
    actions.className = "dli-consent__actions";

    var accept = document.createElement("button");
    accept.type = "button";
    accept.className = "dli-consent__accept";
    accept.textContent = "Accept";

    var link = document.createElement("a");
    link.className = "dli-consent__link";
    link.href = "/privacy/";
    link.textContent = "Privacy policy";

    actions.appendChild(accept);
    actions.appendChild(link);
    inner.appendChild(eyebrow);
    inner.appendChild(text);
    inner.appendChild(actions);
    wrap.appendChild(inner);
    document.body.appendChild(wrap);

    requestAnimationFrame(function () {
      wrap.classList.add("is-visible");
      document.documentElement.classList.add("has-consent");
      var syncHeight = function () {
        document.documentElement.style.setProperty("--consent-h", wrap.offsetHeight + "px");
      };
      syncHeight();
      window.addEventListener("resize", syncHeight);
    });

    accept.addEventListener("click", function () {
      saveConsent();
      document.documentElement.classList.remove("has-consent");
      document.documentElement.style.removeProperty("--consent-h");
      wrap.classList.remove("is-visible");
      wrap.classList.add("is-hiding");
      window.setTimeout(function () {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }, 500);
    });
  }

  /* ------------------------------------------------------------ accessibility */
  var DEFAULTS = { text: 0, contrast: false, motion: false, underline: false };

  function readA11y() {
    var raw = readStore(A11Y_KEY);
    if (!raw) return Object.assign({}, DEFAULTS);
    try {
      return Object.assign({}, DEFAULTS, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function applyA11y(prefs) {
    var root = document.documentElement;
    root.classList.toggle("a11y-text-1", prefs.text === 1);
    root.classList.toggle("a11y-text-2", prefs.text === 2);
    root.classList.toggle("a11y-contrast", !!prefs.contrast);
    root.classList.toggle("a11y-reduce-motion", !!prefs.motion);
    root.classList.toggle("a11y-underline", !!prefs.underline);
  }

  function buildA11y() {
    var prefs = readA11y();
    applyA11y(prefs);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "dli-a11y-btn";
    button.setAttribute("aria-label", "Accessibility menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="4.2" r="1.7" fill="currentColor" stroke="none"></circle>' +
      '<path d="M3.8 8.4c2.6.9 5.3 1.35 8.2 1.35s5.6-.45 8.2-1.35"></path>' +
      '<path d="M12 9.7v4.1"></path><path d="M12 13.8 8.6 20.4"></path><path d="M12 13.8l3.4 6.6"></path>' +
      "</svg>";

    var panel = document.createElement("div");
    panel.className = "dli-a11y-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Accessibility options");
    panel.innerHTML =
      '<div class="dli-a11y-panel__head"><p class="dli-a11y-panel__title">Accessibility</p>' +
      '<button type="button" class="dli-a11y-close" aria-label="Close accessibility menu">✕</button></div>' +
      '<div class="dli-a11y-group"><span class="dli-a11y-label">Text size</span><div class="dli-a11y-row">' +
      '<button type="button" class="dli-a11y-opt" data-text="0">Default</button>' +
      '<button type="button" class="dli-a11y-opt" data-text="1">Large</button>' +
      '<button type="button" class="dli-a11y-opt" data-text="2">Larger</button></div></div>' +
      '<div class="dli-a11y-group">' +
      '<button type="button" class="dli-a11y-toggle" data-toggle="contrast" aria-pressed="false">High contrast <span class="dli-a11y-toggle__state">Off</span></button>' +
      '<button type="button" class="dli-a11y-toggle" data-toggle="motion" aria-pressed="false">Reduce motion <span class="dli-a11y-toggle__state">Off</span></button>' +
      '<button type="button" class="dli-a11y-toggle" data-toggle="underline" aria-pressed="false">Underline links <span class="dli-a11y-toggle__state">Off</span></button>' +
      "</div>" +
      '<button type="button" class="dli-a11y-reset">Reset preferences</button>';

    document.body.appendChild(button);
    document.body.appendChild(panel);

    function sync() {
      applyA11y(prefs);
      writeStore(A11Y_KEY, JSON.stringify(prefs));
      panel.querySelectorAll("[data-text]").forEach(function (opt) {
        opt.setAttribute("aria-pressed", String(Number(opt.getAttribute("data-text")) === prefs.text));
      });
      panel.querySelectorAll("[data-toggle]").forEach(function (toggle) {
        var key = toggle.getAttribute("data-toggle");
        var on = !!prefs[key];
        toggle.setAttribute("aria-pressed", String(on));
        var state = toggle.querySelector(".dli-a11y-toggle__state");
        if (state) state.textContent = on ? "On" : "Off";
      });
    }

    function open() {
      panel.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      var first = panel.querySelector(".dli-a11y-close");
      if (first) first.focus();
    }
    function close() {
      panel.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.focus();
    }

    button.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) close();
      else open();
    });

    document.addEventListener("click", function (e) {
      var trigger = e.target && e.target.closest ? e.target.closest("[data-a11y-open]") : null;
      if (!trigger) return;
      e.preventDefault();
      open();
    });
    panel.querySelector(".dli-a11y-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) close();
    });
    document.addEventListener("click", function (e) {
      if (!panel.classList.contains("is-open")) return;
      if (panel.contains(e.target) || button.contains(e.target)) return;
      close();
    });

    panel.querySelectorAll("[data-text]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        prefs.text = Number(opt.getAttribute("data-text"));
        sync();
      });
    });
    panel.querySelectorAll("[data-toggle]").forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var key = toggle.getAttribute("data-toggle");
        prefs[key] = !prefs[key];
        sync();
      });
    });
    panel.querySelector(".dli-a11y-reset").addEventListener("click", function () {
      prefs = Object.assign({}, DEFAULTS);
      sync();
    });

    sync();
  }

  function init() {
    if (location.search.indexOf("reset-consent") >= 0) {
      try {
        window.localStorage.removeItem(CONSENT_KEY);
      } catch (e) {}
      document.cookie = "dli_consent=; Max-Age=0; Path=/";
    }
    buildConsent();
    buildA11y();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
