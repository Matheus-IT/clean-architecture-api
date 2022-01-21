import { Either, left, right } from '../shared/either';
import { InvalidEmailError } from './errors/invalid-email-error';

export class Email {
	private readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static create(value: string): Either<InvalidEmailError, Email> {
		if (Email.validate(value)) {
			return right(new Email(value));
		}
		return left(new InvalidEmailError());
	}

	static validate(value: string): boolean {
		const emailRegex =
			/^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

		if (!emailRegex.test(value)) {
			return false;
		}
		if (!value) {
			return false;
		}
		if (value.length > 256) {
			return false;
		}
		const [local, domain] = value.split('@');
		if (local.length > 64 || local.length == 0 || domain.length > 190 || domain.length == 0) {
			return false;
		}
		return true;
	}
}
