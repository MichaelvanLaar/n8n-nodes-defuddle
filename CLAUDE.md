<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package that extracts main content from webpages using the [Defuddle](https://github.com/kepano/defuddle) library. It provides a single node that processes HTML input and returns cleaned, readable content (similar to browser reader mode).

**Requirements:**
- Node.js 20 or higher (enforced via `engines` in package.json)
- n8n version 1.20.0 or above

## Build and Development Commands

### Building
```bash
npm run build          # Compile TypeScript and copy icons to dist/
npm run dev            # Watch mode for TypeScript compilation
```

The build process consists of two steps:
1. `tsc` - Compiles TypeScript from `nodes/**/*.ts` to `dist/`
2. `gulp build:icons` - Copies SVG/PNG icons from `nodes/` to `dist/nodes/`

### Linting and Formatting
```bash
npm run lint           # Check TypeScript files for errors
npm run lintfix        # Auto-fix linting issues
npm run format         # Format code with Prettier
```

### Publishing

**IMPORTANT:** Follow this exact workflow when publishing a new version:

1. **Update README.md** - Add the new version section to the "Version History" with complete changelog
2. **Commit README changes** - Commit the README update before bumping version
3. **Bump version** - Use `npm version patch|minor|major` (this updates package.json, package-lock.json, and creates a git commit + tag automatically)
4. **Publish to npm** - Run `npm publish` (this runs prepublishOnly hook: build + lint)
5. **Push to GitHub** - Run `git push && git push --tags` to push commits and the version tag
6. **Create GitHub release** - Use `gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."` with the same changelog text from README.md

**Files that must be updated:**
- `README.md` - Add version section to "Version History" (do this FIRST, before version bump)
- `package.json` and `package-lock.json` - Automatically updated by `npm version`

**Note:**
- The `npm version` command automatically creates a git commit and tag, so commit README.md changes BEFORE running it
- Always use the same changelog text in both README.md and the GitHub release description for consistency

```bash
npm run prepublishOnly # Runs before publishing (build + lint)
```

## Architecture

### Node Structure

The package follows n8n's community node architecture:

- **Single Node Implementation**: `nodes/Defuddle/Defuddle.node.ts` - The main (and only) node
- **Icon**: `nodes/Defuddle/defuddle.svg` - Node icon displayed in n8n UI
- **Build Output**: All compiled code goes to `dist/` directory
- **Package Entry**: `dist/nodes/Defuddle/Defuddle.node.js` (specified in package.json `n8n.nodes`)

### Key Dependencies

- **defuddle** (^0.6.6): Core content extraction library
- **jsdom** (^27.0.0): Provides sandboxed DOM environment for parsing HTML (requires Node.js 20+)
- **turndown** (^7.2.1): Converts HTML to Markdown format
- **n8n-workflow** (^1.20.0): n8n SDK for node development (peer dependency)

**Dev Dependencies:**
- **TypeScript** (^5.9.3): Upgraded from 4.9 for better performance and type checking
- **ESLint** (^9.37.0): Uses flat config format (`eslint.config.mjs`)
- **typescript-eslint** (^8.45.0): ESLint plugin for TypeScript
- **Prettier** (^3.6.2): Code formatting
- **gulp** (^5.0.1): Build task runner (requires `{encoding: false}` for binary files)

### Node Execution Flow

1. Accepts HTML input (typically from HTTP Request node via `{{$json.data}}`)
2. Creates sandboxed JSDOM instance (scripts disabled, no external resources)
3. Passes DOM to Defuddle parser with user-configured options
4. Optionally converts HTML content to Markdown using Turndown
5. Filters output fields based on user selection
6. Returns structured JSON with extracted content and metadata

### Content Format Options

The node supports three output modes controlled by `contentFormat` parameter:
- `html`: Returns content as HTML (default)
- `markdown`: Converts content to Markdown (replaces `content` field)
- `both`: Returns both HTML in `content` and Markdown in `contentMarkdown`

### Security Considerations

JSDOM is configured with security hardening:
- `runScripts: undefined` - Never execute JavaScript
- `resources: undefined` - Block external resource loading
- `pretendToBeVisual: false` - Minimal parsing overhead

## TypeScript Configuration

- **Target**: ES2019
- **Module**: CommonJS (required for n8n)
- **Strict mode**: Enabled
- **Source**: `nodes/**/*`
- **Output**: `dist/`

## ESLint Configuration

Uses **ESLint 9 flat config** format in `eslint.config.mjs`:
- Based on TypeScript ESLint recommended type-checked rules
- Includes `plugin:n8n-nodes-base/community` rules:
  - `node-dirname-against-convention`: Enforces n8n directory naming
  - `node-class-description-inputs-wrong-regular-node`: Validates input configuration
  - `node-class-description-outputs-wrong`: Validates output configuration
  - `node-filename-against-convention`: Enforces n8n file naming
- Custom rule: `@typescript-eslint/require-await` disabled (n8n nodes must return Promise even without await)
- Ignores: `**/*.js` files, `node_modules`, `dist`

**Note:** When updating dependencies, use `--legacy-peer-deps` flag due to jsdom peer dependency mismatch with defuddle.

## n8n Node Standards

This package must comply with n8n community node requirements:
- Nodes must implement `INodeType` interface
- Class name should match the node name in description
- File naming: `{NodeName}.node.ts`
- Directory naming: `nodes/{NodeName}/`
- Icons placed alongside node file
- Package metadata in `package.json` under `n8n` key
