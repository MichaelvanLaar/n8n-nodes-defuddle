## Why

The project currently has no automated testing infrastructure, relying solely on manual testing via n8n workflow execution. This creates significant risks for regressions, security vulnerabilities, and incorrect behavior when making changes. Comprehensive automated testing is essential to:

- Ensure all node features work correctly across different configurations
- Catch potential security vulnerabilities in HTML parsing and JSDOM sandboxing
- Prevent regressions when refactoring or adding new features
- Validate error handling and edge cases that are difficult to test manually
- Provide confidence when publishing new versions

## What Changes

- **Add Jest testing framework** with TypeScript support for comprehensive unit and integration testing
- **Create test suites** covering:
  - All node features (HTML/Markdown conversion, output field filtering, content extraction options)
  - Security validation (JSDOM sandboxing, script blocking, external resource blocking)
  - Error handling scenarios (missing HTML, invalid input, JSDOM failures)
  - Edge cases (empty content, malformed HTML, special characters, large documents)
  - n8n integration points (IExecuteFunctions mocking, parameter handling, error propagation)
- **Add Husky pre-commit hooks** to automatically run tests, linting, and build before commits
- **Update package.json scripts** with test commands (test, test:watch, test:coverage)
- **Update internal documentation** (CLAUDE.md, openspec/project.md) with testing conventions
- **Update external documentation** (README.md) with testing information and version history

## Impact

- **Affected specs**:
  - `testing-infrastructure` (NEW) - Jest configuration and test structure
  - `pre-commit-automation` (NEW) - Husky hooks for automated quality checks
  - `documentation` (NEW) - Documentation updates for testing practices

- **Affected code**:
  - `package.json` - Add Jest, Husky, and related dependencies; add test scripts
  - `jest.config.js` (NEW) - Jest configuration for TypeScript
  - `.husky/pre-commit` (NEW) - Pre-commit hook script
  - `nodes/Defuddle/__tests__/` (NEW) - Test files directory
  - `nodes/Defuddle/__tests__/Defuddle.node.test.ts` (NEW) - Main test suite
  - `nodes/Defuddle/__tests__/fixtures/` (NEW) - HTML test fixtures
  - `CLAUDE.md` - Add testing conventions section
  - `openspec/project.md` - Update testing strategy from "no tests" to comprehensive approach
  - `README.md` - Add testing section and version history entry

- **Build pipeline**:
  - Tests will run automatically before every commit via Husky
  - `prepublishOnly` hook will include test execution (build + lint + test)
  - No changes to existing build/lint workflows
