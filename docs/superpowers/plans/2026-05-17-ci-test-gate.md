# CI Test Gate & Fixture Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a push/PR CI test gate and extend three fixture tests to assert meaningful output rather than just "doesn't throw."

**Architecture:** New `.github/workflows/test.yml` mirrors the publish workflow steps (checkout → setup-node → update npm → ci → lint → test:coverage) without the publish step. Three existing test cases in `Defuddle.node.test.ts` get additional assertions targeting known content in their respective HTML fixtures.

**Tech Stack:** GitHub Actions, Jest (with `--coverage`), TypeScript, n8n-workflow

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `.github/workflows/test.yml` | Create | Push/PR test gate |
| `nodes/Defuddle/__tests__/Defuddle.node.test.ts:689-706` | Modify | Large-article: add title, author, length assertions |
| `nodes/Defuddle/__tests__/Defuddle.node.test.ts:708-724` | Modify | Unicode: add title and content charset assertions |
| `nodes/Defuddle/__tests__/Defuddle.node.test.ts:613-630` | Modify | Malformed: add content-includes-heading assertion |

---

## Task 1: Create test.yml workflow

**Files:**
- Create: `.github/workflows/test.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/test.yml` with this exact content:

```yaml
name: Test

on:
    push:
        branches:
            - "**"
    pull_request:

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: actions/setup-node@v4
              with:
                  node-version: "20"

            - name: Update npm
              run: npm install -g npm@latest

            - run: npm ci

            - run: npm run lint

            - run: npm run test:coverage
```

Note: indentation uses 4 spaces throughout, matching the style of `publish.yml`.

- [ ] **Step 2: Verify the file is syntactically valid**

Run:
```bash
cat .github/workflows/test.yml
```
Expected: file displays cleanly with correct indentation.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "✨ ci: add push/PR test gate with coverage"
```

---

## Task 2: Extend unicode fixture assertions

**Files:**
- Modify: `nodes/Defuddle/__tests__/Defuddle.node.test.ts:708-724`

The fixture `unicode.html` has `<title>Unicode Test 🌍</title>` and article body containing `Привет, 世界, مرحبا`. The current test only checks `content` is defined.

- [ ] **Step 1: Replace the existing unicode test assertions**

In `nodes/Defuddle/__tests__/Defuddle.node.test.ts`, find the test at line 708 (`'should handle Unicode and special characters'`). Replace the assertion block (lines 722–724) from:

```typescript
			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
```

with:

```typescript
			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toContain('Unicode Test');
			const unicodeContent = result[0][0].json.content as string;
			expect(unicodeContent).toContain('Привет');
```

- [ ] **Step 2: Run the test to verify it passes**

```bash
npm test -- --testNamePattern="should handle Unicode and special characters"
```

Expected output: `PASS` with 1 test passing. If it fails, check whether Defuddle is extracting the `<p>` tags from the `<article>` element correctly.

- [ ] **Step 3: Commit**

```bash
git add nodes/Defuddle/__tests__/Defuddle.node.test.ts
git commit -m "✅ test: assert unicode title and Cyrillic content extraction"
```

---

## Task 3: Extend large-article fixture assertions

**Files:**
- Modify: `nodes/Defuddle/__tests__/Defuddle.node.test.ts:689-706`

The fixture `large-article.html` has `<title>Large Article for Performance Testing</title>`, `<meta name="author" content="Performance Tester">`, and 20 paragraphs of body text. The current test only checks `content` is defined and is a string.

- [ ] **Step 1: Replace the existing large-article test assertions**

Find the test at line 689 (`'should handle very large HTML documents'`). Replace the assertion block (lines 703–706) from:

```typescript
			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
			expect(typeof result[0][0].json.content).toBe('string');
```

with:

```typescript
			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
			expect(typeof result[0][0].json.content).toBe('string');
			expect(result[0][0].json.title).toBe('Large Article for Performance Testing');
			expect(result[0][0].json.author).toBe('Performance Tester');
			expect((result[0][0].json.content as string).length).toBeGreaterThan(500);
```

- [ ] **Step 2: Run the test to verify it passes**

```bash
npm test -- --testNamePattern="should handle very large HTML documents"
```

Expected output: `PASS` with 1 test passing. If `author` assertion fails, Defuddle may be returning the author differently — inspect the actual value with `console.log(result[0][0].json.author)` and adjust the assertion to match.

- [ ] **Step 3: Commit**

```bash
git add nodes/Defuddle/__tests__/Defuddle.node.test.ts
git commit -m "✅ test: assert large-article title, author, and content length"
```

---

## Task 4: Extend malformed fixture assertions

**Files:**
- Modify: `nodes/Defuddle/__tests__/Defuddle.node.test.ts:613-630`

The fixture `malformed.html` has `<h1>Article with Broken HTML</h1>` inside an `<article>` with unclosed tags and no closing `</body>` or `</html>`. The current test only checks `content` is defined.

- [ ] **Step 1: Replace the existing malformed test assertions**

Find the test at line 613 (`'should handle malformed HTML without crashing'`). Replace the assertion block (lines 628–630) from:

```typescript
			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
```

with:

```typescript
			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.content as string).toContain('Article with Broken HTML');
```

- [ ] **Step 2: Run the test to verify it passes**

```bash
npm test -- --testNamePattern="should handle malformed HTML without crashing"
```

Expected output: `PASS` with 1 test passing. If it fails, Defuddle may be returning the h1 text in the `title` field rather than `content` — check with `console.log(JSON.stringify(result[0][0].json, null, 2))` and adjust if needed.

- [ ] **Step 3: Run the full test suite to confirm nothing is broken**

```bash
npm test
```

Expected: `47 tests passed`. Zero failures. (We're extending existing test cases, not adding new `it()` blocks, so the count stays at 47.)

- [ ] **Step 4: Commit**

```bash
git add nodes/Defuddle/__tests__/Defuddle.node.test.ts
git commit -m "✅ test: assert malformed HTML heading is recovered in content"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|-----------------|------|
| Add test.yml triggering on push (all branches) and pull_request | Task 1 |
| Run `npm run lint` in CI | Task 1 |
| Run `npm run test:coverage` in CI | Task 1 |
| unicode: assert title and non-ASCII content | Task 2 |
| large-article: assert title, author, content length | Task 3 |
| malformed: assert heading text recovered | Task 4 |
