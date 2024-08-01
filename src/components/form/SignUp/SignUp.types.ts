import type {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form';

export interface ISignUpForm {
    confirmPassword?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
}
export type SignUpFormTypes = {
    errors: FieldErrors<ISignUpForm>;
    handleSubmit: UseFormHandleSubmit<ISignUpForm, undefined>;
    onSubmit: (data: ISignUpForm) => void;
    register: UseFormRegister<ISignUpForm>;
};
