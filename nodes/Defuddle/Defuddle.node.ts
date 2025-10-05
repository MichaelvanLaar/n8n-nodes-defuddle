import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import type { DefuddleOptions, DefuddleResponse } from 'defuddle';
import DefuddleClass from 'defuddle';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

/**
 * Convert HTML content to Markdown
 */
function convertToMarkdown(html: string): string {
	const turndownService = new TurndownService({
		headingStyle: 'atx',
		codeBlockStyle: 'fenced',
	});
	return turndownService.turndown(html);
}

export class Defuddle implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Defuddle',
		name: 'defuddle',
		icon: 'file:defuddle.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Extract main content from webpages using Defuddle',
		defaults: {
			name: 'Defuddle',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'HTML Source',
				name: 'htmlSource',
				type: 'string',
				default: '={{$json.data}}',
				required: true,
				description: 'The HTML content to extract from. Usually from an HTTP Request node.',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'Optional: The original URL of the page (helps with relative links)',
			},
			{
				displayName: 'Content Format',
				name: 'contentFormat',
				type: 'options',
				default: 'html',
				description: 'Choose the output format for the extracted content',
				options: [
					{
						name: 'HTML Only',
						value: 'html',
						description: 'Return content as HTML',
					},
					{
						name: 'Markdown Only',
						value: 'markdown',
						description: 'Convert content to Markdown (content field will contain Markdown)',
					},
					{
						name: 'HTML + Markdown',
						value: 'both',
						description: 'Return both HTML (content) and Markdown (contentMarkdown)',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Remove Images',
						name: 'removeImages',
						type: 'boolean',
						default: false,
						description: 'Whether to remove images from the extracted content',
					},
					{
						displayName: 'Remove Exact Selectors',
						name: 'removeExactSelectors',
						type: 'boolean',
						default: true,
						description:
							'Whether to remove elements matching exact selectors like ads, social buttons, etc.',
					},
					{
						displayName: 'Remove Partial Selectors',
						name: 'removePartialSelectors',
						type: 'boolean',
						default: true,
						description:
							'Whether to remove elements matching partial selectors like ads, social buttons, etc.',
					},
					{
						displayName: 'Debug Mode',
						name: 'debug',
						type: 'boolean',
						default: false,
						description: 'Whether to enable verbose logging',
					},
					{
						displayName: 'Output Fields',
						name: 'outputFields',
						type: 'multiOptions',
						default: ['content', 'title', 'author', 'description'],
						description: 'Choose which fields to include in the output',
						options: [
							{
								name: 'Content',
								value: 'content',
								description: 'The main extracted content',
							},
							{
								name: 'Content Markdown',
								value: 'contentMarkdown',
								description:
									'The content in Markdown format (only available with separateMarkdown option)',
							},
							{
								name: 'Title',
								value: 'title',
								description: 'The page title',
							},
							{
								name: 'Author',
								value: 'author',
								description: 'The article author',
							},
							{
								name: 'Description',
								value: 'description',
								description: 'The article summary/description',
							},
							{
								name: 'Domain',
								value: 'domain',
								description: 'The website domain',
							},
							{
								name: 'Word Count',
								value: 'wordCount',
								description: 'The total number of words in the content',
							},
							{
								name: 'Published Date',
								value: 'published',
								description: 'The publication date',
							},
							{
								name: 'Image',
								value: 'image',
								description: 'The main article image URL',
							},
							{
								name: 'Schema.org Data',
								value: 'schemaOrgData',
								description: 'Extracted structured data',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const htmlSource = this.getNodeParameter('htmlSource', i) as string;
				const url = this.getNodeParameter('url', i, '') as string;
				const contentFormat = this.getNodeParameter('contentFormat', i) as string;
				const options = this.getNodeParameter('options', i, {}) as {
					removeImages?: boolean;
					removeExactSelectors?: boolean;
					removePartialSelectors?: boolean;
					debug?: boolean;
					outputFields?: string[];
				};

				if (!htmlSource) {
					throw new NodeOperationError(this.getNode(), 'HTML source is required', { itemIndex: i });
				}

				// Prepare defuddle options (don't pass markdown options to the parser)
				const defuddleOptions: DefuddleOptions = {
					debug: options.debug || false,
					removeImages: options.removeImages || false,
					removeExactSelectors: options.removeExactSelectors !== false,
					removePartialSelectors: options.removePartialSelectors !== false,
				};

				// Add URL to options if provided
				if (url) {
					defuddleOptions.url = url;
				}

				// Parse the HTML using Defuddle with JSDOM
				// Security: Disable script execution and restrict external resource loading
				const dom = new JSDOM(htmlSource, {
					url: url || undefined,
					runScripts: undefined, // Never run scripts
					resources: undefined, // Don't load external resources
					pretendToBeVisual: false, // Not needed for parsing
				});
				const defuddle = new DefuddleClass(dom.window.document, defuddleOptions);
				const result: DefuddleResponse = defuddle.parse();

				// Handle markdown conversion based on contentFormat
				if (contentFormat === 'markdown') {
					// Replace content with markdown
					result.content = convertToMarkdown(result.content);
				} else if (contentFormat === 'both') {
					// Add separate markdown field
					result.contentMarkdown = convertToMarkdown(result.content);
				}

				// Filter output fields if specified
				let outputFields = options.outputFields;

				// If no output fields specified, use defaults
				if (!outputFields || outputFields.length === 0) {
					outputFields = ['content', 'title', 'author', 'description'];

					// Auto-include contentMarkdown when format is 'both'
					if (contentFormat === 'both') {
						outputFields.push('contentMarkdown');
					}
				}

				const filteredResult: any = {};
				outputFields.forEach((field) => {
					if ((result as any)[field] !== undefined) {
						filteredResult[field] = (result as any)[field];
					}
				});

				returnData.push({
					json: filteredResult,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
