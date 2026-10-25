/**
 * Unit tests for the shared helpers in lib/index.js.
 * Run with: npm test
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  summarizePrediction,
  requirePrompt,
} from "../.claude/skills/video-generation/lib/index.js";

describe("summarizePrediction", () => {
  it("includes id, status, and created date", () => {
    const prediction = {
      id: "pred-123",
      status: "succeeded",
      created_at: "2026-01-01T00:00:00Z",
      output: ["https://example.com/out.mp4"],
    };
    const summary = summarizePrediction(prediction);
    assert.ok(summary.includes("pred-123"));
    assert.ok(summary.includes("succeeded"));
    assert.ok(summary.includes("https://example.com/out.mp4"));
  });

  it("handles a single string output", () => {
    const prediction = {
      id: "pred-456",
      status: "failed",
      created_at: "2026-01-01T00:00:00Z",
      output: "https://example.com/out.mp4",
      error: "something went wrong",
    };
    const summary = summarizePrediction(prediction);
    assert.ok(summary.includes("failed"));
    assert.ok(summary.includes("something went wrong"));
  });
});

describe("requirePrompt", () => {
  it("returns the trimmed prompt", () => {
    assert.strictEqual(requirePrompt("  hello world  "), "hello world");
  });

  it("throws on an empty prompt", () => {
    assert.throws(() => requirePrompt(""), /Prompt is required/);
    assert.throws(() => requirePrompt("   "), /Prompt is required/);
  });
});
