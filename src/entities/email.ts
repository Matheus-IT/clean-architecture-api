export class Email {
	static validate(email: string): boolean {
		if (!email) {
			return false;
		}
		if (email.length > 256) {
			return false;
		}
		const [local, domain] = email.split('@');
		if (local.length > 64 || domain.length > 191) {
			return false;
		}
		return true;
	}
}
