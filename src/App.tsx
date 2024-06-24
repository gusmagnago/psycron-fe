import { type SubmitHandler, useForm } from 'react-hook-form';

import { SignIn } from './components/form/SignIn/SignIn';
import type { ISignInForm } from './components/form/SignIn/SignIn.types';
import { UserDetails } from './components/user/components/user-details/UserDetails';


function App() {
	const {
		register: registerSignIn,
		handleSubmit: handleSubmitSignIn,
		formState: { errors: errorsSignIn },
	} = useForm<ISignInForm>();

	const onSubmitSignIn: SubmitHandler<ISignInForm> = (data) => {
		alert(`data: ${data}`);
	};

	const mockUserDetailsCardProps = {
		plan: {
			name: 'Premium',
			status: 'paid',
		},
		user: {
			contacts: {
				address: {
					address: '123 Main St, Apt 4B',
					administrativeArea: 'California',
					city: 'Los Angeles',
					country: 'USA',
					moreInfo: 'Near the big park',
					postalCode: '90001',
					route: 'Main St',
					streetNumber: '123',
					sublocality: 'Downtown',
				},
				phone: '+1 234 567 8901',
			},
			email: 'john.doe@example.com',
			firstName: 'John',
			image: 'https://via.placeholder.com/150',
			lastName: 'Doe',
			pass: 'securepassword123',
			patients: [0, 1, 2, 3, 4, 5, 6],
		},
	};

	return (
		<>
			{/* <SignIn
				errors={errorsSignIn}
				handleSubmit={handleSubmitSignIn}
				onSubmit={onSubmitSignIn}
				register={registerSignIn}
			/> */}
			<UserDetails user={mockUserDetailsCardProps.user} plan={mockUserDetailsCardProps.plan}/>
		</>
	);
}

export default App;
