# Project Context

## Purpose

This is an n8n community node package that extracts main content from webpages using the Defuddle library. The goal is to provide n8n users with a simple, reliable way to clean HTML content and extract the most relevant parts of webpages (similar to browser reader mode functionality).

**Key Goals:**
- Extract clean, readable content from HTML pages
- Support both HTML and Markdown output formats
- Provide configurable extraction options (image removal, ad filtering, etc.)
- Integrate seamlessly with n8n workflows (typically following HTTP Request nodes)
- Maintain security with sandboxed DOM parsing

## Tech Stack

**Core Technologies:**
- **TypeScript** 5.9.3 - Primary language (compiled to CommonJS for n8n)
- **Node.js** ≥20.0.0 - Runtime environment (enforced via package.json engines)
- **n8n-workflow** ^1.20.0 - n8n SDK for node development

**Key Dependencies:**
- **defuddle** ^0.6.6 - Core content extraction library
- **jsdom** 24.1.3 - Sandboxed DOM environment for HTML parsing
- **turndown** ^7.2.1 - HTML to Markdown conversion

**Build & Development Tools:**
- **gulp** 5.0.1 - Build task runner (for copying icon assets)
- **ESLint** 9.37.0 - Linting (flat config format)
- **typescript-eslint** 8.45.0 - TypeScript linting plugin
- **Prettier** 3.6.2 - Code formatting
- **eslint-plugin-n8n-nodes-base** - n8n-specific linting rules

## Project Conventions

### Code Style

**Formatting:**
- Prettier is the source of truth for formatting
- Run `npm run format` to format all code in `nodes/` directory
- Auto-formatting enforced via Prettier with packagejson plugin

**Naming Conventions:**
- Node class name must match the node name in description (e.g., `Defuddle`)
- File naming: `{NodeName}.node.ts` (e.g., `Defuddle.node.ts`)
- Directory naming: `nodes/{NodeName}/` (enforced by n8n ESLint rules)

**TypeScript:**
- Target: ES2019
- Module: CommonJS (required for n8n compatibility)
- Strict mode enabled
- No unused variables/parameters allowed

### Architecture Patterns

**n8n Community Node Architecture:**
- Single node implementation in `nodes/Defuddle/Defuddle.node.ts`
- Node must implement `INodeType` interface from n8n-workflow
- Icon asset: `defuddle.svg` placed alongside node file
- Build output to `dist/` directory
- Package entry point: `dist/nodes/Defuddle/Defuddle.node.js`

**Node Execution Pattern:**
1. Accept HTML input (default: `{{$json.data}}` from previous node)
2. Create sandboxed JSDOM instance with security hardening
3. Pass DOM to Defuddle parser with user-configured options
4. Optionally convert HTML to Markdown using Turndown
5. Filter output fields based on user selection
6. Return structured JSON with extracted content and metadata

**Security Pattern:**
- JSDOM configured with strict security:
  - `runScripts: undefined` - Never execute JavaScript
  - `resources: undefined` - Block external resource loading
  - `pretendToBeVisual: false` - Minimal parsing overhead

**Output Format Options:**
- `html` - Returns content as HTML (default)
- `markdown` - Converts content to Markdown (replaces `content` field)
- `both` - Returns both HTML in `content` and Markdown in `contentMarkdown`

### Testing Strategy

**Current State:**
- No automated tests currently implemented
- Testing done manually via n8n workflow execution
- Linting enforced via `npm run lint` (runs in prepublishOnly)

**Linting Requirements:**
- Must pass ESLint with n8n community node rules before publishing
- TypeScript compilation must succeed without errors
- Specific n8n rules enforced:
  - `node-dirname-against-convention`
  - `node-class-description-inputs-wrong-regular-node`
  - `node-class-description-outputs-wrong`
  - `node-filename-against-convention`

### Git Workflow

**Version Publishing Workflow (STRICT ORDER):**
1. Update `README.md` - Add new version section to "Version History" with complete changelog
2. Commit README changes - Commit BEFORE version bump
3. Run `npm version patch|minor|major` - Auto-updates package.json, package-lock.json, creates git commit + tag
4. Run `npm publish` - Publishes to npm (runs prepublishOnly: build + lint)
5. Run `git push && git push --tags` - Push commits and version tag to GitHub
6. Create GitHub release - Use `gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."` with same changelog from README

**Branch Strategy:**
- Main branch: `main`
- Current branch: `main`

**Important Notes:**
- `npm version` automatically creates git commit and tag
- Always commit README.md changes BEFORE running `npm version`
- Use same changelog text in both README.md and GitHub release for consistency
- Never skip prepublishOnly hooks (runs build + lint automatically)

## Domain Context

**n8n Workflow Automation:**
- n8n is a visual workflow automation platform
- Nodes are the building blocks of n8n workflows
- Each node performs a specific operation and passes data to the next node
- Community nodes extend n8n's functionality with custom integrations

**Content Extraction Domain:**
- Similar to browser "Reader Mode" functionality
- Removes ads, navigation, footers, and other non-content elements
- Extracts metadata (title, author, description, publication date, etc.)
- Preserves main article content with proper HTML structure
- Optionally converts to Markdown for downstream processing

**Typical Use Cases:**
- Web scraping workflows that need clean article content
- Content aggregation and republishing
- Research and data collection from news sites/blogs
- RSS-to-markdown pipelines
- Content archival systems

## Important Constraints

**Runtime Constraints:**
- Node.js 20 or higher required (jsdom dependency)
- Must use CommonJS module format (n8n requirement)
- Peer dependency on n8n-workflow ^1.20.0

**Security Constraints:**
- Never execute JavaScript from parsed HTML (JSDOM sandboxing)
- Block all external resource loading during parsing
- No network requests from within the node itself

**Build Constraints:**
- Icons must be copied to dist/ via gulp task (not handled by tsc)
- Build must complete successfully before publishing (enforced via prepublishOnly)
- Linting must pass before publishing

**Package Management:**
- Use `--legacy-peer-deps` when updating dependencies (jsdom peer dependency mismatch with defuddle)
- Only `dist/` directory included in published package (specified in package.json files)

**n8n API Constraints:**
- Must implement n8n API version 1
- Node execution method must return Promise (even without await)
- Must follow n8n node property schema for inputs/outputs/options

## External Dependencies

**Core Libraries:**
- **Defuddle** (github.com/kepano/defuddle) - Content extraction engine, maintained by Obsidian creator
- **JSDOM** (github.com/jsdom/jsdom) - JavaScript implementation of web standards, used for DOM parsing
- **Turndown** (github.com/mixmark-io/turndown) - HTML to Markdown converter

**n8n Ecosystem:**
- **n8n-workflow** - Official n8n SDK providing INodeType, IExecuteFunctions, and other core interfaces
- **eslint-plugin-n8n-nodes-base** - Official ESLint rules for n8n community nodes

**No External Services:**
- Package operates entirely offline
- No API calls or external service dependencies
- All processing happens in-memory within the Node.js runtime
