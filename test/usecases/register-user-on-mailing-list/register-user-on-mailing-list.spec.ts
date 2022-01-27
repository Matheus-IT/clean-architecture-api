import { UserData } from '../../../src/entities/user-data';
import { UserRepository } from '../../../src/usecases/register-user-on-mailing-list/ports/user-repository';
import { RegisterUserOnMailingList } from '../../../src/usecases/register-user-on-mailing-list/register-user-on-mailing-list';
import { InMemoryUserRepository } from './repository/in-memory-user-repository';

describe('register user on mailing list use case', () => {
	test('should add user with complete data to mailing list', async () => {
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);

		const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);
		const name = 'any_name';
		const email = 'any@email.com';
		const res = await useCase.perform({ name, email });

		const user = repo.findUserByEmail('any@email.com');
		expect((await user).name).toBe('any_name');
		expect(res.value.name).toBe('any_name');
	});

	test('should not add user with invalid name to mailing list', async () => {
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);

		const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);
		const name = 'any_name';
		const invalidEmail = 'invalid_email';
		const res = (await useCase.perform({ name: name, email: invalidEmail })).value as Error;

		const user = await repo.findUserByEmail('any@email.com');
		expect(user).toBeNull();
		expect(res.name).toEqual('InvalidEmailError');
	});

	test('should not add user with invalid email to mailing list', async () => {
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);

		const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);
		const invalidName = '';
		const email = 'test@mail.com';
		const res = (await useCase.perform({ name: invalidName, email: email })).value as Error;

		const user = await repo.findUserByEmail('test@mail.com');
		expect(user).toBeNull();
		expect(res.name).toEqual('InvalidNameError');
	});
});
