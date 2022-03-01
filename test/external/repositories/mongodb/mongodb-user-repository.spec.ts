import { MongodbUserRepository } from '@/external/repositories/mongodb';
import { MongoHelper } from '@/external/repositories/mongodb/helper';

describe('Mongodb user repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		MongoHelper.disconnect();
	});

	beforeEach(async () => {
		await MongoHelper.clearCollection('users');
	});

	test('user should be added', async () => {
		const userRepository = new MongodbUserRepository();

		const testUser = {
			name: 'test user',
			email: 'test@email.com',
		};

		await userRepository.add(testUser);
		expect(await userRepository.exists(testUser)).toBeTruthy();
	});

	test('Find all users should return all added users', async () => {
		const userRepository = new MongodbUserRepository();
		await userRepository.add({
			name: '1test name',
			email: '1test@email.com',
		});
		await userRepository.add({
			name: '2test name',
			email: '2test@email.com',
		});

		const users = await userRepository.findAllUsers();
		expect(users[0].name).toEqual('1test name');
		expect(users[0].email).toEqual('1test@email.com');
		expect(users[1].name).toEqual('2test name');
		expect(users[1].email).toEqual('2test@email.com');
	});
});
