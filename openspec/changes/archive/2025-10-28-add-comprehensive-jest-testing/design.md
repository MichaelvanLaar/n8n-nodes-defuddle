## Context

This is an n8n community node package with a single node implementation (Defuddle.node.ts) that:
- Parses HTML using JSDOM with security hardening
- Extracts content via the Defuddle library
- Converts HTML to Markdown via Turndown
- Supports configurable output filtering

Currently, there is no automated testing. Testing is done manually through n8n workflow execution, which:
- Cannot easily test security edge cases (XSS, script execution attempts)
- Doesn't validate error handling paths
- Provides no regression protection
- Makes refactoring risky

The testing infrastructure must integrate with the existing n8n development workflow without disrupting the build/publish pipeline.

## Goals / Non-Goals

**Goals:**
- Comprehensive test coverage for all node features and configurations
- Security validation ensuring JSDOM sandboxing prevents script execution and external resource loading
- Error handling validation for all failure modes (missing input, invalid HTML, JSDOM errors)
- Edge case coverage (empty content, malformed HTML, Unicode, large documents)
- Pre-commit automation to prevent committing broken code
- Clear testing conventions documented for future maintenance

**Non-Goals:**
- End-to-end workflow testing in actual n8n environment (requires full n8n setup)
- Performance benchmarking (not a current concern for this node)
- Testing Defuddle library internals (external dependency, trust upstream tests)
- Testing JSDOM library internals (external dependency, trust upstream tests)
- Testing Turndown library internals (external dependency, trust upstream tests)

## Decisions

### Testing Framework: Jest

**Decision:** Use Jest with ts-jest for TypeScript support

**Rationale:**
- Industry standard with excellent TypeScript support via ts-jest
- Built-in mocking capabilities essential for n8n IExecuteFunctions
- Coverage reporting included
- Watch mode for development
- Widely documented, easy for contributors to understand

**Alternatives considered:**
- Vitest: Modern and faster, but Jest is more established for Node.js projects
- Mocha + Chai: Requires more setup, less integrated experience

### Test Structure: Co-located with Node

**Decision:** Place tests in `nodes/Defuddle/__tests__/` directory

**Rationale:**
- Follows n8n community node conventions
- Tests live close to implementation
- Easy to find related tests when modifying node
- Clear namespace separation via __tests__ directory

**Alternatives considered:**
- Separate top-level `test/` directory: More distance from implementation, harder to maintain

### Mock Strategy: Manual Mocks for IExecuteFunctions

**Decision:** Create hand-written mock implementation of IExecuteFunctions

**Rationale:**
- n8n-workflow types are complex and deeply nested
- Manual mocks provide precise control over test scenarios
- Easier to understand test setup without mock framework magic
- Can simulate all parameter types (string, boolean, options, collection, multiOptions)

**Alternatives considered:**
- jest.mock() auto-mocking: Too unpredictable for complex n8n interfaces
- Using actual n8n test utilities: Would require n8n as dev dependency, heavyweight

### Test Fixtures: HTML Files

**Decision:** Store sample HTML in `nodes/Defuddle/__tests__/fixtures/` as .html files

**Rationale:**
- Real-world HTML examples (news articles, blog posts)
- Easier to read/maintain than inline strings
- Can test different HTML structures and edge cases
- Reusable across multiple test cases

**Fixture categories:**
- `simple-article.html` - Basic clean article
- `complex-article.html` - Article with ads, navigation, scripts
- `malicious.html` - HTML with XSS attempts, script tags
- `malformed.html` - Invalid/broken HTML
- `unicode.html` - Special characters and Unicode
- `empty.html` - Minimal/empty content
- `large-article.html` - Very large document for performance edge case

### Pre-Commit Hook: Husky

**Decision:** Use Husky for Git hooks with fast-fail pipeline (lint → test → build)

**Rationale:**
- Industry standard, simple setup
- Cross-platform support
- Fast-fail order: lint (fastest) → test (medium) → build (slowest)
- Prevents broken commits from entering history

**Hook sequence:**
1. `npm run lint` - Catch style issues immediately (fastest)
2. `npm run test` - Validate behavior (medium speed)
3. `npm run build` - Ensure compilation succeeds (slowest)

Any failure stops the commit with clear error message.

**Alternatives considered:**
- lint-staged: Overkill for this project (single node, small codebase)
- Manual discipline: Unreliable, humans forget

### Coverage Target: 80% Minimum

**Decision:** Target >80% code coverage, measure with Jest coverage reports

**Rationale:**
- Balance between thoroughness and diminishing returns
- Focus on critical paths: execute method, convertToMarkdown function
- Some low-value paths (type definitions, n8n metadata) excluded
- Coverage tracked but not enforced as blocking (advisory)

**Not enforcing coverage thresholds via CI (for now):**
- Project is small, manual review sufficient
- Can add later if coverage degrades

## Test Categories

### 1. Feature Tests
- Content extraction with different Defuddle options
- HTML/Markdown conversion modes (html, markdown, both)
- Output field filtering (default, custom selection)
- URL parameter handling

### 2. Security Tests
- JSDOM sandboxing validation
- Script execution blocking
- External resource blocking
- XSS attempt handling

### 3. Error Handling Tests
- Missing htmlSource parameter
- Empty/invalid HTML input
- JSDOM parsing failures
- continueOnFail behavior

### 4. Edge Case Tests
- Very large HTML documents
- Special characters and Unicode
- Malformed/broken HTML
- Empty content extraction

### 5. Integration Tests
- IExecuteFunctions mocking
- Parameter retrieval from n8n
- Multiple items processing (batch execution)
- Paired item indexing

## Risks / Trade-offs

### Risk: Test Brittleness from Defuddle/JSDOM Changes

**Mitigation:**
- Focus tests on this node's logic, not library internals
- Use snapshot testing sparingly (only for stable outputs)
- Mock external libraries if they become flaky
- Pin dependency versions and test before upgrading

### Risk: Pre-Commit Hook Slowness

**Impact:** If tests take >5 seconds, developers may bypass hooks with `--no-verify`

**Mitigation:**
- Keep test suite fast (current node is simple, tests should be <2s)
- Use `test:watch` during development to get instant feedback
- Fast-fail order (lint → test → build) exits early on common issues

**Fallback:** If test suite grows too slow, move to pre-push hook instead

### Risk: Mock Drift from Real n8n

**Impact:** Tests pass but node fails in actual n8n environment

**Mitigation:**
- Keep mock IExecuteFunctions aligned with n8n-workflow types
- Include manual testing workflow in README for final validation
- Update mocks when upgrading n8n-workflow peer dependency

### Trade-off: Test Maintenance Burden

**Downside:** More code to maintain (tests approximately equal to implementation size)

**Upside:**
- Regression protection far outweighs maintenance cost
- Tests serve as living documentation
- Refactoring becomes safer and faster

## Migration Plan

**Phase 1: Infrastructure Setup (Non-Breaking)**
1. Install Jest + Husky dependencies
2. Create jest.config.js and test directory structure
3. Add test scripts to package.json
4. No impact on existing workflows

**Phase 2: Test Implementation (Non-Breaking)**
1. Write all test suites incrementally
2. Tests exist alongside code, no functional changes
3. Can run `npm test` manually, not enforced yet

**Phase 3: Pre-Commit Activation (Breaking for Development)**
1. Initialize Husky and create pre-commit hook
2. **Breaking change for contributors**: Commits now blocked by failing tests/lint
3. Update CLAUDE.md and README.md with new workflow

**Rollback Plan:**
- Remove `.husky` directory to disable hooks
- Remove test scripts from package.json
- Tests remain but are not enforced

**Publishing Impact:**
- Update `prepublishOnly` to include `npm test` (after lint)
- If tests fail, publish is blocked (intentional safety)
- No impact on users, only on package publishing workflow

## Open Questions

1. **Should test coverage be enforced via Jest thresholds?**
   - **Decision:** Not initially. Monitor coverage manually, add enforcement if it degrades below 80%

2. **Should tests run in GitHub Actions CI/CD?**
   - **Current state:** Repository has .github/workflows/claude-code-review.yml
   - **Decision:** Out of scope for this change. Pre-commit hooks provide sufficient protection for now
   - **Future:** Can add CI/CD test run in separate change

3. **Should we test against multiple Node.js versions?**
   - **Decision:** No. Package requires Node.js 20+, test in that environment only
   - **Rationale:** Project uses jsdom which requires Node.js 20, no lower version support needed

4. **Should we include integration tests with actual n8n?**
   - **Decision:** No. Too heavyweight for unit test suite
   - **Alternative:** Document manual testing workflow in README for final validation before publishing
