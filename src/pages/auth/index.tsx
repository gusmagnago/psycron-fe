import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { SignIn as SignInForm } from '@psycron/components/form/SignIn/SignIn';
import type { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import { SignUp } from '@psycron/components/form/SignUp/SignUp';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import { useAuth } from '@psycron/context/user/UserAuthenticationContext';

export const AuthPage = () => {
	const { signIn, signUp } = useAuth();
	const { pathname } = useLocation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ISignInForm>();

	const onSubmitSignIn: SubmitHandler<ISignInForm> = (data) => {
		signIn(data);
	};

	const onSubmitSignUp: SubmitHandler<ISignUpForm> = (data) => {
		signUp(data);
	};

	return (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			height='100%'
		>
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
		</Box>
	);
};
