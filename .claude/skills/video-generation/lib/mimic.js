/**
 * Adapt a Style Blueprint to a new topic/brand: build per-shot generation prompts
 * that keep the reference's structure and pacing but not its footage.
 */

import { parseBlueprint } from "./blueprint.js";

export function buildShotPrompts(blueprint, { topic, brand = "", style = "" } = {}) {
  const bp = parseBlueprint(blueprint);
  if (!topic || !topic.trim()) throw new Error("A --topic is required to mimic a blueprint.");
  const last = bp.shots.length - 1;
  return bp.shots.map((s, i) => {
    const role = i === 0 ? "Attention-grabbing hook" : i === last ? "Closing shot with call to action" : "Supporting shot";
    const dur = Math.round((s.endSec - s.startSec) * 10) / 10;
    const parts = [
      `${role} for a ${bp.aspect} short-form video about ${topic.trim()}.`,
      s.description && `Match the composition of the reference: ${s.description}.`,
      brand && `Brand: ${brand}.`,
      style && `Style: ${style}.`,
      `Duration about ${dur}s.`,
    ];
    return { index: s.index ?? i, durationSec: dur, prompt: parts.filter(Boolean).join(" ") };
  });
}
