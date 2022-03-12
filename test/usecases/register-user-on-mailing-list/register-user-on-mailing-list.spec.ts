import { User, UserData } from '@/entities';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { InMemoryUserRepository } from '@/usecases/repository';

describe('register user on mailing list use case', () => {
	test('should add user with complete data to mailing list', async () => {
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);

		const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);
		const name = 'any_name';
		const email = 'any@email.com';
		const user = User.create({ name, email }).value as User;
		const res = await useCase.perform(user);

		const addedUser = repo.findUserByEmail('any@email.com');
		expect((await addedUser).name).toBe('any_name');
		expect(res.name).toBe('any_name');
	});
});
