import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default tseslint.config(
	{
		ignores: ['node_modules/**', 'dist/**', '**/*.js'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		files: ['nodes/**/*.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			'n8n-nodes-base/node-dirname-against-convention': 'error',
			'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
			'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
			'n8n-nodes-base/node-filename-against-convention': 'error',
			'@typescript-eslint/require-await': 'off', // n8n nodes must return Promise even without await
		},
	}
);
