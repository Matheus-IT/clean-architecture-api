import request from 'supertest';
import app from '@/main/config/app';

describe('Body parser middleware', () => {
	test('Should parse body as json', async () => {
		app.post('/test-body-parser', (req, res) => {
			res.send(req.body);
		});

		await request(app).post('/test-body-parser').send({ name: 'Testing123' }).expect({ name: 'Testing123' });
	});
});
