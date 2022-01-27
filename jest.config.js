module.exports = {
	roots: ['<rootDir>/test'],
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
