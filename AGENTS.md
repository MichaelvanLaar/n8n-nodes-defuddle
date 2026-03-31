# AGENTS.md

Universal agent brief for all AI coding tools (Claude Code, Codex, Gemini CLI, etc.).

## Project

n8n community node package: extracts main content from webpages using the Defuddle library.
Single node implementation at `nodes/Defuddle/Defuddle.node.ts`.

## Setup Commands

```
npm install --legacy-peer-deps   # required due to jsdom peer dep mismatch
npm run build                    # TypeScript compile + copy icons to dist/
npm run dev                      # TypeScript watch mode
npm test                         # Run Jest test suite (47 tests)
npm run lint                     # ESLint with n8n community node rules
```

## Architecture Boundaries

- **Node implementation**: `nodes/Defuddle/Defuddle.node.ts` — the only node
- **Tests**: `nodes/Defuddle/__tests__/` — co-located, with HTML fixtures in `fixtures/`
- **Build output**: `dist/` — compiled output, only directory published to npm
- **Icons**: `nodes/Defuddle/defuddle.svg` — copied to dist via gulp task
- **OpenSpec**: `openspec/` — structured change management artifacts

Do NOT modify:
- `.env` or any environment files
- `.git/` internals
- `node_modules/`
- `dist/` directly (always rebuild)
- GitHub Actions workflows without explicit approval

## Testing Conventions

- Framework: Jest with ts-jest
- All node features must have corresponding tests
- Coverage target: >80% (currently ~100%)
- Mock `IExecuteFunctions` manually for precise test control
- Use HTML fixtures from `__tests__/fixtures/` (not inline strings)
- Security tests (JSDOM sandboxing) are mandatory for any parsing changes
- Pre-commit hooks enforce: lint → test → build (fail-fast)

## Code Style

- TypeScript strict mode, no `any` types
- Conventional Commits with gitmoji for commit messages
- Prettier for formatting, ESLint with `eslint-plugin-n8n-nodes-base`
- n8n naming conventions enforced by ESLint rules:
  - File: `{NodeName}.node.ts`
  - Directory: `nodes/{NodeName}/`
  - Class name matches node description name

## Safety Rules

- Never execute JavaScript from parsed HTML (JSDOM sandboxing is critical)
- Never commit secrets, API keys, or `.env` files
- Never bypass pre-commit hooks without explicit human approval
- Never modify `package-lock.json` manually — only via `npm install`
- Always use `--legacy-peer-deps` when adding/updating dependencies

## Publishing

See `.claude/release-checklist.md` for the complete release workflow.
Quick summary: Update README.md → commit → `npm version` → `git push --tags` → GitHub Actions publishes automatically.

## OpenSpec Workflow

This project uses OpenSpec for structured change management.
Active changes live in `openspec/changes/`, archived in `openspec/changes/archive/`.
Schema: spec-driven (proposal → specs → design → tasks).