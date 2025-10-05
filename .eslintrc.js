module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		ecmaVersion: 2019,
	},
	ignorePatterns: ['.eslintrc.js', '**/*.js', 'node_modules', 'dist'],
	plugins: ['@typescript-eslint'],
	extends: ['plugin:n8n-nodes-base/community'],
	rules: {
		'n8n-nodes-base/node-dirname-against-convention': 'error',
		'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
		'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
		'n8n-nodes-base/node-filename-against-convention': 'error',
	},
};
