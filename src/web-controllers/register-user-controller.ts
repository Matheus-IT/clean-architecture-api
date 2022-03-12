import { UserData } from '@/entities';
import { UseCase } from '@/usecases/ports';
import { HttpRequest, HttpResponse } from '@/web-controllers/ports';
import { created, badRequest, serverError } from '@/web-controllers/utils';
import { MissingParamError } from './errors';

export class RegisterAndSendEmailController {
	private readonly usecase: UseCase;
	private readonly requiredParams = ['name', 'email'];

	constructor(usecase: UseCase) {
		this.usecase = usecase;
	}

	public async handle(request: HttpRequest): Promise<HttpResponse> {
		try {
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
		} catch (error) {
			return serverError(error);
		}
	}
}
