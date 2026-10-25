/**
 * Style Blueprint: a structured description of a reference video's style
 * (hook, shots, pacing, captions, audio, CTA) that /clipmimic:mimic adapts to a new topic.
 */

export const BLUEPRINT_VERSION = "1.0";

export function createBlueprint(partial = {}) {
  return {
    schemaVersion: BLUEPRINT_VERSION,
    source: null,
    durationSec: 0,
    aspect: "9:16",
    hook: { text: "", endSec: 3 },
    shots: [],
    pacing: { shotCount: 0, avgShotSec: 0, cutsPerMinute: 0 },
    captions: { present: false, style: "" },
    audio: { hasSpeech: false, transcript: "", music: "" },
    cta: "",
    ...partial,
  };
}

export function validateBlueprint(bp) {
  const errors = [];
  if (!bp || typeof bp !== "object") return ["Blueprint must be an object."];
  if (bp.schemaVersion !== BLUEPRINT_VERSION) {
    errors.push(`schemaVersion must be "${BLUEPRINT_VERSION}"`);
  }
  if (typeof bp.durationSec !== "number" || bp.durationSec <= 0) errors.push("durationSec must be a positive number");
  if (!Array.isArray(bp.shots) || bp.shots.length === 0) errors.push("shots must be a non-empty array");
  else {
    bp.shots.forEach((s, i) => {
      if (typeof s.startSec !== "number" || typeof s.endSec !== "number" || s.endSec <= s.startSec) {
        errors.push(`shots[${i}] needs startSec < endSec`);
      }
    });
  }
  if (!bp.pacing || typeof bp.pacing !== "object") errors.push("pacing is required");
  return errors;
}

export function parseBlueprint(json) {
  const bp = typeof json === "string" ? JSON.parse(json) : json;
  const errors = validateBlueprint(bp);
  if (errors.length) throw new Error(`Invalid blueprint: ${errors.join("; ")}`);
  return bp;
}

/** Compute pacing stats from shots + total duration. */
export function computePacing(shots, durationSec) {
  const shotCount = shots.length;
  const avgShotSec = shotCount ? durationSec / shotCount : 0;
  const cutsPerMinute = durationSec ? ((shotCount - 1) / durationSec) * 60 : 0;
  const r = (n) => Math.round(n * 100) / 100;
  return { shotCount, avgShotSec: r(avgShotSec), cutsPerMinute: r(Math.max(0, cutsPerMinute)) };
}
