import { MongoHelper } from '@/external/repositories/mongodb/helper';
import app from '@/main/config/app';
import request from 'supertest';

describe('Register route', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		MongoHelper.clearCollection('users');
	});

	test('Should return an account on success', async () => {
		app.post('/test_cors', (req, res) => {
			res.send();
		});

		await request(app).post('/api/register').send({ name: 'test name', email: 'test@email.com' }).expect(201);
	});
});
