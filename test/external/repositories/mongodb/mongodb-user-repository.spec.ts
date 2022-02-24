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
		MongoHelper.clearCollection('users');
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
});
