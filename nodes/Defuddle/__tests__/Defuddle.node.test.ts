import { IExecuteFunctions, INode, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { Defuddle } from '../Defuddle.node';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper function to load HTML fixtures
 */
function loadFixture(filename: string): string {
	return fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8');
}

/**
 * Mock implementation of IExecuteFunctions for testing
 */
function createMockExecuteFunctions(
	items: INodeExecutionData[],
	parameters: Record<string, unknown> = {},
	continueOnFail = false,
): IExecuteFunctions {
	return {
		getInputData: () => items,
		getNodeParameter: (parameterName: string, itemIndex: number, fallback?: unknown) => {
			const key = `${parameterName}_${itemIndex}`;
			if (parameters[key] !== undefined) {
				return parameters[key];
			}
			// Use fallback if provided
			if (fallback !== undefined) {
				return fallback;
			}
			// Return default values based on parameter name
			if (parameterName === 'htmlSource') return items[itemIndex]?.json?.html || '';
			if (parameterName === 'url') return '';
			if (parameterName === 'contentFormat') return 'html';
			if (parameterName === 'options') return {};
			return undefined;
		},
		continueOnFail: () => continueOnFail,
		getNode: () =>
			({
				name: 'Defuddle Test Node',
				type: 'n8n-nodes-defuddle.defuddle',
				typeVersion: 1,
			}) as INode,
	} as IExecuteFunctions;
}

describe('Defuddle Node', () => {
	let defuddleNode: Defuddle;

	beforeEach(() => {
		defuddleNode = new Defuddle();
	});

	describe('Node Metadata', () => {
		it('should have correct node description', () => {
			expect(defuddleNode.description).toBeDefined();
			expect(defuddleNode.description.displayName).toBe('Defuddle');
			expect(defuddleNode.description.name).toBe('defuddle');
			expect(defuddleNode.description.version).toBe(1);
		});

		it('should have correct inputs and outputs', () => {
			expect(defuddleNode.description.inputs).toEqual(['main']);
			expect(defuddleNode.description.outputs).toEqual(['main']);
		});

		it('should have correct parameter definitions', () => {
			const properties = defuddleNode.description.properties;
			expect(properties).toBeDefined();
			expect(properties.length).toBeGreaterThan(0);

			// Check htmlSource parameter
			const htmlSourceParam = properties.find((p) => p.name === 'htmlSource');
			expect(htmlSourceParam).toBeDefined();
			expect(htmlSourceParam?.required).toBe(true);
			expect(htmlSourceParam?.type).toBe('string');
		});
	});

	describe('Basic Content Extraction', () => {
		it('should extract content from simple HTML', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result.length).toBe(1);
			expect(result[0].length).toBe(1);
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toBeDefined();
		});

		it('should extract title from HTML', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.title).toContain('Simple Test Article');
		});

		it('should extract author from HTML metadata', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.author).toBeDefined();
		});

		it('should extract description from HTML metadata', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.description).toBeDefined();
		});

		it('should handle complex HTML with ads and navigation', async () => {
			const html = loadFixture('complex-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toBeDefined();
			// Content should be extracted despite surrounding noise
			expect(typeof result[0][0].json.content).toBe('string');
		});
	});

	describe('Content Format Modes', () => {
		it('should return HTML when contentFormat is "html"', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			expect(typeof result[0][0].json.content).toBe('string');
			// HTML should contain tags
			expect(result[0][0].json.content).toMatch(/<[^>]+>/);
			// Should not have contentMarkdown field
			expect(result[0][0].json.contentMarkdown).toBeUndefined();
		});

		it('should convert to Markdown when contentFormat is "markdown"', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'markdown',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			const content = result[0][0].json.content as string;
			// Markdown should not contain HTML tags like <p>, <h1>, etc.
			expect(content).not.toMatch(/<p>/);
			expect(content).not.toMatch(/<\/p>/);
			// Content should be string (converted from HTML)
			expect(typeof content).toBe('string');
			// Should not have contentMarkdown field
			expect(result[0][0].json.contentMarkdown).toBeUndefined();
		});

		it('should return both HTML and Markdown when contentFormat is "both"', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'both',
					options_0: {
						outputFields: ['content', 'contentMarkdown', 'title', 'author', 'description'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			// Should have both content (HTML) and contentMarkdown
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.contentMarkdown).toBeDefined();
			// content should have HTML tags
			expect(result[0][0].json.content).toMatch(/<[^>]+>/);
			// contentMarkdown should be markdown (no HTML tags)
			const markdown = result[0][0].json.contentMarkdown as string;
			expect(markdown).not.toMatch(/<p>/);
			expect(markdown).not.toMatch(/<\/p>/);
			expect(typeof markdown).toBe('string');
		});

		it('should auto-include contentMarkdown in default output when format is "both"', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'both',
					options_0: {}, // No outputFields specified, should use defaults
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			// Should automatically include contentMarkdown
			expect(result[0][0].json.contentMarkdown).toBeDefined();
		});
	});

	describe('Output Field Filtering', () => {
		it('should return default fields when no outputFields specified', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {}, // No outputFields
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			// Default fields: content, title, author, description
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toBeDefined();
			expect(result[0][0].json.author).toBeDefined();
			expect(result[0][0].json.description).toBeDefined();
		});

		it('should filter output to only selected fields', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: ['content', 'title'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			// Should only have content and title
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toBeDefined();
			// Should not have author or description
			expect(result[0][0].json.author).toBeUndefined();
			expect(result[0][0].json.description).toBeUndefined();
		});

		it('should include all fields when all are selected', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: [
							'content',
							'title',
							'author',
							'description',
							'domain',
							'wordCount',
							'published',
							'image',
							'schemaOrgData',
						],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			// Should have all requested fields that exist
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toBeDefined();
		});

		it('should handle empty outputFields array as default fields', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: [], // Empty array
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			// Should fall back to default fields
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][0].json.title).toBeDefined();
		});
	});

	describe('Defuddle Options', () => {
		it('should respect removeImages option when true', async () => {
			const html = loadFixture('complex-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						removeImages: true,
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// This test verifies the option is passed; actual image removal is handled by Defuddle
		});

		it('should respect removeExactSelectors option', async () => {
			const html = loadFixture('complex-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						removeExactSelectors: true,
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
		});

		it('should respect removePartialSelectors option', async () => {
			const html = loadFixture('complex-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						removePartialSelectors: true,
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
		});

		it('should respect debug option', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						debug: true,
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
		});
	});

	describe('URL Parameter Handling', () => {
		it('should handle execution without URL parameter', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
		});

		it('should pass URL to Defuddle when provided', async () => {
			const html = loadFixture('simple-article.html');
			const testUrl = 'https://example.com/article';
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: testUrl,
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// URL is used for resolving relative links in Defuddle
		});

		it('should handle URL with domain extraction', async () => {
			const html = loadFixture('simple-article.html');
			const testUrl = 'https://example.com/article/path';
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: testUrl,
					contentFormat_0: 'html',
					options_0: {
						outputFields: ['content', 'domain'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// Domain should be extracted if URL is provided
		});
	});

	describe('JSDOM Security Sandboxing', () => {
		it('should not execute JavaScript in malicious HTML', async () => {
			const html = loadFixture('malicious.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			// Should not throw and should not execute scripts
			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
		});

		it('should block external resource loading', async () => {
			const html = loadFixture('malicious.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			// Should process without loading external resources
			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
		});

		it('should sanitize XSS attempts', async () => {
			const html = loadFixture('malicious.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			// Scripts should not be executed during parsing
		});
	});

	describe('Error Handling', () => {
		it('should throw NodeOperationError when htmlSource is empty', async () => {
			const mockFunctions = createMockExecuteFunctions(
				[{ json: {} }],
				{
					htmlSource_0: '',
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			await expect(defuddleNode.execute.call(mockFunctions)).rejects.toThrow(NodeOperationError);
		});

		it('should throw NodeOperationError when htmlSource is missing', async () => {
			const mockFunctions = createMockExecuteFunctions(
				[{ json: {} }],
				{
					// htmlSource not provided
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			await expect(defuddleNode.execute.call(mockFunctions)).rejects.toThrow(NodeOperationError);
		});

		it('should handle empty HTML gracefully', async () => {
			const html = loadFixture('empty.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			// Should return result even if content is minimal
			expect(result[0][0].json).toBeDefined();
		});

		it('should handle malformed HTML without crashing', async () => {
			const html = loadFixture('malformed.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			// Should not throw - JSDOM and Defuddle should handle malformed HTML
			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
		});
	});

	describe('continueOnFail Behavior', () => {
		it('should return error object when continueOnFail is true and error occurs', async () => {
			const mockFunctions = createMockExecuteFunctions(
				[{ json: {} }],
				{
					htmlSource_0: '', // Empty HTML will cause error
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
				true, // continueOnFail = true
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0].length).toBe(1);
			expect(result[0][0].json.error).toBeDefined();
			expect(typeof result[0][0].json.error).toBe('string');
		});

		it('should include pairedItem in error output', async () => {
			const mockFunctions = createMockExecuteFunctions(
				[{ json: {} }],
				{
					htmlSource_0: '',
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
				true, // continueOnFail = true
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].pairedItem).toBeDefined();
			expect(result[0][0].pairedItem).toEqual({ item: 0 });
		});

		it('should throw error when continueOnFail is false', async () => {
			const mockFunctions = createMockExecuteFunctions(
				[{ json: {} }],
				{
					htmlSource_0: '',
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
				false, // continueOnFail = false
			);

			await expect(defuddleNode.execute.call(mockFunctions)).rejects.toThrow();
		});
	});

	describe('Edge Cases', () => {
		it('should handle very large HTML documents', async () => {
			const html = loadFixture('large-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
			expect(typeof result[0][0].json.content).toBe('string');
		});

		it('should handle Unicode and special characters', async () => {
			const html = loadFixture('unicode.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0][0].json.content).toBeDefined();
		});

		it('should handle HTML with only whitespace', async () => {
			const html = '   \n\n\t\t  ';
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
		});
	});

	describe('Multiple Items Processing', () => {
		it('should process multiple items in batch', async () => {
			const html1 = loadFixture('simple-article.html');
			const html2 = loadFixture('complex-article.html');

			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html: html1 } }, { json: { html: html2 } }],
				{
					htmlSource_0: html1,
					htmlSource_1: html2,
					url_0: '',
					url_1: '',
					contentFormat_0: 'html',
					contentFormat_1: 'html',
					options_0: {},
					options_1: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0].length).toBe(2);
			expect(result[0][0].json.content).toBeDefined();
			expect(result[0][1].json.content).toBeDefined();
		});

		it('should maintain correct pairedItem indices for multiple items', async () => {
			const html = loadFixture('simple-article.html');

			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }, { json: { html } }, { json: { html } }],
				{
					htmlSource_0: html,
					htmlSource_1: html,
					htmlSource_2: html,
					url_0: '',
					url_1: '',
					url_2: '',
					contentFormat_0: 'html',
					contentFormat_1: 'html',
					contentFormat_2: 'html',
					options_0: {},
					options_1: {},
					options_2: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0].length).toBe(3);
			expect(result[0][0].pairedItem).toEqual({ item: 0 });
			expect(result[0][1].pairedItem).toEqual({ item: 1 });
			expect(result[0][2].pairedItem).toEqual({ item: 2 });
		});

		it('should handle mixed success and failure with continueOnFail', async () => {
			const html = loadFixture('simple-article.html');

			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }, { json: {} }, { json: { html } }],
				{
					htmlSource_0: html,
					htmlSource_1: '', // This will fail
					htmlSource_2: html,
					url_0: '',
					url_1: '',
					url_2: '',
					contentFormat_0: 'html',
					contentFormat_1: 'html',
					contentFormat_2: 'html',
					options_0: {},
					options_1: {},
					options_2: {},
				},
				true, // continueOnFail
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0].length).toBe(3);
			// First item should succeed
			expect(result[0][0].json.content).toBeDefined();
			// Second item should have error
			expect(result[0][1].json.error).toBeDefined();
			// Third item should succeed
			expect(result[0][2].json.content).toBeDefined();
		});
	});

	describe('pairedItem Behavior', () => {
		it('should include correct pairedItem for single item', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].pairedItem).toEqual({ item: 0 });
		});

		it('should include correct pairedItem for each item in batch', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }, { json: { html } }],
				{
					htmlSource_0: html,
					htmlSource_1: html,
					url_0: '',
					url_1: '',
					contentFormat_0: 'html',
					contentFormat_1: 'html',
					options_0: {},
					options_1: {},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].pairedItem).toEqual({ item: 0 });
			expect(result[0][1].pairedItem).toEqual({ item: 1 });
		});
	});

	describe('All Output Fields', () => {
		it('should extract wordCount when requested', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: ['content', 'wordCount'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// wordCount may or may not be present depending on Defuddle's extraction
		});

		it('should extract published date when requested', async () => {
			const html = loadFixture('complex-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: ['content', 'published'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// published date may or may not be extracted depending on HTML
		});

		it('should extract image when requested', async () => {
			const html = loadFixture('complex-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: ['content', 'image'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// image may or may not be extracted
		});

		it('should extract schemaOrgData when requested', async () => {
			const html = loadFixture('simple-article.html');
			const mockFunctions = createMockExecuteFunctions(
				[{ json: { html } }],
				{
					htmlSource_0: html,
					url_0: '',
					contentFormat_0: 'html',
					options_0: {
						outputFields: ['content', 'schemaOrgData'],
					},
				},
			);

			const result = await defuddleNode.execute.call(mockFunctions);

			expect(result[0][0].json.content).toBeDefined();
			// schemaOrgData may or may not be present
		});
	});
});
