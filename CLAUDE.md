# CLAUDE.md

n8n community node — extracts main content from webpages using the Defuddle library.
Published as `@michaelvanlaar/n8n-nodes-defuddle` on npm.

## Stack

TypeScript 5.9, Node.js 20+, n8n-workflow ^1.20.0, Defuddle, JSDOM, Turndown, Jest, Husky, ESLint/Prettier.

## Architecture

Single-node package: `nodes/Defuddle/Defuddle.node.ts`.
HTML input → sandboxed JSDOM → Defuddle extraction → optional Turndown markdown conversion → filtered JSON output.
Build output to `dist/`; only `dist/` is published to npm.

@openspec/project.md for full architecture, conventions, and domain context.
@AGENTS.md for universal agent brief (setup, testing, safety rules).

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

## Publishing

@.claude/release-checklist.md

## GitHub Integration

- Automated npm publishing via GitHub Actions when version tags are pushed (OIDC, provenance).

## OpenSpec

This project uses OpenSpec for structured change management.
See `openspec/config.yaml` for workflow configuration.