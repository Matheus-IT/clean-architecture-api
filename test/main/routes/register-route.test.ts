import app from '@/main/config/app';
import request from 'supertest';

describe('Register route', () => {
	test('Should return an account on success', async () => {
		app.post('/test_cors', (req, res) => {
			res.send();
		});

		await request(app).post('/api/register').send({ name: 'test name', email: 'test@email.com' }).expect(201);
	});
});
