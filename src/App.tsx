import { type SubmitHandler, useForm } from 'react-hook-form';

import { SignIn } from './components/form/SignIn/SignIn';
import type { ISignInForm } from './components/form/SignIn/SignIn.types';
import { SignUp } from './components/form/SignUp/SignUp';
import type { ISignUpForm } from './components/form/SignUp/SignUp.types';

function App() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ISignInForm>();

	const {
		register: registerSignUp,
		handleSubmit: handleSubmitSignUp,
		formState: { errors: errorsSignUp },
	} = useForm<ISignUpForm>();

	const onSubmit: SubmitHandler<ISignInForm> = (data) => {
		console.log('SignIn Submitted', data);
	};


	const onSubmitSignUp: SubmitHandler<ISignUpForm> = (data) => {
		console.log('SignUp Submitted', data);
	};

	return (
		<>
			<SignUp
				errors={errorsSignUp}
				handleSubmit={handleSubmitSignUp}
				onSubmit={onSubmitSignUp}
				register={registerSignUp}
			/>
			<SignIn
				errors={errors}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				register={register}
			/>
		</>
	);
}

export default App;
