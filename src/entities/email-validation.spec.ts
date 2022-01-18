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

	test('should not accept local part larger than 64 chars', () => {
		const email = 'l'.repeat(65) + '@mail.com';
		expect(Email.validate(email)).toBeFalsy();
	});

	test('should not accept email larger than 256 chars', () => {
		const email = 'l'.repeat(64) + '@' + 'd'.repeat(192); // one char more than acceptable
		expect(Email.validate(email)).toBeFalsy();
	});
});
