import 'module-alias/register';
import app from '@/main/config/app';
import { MongoHelper } from '@/external/repositories/mongodb/helper';

MongoHelper.connect(process.env.MONGO_URL).then(async () => {
	const app = await (await import('./config/app')).default;
	app.listen(5000, () => {
		console.log('Server running at http://localhost:5000');
	});
});
