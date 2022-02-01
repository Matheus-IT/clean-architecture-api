import app from '@/main/config/app';
import request from 'supertest';

describe('CORS middleware', () => {
	test('Should enable cors', async () => {
		app.post('/test-cors', (req, res) => {
			res.send();
		});

		await request(app)
			.get('/test_cors')
			.expect('access-control-allow-origin', '*')
			.expect('access-control-allow-headers', '*')
			.expect('access-control-allow-methods', '*');
	});
});
