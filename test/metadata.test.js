import assert from "node:assert";
import { describe, it } from "node:test";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { mapMetadata, fetchMetadata } from "../.claude/skills/video-generation/lib/metadata.js";
import { parseVtt, parseSrt, joinTranscript, fetchTranscript } from "../.claude/skills/video-generation/lib/transcript.js";
import { analyze, hookText } from "../.claude/skills/video-generation/lib/analyze.js";

const INFO = JSON.stringify({
  title: "  Cold plunge  ", description: "Try it #Wellness #ColdPlunge", uploader: "ann", upload_date: "20240131",
  duration: 42.5, tags: ["Health", "wellness"], thumbnail: "https://x/t.jpg", extractor_key: "TikTok",
  view_count: 1000, like_count: 50, chapters: [{ start_time: 0, end_time: 5, title: "Intro" }],
});

// YouTube-style rolling auto-captions: each cue repeats the previous line.
const VTT = `WEBVTT
Kind: captions

00:00:00.000 --> 00:00:01.500 align:start position:0%
<c>stop</c><00:00:00.500><c> scrolling</c>

00:00:01.500 --> 00:00:01.510 align:start position:0%
stop scrolling

00:00:01.510 --> 00:00:03.000 align:start position:0%
stop scrolling
this <c>changes</c> everything

00:00:03.000 --> 00:00:03.010
this changes everything

00:00:03.010 --> 00:00:05.000
this changes everything
watch closely
`;

const SRT = `1
00:00:00,000 --> 00:00:02,000
Hello <i>there</i>

2
00:00:02,000 --> 00:00:04,500
General Kenobi
`;

function mockRun({ info = INFO, vtt = VTT, failMeta = false, failSubs = false } = {}) {
  return async (bin, args) => {
    if (bin === "ffprobe") {
      return { stdout: JSON.stringify({ format: { duration: "10" }, streams: [{ codec_type: "video", width: 1080, height: 1920 }, { codec_type: "audio" }] }), stderr: "" };
    }
    if (bin === "ffmpeg") return { stdout: "", stderr: "pts_time:4.0" };
    if (args.includes("--dump-single-json")) {
      if (failMeta) throw new Error("yt-dlp failed: HTTP 429\nextra");
      return { stdout: info, stderr: "" };
    }
    if (failSubs) throw new Error("yt-dlp failed: boom");
    if (vtt) await writeFile(path.join(path.dirname(args[args.indexOf("-o") + 1]), "abc.en.vtt"), vtt);
    return { stdout: "", stderr: "" };
  };
}

describe("metadata", () => {
  it("maps yt-dlp JSON with nulls for missing fields", () => {
    const { metadata, engagement } = mapMetadata(JSON.parse(INFO));
    assert.strictEqual(metadata.title, "Cold plunge");
    assert.strictEqual(metadata.uploadDate, "2024-01-31");
    assert.strictEqual(metadata.platform, "tiktok");
    assert.deepStrictEqual(metadata.hashtags, ["health", "wellness", "coldplunge"]);
    assert.deepStrictEqual(metadata.chapters, [{ startSec: 0, endSec: 5, title: "Intro" }]);
    assert.deepStrictEqual(engagement, { viewCount: 1000, likeCount: 50, commentCount: null });
    assert.strictEqual(mapMetadata({}).metadata.title, null);
  });

  it("fetchMetadata calls yt-dlp without downloading", async () => {
    let seen;
    const m = await fetchMetadata("https://t.co/v", { run: async (bin, args) => ((seen = [bin, args]), { stdout: INFO }) });
    assert.strictEqual(seen[0], "yt-dlp");
    assert.ok(seen[1].includes("--skip-download") && seen[1].includes("--dump-single-json"));
    assert.strictEqual(m.metadata.uploader, "ann");
  });
});

describe("transcript", () => {
  it("dedupes rolling VTT lines and strips tags", () => {
    const cues = parseVtt(VTT);
    assert.deepStrictEqual(cues.map((c) => c.text), ["stop scrolling", "this changes everything", "watch closely"]);
    assert.strictEqual(cues[1].startSec, 1.51);
    assert.strictEqual(joinTranscript(cues), "stop scrolling this changes everything watch closely");
  });

  it("parses SRT", () => {
    const cues = parseSrt(SRT);
    assert.deepStrictEqual(cues, [
      { startSec: 0, endSec: 2, text: "Hello there" },
      { startSec: 2, endSec: 4.5, text: "General Kenobi" },
    ]);
  });

  it("fetchTranscript returns empty when no subs are written", async () => {
    const dir = await import("node:fs/promises").then((f) => f.mkdtemp(path.join(process.env.TMPDIR || "/tmp", "t-")));
    assert.deepStrictEqual(await fetchTranscript("https://t.co/v", { dir, run: async () => ({ stdout: "" }) }), { cues: [], text: "" });
  });
});

describe("analyze with URL enrichment", () => {
  it("selects hook text spoken before hook.endSec", () => {
    const cues = parseVtt(VTT);
    assert.strictEqual(hookText(cues, 3), "stop scrolling this changes everything");
    assert.strictEqual(hookText(cues, 1), "stop scrolling");
  });

  it("fills metadata, engagement, transcript and hook", async () => {
    const bp = await analyze("/tmp/v.mp4", { source: "https://t.co/v", run: mockRun() });
    assert.strictEqual(bp.metadata.title, "Cold plunge");
    assert.strictEqual(bp.engagement.viewCount, 1000);
    assert.strictEqual(bp.audio.transcript, "stop scrolling this changes everything watch closely");
    assert.strictEqual(bp.hook.text, "stop scrolling this changes everything");
    assert.strictEqual(bp.warnings, undefined);
    assert.strictEqual(bp.schemaVersion, "1.0");
  });

  it("records warnings instead of failing", async () => {
    const bp = await analyze("/tmp/v.mp4", { source: "https://t.co/v", run: mockRun({ failMeta: true, failSubs: true }) });
    assert.strictEqual(bp.metadata, undefined);
    assert.strictEqual(bp.audio.transcript, "");
    assert.strictEqual(bp.warnings.length, 2);
    assert.match(bp.warnings[0], /^metadata unavailable: yt-dlp failed: HTTP 429$/);
  });

  it("warns when no captions exist and honors opt-outs and local files", async () => {
    const none = await analyze("/tmp/v.mp4", { source: "https://t.co/v", run: mockRun({ vtt: "" }) });
    assert.deepStrictEqual(none.warnings, ["transcript unavailable: no captions found"]);
    const off = await analyze("/tmp/v.mp4", { source: "https://t.co/v", metadata: false, transcript: false, run: mockRun() });
    assert.strictEqual(off.metadata, undefined);
    assert.strictEqual(off.warnings, undefined);
    const local = await analyze("/tmp/v.mp4", { run: mockRun() });
    assert.strictEqual(local.metadata, undefined);
  });
});
