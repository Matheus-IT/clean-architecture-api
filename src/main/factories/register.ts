import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { RegisterUserController } from '@/web-controllers';
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository';

export const makeRegisterUserController = (): RegisterUserController => {
	const inMemoryRepository = new InMemoryUserRepository([]);
	const usecase = new RegisterUserOnMailingList(inMemoryRepository);
	const controller = new RegisterUserController(usecase);
	return controller;
};
