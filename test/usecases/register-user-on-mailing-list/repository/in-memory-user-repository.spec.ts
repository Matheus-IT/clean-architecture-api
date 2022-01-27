import { UserData } from '@/entities';
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository';

describe('In memory user repository', () => {
	test('should return null if user is not found', async () => {
		const users: UserData[] = [];
		const userRepo = new InMemoryUserRepository(users);
		const user = await userRepo.findUserByEmail('test@example.com');
		expect(user).toBeNull();
	});

	test('should return user when it is found in the repository', async () => {
		const users: UserData[] = [];
		const userRepo = new InMemoryUserRepository(users);

		const newUser = {
			name: 'juvenal',
			email: 'juvenal@test.com',
		};
		await userRepo.add(newUser);

		const user = await userRepo.findUserByEmail(newUser.email);

		expect(user).toBe(newUser);
	});

	test('should return all users in the repository', async () => {
		const users: UserData[] = [
			{ name: 'user1', email: 'user1@mail.com' },
			{ name: 'user2', email: 'user2@mail.com' },
		];

		const userRepo = new InMemoryUserRepository(users);
		const allUsers = await userRepo.findAllUsers();

		expect(allUsers).toBe(users);
	});
});
