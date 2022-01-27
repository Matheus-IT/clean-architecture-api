import { User } from '../../src/entities';

describe('User domain entity', () => {
	test('should not create user width invalid email address', () => {
		const invalidEmail = 'invalid_email';
		const error = User.create({ name: 'test_name', email: invalidEmail }).value as Error;
		expect(error.name).toEqual('InvalidEmailError');
		expect(error.message).toEqual('Invalid email: ' + invalidEmail + '.');
	});

	test('should not create user with invalid name (too few characters)', () => {
		const invalidName = 'M           ';
		const error = User.create({ name: invalidName, email: 'test@email.com' }).value as Error;
		expect(error.name).toEqual('InvalidNameError');
		expect(error.message).toEqual('Invalid name: ' + invalidName + '.');
	});

	test('should not create user with invalid name (too many characters)', () => {
		const invalidName = 'M'.repeat(257);
		const error = User.create({ name: invalidName, email: 'test@email.com' }).value as Error;
		expect(error.name).toEqual('InvalidNameError');
	});

	test('should create user with valid data', () => {
		const validUserData = { name: 'test_name', email: 'test@test.com' };
		const user = User.create(validUserData).value as User;

		expect(user.name.value).toEqual(validUserData.name);
		expect(user.email.value).toEqual(validUserData.email);
	});
});
