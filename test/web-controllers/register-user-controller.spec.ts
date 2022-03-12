import { UserData } from '@/entities';
import { InvalidEmailError, InvalidNameError } from '@/entities/errors';
import { UseCase } from '@/usecases/ports';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports';
import { MissingParamError } from '@/web-controllers/errors';
import { HttpRequest, HttpResponse } from '@/web-controllers/ports';
import { RegisterAndSendEmailController } from '@/web-controllers/register-user-controller';
import { InMemoryUserRepository } from '@/usecases/repository';
import { EmailOptions, EmailService } from '@/usecases/send-email/ports';
import { Either, right } from '@/shared';
import { MailServiceError } from '@/usecases/errors';
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email';
import { SendEmail } from '@/usecases/send-email';

const attachmentFilePath = '../resources/text.txt';
const fromName = 'Test';
const fromEmail = 'from_email@email.com';
const toName = 'any one';
const toEmail = 'any_email@email.com';
const subject = 'Test email';
const emailBody = 'Hello wold attachment test';
const emailBodyHtml = '<b>Hello world attachment testing</b>';
const attachment = [
	{
		filename: attachmentFilePath,
		contentType: 'text/plain',
	},
];
const mailOptions: EmailOptions = {
	host: 'test',
	port: 867,
	username: 'test',
	password: 'test',
	from: fromName + ' ' + fromEmail,
	to: toName + '<' + toEmail + '>',
	subject: subject,
	text: emailBody,
	html: emailBodyHtml,
	attachments: attachment,
};

class MailServiceStub implements EmailService {
	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		return right(emailOptions);
	}
}

describe('Register user web controller', () => {
	// Register usecase
	const users: UserData[] = [];
	const repo: UserRepository = new InMemoryUserRepository(users);
	const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);

	// Send email
	const mailServiceStub = new MailServiceStub();
	const sendEmailUsecase = new SendEmail(mailOptions, mailServiceStub);

	// Combined register and send
	const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase);
	const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase);

	class ErrorThrowingUseCaseStub implements UseCase {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		perform(request: never): Promise<void> {
			throw Error();
		}
	}
	const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub();

	test('should return status code ok when request contains valid user data', async () => {
		const request: HttpRequest = {
			body: {
				name: 'Test user',
				email: 'test@email.com',
			},
		};

		const response: HttpResponse = await controller.handle(request);
		expect(response.statusCode).toEqual(200);
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

		const controller = new RegisterAndSendEmailController(errorThrowingUseCaseStub);
		const response: HttpResponse = await controller.handle(request);
		expect(response.statusCode).toEqual(500);
		expect(response.body).toBeInstanceOf(Error);
	});
});
