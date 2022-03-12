import { User, UserData } from '@/entities';
import { InvalidEmailError, InvalidNameError } from '@/entities/errors';
import { Either, left, right } from '@/shared';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { SendEmail } from '@/usecases/send-email';
import { MailServiceError } from '@/usecases/errors';
import { UseCase } from '@/usecases/ports';

export class RegisterAndSendEmail implements UseCase {
	private registerUser: RegisterUserOnMailingList;
	private sendEmail: SendEmail;

	constructor(registerUser: RegisterUserOnMailingList, sendEmail: SendEmail) {
		this.registerUser = registerUser;
		this.sendEmail = sendEmail;
	}

	async perform(request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>> {
		const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request);
		if (userOrError.isLeft()) {
			return left(userOrError.value);
		}

		const user: User = userOrError.value;

		await this.registerUser.perform(user);
		const result = await this.sendEmail.perform(user);

		if (result.isLeft()) {
			return left(result.value);
		}
		return right({ name: user.name.value, email: user.email.value });
	}
}
