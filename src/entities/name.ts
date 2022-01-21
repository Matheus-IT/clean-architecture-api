import { Either, left, right } from '../shared/either';
import { InvalidNameError } from './errors/invalid-name-error';

export class Name {
	private readonly value: string;

	private constructor(value: string) {
		this.value = value;
	}

	static create(value: string): Either<InvalidNameError, Name> {
		if (!Name.validate(value)) {
			return left(new InvalidNameError());
		}
		return right(new Name(value));
	}

	public static validate(value: string): boolean {
		if (!value) {
			return false;
		}
		const val = value.trim();
		if (val.length > 256 || val.length < 2) {
			return false;
		}
		return true;
	}
}
