# Release Checklist for n8n Community Node

This checklist should be followed every time a new version is ready for release.

## Pre-Release Verification

- [ ] All features/fixes for this release are complete and merged
- [ ] All tests passing (47 tests, enforced by pre-commit hooks)
- [ ] No linting errors (`npm run lint`)
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Test coverage meets target (>80%, currently ~100%)
- [ ] Check `.gitignore` file: Review and update if recent changes require ignoring additional files/directories
- [ ] Check for archivable OpenSpec changes: Run `openspec list` to verify if any completed changes need archiving

## Version & Documentation Updates

- [ ] **Determine version number** following semantic versioning:
  - Patch (0.x.Y): Bug fixes, minor improvements, dependency updates
  - Minor (0.X.0): New features, new options, backward compatible changes
  - Major (X.0.0): Breaking changes (rarely needed for this node)

- [ ] **Update README.md Version History**:
  - Change `### 0.X.0 (Upcoming)` to `### 0.X.0` with no date suffix
  - Add comprehensive bullet points describing all changes
  - Categorize changes:
    - New features and capabilities
    - Bug fixes and improvements
    - Dependency updates
    - Breaking changes (if any)
    - Security fixes (if any)
  - Keep description concise but complete
  - Create new `### 0.X+1.0 (Upcoming)` section for next release

- [ ] **Review README.md content**:
  - Ensure all new features are documented in Usage section
  - Update configuration options if new parameters added
  - Verify code examples are accurate
  - Check test count if changed (currently 47 tests)
  - Update coverage percentage if changed (currently ~100%)
  - Confirm compatibility requirements (Node.js 20+, n8n 1.20.0+)

- [ ] **Review package.json**:
  - Verify description is accurate (shown in n8n Community Nodes UI)
  - Check keywords are relevant for npm/n8n discoverability
  - Confirm all dependencies are at correct versions
  - Ensure `files` array includes only `dist` directory

- [ ] Review `.gitignore`: Ensure all build artifacts, temporary files, and sensitive data are properly ignored

- [ ] **Update other documentation** if needed:
  - CLAUDE.md (project context for AI assistants)
  - openspec/project.md (comprehensive project documentation)
  - Design documents in openspec/changes/ (if architectural changes)

## Testing & Quality Assurance

- [ ] **Run full test suite**: `npm test`
  - All 47 tests must pass
  - Pre-commit hook enforces this, but verify manually

- [ ] **Generate coverage report**: `npm run test:coverage`
  - Verify coverage remains >80% (target met: ~100%)
  - Check for any uncovered critical code paths

- [ ] **Run linting**: `npm run lint`
  - Must pass with zero errors
  - Includes n8n community node specific rules

- [ ] **Test build process**: `npm run build`
  - TypeScript compilation succeeds
  - Icons copied to dist/ correctly
  - No build warnings

- [ ] **Test in actual n8n** (manual testing):
  - Install package in local n8n instance
  - Test with HTTP Request → Defuddle workflow
  - Verify all content format modes (HTML, Markdown, Both)
  - Test error handling with invalid input
  - Confirm output field filtering works
  - Test all Defuddle options (removeImages, removeSelectors, debug)

## OpenSpec Management

- [ ] **Archive completed OpenSpec changes**:

  ```bash
  openspec list
  ```

  - If any completed changes are listed, archive them:

    ```bash
    openspec archive <change-id> --yes
    ```

    Or if specs are already updated manually:

    ```bash
    openspec archive <change-id> --yes --skip-specs
    ```

  - Verify archive was created:

    ```bash
    openspec validate --all --strict
    ```

- [ ] **Stage OpenSpec changes** (if any were archived):

  ```bash
  git add openspec/
  ```

## Commit & Version Bump

**IMPORTANT:** Commit README.md changes BEFORE running `npm version`

- [ ] **Stage README.md and other documentation changes**:

  ```bash
  git add README.md CLAUDE.md openspec/project.md [other-modified-files]
  ```

- [ ] **Commit documentation updates**:

  ```bash
  git commit -m "Update documentation for version X.Y.Z release

  - Update README.md version history with changelog
  - [Other documentation changes]

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```

  - Pre-commit hook will run: lint → test → build automatically

- [ ] **Bump version with npm** (creates commit + tag automatically):

  ```bash
  npm version patch   # for 0.x.Y (bug fixes)
  npm version minor   # for 0.X.0 (new features)
  npm version major   # for X.0.0 (breaking changes)
  ```

  - This updates package.json and package-lock.json
  - Creates git commit: "X.Y.Z"
  - Creates git tag: "vX.Y.Z"

## Push to GitHub & Trigger Automated Publishing

- [ ] **Push commits and tags to GitHub**:

  ```bash
  git push && git push --tags
  ```

  - Pushes the version commit created by `npm version`
  - Pushes the vX.Y.Z tag
  - **This automatically triggers the GitHub Actions publish workflow** (.github/workflows/publish.yml)

- [ ] **Verify GitHub push**:
  - Visit: https://github.com/MichaelvanLaar/n8n-nodes-defuddle
  - Confirm new commit appears
  - Check tag appears in tags list

## Monitor Automated Publishing

- [ ] **Watch GitHub Actions workflow**:
  - Visit: https://github.com/MichaelvanLaar/n8n-nodes-defuddle/actions
  - Click on the running "Publish Package" workflow
  - Monitor the steps: checkout → build → lint → test → publish
  - Wait for green checkmark (usually 2-3 minutes)
  - If workflow fails, check logs and fix issues before retrying

- [ ] **Verify npm publication** (1-2 minutes after workflow succeeds):
  - Visit: https://www.npmjs.com/package/@michaelvanlaar/n8n-nodes-defuddle
  - Confirm new version number is displayed
  - Check README renders correctly on npm page
  - Verify last publish time is recent
  - Verify provenance attestation badge appears (OIDC benefit)

## GitHub Release

- [ ] **Create GitHub release with changelog**:

  ```bash
  gh release create vX.Y.Z --title "vX.Y.Z" --notes "$(cat <<'EOF'
  ## Changes

  - [Copy bullet points from README.md version history]
  - [Use exact same text for consistency]

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  EOF
  )"
  ```

- [ ] **Verify GitHub release**:
  - Visit: https://github.com/MichaelvanLaar/n8n-nodes-defuddle/releases
  - Confirm release appears with correct version
  - Check release notes render correctly
  - Verify it's marked as "Latest" release

## Post-Release Verification

- [ ] **Test installation from npm**:

  ```bash
  npm install @michaelvanlaar/n8n-nodes-defuddle
  ```

  - In a test n8n installation

- [ ] **Test via n8n Community Nodes UI**:
  - Open n8n instance
  - Go to Settings > Community Nodes
  - Install: `@michaelvanlaar/n8n-nodes-defuddle`
  - Verify installation succeeds
  - Confirm node appears in n8n node palette

- [ ] **Smoke test in n8n**:
  - Create workflow: HTTP Request → Defuddle
  - Fetch a webpage and extract content
  - Verify output is correct
  - Test at least one of each: HTML only, Markdown only, Both

- [ ] **Update project tracking** (if applicable):
  - Close issues fixed in this release
  - Update project milestones
  - Archive completed OpenSpec changes: `openspec archive <change-id>`

- [ ] **Announce release** (optional):
  - n8n Community Forum: https://community.n8n.io/
  - GitHub Discussions (if enabled)
  - Social media for significant releases

## Rollback Procedure (if needed)

If critical issues are discovered after publishing:

1. **Deprecate broken version on npm**:

   ```bash
   npm deprecate @michaelvanlaar/n8n-nodes-defuddle@X.Y.Z "Critical bug - use version X.Y.Z+1 instead"
   ```

2. **Delete GitHub release and tag** (optional, prevents confusion):

   ```bash
   gh release delete vX.Y.Z --yes
   git push --delete origin vX.Y.Z  # Delete remote tag
   git tag -d vX.Y.Z                # Delete local tag
   ```

3. **Create hotfix**:
   - Fix the critical issue
   - Follow this checklist again for patch release (X.Y.Z+1)
   - Note the fix in version history
   - Push tag to trigger automated publish via GitHub Actions

**Notes:**
- Cannot unpublish from npm after 72 hours. Use deprecation instead.
- If GitHub Actions workflow failed, no npm publish occurred - just fix and re-push the tag
- To re-trigger workflow: delete and recreate the tag, or create a new patch version

## Troubleshooting GitHub Actions Workflow

If the automated publish workflow fails:

1. **Check the workflow logs**:
   - Visit: https://github.com/MichaelvanLaar/n8n-nodes-defuddle/actions
   - Click the failed workflow run
   - Review logs to identify the failure point

2. **Common failure scenarios**:
   - **Build fails**: Fix TypeScript errors, run `npm run build` locally first
   - **Lint fails**: Fix linting errors, run `npm run lint` locally first
   - **Tests fail**: Fix test failures, run `npm test` locally first
   - **Publish fails**: Check npm OIDC configuration, verify package name/scope

3. **Fix and retry**:
   ```bash
   # Fix the issue locally and test
   npm run build && npm run lint && npm test

   # Delete the tag (local and remote)
   git tag -d vX.Y.Z
   git push --delete origin vX.Y.Z

   # Create a new patch version (or recreate same tag if no code changes)
   npm version patch  # Creates new version
   # OR
   git tag vX.Y.Z     # Recreate same tag if just fixing workflow

   # Push again to trigger workflow
   git push --tags
   ```

---

## Quick Reference Commands

```bash
# Development workflow
npm run dev           # Watch mode for development
npm run lint          # Check for linting errors
npm run lintfix       # Auto-fix linting issues
npm test              # Run test suite
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run build         # Build for production

# Release workflow (in order)
git add README.md     # Stage documentation
git commit -m "..."   # Commit documentation updates
npm version minor     # Bump version (patch/minor/major)
git push --tags       # Push commits and tags (triggers automated publish)
# Monitor GitHub Actions workflow at /actions
gh release create...  # Create GitHub release
```

## Version Number Guide

- **Patch** (0.2.6): Bug fixes, dependency updates, documentation improvements
- **Minor** (0.3.0): New features, new options, new output fields, backward compatible
- **Major** (1.0.0): Breaking changes, removed features, API changes (rare for this node)

## Important Notes

- **Pre-commit hooks** run lint → test → build before every commit (via Husky)
- **Automated publishing** via GitHub Actions when version tags are pushed (no manual `npm publish`)
- **OIDC authentication** with npm Trusted Publishers (no npm token in secrets)
- **Provenance attestations** automatically generated for published packages (cryptographic proof of build source)
- **GitHub Actions workflow** runs build → lint → test → publish (same as prepublishOnly, but in CI)
- **All 47 tests must pass** before release (enforced by hooks and CI)
- **README.md must be updated BEFORE `npm version`** (npm version creates commit automatically)
- Use **same changelog text** in README.md and GitHub release for consistency
- Follow **semantic versioning**: https://semver.org/
- Update version history **throughout development**, not just at release time
- Package requires **Node.js 20+** and **n8n 1.20.0+**
- Only **`dist/` directory** is published to npm (configured in package.json `files`)
- **Review `.gitignore`** before each release to ensure proper file exclusion
- **Archive OpenSpec changes** as part of release to keep specs synchronized with released code

## Testing Requirements

- **Unit Tests**: All 47 tests must pass
- **Coverage**: >80% (currently ~100%)
- **Linting**: Zero errors (n8n community node rules + TypeScript ESLint)
- **Build**: Clean build with no warnings
- **Manual Testing**: Test in actual n8n instance before publishing

## Dependencies

This project uses:

- **Jest** for testing
- **ts-jest** for TypeScript support in tests
- **Husky** for Git hooks
- **ESLint** for linting (flat config format)
- **Prettier** for code formatting
- **TypeScript** for compilation
- **gulp** for build tasks (icon copying)
