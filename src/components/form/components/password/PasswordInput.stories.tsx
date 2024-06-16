import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { PasswordInput } from './PasswordInput';
import type { PasswordInputProps } from './PasswordInput.types';

const DefaultPasswordInput = (args: PasswordInputProps<FieldValues>) => (
	<PasswordInput {...args} />
);

const meta: Meta<typeof PasswordInput> = {
	title: 'Form / Components / Password Input',
	component: DefaultPasswordInput,
};

export default meta;

type Story = StoryObj<typeof DefaultPasswordInput>;

export const Default: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
		} = useForm();

		return <PasswordInput errors={errors} register={register} />;
	},
	args: {
		hasToConfirm: false,
	},
};

export const WithConfirmPassword: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
		} = useForm();

		return <PasswordInput errors={errors} register={register} hasToConfirm />;
	},
	args: {
		hasToConfirm: false,
	},
};
