## ADDED Requirements

### Requirement: Husky Pre-Commit Hook Installation

The project SHALL use Husky to manage Git hooks and automatically run quality checks before commits are allowed.

#### Scenario: Husky dependency installation

- **WHEN** the project dependencies are installed via npm install
- **THEN** Husky SHALL be listed as a devDependency in package.json
- **AND** Husky version SHALL be 9.x or later

#### Scenario: Husky initialization

- **WHEN** the repository is cloned and dependencies are installed
- **THEN** a `.husky/` directory SHALL exist in the project root
- **AND** the `.husky/pre-commit` file SHALL exist and be executable
- **AND** Git hooks SHALL be configured to use the .husky directory

### Requirement: Pre-Commit Quality Checks

The pre-commit hook SHALL run linting, testing, and build checks in fast-fail order to catch issues before they enter version control.

#### Scenario: Pre-commit hook execution order

- **WHEN** a developer attempts to create a Git commit
- **THEN** the pre-commit hook SHALL run `npm run lint` first
- **AND** if linting fails, the hook SHALL exit immediately without running tests or build
- **AND** if linting passes, the hook SHALL run `npm run test`
- **AND** if tests fail, the hook SHALL exit immediately without running build
- **AND** if tests pass, the hook SHALL run `npm run build`
- **AND** if build fails, the hook SHALL exit and prevent the commit
- **AND** if all checks pass, the commit SHALL proceed normally

#### Scenario: Pre-commit hook failure messaging

- **WHEN** any pre-commit check fails (lint, test, or build)
- **THEN** the hook SHALL display the error output in the terminal
- **AND** the hook SHALL exit with a non-zero exit code
- **AND** Git SHALL prevent the commit from being created
- **AND** the developer SHALL receive clear feedback on what failed

#### Scenario: Pre-commit hook bypass

- **WHEN** a developer runs `git commit --no-verify`
- **THEN** Git SHALL skip the pre-commit hook
- **AND** the commit SHALL be created without running quality checks
- **AND** this bypass SHALL only be used in exceptional circumstances (documented in CLAUDE.md)

### Requirement: Fast-Fail Pipeline Optimization

The pre-commit checks SHALL be ordered by execution speed to provide fastest possible feedback and minimize developer wait time.

#### Scenario: Lint-first optimization

- **WHEN** code has linting errors
- **THEN** the pre-commit hook SHALL fail within 1-3 seconds (linting is fastest)
- **AND** tests and build SHALL NOT run (saving 5-10+ seconds)

#### Scenario: Test-second optimization

- **WHEN** code passes linting but has test failures
- **THEN** the pre-commit hook SHALL fail within 3-5 seconds (after lint + test)
- **AND** build SHALL NOT run (saving 5+ seconds for TypeScript compilation)

#### Scenario: Build-last validation

- **WHEN** code passes linting and tests
- **THEN** the pre-commit hook SHALL run TypeScript compilation as final validation
- **AND** this ensures that code compiles correctly before commit
- **AND** this catches TypeScript errors that may not be caught by tests

### Requirement: Pre-Commit Hook Performance

The pre-commit hook SHALL complete quickly enough to not disrupt developer workflow while still providing comprehensive validation.

#### Scenario: Total execution time target

- **WHEN** all pre-commit checks pass
- **THEN** the total hook execution time SHOULD be under 10 seconds
- **AND** linting SHOULD complete in under 3 seconds
- **AND** testing SHOULD complete in under 5 seconds
- **AND** build SHOULD complete in under 5 seconds

#### Scenario: Performance degradation handling

- **WHEN** the test suite grows and execution time exceeds 10 seconds
- **THEN** the team SHOULD consider optimizing test performance
- **OR** the team SHOULD consider moving tests to a pre-push hook instead
- **AND** this decision SHOULD be documented in design.md

### Requirement: Integration with Publishing Workflow

The pre-commit hook checks SHALL integrate with the existing npm publishing workflow to ensure quality at multiple stages.

#### Scenario: prepublishOnly script integration

- **WHEN** the `prepublishOnly` script is updated
- **THEN** it SHALL run `npm run build && npm run lint && npm run test` in sequence
- **AND** if any step fails, publishing SHALL be blocked
- **AND** this ensures that only code passing all checks can be published to npm

#### Scenario: Version bump workflow compatibility

- **WHEN** a developer runs `npm version patch|minor|major`
- **THEN** the pre-commit hook SHALL run before the version commit is created
- **AND** if hooks fail, the version bump SHALL be aborted
- **AND** package.json and package-lock.json SHALL NOT be modified

### Requirement: Documentation of Hook Behavior

The project documentation SHALL clearly explain how pre-commit hooks work and how developers should interact with them.

#### Scenario: CLAUDE.md hook documentation

- **WHEN** CLAUDE.md is updated with hook information
- **THEN** it SHALL explain that pre-commit hooks run automatically
- **AND** it SHALL document the execution order (lint → test → build)
- **AND** it SHALL explain when to use --no-verify (exceptional cases only)
- **AND** it SHALL provide troubleshooting steps for common hook failures

#### Scenario: README.md hook documentation

- **WHEN** README.md is updated with development information
- **THEN** it SHALL mention that tests run automatically before commits
- **AND** it SHALL provide the command to run tests manually (`npm test`)
- **AND** it SHALL explain that Husky manages Git hooks
