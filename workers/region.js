/**
 * DLI region resolver — served at /region.js on deeplearningintelligence.com.
 *
 * The page loads this synchronously in <head>. It sets window.DLI_REGION before
 * the Design Component renders, so regional copy appears on first paint with no
 * flash and no client-side geolocation prompt.
 *
 * Priority: explicit ?region= override > known bot (UAE default) > country map.
 * No IP address is logged or stored.
 */

const GCC = new Set(["SA", "QA", "KW", "BH", "OM"]);
const ALLOWED = new Set(["ae", "gcc", "us", "global"]);
const BOT =
  /(googlebot|bingbot|duckduckbot|yandexbot|baiduspider|applebot|gptbot|oai-searchbot|claudebot|claude-searchbot|perplexitybot)/i;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const forced = (url.searchParams.get("region") || "").toLowerCase();
    const country = (request.cf && request.cf.country) || "AE";
    const ua = request.headers.get("user-agent") || "";

    let region = "ae";
    if (ALLOWED.has(forced)) region = forced;
    else if (BOT.test(ua)) region = "ae";
    else if (country === "AE") region = "ae";
    else if (GCC.has(country)) region = "gcc";
    else if (country === "US") region = "us";
    else region = "global";

    return new Response(
      `window.DLI_REGION=${JSON.stringify(region)};window.DLI_REGION_SOURCE="edge";`,
      {
        headers: {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store, max-age=0",
          "x-content-type-options": "nosniff",
          "x-dli-region": region
        }
      }
    );
  }
};
