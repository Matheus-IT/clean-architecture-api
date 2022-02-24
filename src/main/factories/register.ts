import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { RegisterUserController } from '@/web-controllers';
import { MongodbUserRepository } from '@/external/repositories/mongodb';

export const makeRegisterUserController = (): RegisterUserController => {
	const mongodbUserRepository = new MongodbUserRepository();
	const usecase = new RegisterUserOnMailingList(mongodbUserRepository);
	const controller = new RegisterUserController(usecase);
	return controller;
};
