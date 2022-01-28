import { UserData } from '@/entities';
import { InvalidEmailError, InvalidNameError } from '@/entities/errors';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports';
import { MissingParamError } from '@/web-controllers/errors';
import { HttpRequest, HttpResponse } from '@/web-controllers/ports';
import { RegisterUserController } from '@/web-controllers/register-user-controller';
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository';

describe('Register user web controller', () => {
	test('should return status code 201 when request contains valid user data', async () => {
		const request: HttpRequest = {
			body: {
				name: 'Test user',
				email: 'test@email.com',
			},
		};

		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);
		const controller: RegisterUserController = new RegisterUserController(usecase);

		const response: HttpResponse = await controller.handle(request);
		expect(response.statusCode).toEqual(201);
		expect(response.body).toEqual(request.body);
	});

	test('should return status code 400 when request contains invalid name', async () => {
		const requestWithInvalidName: HttpRequest = {
			body: {
				name: '',
				email: 'test@email.com',
			},
		};

		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const usecase = new RegisterUserOnMailingList(repo);
		const controller = new RegisterUserController(usecase);

		const response: HttpResponse = await controller.handle(requestWithInvalidName);
		expect(response.statusCode).toEqual(400);
		expect(response.body).toBeInstanceOf(InvalidNameError);
	});

	test('should return status code 400 when request contains invalid email', async () => {
		const requestWithInvalidEmail: HttpRequest = {
			body: {
				name: 'Test name',
				email: 'invalid_email',
			},
		};

		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const usecase = new RegisterUserOnMailingList(repo);
		const controller = new RegisterUserController(usecase);

		const response: HttpResponse = await controller.handle(requestWithInvalidEmail);
		expect(response.statusCode).toEqual(400);
		expect(response.body).toBeInstanceOf(InvalidEmailError);
	});
});
