export class Email {
	static validate(email: string): boolean {
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
