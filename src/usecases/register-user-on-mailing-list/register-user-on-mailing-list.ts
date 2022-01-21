import { InvalidEmailError } from '../../entities/errors/invalid-email-error';
import { InvalidNameError } from '../../entities/errors/invalid-name-error';
import { User } from '../../entities/user';
import { UserData } from '../../entities/user-data';
import { Either, left, right } from '../../shared/either';
import { UserRepository } from './ports/user-repository';

export class RegisterUserOnMailingList {
	private readonly userRepo: UserRepository;

	constructor(userRepo: UserRepository) {
		this.userRepo = userRepo;
	}

	async perform(userData: UserData): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
		const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(userData);
		if (userOrError.isLeft()) {
			return left(userOrError.value);
		}

		if (!(await this.userRepo.exists(userData))) {
			await this.userRepo.add(userData);
		}
		return right(userData);
	}
}
