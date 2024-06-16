import { type SubmitHandler, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { SignIn } from './SignIn';
import type { ISignInForm, SignInFormTypes } from './SignIn.types';

const DefaultSignIn = (args: SignInFormTypes) => <SignIn {...args} />;

const meta: Meta<typeof SignIn> = {
	title: 'Form / SignIn',
	component: DefaultSignIn,
};

export default meta;

type Story = StoryObj<typeof DefaultSignIn>;

export const Default: Story = {
	render: () => {
		const {
			register: registerSignIn,
			handleSubmit: handleSubmitSignIn,
			formState: { errors: errorsSignIn },
		} = useForm<ISignInForm>();

		const onSubmitSignIn: SubmitHandler<ISignInForm> = (data) => {
			alert(`data: ${data}`);
		};

		return (
			<SignIn
				errors={errorsSignIn}
				handleSubmit={handleSubmitSignIn}
				onSubmit={onSubmitSignIn}
				register={registerSignIn}
			/>
		);
	},
};
