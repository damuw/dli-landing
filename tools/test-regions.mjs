import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const R = require("../site/assets/regions.js");

const AS_OF = Date.parse("2026-11-05T00:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

for (const id of ["ae", "gcc", "us", "global"]) {
  const region = R.REGIONS[id];
  assert.ok(region, `${id}: region exists`);
  assert.ok(region.signals.length >= 2, `${id}: at least 2 current signals`);
  for (const s of region.signals) {
    assert.ok(s.publishedAt, `${id}: publishedAt`);
    assert.ok(Date.parse(s.publishedAt) <= AS_OF, `${id}: not future-dated`);
    assert.ok(AS_OF - Date.parse(s.publishedAt) <= R.MAX_AGE_DAYS * DAY, `${id}: ${s.title} is older than 120 days at release`);
    assert.ok(s.title && s.lead && s.sources.length, `${id}: complete signal`);
  }
  const filtered = R.filterSignals(region.signals, AS_OF);
  assert.equal(filtered.length, region.signals.length, `${id}: all current cards pass the filter`);
}

const old = { publishedAt: "2025-05-22", title: "Stargate UAE" };
const fresh = { publishedAt: "2026-10-30", title: "UAE lab" };
assert.deepEqual(R.filterSignals([old, fresh], AS_OF).map((s) => s.title), ["UAE lab"]);
assert.equal(R.filterSignals([old], AS_OF).length, 0);
assert.equal(R.filterSignals([fresh], AS_OF).length, 1);
assert.equal(R.filterSignals([], AS_OF).length, 0);

// After 120 days the same cards must age out; the page then shows the archive fallback.
const later = AS_OF + 121 * DAY;
assert.equal(R.filterSignals([fresh], later).length, 0);

console.log("region tests: current cards are recent; 120-day filter ages them out");
