# Contributing

Thanks for your interest in contributing to the video-generation skill for Claude Code.

## Development setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/arundass/claude-video-generation-skill.git
   cd claude-video-generation-skill
   npm install
   ```

2. Set your API key (never commit this):
   ```bash
   export REPLICATE_API_TOKEN=your_token_here
   ```

3. Run the test suite:
   ```bash
   npm test
   ```
   Tests run via `node --test` over the `test/` directory. The package is ESM (`"type": "module"`), so all test files use ESM imports.

## ESM import rule

Always use the **default** import for Node's built-in `assert`:

```js
// correct
import assert from "node:assert";

// wrong — named export does not exist in ESM
import { assert } from "node:assert";
```

Breaking this causes `npm test` to fail at import time with a confusing module error.

## Project layout

```
.claude/skills/video-generation/
├── SKILL.md          ← skill manifest; every command must be declared here
├── commands/         ← one file per slash command (thin wrappers only)
│   ├── generate.js
│   ├── generate-image.js
│   ├── status.js
│   └── models.js
└── lib/              ← shared helper logic
    ├── replicate.js
    └── index.js
```

### Command registration

Every script in `commands/` **must** be declared in `SKILL.md`. Claude Code reads `SKILL.md` to expose slash commands (`/clipmimic:generate`, `/clipmimic:generate-image`, `/clipmimic:status`, `/clipmimic:models`). An undeclared script will never be invoked.

### Helper logic

Business logic (API calls, polling, response shaping) belongs in `lib/`, not in command scripts. Command scripts should be thin wrappers that import from `lib/` and format output.

## Adding a new provider

1. Create `lib/<provider>.js` following the interface in `lib/replicate.js`.
2. Add `commands/generate-<provider>.js`.
3. Register the new command in `SKILL.md`.
4. Add tests in `test/<provider>.test.js`.
5. Open a `new-provider` issue first if you want design feedback before writing code.

## Replicate prediction payload

The correct request shape:
- `POST /v1/models/{owner}/{name}/predictions`
- Body: `{ version: "<hash-after-colon>", input: { … } }`

Do **not** include a top-level `model` field or a hardcoded date string as the version. See `lib/replicate.js` for the canonical implementation.

## Pull requests

- One feature or fix per PR.
- Include or update tests for every behaviour change.
- `npm test` must pass locally before you open the PR.
- Fill in the pull request template checklist.

## Code of conduct

This project follows the [Contributor Covenant 2.1](CODE_OF_CONDUCT.md). Please be respectful.
