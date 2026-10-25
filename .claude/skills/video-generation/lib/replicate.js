/**
 * Replicate API client for video generation.
 *
 * Wraps Replicate's prediction API:
 *  - POST /predictions   -> start a generation job
 *  - GET  /predictions/:id  -> poll a job until it completes
 *
 * Requires REPLICATE_API_TOKEN in the environment.
 */

const BASE = "https://api.replicate.com/v1";

/** Poll cap in attempts; default 30 minutes, override with VIDEO_POLL_MAX_MINUTES. */
function pollMaxAttempts(intervalMs) {
  const minutes = Number(process.env.VIDEO_POLL_MAX_MINUTES) || 30;
  return Math.ceil((minutes * 60000) / intervalMs);
}

export class ReplicateClient {
  constructor({ token } = {}) {
    this.token = token || process.env.REPLICATE_API_TOKEN;
    if (!this.token) {
      throw new Error(
        "REPLICATE_API_TOKEN is not set. Export it and try again."
      );
    }
  }

  _headers() {
    return {
      Authorization: `Token ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async _request(path, { method = "GET", body } = {}) {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: this._headers(),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const err = await res.json();
        detail = err.detail || JSON.stringify(err);
      } catch (_) {
        detail = await res.text();
      }
      throw new Error(`Replicate API error (${res.status}): ${detail}`);
    }

    return res.json();
  }

  /**
   * Start a text-to-video or image-to-video prediction.
   * @param {string} model - Replicate model owner/name, e.g. "anotherjesse/zeroscope-v2-xl"
   * @param {object} input - Model input parameters (prompt, image, etc.)
   * @returns {object} The created prediction with an `id` to poll.
   */
  async createPrediction(model, input) {
    const [modelRef, version] = model.split(":");
    const [owner, name] = modelRef.split("/");
    if (!owner || !name) {
      throw new Error(
        `Invalid model reference "${model}". Use owner/name or owner/name:version-hash`
      );
    }
    // Community models need a version: use the pinned one, else resolve the latest.
    let resolved = version;
    if (!resolved) {
      const info = await this._request(`/models/${owner}/${name}`);
      resolved = info.latest_version?.id;
    }
    if (resolved) {
      return this._request("/predictions", {
        method: "POST",
        body: { version: resolved, input },
      });
    }
    // Official models have no version: they use the model-scoped endpoint.
    return this._request(`/models/${owner}/${name}/predictions`, {
      method: "POST",
      body: { input },
    });
  }

  /**
   * Fetch a prediction by ID. Returns the prediction object.
   * @param {string} id - Prediction ID returned from createPrediction.
   * @returns {object}
   */
  async getPrediction(id) {
    return this._request(`/predictions/${id}`);
  }

  /**
   * Poll a prediction until it reaches a terminal state.
   * @param {string} id - Prediction ID.
   * @param {object} opts - { intervalMs, maxAttempts }
   * @returns {object} Final prediction object.
   */
  async poll(id, { intervalMs = 5000, maxAttempts = pollMaxAttempts(intervalMs) } = {}) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const prediction = await this.getPrediction(id);
      const status = prediction.status;

      if (status === "succeeded" || status === "failed" || status === "canceled") {
        return prediction;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error(
      `Prediction ${id} is still running after ${Math.round((maxAttempts * intervalMs) / 60000)} minutes. ` +
        `It may still finish: check it with /video:status ${id}. ` +
        `Raise the wait with VIDEO_POLL_MAX_MINUTES.`
    );
  }

  /**
   * List available models (thin wrapper; Replicate's model listing is public).
   * @param {string} cursor - Pagination cursor.
   * @returns {object}
   */
  async listModels(cursor) {
    const path = cursor ? `/models?cursor=${cursor}` : "/models";
    return this._request(path);
  }
}
