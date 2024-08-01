import { type SubmitHandler, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { SignIn } from './SignIn';
import type { ISignInForm, SignInFormTypes } from './SignIn.types';

const DefaultSignIn = (args: SignInFormTypes) => <SignIn {...args} />;

const meta: Meta<typeof SignIn> = {
	title: 'Components / Form / SignIn',
	component: DefaultSignIn,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultSignIn>;

export const Default: Story = {
	render: () => {
		const {
			register: registerSignIn,
			handleSubmit: handleSubmitSignIn,
			formState: { errors: errorsSignIn },
			// eslint-disable-next-line react-hooks/rules-of-hooks
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
