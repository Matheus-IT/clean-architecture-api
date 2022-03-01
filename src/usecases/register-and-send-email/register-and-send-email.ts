import { User, UserData } from '@/entities';
import { InvalidEmailError, InvalidNameError } from '@/entities/errors';
import { Either, left, right } from '@/shared';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { SendEmail } from '@/usecases/send-email';
import { MailServiceError } from '../errors';
import { UseCase } from '../ports';

export class RegisterAndSendEmail implements UseCase {
	private registerUser: RegisterUserOnMailingList;
	private sendEmail: SendEmail;

	constructor(registerUser: RegisterUserOnMailingList, sendEmail: SendEmail) {
		this.registerUser = registerUser;
		this.sendEmail = sendEmail;
	}

	async perform(request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, User>> {
		const userOrError = User.create(request);

		if (userOrError.isLeft()) {
			return left(userOrError.value);
		}

		const user: User = userOrError.value;
		const userData = { name: user.name.value, email: user.email.value };

		await this.registerUser.perform(userData);

		const result = await this.sendEmail.perform(userData);

		if (result.isLeft()) {
			return left(result.value);
		}
		return right(user);
	}
}
