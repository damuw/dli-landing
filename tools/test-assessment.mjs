import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const A = require("../site/assets/assessment.js");

const ids = ["mandate", "data", "hosting", "autonomy", "integration", "controls", "baseline", "timeframe"];

for (const seg of ["government", "enterprise", "capital"]) {
  const qs = A.questions(seg);
  assert.equal(qs.length, 8, `${seg}: 8 questions`);
  assert.equal(qs[0].id, "mandate", `${seg}: mandate first`);
  assert.ok(qs.every((q) => q.opts.length >= 4), `${seg}: every question has 4+ options`);
  assert.ok(qs.every((q) => q.opts.every((o) => o.score >= 0 && o.score <= 3)), `${seg}: scores 0-3`);
  assert.ok(A.segment(seg).plan.length === 3, `${seg}: 3-phase plan`);
}

const allLow = Object.fromEntries(ids.map((id) => [id, 0]));
const low = A.score(allLow);
assert.equal(low.answered, 8);
assert.equal(low.avg, 0);
assert.equal(low.band.key, "early");
assert.equal(low.dims.length, 8);
assert.equal(A.gaps(allLow).length, 5);
assert.ok(A.gaps(allLow).every((g) => g.severity === "High"));

const allHigh = Object.fromEntries(ids.map((id) => [id, 3]));
const high = A.score(allHigh);
assert.equal(high.avg, 3);
assert.equal(high.band.key, "advanced");
const highGaps = A.gaps(allHigh);
assert.equal(highGaps.length, 3);
assert.equal(highGaps[0].id, "scale");

const mixed = { mandate: 2, data: 0, hosting: 1, autonomy: 1, integration: 2, controls: 0, baseline: 2, timeframe: 1 };
const ms = A.score(mixed);
assert.ok(ms.avg > 0 && ms.avg < 3);
const mg = A.gaps(mixed);
assert.ok(mg.length <= 5 && mg.length >= 3);
assert.ok(mg[0].value <= mg[mg.length - 1].value, "gaps ascending by score");
assert.ok(mg.every((g) => g.title && g.next && g.artifact), "gaps are actionable");

const sum = A.summary(mixed, "government");
assert.equal(sum.segment, "government");
assert.equal(sum.dimensions.length, 8);
assert.ok(sum.profileNote.length > 10);
assert.equal(sum.band.key, A.score(mixed).band.key);
assert.equal(sum.nextSteps.length, 3);

// Partial answers must not throw or inflate the profile.
const partial = A.score({ mandate: 3 });
assert.equal(partial.dims.length, 8);
assert.equal(partial.dims[1].value, 0);

// Unknown segment falls back to enterprise.
assert.equal(A.segment("nope").id, "enterprise");

console.log("assessment tests: 18 assertions passed");
