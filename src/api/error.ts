export class CustomError extends Error {
	public statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export const statusCodeToTranslationKey: { [key: string]: string } = {
	400: 'globals.error.already-subscribed',
	500: 'globals.error.internal-server-error',
	401: 'globals.error.invalid-user',
};
