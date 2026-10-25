/**
 * Analyze a local video into a Style Blueprint using ffprobe/ffmpeg.
 */

import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { run as defaultRun } from "./tools.js";
import { createBlueprint, computePacing } from "./blueprint.js";
import { isUrl } from "./ingest.js";
import { fetchMetadata } from "./metadata.js";
import { fetchTranscript } from "./transcript.js";

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

/** Text of cues that start before `endSec` (the spoken hook). */
export function hookText(cues, endSec) {
  return cues.filter((c) => c.startSec < endSec).map((c) => c.text).join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Metadata/transcript are best-effort for URL sources: any failure becomes a
 * short entry in `warnings` and never fails the analysis.
 */
export async function analyze(file, { threshold, keyframesDir, source = file, run = defaultRun, metadata = true, transcript = true } = {}) {
  const meta = await probe(file, run);
  const cuts = await detectScenes(file, { threshold, run });
  const shots = cutsToShots(cuts, meta.durationSec);
  if (keyframesDir) await extractKeyframes(file, shots, keyframesDir, run);

  const hook = { text: "", endSec: Math.min(3, shots[0]?.endSec ?? 3) };
  const audio = { hasSpeech: meta.hasAudio, transcript: "", music: "" };
  const extra = {};
  const warnings = [];
  const short = (e) => String(e?.message ?? e).split("\n")[0].slice(0, 160);

  if (isUrl(String(source))) {
    if (metadata) {
      try {
        const m = await fetchMetadata(source, { run });
        extra.metadata = m.metadata;
        extra.engagement = m.engagement;
      } catch (e) {
        warnings.push(`metadata unavailable: ${short(e)}`);
      }
    }
    if (transcript) {
      let dir;
      try {
        dir = await mkdtemp(path.join(tmpdir(), "clipmimic-subs-"));
        const t = await fetchTranscript(source, { run, dir });
        if (t.text) {
          audio.transcript = t.text;
          audio.hasSpeech = true;
          hook.text = hookText(t.cues, hook.endSec);
        } else {
          warnings.push("transcript unavailable: no captions found");
        }
      } catch (e) {
        warnings.push(`transcript unavailable: ${short(e)}`);
      } finally {
        if (dir) await rm(dir, { recursive: true, force: true }).catch(() => {});
      }
    }
  }
  if (warnings.length) extra.warnings = warnings;

  return createBlueprint({
    source,
    durationSec: meta.durationSec,
    aspect: aspectLabel(meta.width, meta.height),
    hook,
    shots,
    pacing: computePacing(shots, meta.durationSec),
    audio,
    ...extra,
  });
}
