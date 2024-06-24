import { type SubmitHandler, useForm } from 'react-hook-form';

import { AddPatientForm } from './components/form/AddPatient/AddPatientForm';
import { SignIn } from './components/form/SignIn/SignIn';
import type { ISignInForm } from './components/form/SignIn/SignIn.types';

function App() {


	const {
		register: registerSignIn,
		handleSubmit: handleSubmitSignIn,
		formState: { errors: errorsSignIn },
	} = useForm<ISignInForm>();

	const onSubmitSignIn: SubmitHandler<ISignInForm> = (data) => {
		alert(`data: ${data}`);
	};


	return (
		<>
			<AddPatientForm shortButton={false} />
			<SignIn
				errors={errorsSignIn}
				handleSubmit={handleSubmitSignIn}
				onSubmit={onSubmitSignIn}
				register={registerSignIn}
			/>
		</>
	);
}

export default App;
