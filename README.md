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

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Defuddle library](https://github.com/kepano/defuddle)

## Version History

### 0.2.0

- Dependency updates for security and compatibility
- Updated jsdom to v27 (improved CSS selector engine and browser simulation)
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
