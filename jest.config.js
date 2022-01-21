/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export const roots = ['<rootDir>/src'];
export const coverageDirectory = 'coverage';
export const collectCoverageFrom = [
	'<rootDir>/src/**/*.ts',
	'!**/test/**',
	'!**/config/**'
];
export const testEnvironment = 'node';
export const transform = {
	'.+\\.ts$': 'ts-jest'
};
