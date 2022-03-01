import { User, UserData } from '@/entities';
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
	test('should add user with complete data to mailing list', async () => {
		// Register usecase
		const users: UserData[] = [];
		const repo: UserRepository = new InMemoryUserRepository(users);
		const registerUsecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo);

		// Send email
		const mailServiceMock = new MailServiceMock();
		const sendEmailUsecase = new SendEmail(mailOptions, mailServiceMock);

		// Combined register and send
		const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase);
		const res = (await registerAndSendEmailUseCase.perform({ name: 'test name', email: 'test@email.com' }))
			.value as User;

		const user = await repo.findUserByEmail('test@email.com');

		expect(user.name).toBe('test name');
		expect(res.name.value).toBe('test name');
		expect(mailServiceMock.timesSendWasCalled).toEqual(1);
		expect(res.name.value).toEqual('test name');
	});
});
