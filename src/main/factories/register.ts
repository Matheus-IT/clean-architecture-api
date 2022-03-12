import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { RegisterAndSendEmailController } from '@/web-controllers';
import { MongodbUserRepository } from '@/external/repositories/mongodb';
import { EmailOptions } from '@/usecases/send-email/ports';
import { SendEmail } from '@/usecases/send-email';
import { NodemailerEmailService } from '@/external/mail-services';
import { getEmailOptions } from '@/main/config/email';
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email';

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

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
	const mongodbUserRepository = new MongodbUserRepository();
	const registerUsecase = new RegisterUserOnMailingList(mongodbUserRepository);

	const emailService = new NodemailerEmailService();
	const sendEmailUsecase = new SendEmail(getEmailOptions(), emailService);
	const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUsecase, sendEmailUsecase);
	const controller = new RegisterAndSendEmailController(registerAndSendEmailUseCase);
	return controller;
};
