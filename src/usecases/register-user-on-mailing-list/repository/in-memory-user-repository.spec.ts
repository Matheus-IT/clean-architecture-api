import { UserData } from '../user-data';
import { InMemoryUserRepository } from './in-memory-user-repository';

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
});
