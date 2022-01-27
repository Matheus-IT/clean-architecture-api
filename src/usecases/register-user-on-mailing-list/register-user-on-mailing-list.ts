import { InvalidEmailError, InvalidNameError } from '../../entities/errors';
import { User, UserData } from '../../entities';
import { Either, left, right } from '../../shared';
import { UserRepository } from './ports';

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
