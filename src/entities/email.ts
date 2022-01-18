export class Email {
	static validate(email: string): boolean {
		const emailRegex =
			/^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

		if (!emailRegex.test(email)) {
			return false;
		}
		if (!email) {
			return false;
		}
		if (email.length > 256) {
			return false;
		}
		const [local, domain] = email.split('@');
		if (local.length > 64 || local.length == 0 || domain.length > 190 || domain.length == 0) {
			return false;
		}
		return true;
	}
}
