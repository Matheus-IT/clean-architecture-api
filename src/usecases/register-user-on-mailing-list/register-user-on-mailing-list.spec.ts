import { UserData } from '../../entities/user-data';

describe('register user on mailing list use case', () => {
	test('should add user with complete data to mailing list', async () => {
		const users: UserData[] = [];
		console.log(users);
		// const repo: UserRepository = new InMemoryUserRepository(users);

		// const usecase: RegisterUserOnMailinList = new RegisterUserOnMailingList(repo);
		// const name = 'any_name';
		// const email = 'any@email.com';
		// const res = await usecase.RegisterUserOnMailingList({ name, email});

		// const user = repo.findUserByEmail('any@email.com');
		// expect((await user).name).toBe('any_name');
	});
});
