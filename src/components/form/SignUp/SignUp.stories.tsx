import { type SubmitHandler, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { SignUp } from './SignUp';
import type { ISignUpForm, SignUpFormTypes } from './SignUp.types';

const DefaultSignUp = (args: SignUpFormTypes) => <SignUp {...args} />;

const meta: Meta<typeof SignUp> = {
	title: 'Components / Form / SignUp',
	component: DefaultSignUp,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultSignUp>;

export const Default: Story = {
	render: () => {
		const {
			register: registerSignUp,
			handleSubmit: handleSubmitSignUp,
			formState: { errors: errorsSignUp },
		} = useForm<ISignUpForm>();

		const onSubmitSignUp: SubmitHandler<ISignUpForm> = (data) => {
			alert(`data: ${data}`);
		};

		return (
			<SignUp
				errors={errorsSignUp}
				handleSubmit={handleSubmitSignUp}
				onSubmit={onSubmitSignUp}
				register={registerSignUp}
			/>
		);
	},
};
