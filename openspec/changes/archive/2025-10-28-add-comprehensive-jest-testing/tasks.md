## 1. Setup Jest Testing Infrastructure

- [x] 1.1 Install Jest and TypeScript dependencies (@types/jest, ts-jest, jest)
- [x] 1.2 Create jest.config.js with TypeScript support and coverage configuration
- [x] 1.3 Add test scripts to package.json (test, test:watch, test:coverage)
- [x] 1.4 Create test directory structure (nodes/Defuddle/__tests__/)
- [x] 1.5 Create HTML test fixtures directory with sample HTML files

## 2. Create Core Test Suites

- [x] 2.1 Write tests for basic content extraction (HTML input → extracted content)
- [x] 2.2 Write tests for HTML/Markdown conversion (all three content format modes)
- [x] 2.3 Write tests for output field filtering (default fields, custom selection)
- [x] 2.4 Write tests for Defuddle options (removeImages, removeExactSelectors, removePartialSelectors, debug)
- [x] 2.5 Write tests for URL parameter handling (with/without URL, relative link resolution)

## 3. Create Security and Error Handling Tests

- [x] 3.1 Write tests validating JSDOM sandboxing (scripts blocked, external resources blocked)
- [x] 3.2 Write tests for malicious HTML scenarios (XSS attempts, script tags, external resources)
- [x] 3.3 Write tests for error handling (missing HTML, empty HTML, invalid HTML)
- [x] 3.4 Write tests for NodeOperationError scenarios (empty htmlSource parameter)
- [x] 3.5 Write tests for continueOnFail behavior (error objects in output)

## 4. Create Edge Case and Integration Tests

- [x] 4.1 Write tests for edge cases (very large HTML, special characters, Unicode, malformed HTML)
- [x] 4.2 Write tests for n8n integration (IExecuteFunctions mocking, parameter retrieval)
- [x] 4.3 Write tests for multiple items processing (batch execution through execute method)
- [x] 4.4 Write tests for pairedItem behavior (correct item indexing)
- [x] 4.5 Write tests for all output fields (content, title, author, description, domain, wordCount, published, image, schemaOrgData)

## 5. Setup Pre-Commit Automation

- [x] 5.1 Install Husky as dev dependency
- [x] 5.2 Initialize Husky and create .husky directory
- [x] 5.3 Create pre-commit hook script (.husky/pre-commit)
- [x] 5.4 Configure pre-commit to run: lint → test → build (fail fast on any failure)
- [x] 5.5 Test pre-commit hook with intentional test failure to verify blocking

## 6. Update Documentation

- [x] 6.1 Update CLAUDE.md with testing conventions and commands
- [x] 6.2 Update openspec/project.md testing strategy section
- [x] 6.3 Update README.md with testing section (running tests, coverage)
- [x] 6.4 Update package.json prepublishOnly script to include tests
- [x] 6.5 Add version history entry to README.md for this change

## 7. Validation and Quality Checks

- [x] 7.1 Run test suite and ensure 100% pass rate
- [x] 7.2 Generate coverage report and verify adequate coverage (target: >80%)
- [x] 7.3 Test pre-commit hook by making a commit
- [x] 7.4 Verify all tests pass in CI/CD context (if applicable)
- [x] 7.5 Run full build and publish workflow to ensure no breakage
