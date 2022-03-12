import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { RegisterAndSendEmailController } from '@/web-controllers';
import { MongodbUserRepository } from '@/external/repositories/mongodb';

export const makeRegisterUserController = (): RegisterAndSendEmailController => {
	const mongodbUserRepository = new MongodbUserRepository();
	const usecase = new RegisterUserOnMailingList(mongodbUserRepository);
	const controller = new RegisterAndSendEmailController(usecase);
	return controller;
};
