import { UserData } from '@/entities';
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list';
import { HttpRequest, HttpResponse } from '@/web-controllers/ports';
import { created, badRequest } from '@/web-controllers/utils';
import { MissingParamError } from './errors';

export class RegisterUserController {
	private readonly usecase: RegisterUserOnMailingList;
	private readonly requiredParams = ['name', 'email'];

	constructor(usecase: RegisterUserOnMailingList) {
		this.usecase = usecase;
	}

	public async handle(request: HttpRequest): Promise<HttpResponse> {
		const missingParams = [];

		for (const el of this.requiredParams) {
			if (!(el in request.body)) {
				missingParams.push(el);
			}
		}
		if (missingParams.length > 0) {
			const missingParamsRepresentation = missingParams.join(' and ');
			return badRequest(new MissingParamError(missingParamsRepresentation));
		}

		const userData: UserData = request.body;
		const response = await this.usecase.perform(userData);

		if (response.isLeft()) {
			return badRequest(response.value);
		}
		return created(response.value);
	}
}
