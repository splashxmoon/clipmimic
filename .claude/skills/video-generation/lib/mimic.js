/**
 * Adapt a Style Blueprint to a new topic/brand: build per-shot generation prompts
 * that keep the reference's structure and pacing but not its footage.
 */

import { parseBlueprint } from "./blueprint.js";
import { getPlatform, platformWarnings } from "./platforms.js";

export function buildShotPrompts(blueprint, { topic, brand = "", style = "", platform = "" } = {}) {
  return planMimic(blueprint, { topic, brand, style, platform }).shots;
}

/** Full plan: per-shot prompts plus a caption/hook/CTA script and platform warnings. */
export function planMimic(blueprint, { topic, brand = "", style = "", platform = "" } = {}) {
  const bp = parseBlueprint(blueprint);
  if (!topic || !topic.trim()) throw new Error("A --topic is required to mimic a blueprint.");
  const plat = getPlatform(platform);
  const aspect = plat ? plat.aspect : bp.aspect;
  const last = bp.shots.length - 1;

  const shots = bp.shots.map((s, i) => {
    const role = i === 0 ? "Attention-grabbing hook" : i === last ? "Closing shot with call to action" : "Supporting shot";
    const dur = Math.round((s.endSec - s.startSec) * 10) / 10;
    const parts = [
      `${role} for a ${aspect} short-form video about ${topic.trim()}.`,
      s.description && `Match the composition of the reference: ${s.description}.`,
      i === 0 && bp.hook?.text && `The reference opens with a line like: "${bp.hook.text}" (write a new line for this topic, same energy and length).`,
      i === last && bp.cta && `The reference ends with a call to action like: "${bp.cta}" (write a new one for this topic).`,
      bp.captions?.present && bp.captions.style && `On-screen captions in this style: ${bp.captions.style}.`,
      brand && `Brand: ${brand}.`,
      style && `Style: ${style}.`,
      plat && `Framing: ${plat.captionSafe}.`,
      `Duration about ${dur}s.`,
    ];
    return { index: s.index ?? i, durationSec: dur, prompt: parts.filter(Boolean).join(" ") };
  });

  return {
    platform: plat ? plat.key : null,
    aspect,
    warnings: platformWarnings(bp, plat),
    script: {
      hookReference: bp.hook?.text || "",
      ctaReference: bp.cta || "",
      captionStyle: bp.captions?.present ? bp.captions.style : "",
      music: bp.audio?.music || "",
    },
    shots,
  };
}
