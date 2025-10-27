## ADDED Requirements

### Requirement: CLAUDE.md Testing Documentation

The CLAUDE.md file SHALL be updated to include comprehensive testing conventions and guidelines for AI assistants working on the project.

#### Scenario: Testing commands section

- **WHEN** CLAUDE.md is updated with testing information
- **THEN** it SHALL include a "Testing" section in the "Build and Development Commands" area
- **AND** it SHALL document the `npm test` command with description
- **AND** it SHALL document the `npm run test:watch` command for development
- **AND** it SHALL document the `npm run test:coverage` command for coverage reports
- **AND** it SHALL explain when to use each command

#### Scenario: Testing conventions section

- **WHEN** CLAUDE.md is updated with testing conventions
- **THEN** it SHALL include a "Testing Conventions" section under "Project Conventions"
- **AND** it SHALL explain the test file structure (`__tests__/` directories)
- **AND** it SHALL explain the naming convention (`.test.ts` extension)
- **AND** it SHALL explain the fixture organization (`fixtures/` subdirectory)
- **AND** it SHALL specify coverage expectations (>80% target)

#### Scenario: Pre-commit hook documentation

- **WHEN** CLAUDE.md is updated with pre-commit information
- **THEN** it SHALL explain that Husky manages pre-commit hooks
- **AND** it SHALL document the hook execution order (lint → test → build)
- **AND** it SHALL explain that hooks prevent committing broken code
- **AND** it SHALL document the `--no-verify` bypass option and when to use it (exceptional cases only)
- **AND** it SHALL provide troubleshooting guidance for hook failures

#### Scenario: Test writing guidelines

- **WHEN** CLAUDE.md includes test writing guidance
- **THEN** it SHALL explain how to mock IExecuteFunctions for n8n integration tests
- **AND** it SHALL explain how to use test fixtures for HTML inputs
- **AND** it SHALL emphasize testing security constraints (JSDOM sandboxing)
- **AND** it SHALL emphasize testing error handling paths
- **AND** it SHALL explain that tests should focus on node logic, not library internals

### Requirement: openspec/project.md Testing Strategy Update

The openspec/project.md file SHALL be updated to reflect the new comprehensive testing approach replacing the previous "no tests" state.

#### Scenario: Testing strategy section update

- **WHEN** openspec/project.md is updated
- **THEN** the "Testing Strategy" section SHALL be modified to reflect current state
- **AND** it SHALL remove language stating "No automated tests currently implemented"
- **AND** it SHALL document that Jest is the testing framework
- **AND** it SHALL document that tests are co-located in `__tests__/` directories
- **AND** it SHALL document the coverage target (>80%)

#### Scenario: Current state documentation

- **WHEN** openspec/project.md testing section is updated
- **THEN** it SHALL state that comprehensive automated tests are implemented
- **AND** it SHALL list test categories: feature tests, security tests, error handling, edge cases, integration tests
- **AND** it SHALL document that pre-commit hooks enforce test passing
- **AND** it SHALL document that prepublishOnly hook includes test execution

#### Scenario: Testing requirements documentation

- **WHEN** openspec/project.md is updated
- **THEN** it SHALL document that all new features MUST include tests
- **AND** it SHALL document that tests MUST pass before commits (enforced via Husky)
- **AND** it SHALL document that tests MUST pass before publishing (enforced via prepublishOnly)
- **AND** it SHALL document the fast-fail pipeline order (lint → test → build)

### Requirement: README.md Testing Information

The README.md file SHALL be updated to include testing information for external users and contributors.

#### Scenario: Development section addition

- **WHEN** README.md is updated with testing information
- **THEN** it SHALL include a "Development" or "Testing" section
- **AND** the section SHALL explain how to run tests (`npm test`)
- **AND** the section SHALL explain how to run tests in watch mode (`npm run test:watch`)
- **AND** the section SHALL explain how to generate coverage reports (`npm run test:coverage`)
- **AND** the section SHALL mention that tests run automatically before commits via Husky

#### Scenario: Contributing guidelines

- **WHEN** README.md includes contribution information
- **THEN** it SHALL mention that all contributions MUST include tests
- **AND** it SHALL explain that pre-commit hooks will block commits with failing tests
- **AND** it SHALL provide guidance on running tests locally before committing

#### Scenario: Version history entry

- **WHEN** the testing change is implemented and ready for release
- **THEN** README.md "Version History" section SHALL be updated with a new version entry
- **AND** the entry SHALL list the addition of comprehensive Jest testing infrastructure
- **AND** the entry SHALL list the addition of Husky pre-commit hooks
- **AND** the entry SHALL mention documentation updates
- **AND** the entry SHALL follow the existing version history format

### Requirement: package.json Script Documentation

The package.json file SHALL be updated with test-related scripts that are well-documented via naming and usage.

#### Scenario: Test scripts addition

- **WHEN** package.json is updated with test scripts
- **THEN** it SHALL include a "test" script that runs Jest
- **AND** it SHALL include a "test:watch" script that runs Jest in watch mode
- **AND** it SHALL include a "test:coverage" script that generates coverage reports
- **AND** script names SHALL follow npm conventions (colon-separated namespacing)

#### Scenario: prepublishOnly script update

- **WHEN** package.json prepublishOnly script is updated
- **THEN** it SHALL be changed from "npm run build && npm run lint" to "npm run build && npm run lint && npm run test"
- **AND** tests SHALL run after linting to catch behavioral issues before publishing
- **AND** any test failure SHALL prevent publishing to npm

### Requirement: Test Fixture Documentation

Test fixtures SHALL be documented inline via comments and descriptive filenames to explain their purpose.

#### Scenario: Fixture file naming

- **WHEN** HTML fixture files are created
- **THEN** filenames SHALL be descriptive and indicate the test scenario (e.g., `simple-article.html`, `malicious-xss.html`)
- **AND** filenames SHALL use kebab-case
- **AND** filenames SHALL use the `.html` extension

#### Scenario: Fixture file comments

- **WHEN** HTML fixture files are created
- **THEN** each fixture SHALL include an HTML comment at the top explaining its purpose
- **AND** the comment SHALL describe what aspect of the node is being tested with this fixture
- **AND** the comment SHALL note any special characteristics (e.g., "Contains script tags to test sandboxing")

#### Scenario: Fixture directory structure

- **WHEN** test fixtures are organized
- **THEN** all fixtures SHALL be in `nodes/Defuddle/__tests__/fixtures/` directory
- **AND** fixtures MAY be further organized into subdirectories if categories emerge (e.g., `security/`, `edge-cases/`)
- **AND** a `README.md` in the fixtures directory SHOULD explain the fixture organization (optional, if helpful)

### Requirement: Inline Test Documentation

Test files SHALL include clear documentation via describe blocks, test names, and comments to explain test intent.

#### Scenario: Test suite organization

- **WHEN** test files are written
- **THEN** related tests SHALL be grouped in `describe()` blocks
- **AND** describe blocks SHALL use clear category names (e.g., "Content Extraction", "Security", "Error Handling")
- **AND** nested describe blocks MAY be used for sub-categories

#### Scenario: Test case naming

- **WHEN** individual test cases are written
- **THEN** test names (in `it()` or `test()` blocks) SHALL clearly describe what is being tested
- **AND** test names SHALL be readable as sentences when prefixed with "it" (e.g., "it should extract content from simple HTML")
- **AND** test names SHALL avoid abbreviations unless widely understood

#### Scenario: Complex test explanation

- **WHEN** a test involves complex setup or mocking
- **THEN** comments SHALL explain non-obvious test logic
- **AND** comments SHALL explain why specific test values or fixtures are used
- **AND** comments SHALL explain any workarounds for n8n interface mocking
