import type {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form';

export interface ISignInForm {
    email: string;
    password: string;
    stayConnected?: boolean;
}

export type SignInFormTypes = {
    errors: FieldErrors<ISignInForm>;
    handleSubmit: UseFormHandleSubmit<ISignInForm, undefined>;
    onSubmit: (data: ISignInForm) => void;
    register: UseFormRegister<ISignInForm>;
};


export interface ISignInResponse {
  token: string;
  user: {
    email: string;
    id: string;
  };
}