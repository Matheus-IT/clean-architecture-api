import { Email } from './email';

describe('Email validation', () => {
	test('should not accept null email', () => {
		const email = null;
		expect(Email.validate(email)).toBeFalsy();
	});

	test('should not accept empty strings as email', () => {
		const email = '';
		expect(Email.validate(email)).toBeFalsy();
	});

	test('should accept valid email', () => {
		const email = 'juvenal@mail.com';
		expect(Email.validate(email)).toBeTruthy();
	});
});
