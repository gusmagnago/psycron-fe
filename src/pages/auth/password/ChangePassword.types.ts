export interface IResetPass {
	confirmPassword: string;
	password: string;
	token: string;
}

export interface IResetPassResponse {
	message: string;
	status: string;
}
