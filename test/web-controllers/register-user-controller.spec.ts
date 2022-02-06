import { UserData } from '@/entities';
import { InvalidEmailError, InvalidNameError } from '@/entities/errors';
import { UseCase } from '@/usecases/ports';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports';
import { MissingParamError } from '@/web-controllers/errors';
import { HttpRequest, HttpResponse } from '@/web-controllers/ports';
import { RegisterUserController } from '@/web-controllers/register-user-controller';
import { InMemoryUserRepository } from '@/usecases/repository';

describe('Register user web controller', () => {
	const users: UserData[] = [];
	const repo: UserRepository = new InMemoryUserRepository(users);
	const usecase: UseCase = new RegisterUserOnMailingList(repo);
	const controller: RegisterUserController = new RegisterUserController(usecase);

	class ErrorThrowingUseCaseStub implements UseCase {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		perform(request: never): Promise<void> {
			throw Error();
		}
	}
	const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub();

	test('should return status code 201 when request contains valid user data', async () => {
		const request: HttpRequest = {
			body: {
				name: 'Test user',
				email: 'test@email.com',
			},
		};

		const response: HttpResponse = await controller.handle(request);
		expect(response.statusCode).toEqual(201);
		expect(response.body).toEqual(request.body);
	});

	test('should return status code 400 when request contains invalid name', async () => {
		const requestWithInvalidName: HttpRequest = {
			body: {
				name: 'M             ',
				email: 'test@email.com',
			},
		};

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

		const response: HttpResponse = await controller.handle(requestWithInvalidEmail);
		expect(response.statusCode).toEqual(400);
		expect(response.body).toBeInstanceOf(InvalidEmailError);
	});

	test('should return status code 400 when request is missing username', async () => {
		const requestWithoutName: HttpRequest = {
			body: {
				email: 'test@mail.br',
			},
		};

		const response: HttpResponse = await controller.handle(requestWithoutName);
		expect(response.statusCode).toEqual(400);
		expect(response.body).toBeInstanceOf(MissingParamError);
		expect((response.body as Error).message).toEqual('Missing parameter from request: name.');
	});

	test('should return status code 400 when request is missing email', async () => {
		const requestWithoutEmail: HttpRequest = {
			body: {
				name: 'someone',
			},
		};

		const response: HttpResponse = await controller.handle(requestWithoutEmail);
		expect(response.statusCode).toEqual(400);
		expect(response.body).toBeInstanceOf(MissingParamError);
		expect((response.body as Error).message).toEqual('Missing parameter from request: email.');
	});

	test('should return status code 400 when request is missing name and email', async () => {
		const requestWithoutBody: HttpRequest = {
			body: {},
		};

		const response: HttpResponse = await controller.handle(requestWithoutBody);
		expect(response.statusCode).toEqual(400);
		expect(response.body).toBeInstanceOf(MissingParamError);
		expect((response.body as Error).message).toEqual('Missing parameter from request: name and email.');
	});

	test('should return status code 500 when server raises exception', async () => {
		const request: HttpRequest = {
			body: {
				name: 'Test name',
				email: 'test@email.com',
			},
		};

		const controller = new RegisterUserController(errorThrowingUseCaseStub);
		const response: HttpResponse = await controller.handle(request);
		expect(response.statusCode).toEqual(500);
		expect(response.body).toBeInstanceOf(Error);
	});
});
