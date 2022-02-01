import { Express } from 'express';
import { bodyParser } from './middleware/body-parser';

export default (app: Express) => {
	app.use(bodyParser);
};
