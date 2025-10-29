# @michaelvanlaar/n8n-nodes-defuddle

This is an n8n community node that extracts the main content from webpages using the [Defuddle](https://github.com/kepano/defuddle) library. It provides a simple way to clean HTML content and extract the most relevant parts of a webpage, similar to a browser's reader mode.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes in n8n Settings (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `@michaelvanlaar/n8n-nodes-defuddle` in **Enter npm package name**
4. Click **Install**

### Manual Installation

To get started install the package in your n8n root directory:

```bash
npm install @michaelvanlaar/n8n-nodes-defuddle
```

For Docker-based deployments add the following line before the font installation command in your [n8n Dockerfile](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/Dockerfile):

```
RUN cd /usr/local/lib/node_modules/n8n && npm install @michaelvanlaar/n8n-nodes-defuddle
```

## Operations

The Defuddle node extracts clean content from HTML pages. It accepts HTML input (typically from an HTTP Request node) and returns structured, readable content.

## Usage

### Basic Workflow

1. Add an **HTTP Request** node to fetch the webpage HTML
2. Add the **Defuddle** node after it
3. Configure the Defuddle node with the HTML source (default: `{{$json.data}}`)

### Example Workflow

```
HTTP Request → Defuddle → [Your processing nodes]
```

### Configuration Options

#### HTML Source (Required)

The HTML content to extract from. By default, this is set to `{{$json.data}}` which references the data from the previous HTTP Request node.

#### URL (Optional)

The original URL of the page. This helps Defuddle resolve relative links and extract better metadata.

#### Content Format

Choose the output format for the extracted content:

- **HTML Only** (default): Return content as HTML
- **Markdown Only**: Convert content to Markdown (content field will contain Markdown)
- **HTML + Markdown**: Return both HTML (content) and Markdown (contentMarkdown)

#### Options

- **Remove Images**: Strip all images from the extracted content
- **Remove Exact Selectors**: Remove elements matching exact ad/button selectors (default: enabled)
- **Remove Partial Selectors**: Remove elements matching partial ad/button selectors (default: enabled)
- **Debug Mode**: Enable verbose logging for troubleshooting
- **Output Fields**: Select which fields to include in the output:
  - Content (main extracted content)
  - Content Markdown (Markdown version, only when using "HTML + Markdown" format)
  - Title
  - Author
  - Description
  - Domain
  - Word Count
  - Published Date
  - Image (main article image)
  - Schema.org Data (structured data)

### Output

The node returns a JSON object with the selected fields. When no custom output fields are specified, it returns: `content`, `title`, `author`, and `description` by default.

**Example output (HTML Only):**

```json
{
	"content": "<p>The main article content...</p>",
	"title": "Article Title",
	"author": "Author Name",
	"description": "Article summary"
}
```

**Example output (HTML + Markdown):**

```json
{
	"content": "<p>The main article content...</p>",
	"contentMarkdown": "The main article content...",
	"title": "Article Title",
	"author": "Author Name",
	"description": "Article summary"
}
```

**All available fields:**

- `content`: Main article content (HTML or Markdown depending on format selection)
- `contentMarkdown`: Markdown version (only when using "HTML + Markdown" format)
- `title`: Article title
- `author`: Author name
- `description`: Article summary/description
- `domain`: Website domain
- `wordCount`: Total word count
- `published`: Publication date
- `image`: Main article image URL
- `schemaOrgData`: Structured data from Schema.org markup

## Compatibility

- Requires n8n version 1.20.0 or above
- Node.js 20 or higher required (as of version 0.2.0)

## Development

### Testing

This package includes comprehensive automated tests to ensure reliability and prevent regressions.

**Running Tests:**
```bash
npm test                # Run test suite
npm run test:watch      # Run tests in watch mode for development
npm run test:coverage   # Generate coverage report
```

**Testing Framework:**
- Jest with TypeScript support (ts-jest)
- 47 test cases covering all node features
- >80% code coverage target
- Automated pre-commit hooks via Husky

**Test Categories:**
1. Feature tests (content extraction, format conversion, output filtering)
2. Security tests (JSDOM sandboxing, XSS prevention, script blocking)
3. Error handling (missing input, invalid HTML, continueOnFail)
4. Edge cases (large documents, Unicode, malformed HTML)
5. Integration tests (n8n interface mocking, batch processing)

### Quality Assurance

Pre-commit hooks automatically run:
1. Linting (ESLint with n8n community node rules)
2. Tests (Jest test suite)
3. Build (TypeScript compilation and icon copying)

This ensures all commits maintain code quality and passing tests.

## Claude Code Integration

This project integrates Claude Code with Context7 MCP for enhanced AI-assisted development, providing access to current n8n documentation.

### Setup

#### 1. Environment File Setup

Create an environment configuration file:

```bash
cp .env.example .env
```

This generates a new `.env` file in your project root where you'll store your API credentials.

#### 2. API Key Registration

Obtain your authentication key from [context7.com](https://context7.com), then add it to your `.env`:

```
CONTEXT7_API_KEY=your-api-key-here
```

The project `.gitignore` automatically prevents this file from being committed to version control.

#### 3. MCP Configuration

The project includes a `.mcp.json` file that pre-configures the MCP server settings. No additional setup is needed—the integration is ready once your `.env` file contains a valid API key.

### Context7 Slash Commands

This project includes slash commands for [Claude Code](https://claude.ai/code) that provide quick access to n8n documentation via Context7.

#### `/context7:n8n [topic]`

Pulls official n8n documentation into the conversation context to assist with development tasks.

**Usage:**

```
/context7:n8n
```

Fetches general n8n documentation relevant to the current task (e.g., community node development, node structure, testing).

**With optional topic:**

```
/context7:n8n node development
/context7:n8n credentials
/context7:n8n IExecuteFunctions
/context7:n8n parameters
```

Focuses the documentation retrieval on a specific topic.

**When to use:**
- Developing or maintaining n8n community nodes
- Working with n8n APIs (IExecuteFunctions, INodeType, INodeProperties, etc.)
- Troubleshooting node-related issues
- Understanding n8n conventions and best practices
- Working with credentials, webhooks, or polling triggers
- Checking for API changes or updated patterns

### Recommended Usage Scenarios

Use Context7 integration when:
- Learning unfamiliar or newly-released n8n APIs
- Resolving complex node development challenges
- Implementing features requiring deep knowledge of n8n internals
- Confirming best practices or verifying API changes
- Working with credentials, webhooks, or polling triggers

Avoid using it for:
- Following established code patterns already present in the codebase
- Standard refactoring tasks
- Similar features already implemented elsewhere

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Defuddle library](https://github.com/kepano/defuddle)

## Version History

### 0.3.0 (Upcoming)

- Add comprehensive Jest testing infrastructure
  - 47 test cases covering all node features
  - Feature tests: content extraction, format conversion, output filtering, Defuddle options
  - Security tests: JSDOM sandboxing, script blocking, XSS prevention
  - Error handling tests: missing input, invalid HTML, continueOnFail behavior
  - Edge case tests: large documents, Unicode, malformed HTML, empty content
  - Integration tests: IExecuteFunctions mocking, batch processing, pairedItem indexing
- Add Husky pre-commit hooks
  - Automatically run lint → test → build before each commit
  - Prevent broken code from entering repository
- Update publishing workflow to include automated testing (prepublishOnly now runs: build + lint + test)
- Add testing documentation to README.md and CLAUDE.md
- Update project.md with comprehensive testing strategy

### 0.2.5

- Update development dependencies to latest versions:
  - @typescript-eslint/eslint-plugin: 8.45.0 → 8.46.1
  - @typescript-eslint/parser: 8.45.0 → 8.46.1
  - typescript-eslint: 8.45.0 → 8.46.1
  - eslint-plugin-n8n-nodes-base: 1.16.3 → 1.16.4

### 0.2.4

- Add LICENSE.md file

### 0.2.3

- Documentation improvements and workflow standardization

### 0.2.2

- Updated README.md with complete version history

### 0.2.1

- Fixed peer dependency conflict by downgrading jsdom to v24.x to match defuddle's requirements
- Resolves npm install errors when installing via n8n Community Nodes

### 0.2.0

- Dependency updates for security and compatibility
- Updated TypeScript to v5.9 (better performance and type checking)
- Updated ESLint to v9 with flat config
- Updated Prettier to v3.6
- Updated gulp to v5
- Improved type safety in code
- **Breaking change**: Now requires Node.js 20 or higher

### 0.1.0

- Initial release
- HTML content extraction with Defuddle library
- Markdown conversion support (HTML Only, Markdown Only, HTML + Markdown)
- Configurable output fields
- Security hardening with sandboxed JSDOM

## License

[MIT](https://github.com/MichaelvanLaar/n8n-nodes-defuddle/blob/master/LICENSE.md)

## Alternative Custom Node With Similar Features

[n8n-nodes-webpage-content-extractor](https://github.com/Savjee/n8n-nodes-webpage-content-extractor), which is based on the Readability library that is used by Firefox's Reader View.
