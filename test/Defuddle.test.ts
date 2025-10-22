import { Defuddle } from '../nodes/Defuddle/Defuddle.node';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

// ========================================
// UNIT TESTS (No n8n mocking needed)
// ========================================

describe('Defuddle Node - Unit Tests', () => {
	describe('convertToMarkdown', () => {
		// Note: convertToMarkdown is currently not exported, so we'll test it through execute()
		// If you want direct unit tests, export the function or move to a separate module

		it('should be tested through integration tests', () => {
			// This is a placeholder - see integration tests below
			expect(true).toBe(true);
		});
	});
});

// ========================================
// INTEGRATION TESTS (Mock n8n context)
// ========================================

describe('Defuddle Node - Integration Tests', () => {
	let defuddleNode: Defuddle;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		defuddleNode = new Defuddle();

		// Create a mock of IExecuteFunctions (n8n context)
		mockExecuteFunctions = {
			getInputData: jest.fn(),
			getNodeParameter: jest.fn(),
			getNode: jest.fn(() => ({
				name: 'Defuddle Test',
				type: 'n8n-nodes-defuddle.defuddle',
				typeVersion: 1,
				position: [0, 0],
				parameters: {},
			})),
			continueOnFail: jest.fn(() => false),
		} as unknown as jest.Mocked<IExecuteFunctions>;
	});

	describe('execute() with HTML format', () => {
		it('should extract content from valid HTML', async () => {
			const testHtml = `
				<html>
					<head><title>Test Article</title></head>
					<body>
						<article>
							<h1>Test Title</h1>
							<p>This is the main content of the article.</p>
						</article>
					</body>
				</html>
			`;

			// Mock input data
			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { data: testHtml } },
			] as INodeExecutionData[]);

			// Mock parameters
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
				if (paramName === 'htmlSource') return testHtml;
				if (paramName === 'url') return '';
				if (paramName === 'contentFormat') return 'html';
				if (paramName === 'options') return {};
				return undefined;
			});

			// Execute the node
			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			// Assertions
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toHaveProperty('content');
			expect(result[0][0].json).toHaveProperty('title');
			expect(result[0][0].json.content).toContain('main content');
		});

		it('should throw error when HTML is empty', async () => {
			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: {} },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return '';
				if (paramName === 'url') return '';
				if (paramName === 'contentFormat') return 'html';
				if (paramName === 'options') return {};
				return undefined;
			});

			await expect(
				defuddleNode.execute.call(mockExecuteFunctions),
			).rejects.toThrow('HTML source is required');
		});
	});

	describe('execute() with Markdown format', () => {
		it('should convert content to Markdown', async () => {
			const testHtml = `
				<html>
					<body>
						<article>
							<h1>Test Heading</h1>
							<p>Test paragraph with <strong>bold text</strong>.</p>
						</article>
					</body>
				</html>
			`;

			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { data: testHtml } },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return testHtml;
				if (paramName === 'url') return '';
				if (paramName === 'contentFormat') return 'markdown';
				if (paramName === 'options') return {};
				return undefined;
			});

			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			expect(result[0][0].json.content).toMatch(/^#/); // Should start with markdown heading
			expect(result[0][0].json.content).toContain('**bold text**'); // Should have markdown bold
		});
	});

	describe('execute() with both HTML and Markdown', () => {
		it('should return both content and contentMarkdown fields', async () => {
			const testHtml = `
				<html>
					<body>
						<article>
							<h1>Test</h1>
							<p>Content</p>
						</article>
					</body>
				</html>
			`;

			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { data: testHtml } },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return testHtml;
				if (paramName === 'url') return '';
				if (paramName === 'contentFormat') return 'both';
				if (paramName === 'options') return { outputFields: ['content', 'contentMarkdown'] };
				return undefined;
			});

			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			expect(result[0][0].json).toHaveProperty('content');
			expect(result[0][0].json).toHaveProperty('contentMarkdown');
			expect(typeof result[0][0].json.content).toBe('string');
			expect(typeof result[0][0].json.contentMarkdown).toBe('string');
		});
	});

	describe('execute() with output field filtering', () => {
		it('should only include specified fields in output', async () => {
			const testHtml = `
				<html>
					<head><title>Test Title</title></head>
					<body>
						<article>
							<p>Content</p>
						</article>
					</body>
				</html>
			`;

			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { data: testHtml } },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return testHtml;
				if (paramName === 'url') return '';
				if (paramName === 'contentFormat') return 'html';
				if (paramName === 'options') return { outputFields: ['title', 'wordCount'] };
				return undefined;
			});

			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			expect(result[0][0].json).toHaveProperty('title');
			expect(result[0][0].json).toHaveProperty('wordCount');
			expect(result[0][0].json).not.toHaveProperty('content');
			expect(result[0][0].json).not.toHaveProperty('author');
		});
	});

	describe('execute() with options', () => {
		it('should respect removeImages option', async () => {
			const testHtml = `
				<html>
					<body>
						<article>
							<p>Text content</p>
							<img src="test.jpg" alt="Test">
						</article>
					</body>
				</html>
			`;

			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { data: testHtml } },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return testHtml;
				if (paramName === 'url') return '';
				if (paramName === 'contentFormat') return 'html';
				if (paramName === 'options') return { removeImages: true, outputFields: ['content'] };
				return undefined;
			});

			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			// The content should not contain image tags
			expect(result[0][0].json.content).not.toContain('<img');
		});
	});

	describe('execute() error handling', () => {
		it('should continue on fail when enabled', async () => {
			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: {} },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return '';
				return undefined;
			});

			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			expect(result[0][0].json).toHaveProperty('error');
			expect(result[0][0].json.error).toContain('HTML source is required');
		});

		it('should throw error when continueOnFail is disabled', async () => {
			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: {} },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'htmlSource') return '';
				return undefined;
			});

			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			await expect(
				defuddleNode.execute.call(mockExecuteFunctions),
			).rejects.toThrow();
		});
	});

	describe('execute() with multiple items', () => {
		it('should process multiple HTML inputs', async () => {
			const testHtml1 = '<html><body><article><p>Content 1</p></article></body></html>';
			const testHtml2 = '<html><body><article><p>Content 2</p></article></body></html>';

			mockExecuteFunctions.getInputData.mockReturnValue([
				{ json: { data: testHtml1 } },
				{ json: { data: testHtml2 } },
			] as INodeExecutionData[]);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number) => {
					if (paramName === 'htmlSource') return itemIndex === 0 ? testHtml1 : testHtml2;
					if (paramName === 'url') return '';
					if (paramName === 'contentFormat') return 'html';
					if (paramName === 'options') return {};
					return undefined;
				},
			);

			const result = await defuddleNode.execute.call(mockExecuteFunctions);

			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json.content).toContain('Content 1');
			expect(result[0][1].json.content).toContain('Content 2');
		});
	});
});
