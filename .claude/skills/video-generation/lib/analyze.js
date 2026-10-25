/**
 * Analyze a local video into a Style Blueprint using ffprobe/ffmpeg.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { run as defaultRun } from "./tools.js";
import { createBlueprint, computePacing } from "./blueprint.js";

export function aspectLabel(w, h) {
  const r = w / h;
  if (Math.abs(r - 9 / 16) < 0.05) return "9:16";
  if (Math.abs(r - 16 / 9) < 0.05) return "16:9";
  if (Math.abs(r - 1) < 0.05) return "1:1";
  if (Math.abs(r - 4 / 5) < 0.05) return "4:5";
  return `${w}:${h}`;
}

/** Parse cut timestamps from ffmpeg's showinfo output (pts_time:X). */
export function parseSceneCuts(stderr) {
  return [...stderr.matchAll(/pts_time:([0-9.]+)/g)].map((m) => parseFloat(m[1]));
}

/** Turn cut timestamps into contiguous shots covering [0, duration]. */
export function cutsToShots(cuts, durationSec) {
  const edges = [0, ...cuts.filter((t) => t > 0 && t < durationSec), durationSec];
  const shots = [];
  for (let i = 0; i < edges.length - 1; i++) {
    if (edges[i + 1] > edges[i]) shots.push({ index: shots.length, startSec: edges[i], endSec: edges[i + 1], description: "" });
  }
  return shots;
}

export async function probe(file, run = defaultRun) {
  const { stdout } = await run("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file]);
  const info = JSON.parse(stdout);
  const v = (info.streams || []).find((s) => s.codec_type === "video");
  if (!v) throw new Error("No video stream found in the file.");
  return {
    durationSec: parseFloat(info.format?.duration ?? v.duration),
    width: v.width,
    height: v.height,
    hasAudio: (info.streams || []).some((s) => s.codec_type === "audio"),
  };
}

export async function detectScenes(file, { threshold = 0.3, run = defaultRun } = {}) {
  const { stderr } = await run("ffmpeg", ["-i", file, "-filter:v", `select='gt(scene,${threshold})',showinfo`, "-f", "null", "-"]);
  return parseSceneCuts(stderr);
}

export async function extractKeyframes(file, shots, outDir, run = defaultRun) {
  await mkdir(outDir, { recursive: true });
  for (const s of shots) {
    const mid = (s.startSec + s.endSec) / 2;
    const out = path.join(outDir, `shot-${String(s.index).padStart(3, "0")}.jpg`);
    await run("ffmpeg", ["-y", "-ss", String(mid), "-i", file, "-frames:v", "1", out]);
    s.keyframe = out;
  }
  return shots;
}

export async function analyze(file, { threshold, keyframesDir, source = file, run = defaultRun } = {}) {
  const meta = await probe(file, run);
  const cuts = await detectScenes(file, { threshold, run });
  const shots = cutsToShots(cuts, meta.durationSec);
  if (keyframesDir) await extractKeyframes(file, shots, keyframesDir, run);
  return createBlueprint({
    source,
    durationSec: meta.durationSec,
    aspect: aspectLabel(meta.width, meta.height),
    hook: { text: "", endSec: Math.min(3, shots[0]?.endSec ?? 3) },
    shots,
    pacing: computePacing(shots, meta.durationSec),
    audio: { hasSpeech: meta.hasAudio, transcript: "", music: "" },
  });
}
