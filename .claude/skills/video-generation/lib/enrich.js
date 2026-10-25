/**
 * Merge observations from a human-style viewing of the reference (for example
 * Claude watching it in the browser through the Claude in Chrome extension, or
 * describing extracted keyframes) into a Style Blueprint.
 *
 * Observations are plain JSON. Every field is optional:
 *   { page: {url,title,creator}, engagement: {viewCount,likeCount,commentCount,shareCount},
 *     hook: {text,endSec,type}, shots: [{index,description,onScreenText,camera,transition}],
 *     captions: {present,style}, audio: {music,voiceover,transcript}, cta, notes: [] }
 * With no existing blueprint, observations must include durationSec and shots
 * with startSec/endSec so a blueprint can be built from the browser alone.
 */

import { createBlueprint, computePacing, validateBlueprint } from "./blueprint.js";

const str = (v) => (typeof v === "string" ? v.trim() : undefined);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

function pick(obj, keys, conv) {
  const out = {};
  for (const k of keys) {
    const v = conv(obj?.[k]);
    if (v !== undefined && v !== "") out[k] = v;
  }
  return out;
}

export function enrichBlueprint(blueprint, obs = {}) {
  if (!obs || typeof obs !== "object") throw new Error("Observations must be a JSON object.");
  let bp;

  if (blueprint) {
    bp = structuredClone(blueprint);
  } else {
    const durationSec = num(obs.durationSec);
    if (!durationSec || !Array.isArray(obs.shots) || obs.shots.length === 0) {
      throw new Error("Without an existing blueprint, observations need durationSec and shots[] with startSec/endSec.");
    }
    const shots = obs.shots.map((s, i) => ({
      index: i,
      startSec: num(s.startSec),
      endSec: num(s.endSec),
      description: "",
    }));
    bp = createBlueprint({
      source: str(obs.page?.url) || null,
      durationSec,
      aspect: str(obs.aspect) || "9:16",
      shots,
      pacing: computePacing(shots, durationSec),
    });
  }

  if (Array.isArray(obs.shots)) {
    obs.shots.forEach((o, pos) => {
      const idx = blueprint ? (num(o.index) ?? pos) : pos;
      const shot = bp.shots[idx];
      if (!shot) throw new Error(`Observation refers to shot ${idx}, but the blueprint has ${bp.shots.length} shots.`);
      Object.assign(shot, pick(o, ["description", "onScreenText", "camera", "transition", "subject"], str));
    });
  }

  if (obs.hook) {
    const h = { ...pick(obs.hook, ["text", "type"], str), ...pick(obs.hook, ["endSec"], num) };
    bp.hook = { ...bp.hook, ...h };
  }
  if (obs.captions) {
    bp.captions = { ...bp.captions, ...pick(obs.captions, ["style"], str) };
    if (typeof obs.captions.present === "boolean") bp.captions.present = obs.captions.present;
    else if (bp.captions.style) bp.captions.present = true;
  }
  if (obs.audio) {
    bp.audio = { ...bp.audio, ...pick(obs.audio, ["music", "voiceover"], str) };
    const t = str(obs.audio.transcript);
    if (t && !bp.audio.transcript) bp.audio.transcript = t;
    if (typeof obs.audio.hasSpeech === "boolean") bp.audio.hasSpeech = obs.audio.hasSpeech;
    else if (bp.audio.voiceover || bp.audio.transcript) bp.audio.hasSpeech = true;
  }
  if (str(obs.cta)) bp.cta = str(obs.cta);

  if (obs.page) bp.page = { ...bp.page, ...pick(obs.page, ["url", "title", "creator", "platform"], str) };
  if (obs.engagement) bp.engagement = { ...bp.engagement, ...pick(obs.engagement, ["viewCount", "likeCount", "commentCount", "shareCount"], num) };
  if (Array.isArray(obs.notes)) bp.notes = [...(bp.notes || []), ...obs.notes.map(str).filter(Boolean)];
  bp.enrichedBy = "observations";

  const errors = validateBlueprint(bp);
  if (errors.length) throw new Error(`Enriched blueprint is invalid: ${errors.join("; ")}`);
  return bp;
}
