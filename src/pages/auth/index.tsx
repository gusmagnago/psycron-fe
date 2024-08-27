import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router-dom';
import { SignIn as SignInForm } from '@psycron/components/form/SignIn/SignIn';
import type { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import { SignUp } from '@psycron/components/form/SignUp/SignUp';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import { Loader } from '@psycron/components/loader/Loader';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';

import { DASHBOARD } from '../urls';

import { AuthPageWrapper } from './index.styles';

export const AuthPage = () => {
	const { signIn, signUp, isSessionLoading, isAuthenticated } = useAuth();

	const { pathname, state } = useLocation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ISignInForm | ISignUpForm>();

	const onSubmitSignIn: SubmitHandler<ISignInForm> = (data) => {
		signIn(data);
	};

	const onSubmitSignUp: SubmitHandler<ISignUpForm> = (data) => {
		signUp(data);
	};

	if (isSessionLoading) {
		return <Loader />;
	}

	if (isAuthenticated) {
		return <Navigate to={state?.from?.pathname || DASHBOARD} replace />;
	}

	return (
		<AuthPageWrapper>
			{pathname.includes('sign-in') ? (
				<SignInForm
					errors={errors}
					handleSubmit={handleSubmit}
					onSubmit={onSubmitSignIn}
					register={register}
				/>
			) : (
				<SignUp
					errors={errors}
					handleSubmit={handleSubmit}
					onSubmit={onSubmitSignUp}
					register={register}
				/>
			)}
		</AuthPageWrapper>
	);
};
