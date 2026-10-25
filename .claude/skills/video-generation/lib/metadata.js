/**
 * Fetch page metadata for a URL reference without downloading the video.
 * Uses `yt-dlp --dump-single-json --skip-download`; `run` is injectable for tests.
 */

import { run as defaultRun } from "./tools.js";

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);

/** "20240131" -> "2024-01-31"; anything else -> null. */
function formatDate(d) {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(String(d ?? ""));
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** Merge yt-dlp tags with #hashtags in the description; lowercase, no '#', deduped. */
function collectHashtags(json) {
  const fromTags = Array.isArray(json.tags) ? json.tags : [];
  const fromText = [...String(json.description ?? "").matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1]);
  const all = [...fromTags, ...fromText].filter((t) => typeof t === "string").map((t) => t.replace(/^#/, "").trim().toLowerCase());
  return [...new Set(all.filter(Boolean))];
}

/** Pure mapper from yt-dlp's info JSON to blueprint `metadata` + `engagement`. */
export function mapMetadata(json = {}) {
  const chapters = (Array.isArray(json.chapters) ? json.chapters : [])
    .filter((c) => num(c?.start_time) !== null)
    .map((c) => ({ startSec: c.start_time, endSec: num(c.end_time), title: str(c.title) ?? "" }));
  return {
    metadata: {
      title: str(json.title),
      description: str(json.description),
      uploader: str(json.uploader) ?? str(json.channel),
      uploadDate: formatDate(json.upload_date),
      durationSec: num(json.duration),
      hashtags: collectHashtags(json),
      thumbnail: str(json.thumbnail),
      chapters,
      platform: str(json.extractor_key)?.toLowerCase() ?? str(json.extractor)?.toLowerCase() ?? null,
    },
    engagement: {
      viewCount: num(json.view_count),
      likeCount: num(json.like_count),
      commentCount: num(json.comment_count),
    },
  };
}

export async function fetchMetadata(url, { run = defaultRun } = {}) {
  const { stdout } = await run("yt-dlp", ["--dump-single-json", "--skip-download", "--no-playlist", url]);
  return mapMetadata(JSON.parse(stdout));
}
