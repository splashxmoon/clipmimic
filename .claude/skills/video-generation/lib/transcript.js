/**
 * Transcript from a URL's own subtitles (manual or auto captions). No speech-to-text
 * dependency: when no captions exist the transcript is simply empty.
 */

import { mkdtemp, readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { run as defaultRun } from "./tools.js";

const TIME = /(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})/;

function toSec(m) {
  return Number(m[1] || 0) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, "0")) / 1000;
}

/** Remove inline tags (<c>, <00:00:01.000>, <i>, {\an8}) and decode the common entities. */
function cleanLine(line) {
  return line
    .replace(/<[^>]*>/g, "")
    .replace(/\{\\[^}]*\}/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse blocks of "<start> --> <end>" followed by text lines. Handles VTT and SRT
 * (they differ only in header, comma vs dot, and numeric cue ids), then dedupes the
 * rolling lines YouTube auto-captions repeat across consecutive cues.
 */
function parseCues(text) {
  const raw = [];
  for (const block of String(text).replace(/\r/g, "").split(/\n{2,}/)) {
    const lines = block.split("\n");
    const i = lines.findIndex((l) => l.includes("-->"));
    if (i < 0) continue;
    const [a, b] = lines[i].split("-->");
    const start = TIME.exec(a);
    const end = TIME.exec(b);
    if (!start || !end) continue;
    raw.push({ startSec: toSec(start), endSec: toSec(end), lines: lines.slice(i + 1).map(cleanLine).filter(Boolean) });
  }

  const cues = [];
  let prev = new Set();
  for (const c of raw) {
    const fresh = c.lines.filter((l) => !prev.has(l));
    prev = new Set(c.lines);
    const t = fresh.join(" ");
    if (!t) continue;
    const last = cues[cues.length - 1];
    if (last && last.text === t) last.endSec = Math.max(last.endSec, c.endSec);
    else cues.push({ startSec: c.startSec, endSec: c.endSec, text: t });
  }
  return cues;
}

export const parseVtt = (text) => parseCues(text);
export const parseSrt = (text) => parseCues(text);

export function joinTranscript(cues) {
  return cues.map((c) => c.text).join(" ").replace(/\s+/g, " ").trim();
}

export async function fetchTranscript(url, { run = defaultRun, dir } = {}) {
  dir ??= await mkdtemp(path.join(tmpdir(), "clipmimic-subs-"));
  await run("yt-dlp", [
    "--write-subs", "--write-auto-subs", "--sub-langs", "en.*", "--sub-format", "vtt",
    "--skip-download", "--no-playlist", "-o", path.join(dir, "%(id)s"), url,
  ]);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".vtt")).sort();
  if (!files.length) return { cues: [], text: "" };
  const cues = parseVtt(await readFile(path.join(dir, files[0]), "utf8"));
  return { cues, text: joinTranscript(cues) };
}
