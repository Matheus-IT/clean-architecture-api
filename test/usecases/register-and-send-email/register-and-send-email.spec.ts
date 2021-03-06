import { UserData } from '@/entities';
import { Either, right } from '@/shared';
import { MailServiceError } from '@/usecases/errors';
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports';
import { InMemoryUserRepository } from '@/usecases/repository';
import { SendEmail } from '@/usecases/send-email';
import { EmailOptions, EmailService } from '@/usecases/send-email/ports';

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

class MailServiceMock implements EmailService {
	public timesSendWasCalled = 0;

	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		this.timesSendWasCalled++;
		return right(emailOptions);
	}
}

describe('Register and send email to user', () => {
	test('should register user and send him an email with valid data', async () => {
		// Register usecase
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);

		// Send email
		const mailServiceMock = new MailServiceMock();
		const sendEmailUsecase = new SendEmail(mailOptions, mailServiceMock);

		// Combined register and send
		const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase);
		const res: UserData = (await registerAndSendEmailUseCase.perform({ name: 'test name', email: 'test@email.com' }))
			.value as UserData;

		const user = await repo.findUserByEmail('test@email.com');

		expect(user.name).toBe('test name');
		expect(res.name).toBe('test name');
		expect(mailServiceMock.timesSendWasCalled).toEqual(1);
	});

	test('should not register user and send him an email with invalid email', async () => {
		// Register usecase
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);

		// Send email
		const mailServiceMock = new MailServiceMock();
		const sendEmailUsecase = new SendEmail(mailOptions, mailServiceMock);

		// Combined register and send
		const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase);

		const invalidEmail = 'invalid@com';
		const res = (await registerAndSendEmailUseCase.perform({ name: 'test name', email: invalidEmail }))
			.value as UserData;

		expect(res.name).toEqual('InvalidEmailError');
	});

	test('should not register user and send him an email with invalid name', async () => {
		// Register usecase
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);

		// Send email
		const mailServiceMock = new MailServiceMock();
		const sendEmailUsecase = new SendEmail(mailOptions, mailServiceMock);

		// Combined register and send
		const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase);

		const invalidName = 'a';
		const res = (await registerAndSendEmailUseCase.perform({ name: invalidName, email: 'test@mail.com' }))
			.value as UserData;

		expect(res.name).toEqual('InvalidNameError');
	});
});
