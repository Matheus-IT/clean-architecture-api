import { User } from '@/entities';
import { Either, left, right } from '@/shared';
import { MailServiceError } from '@/usecases/errors';
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

class MailServiceStub implements EmailService {
	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		return right(emailOptions);
	}
}

class MailServiceErrorStub implements EmailService {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async send(emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
		return left(new MailServiceError());
	}
}

describe('Send email to user', () => {
	test('should email user with valid name and email address', async () => {
		const mailServiceStub = new MailServiceStub();
		const usecase = new SendEmail(mailOptions, mailServiceStub);
		const user = User.create({ name: toName, email: toEmail }).value as User;

		const response = (await usecase.perform(user)).value as EmailOptions;

		expect(response.to).toEqual(toName + '<' + toEmail + '>');
	});

	test('should return error when email service fails', async () => {
		const mailServiceErrorStub = new MailServiceErrorStub();
		const usecase = new SendEmail(mailOptions, mailServiceErrorStub);

		const name = 'any_name';
		const email = 'any@email.com';
		const user = User.create({ name, email }).value as User;

		const response = await usecase.perform(user);
		expect(response.value).toBeInstanceOf(MailServiceError);
	});
});
