/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	roots: ['<rootDir>/src'],
	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!**/test/**',
		'!**/config/**'
	],
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest'
	}
};
