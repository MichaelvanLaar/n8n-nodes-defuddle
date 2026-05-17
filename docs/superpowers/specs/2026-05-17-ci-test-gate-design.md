# CI Test Gate & Fixture Coverage Design

**Date:** 2026-05-17
**Status:** Approved

## Problem

Tests only run at publish time (tag push). A breaking change merged to `main` is not caught until `npm publish` is attempted. Additionally, three test fixtures (`unicode`, `large-article`, `malformed`) only assert "doesn't throw" — they don't verify actual output fields.

## Goals

1. Add a push/PR test gate so breakage is caught before it reaches `main`.
2. Extend fixture assertions to verify meaningful output, not just absence of errors.
3. Enable coverage tracking in CI.

## Design

### 1. New workflow: `.github/workflows/test.yml`

- **Triggers:** `push` (all branches) and `pull_request`
- **Job:** single job `test` on `ubuntu-latest`, Node 20
- **Steps:**
  1. `actions/checkout@v4`
  2. `actions/setup-node@v4` (node-version: "20")
  3. `npm install -g npm@latest`
  4. `npm ci`
  5. `npm run lint`
  6. `npm run test:coverage`
- No OIDC permissions needed (no publish step).
- Mirrors publish.yml steps exactly, minus the publish itself.

### 2. Extended fixture assertions

**unicode.html** (currently: only `content` defined)
- Assert `title` contains `"Unicode Test"`
- Assert `content` contains at least one non-ASCII string: `"Привет"`, `"世界"`, or `"café"`

**large-article.html** (currently: `content` defined + type check)
- Assert `title` is `"Large Article for Performance Testing"`
- Assert `author` is `"Performance Tester"`
- Assert `content.length > 500` (substantial extraction confirmed)

**malformed.html** (currently: `content` defined)
- Assert `content` includes `"Article with Broken HTML"` (the `<h1>` text recovered despite broken structure)

### 3. Coverage in CI

`npm run test:coverage` (already defined in `package.json`) replaces `npm test` in the new workflow. `jest.config.js` already has `collectCoverageFrom`, `coverageDirectory`, and `coverageReporters` configured — no changes needed there. Coverage output appears in CI logs. No threshold enforcement initially; visibility is the goal.

## Out of Scope

- Coverage threshold enforcement (can be added later in `jest.config.js`)
- Coverage upload to external service (e.g., Codecov)
- Changes to `publish.yml`

## Files Changed

| File | Change |
|------|--------|
| `.github/workflows/test.yml` | New file |
| `nodes/Defuddle/__tests__/Defuddle.node.test.ts` | Extended assertions for unicode, large-article, malformed fixtures |
