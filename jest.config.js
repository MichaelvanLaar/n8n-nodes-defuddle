/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/nodes'],
	testMatch: ['**/__tests__/**/*.test.ts'],
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'!nodes/**/__tests__/**', // Exclude test files from coverage
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: {
					esModuleInterop: true,
				},
			},
		],
	},
};
