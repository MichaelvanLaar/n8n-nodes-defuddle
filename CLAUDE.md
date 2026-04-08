# CLAUDE.md

n8n community node — extracts main content from webpages using the Defuddle library.
Published as `@michaelvanlaar/n8n-nodes-defuddle` on npm.

## Stack

TypeScript 5.9, Node.js 20+, n8n-workflow ^1.20.0, Defuddle, JSDOM, Turndown, Jest, Husky, ESLint/Prettier.

## Architecture

Single-node package: `nodes/Defuddle/Defuddle.node.ts`.
HTML input → sandboxed JSDOM → Defuddle extraction → optional Turndown markdown conversion → filtered JSON output.
Build output to `dist/`; only `dist/` is published to npm.

@AGENTS.md for universal agent brief (setup, testing, safety rules).

### Full Project Context — @openspec/project.md

**Read when:** needing full architecture details, domain context, dependency info, or n8n API constraints.

### Key Config Files

| File | Purpose |
|------|---------|
| `.claude/release-checklist.md` | Release process checklist  |
| `.claude/settings.json` | Claude Code permissions and hooks  |
| `.claude/settings.local.json` | Local Claude Code overrides (gitignored)  |
| `.claude/skills/cc-init/SKILL.md` | Bootstrap best-practice Claude Code config for new projects  |
| `.claude/skills/cc-optimize/SKILL.md` | Audit and optimize existing Claude Code configuration  |
| `.claude/skills/context7-n8n/SKILL.md` | Fetch n8n documentation via context7 for current API reference  |
| `.claude/skills/openspec-apply-change/SKILL.md` | Implement tasks from an active OpenSpec change  |
| `.claude/skills/openspec-archive-change/SKILL.md` | Archive a completed OpenSpec change and sync specs  |
| `.claude/skills/openspec-bulk-archive-change/SKILL.md` | Archive multiple completed OpenSpec changes at once  |
| `.claude/skills/openspec-continue-change/SKILL.md` | Create the next artifact for an in-progress OpenSpec change  |
| `.claude/skills/openspec-explore/SKILL.md` | Thinking-partner mode for exploring ideas before a change  |
| `.claude/skills/openspec-ff-change/SKILL.md` | Fast-forward through all OpenSpec artifact creation in one pass  |
| `.claude/skills/openspec-new-change/SKILL.md` | Start a new OpenSpec change with structured artifact workflow  |
| `.claude/skills/openspec-onboard/SKILL.md` | Guided walkthrough of a complete OpenSpec workflow cycle  |
| `.claude/skills/openspec-sync-specs/SKILL.md` | Sync delta specs to main specs without archiving the change  |
| `.claude/skills/openspec-verify-change/SKILL.md` | Verify implementation matches change artifacts before archiving  |
| `eslint.config.mjs` | ESLint flat config with n8n rules  |
| `.github/workflows/claude-code-review.yml` | Automatic PR review by Claude  |
| `.github/workflows/claude.yml` | Claude automation via `@claude` in issues/PRs  |
| `.github/workflows/publish.yml` | npm publish on git tag push (OIDC)  |
| `.gitignore` | Git ignore patterns  |
| `gulpfile.js` | Gulp build tasks (icon copying)  |
| `jest.config.js` | Jest test configuration  |
| `.mcp.json` | MCP server config  |
| `package.json` | Package metadata, dependencies, scripts  |
| `.prettierrc.js` | Prettier formatting rules  |
| `tsconfig.json` | TypeScript compiler config  |

## Configuration Management

When running config optimization or audit tasks, always check for duplicate entries across `.claude/settings.json`, `.claude/settings.local.json`, and project-level configs before proposing changes.

## Key Commands

- `npm run build` — compile TypeScript + copy icons
- `npm run lint` / `npm run lintfix` — ESLint with n8n rules
- `npm test` / `npm run test:watch` / `npm run test:coverage` — Jest (47 tests, ~100% coverage)
- `npm run dev` — TypeScript watch mode

## Key Conventions

- Conventional Commits with gitmoji.
- Strict TypeScript — no `any` types.
- `--legacy-peer-deps` required when updating dependencies (jsdom peer dep mismatch).
- Pre-commit hooks (Husky): lint → test → build.

## Publishing — @.claude/release-checklist.md

**Read when:** publishing a new version, running release workflow, or bumping version numbers.

## GitHub Integration

- Automated npm publishing via GitHub Actions when version tags are pushed (OIDC, provenance).

## OpenSpec

This project uses OpenSpec for structured change management.
See `openspec/config.yaml` for workflow configuration.

## Handoff

Before ending a session, the user may invoke `/handoff` to create a machine-transfer summary.
When resuming work, always check if HANDOFF.md exists in the project root. If it does, read it
first and continue from where it left off. After confirming the context is restored, delete the file.

## Learnings

When the user corrects a mistake or points out a recurring issue, append a one-line
summary to .claude/learnings.md. Don't modify CLAUDE.md directly.

## Compact Instructions

When compacting, preserve: full list of modified files, current test status, and open TODOs.
