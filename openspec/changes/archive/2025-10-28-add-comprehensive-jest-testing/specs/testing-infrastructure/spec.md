## ADDED Requirements

### Requirement: Jest Test Framework Configuration

The project SHALL use Jest as the testing framework with TypeScript support via ts-jest to enable comprehensive automated testing of the n8n node implementation.

#### Scenario: Jest configuration file exists

- **WHEN** the repository is cloned
- **THEN** a `jest.config.js` file SHALL exist in the project root
- **AND** the configuration SHALL specify ts-jest as the preset
- **AND** the configuration SHALL define a testEnvironment of "node"
- **AND** the configuration SHALL specify coverage collection from the nodes/ directory

#### Scenario: Running tests via npm script

- **WHEN** a developer runs `npm test`
- **THEN** Jest SHALL execute all test files in `nodes/**/__tests__/**/*.test.ts` pattern
- **AND** the test results SHALL be displayed in the terminal
- **AND** the process SHALL exit with code 0 if all tests pass
- **AND** the process SHALL exit with non-zero code if any test fails

#### Scenario: Generating coverage reports

- **WHEN** a developer runs `npm run test:coverage`
- **THEN** Jest SHALL execute all tests and collect coverage data
- **AND** coverage reports SHALL be generated in the `coverage/` directory
- **AND** coverage summary SHALL be displayed in the terminal
- **AND** coverage SHALL include line, branch, function, and statement percentages

#### Scenario: Watch mode for development

- **WHEN** a developer runs `npm run test:watch`
- **THEN** Jest SHALL run in watch mode
- **AND** Jest SHALL re-run tests automatically when source files change
- **AND** watch mode SHALL continue until manually terminated

### Requirement: Test File Structure

The project SHALL organize test files in a co-located structure within the nodes/ directory to maintain proximity between implementation and tests.

#### Scenario: Test directory location

- **WHEN** tests are created for the Defuddle node
- **THEN** tests SHALL be placed in `nodes/Defuddle/__tests__/` directory
- **AND** test files SHALL use the `.test.ts` extension
- **AND** the main test suite SHALL be named `Defuddle.node.test.ts`

#### Scenario: Test fixtures directory

- **WHEN** HTML fixtures are needed for testing
- **THEN** fixtures SHALL be stored in `nodes/Defuddle/__tests__/fixtures/` directory
- **AND** fixture files SHALL use descriptive names (e.g., `simple-article.html`, `malicious.html`)
- **AND** fixtures SHALL be committed to version control

### Requirement: Core Feature Test Coverage

The test suite SHALL comprehensively test all node features including content extraction, format conversion, and output filtering.

#### Scenario: Testing basic content extraction

- **WHEN** the Defuddle node processes valid HTML input
- **THEN** tests SHALL verify that extracted content matches expected output
- **AND** tests SHALL verify that metadata fields (title, author, description) are correctly extracted
- **AND** tests SHALL verify that the node returns data in n8n format (json field, pairedItem)

#### Scenario: Testing HTML to Markdown conversion

- **WHEN** the contentFormat parameter is set to "markdown"
- **THEN** tests SHALL verify that the content field contains Markdown instead of HTML
- **AND** tests SHALL verify that Turndown conversion is applied correctly

#### Scenario: Testing dual format output

- **WHEN** the contentFormat parameter is set to "both"
- **THEN** tests SHALL verify that the content field contains HTML
- **AND** tests SHALL verify that the contentMarkdown field contains Markdown
- **AND** tests SHALL verify that both fields are included in output when no custom outputFields are specified

#### Scenario: Testing output field filtering

- **WHEN** custom outputFields are specified in options
- **THEN** tests SHALL verify that only selected fields are included in the output
- **AND** tests SHALL verify that unselected fields are excluded from the output
- **AND** tests SHALL verify that default fields are used when outputFields is empty

#### Scenario: Testing Defuddle options

- **WHEN** removeImages option is set to true
- **THEN** tests SHALL verify that images are removed from extracted content
- **WHEN** removeExactSelectors is set to false
- **THEN** tests SHALL verify that exact selector filtering is disabled
- **WHEN** removePartialSelectors is set to false
- **THEN** tests SHALL verify that partial selector filtering is disabled

### Requirement: Security Validation Testing

The test suite SHALL validate that JSDOM sandboxing correctly prevents script execution and external resource loading to protect against malicious HTML.

#### Scenario: Testing script execution blocking

- **WHEN** HTML contains script tags with JavaScript code
- **THEN** tests SHALL verify that scripts are NOT executed during parsing
- **AND** tests SHALL verify that no side effects from scripts occur
- **AND** tests SHALL verify that JSDOM configuration has runScripts set to undefined

#### Scenario: Testing external resource blocking

- **WHEN** HTML contains external resources (images, stylesheets, fonts with external URLs)
- **THEN** tests SHALL verify that no network requests are made during parsing
- **AND** tests SHALL verify that JSDOM configuration has resources set to undefined

#### Scenario: Testing XSS attempt handling

- **WHEN** HTML contains potential XSS vectors (event handlers, javascript: URLs)
- **THEN** tests SHALL verify that malicious content is safely parsed without execution
- **AND** tests SHALL verify that the node does not throw errors
- **AND** tests SHALL verify that output is sanitized by Defuddle library

### Requirement: Error Handling Test Coverage

The test suite SHALL validate all error handling paths including missing input, invalid HTML, and n8n error propagation.

#### Scenario: Testing missing HTML source

- **WHEN** the htmlSource parameter is empty or undefined
- **THEN** tests SHALL verify that a NodeOperationError is thrown
- **AND** tests SHALL verify that the error message indicates HTML source is required
- **AND** tests SHALL verify that the error includes the correct itemIndex

#### Scenario: Testing continueOnFail behavior

- **WHEN** an error occurs during processing and continueOnFail is enabled
- **THEN** tests SHALL verify that the node returns an error object instead of throwing
- **AND** tests SHALL verify that the error object contains the error message in the json field
- **AND** tests SHALL verify that processing continues for subsequent items

#### Scenario: Testing invalid HTML handling

- **WHEN** malformed or invalid HTML is provided
- **THEN** tests SHALL verify that JSDOM parses the HTML without throwing
- **AND** tests SHALL verify that Defuddle extracts content best-effort
- **AND** tests SHALL verify that the node returns results (even if content is minimal)

### Requirement: Edge Case Test Coverage

The test suite SHALL test edge cases including empty content, large documents, special characters, and Unicode to ensure robustness.

#### Scenario: Testing empty HTML content

- **WHEN** HTML contains no extractable content (only tags, no text)
- **THEN** tests SHALL verify that the node handles empty extraction gracefully
- **AND** tests SHALL verify that required fields are present (even if empty strings)

#### Scenario: Testing large HTML documents

- **WHEN** HTML input is very large (e.g., >1MB)
- **THEN** tests SHALL verify that the node processes the document without timeout
- **AND** tests SHALL verify that memory usage remains reasonable

#### Scenario: Testing Unicode and special characters

- **WHEN** HTML contains Unicode characters, emojis, and special symbols
- **THEN** tests SHALL verify that characters are preserved correctly in output
- **AND** tests SHALL verify that Markdown conversion handles Unicode correctly

#### Scenario: Testing URL parameter handling

- **WHEN** the URL parameter is provided
- **THEN** tests SHALL verify that the URL is passed to Defuddle options
- **WHEN** the URL parameter is omitted
- **THEN** tests SHALL verify that the node processes HTML without errors

### Requirement: n8n Integration Test Coverage

The test suite SHALL test n8n integration points including IExecuteFunctions mocking, parameter retrieval, and batch processing.

#### Scenario: Testing IExecuteFunctions mocking

- **WHEN** tests mock the IExecuteFunctions interface
- **THEN** mocks SHALL implement getInputData() to return test items
- **AND** mocks SHALL implement getNodeParameter() to return test parameters
- **AND** mocks SHALL implement getNode() to return node metadata
- **AND** mocks SHALL implement continueOnFail() to return boolean

#### Scenario: Testing parameter retrieval

- **WHEN** the node retrieves parameters via this.getNodeParameter()
- **THEN** tests SHALL verify that string parameters are retrieved correctly
- **AND** tests SHALL verify that boolean parameters are retrieved correctly
- **AND** tests SHALL verify that options/collection parameters are retrieved correctly
- **AND** tests SHALL verify that default values are used when parameters are omitted

#### Scenario: Testing batch item processing

- **WHEN** multiple input items are provided to execute()
- **THEN** tests SHALL verify that all items are processed in sequence
- **AND** tests SHALL verify that each item's output includes the correct pairedItem index
- **AND** tests SHALL verify that errors in one item don't stop processing of subsequent items (with continueOnFail)

#### Scenario: Testing all output fields

- **WHEN** tests request each available output field
- **THEN** tests SHALL verify that content field is extracted correctly
- **AND** tests SHALL verify that contentMarkdown field is extracted correctly (when format is "both")
- **AND** tests SHALL verify that title, author, description fields are extracted
- **AND** tests SHALL verify that domain, wordCount, published, image, schemaOrgData fields are extracted when present
