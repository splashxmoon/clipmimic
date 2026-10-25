import assert from "node:assert";
import { describe, it } from "node:test";
import { createBlueprint, validateBlueprint, computePacing } from "../.claude/skills/video-generation/lib/blueprint.js";
import { cutsToShots, parseSceneCuts, aspectLabel, analyze } from "../.claude/skills/video-generation/lib/analyze.js";
import { buildShotPrompts } from "../.claude/skills/video-generation/lib/mimic.js";
import { ingest } from "../.claude/skills/video-generation/lib/ingest.js";
import { ReplicateClient } from "../.claude/skills/video-generation/lib/replicate.js";

describe("blueprint", () => {
  it("validates shots", () => {
    assert.ok(validateBlueprint(createBlueprint()).length > 0);
    const shots = cutsToShots([2, 5], 8);
    const bp = createBlueprint({ durationSec: 8, shots, pacing: computePacing(shots, 8) });
    assert.deepStrictEqual(validateBlueprint(bp), []);
    assert.strictEqual(bp.schemaVersion, "1.0");
    assert.strictEqual(bp.pacing.shotCount, 3);
  });

  it("rejects numeric version and wrong schemaVersion", () => {
    const shots = cutsToShots([2], 4);
    const base = createBlueprint({ durationSec: 4, shots, pacing: computePacing(shots, 4) });
    const legacy = { ...base, version: 1 };
    delete legacy.schemaVersion;
    assert.ok(validateBlueprint(legacy).some((e) => /schemaVersion/.test(e)));
    assert.ok(validateBlueprint({ ...base, schemaVersion: "2.0" }).some((e) => /schemaVersion/.test(e)));
  });
});

describe("analyze", () => {
  it("parses cuts and aspect", () => {
    assert.deepStrictEqual(parseSceneCuts("x pts_time:1.5 y pts_time:4"), [1.5, 4]);
    assert.strictEqual(aspectLabel(1080, 1920), "9:16");
  });
  it("builds a blueprint with mocked binaries", async () => {
    const run = async (bin) =>
      bin === "ffprobe"
        ? { stdout: JSON.stringify({ format: { duration: "10" }, streams: [{ codec_type: "video", width: 1080, height: 1920 }, { codec_type: "audio" }] }), stderr: "" }
        : { stdout: "", stderr: "pts_time:3 pts_time:7" };
    const bp = await analyze("a.mp4", { run });
    assert.strictEqual(bp.shots.length, 3);
    assert.strictEqual(bp.aspect, "9:16");
    assert.strictEqual(bp.hook.endSec, 3);
  });
});

describe("ingest", () => {
  it("dry-run URL builds yt-dlp command", async () => {
    const r = await ingest("https://example.com/v", { dryRun: true });
    assert.match(r.command, /^yt-dlp /);
  });
  it("rejects missing file", async () => {
    await assert.rejects(ingest("/nope/missing.mp4"), /File not found/);
  });
});

describe("mimic", () => {
  it("builds prompts per shot and requires topic", () => {
    const shots = cutsToShots([3], 6);
    const bp = createBlueprint({ durationSec: 6, shots, pacing: computePacing(shots, 6) });
    const out = buildShotPrompts(bp, { topic: "smartwatch" });
    assert.strictEqual(out.length, 2);
    assert.match(out[0].prompt, /hook/i);
    assert.throws(() => buildShotPrompts(bp, {}), /topic/);
  });
});

describe("ReplicateClient.createPrediction", () => {
  async function run(model, latest) {
    const calls = [];
    const orig = globalThis.fetch;
    globalThis.fetch = async (url, init = {}) => {
      calls.push({ url, method: init.method || "GET", body: init.body ? JSON.parse(init.body) : null });
      const isModel = /\/models\/[^/]+\/[^/]+$/.test(url);
      return { ok: true, json: async () => (isModel ? { latest_version: latest } : { id: "p1" }) };
    };
    try {
      await new ReplicateClient({ token: "t" }).createPrediction(model, { prompt: "x" });
    } finally {
      globalThis.fetch = orig;
    }
    return calls;
  }

  it("uses the pinned version directly", async () => {
    const calls = await run("a/b:abc123");
    assert.strictEqual(calls.length, 1);
    assert.ok(calls[0].url.endsWith("/predictions"));
    assert.strictEqual(calls[0].body.version, "abc123");
  });

  it("resolves the latest version for unpinned community models", async () => {
    const calls = await run("a/b", { id: "latest99" });
    assert.ok(calls[0].url.endsWith("/models/a/b"));
    assert.ok(calls[1].url.endsWith("/predictions"));
    assert.strictEqual(calls[1].body.version, "latest99");
  });

  it("falls back to the model endpoint for official models", async () => {
    const calls = await run("a/b", undefined);
    assert.ok(calls[1].url.endsWith("/models/a/b/predictions"));
    assert.strictEqual(calls[1].body.version, undefined);
  });
});
