import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { PasswordInput } from './PasswordInput';
import type { PasswordInputProps } from './PasswordInput.types';

const DefaultPasswordInput = (args: PasswordInputProps<FieldValues>) => (
	<PasswordInput {...args} />
);

const meta: Meta<typeof PasswordInput> = {
	title: 'Components / Form / Components / Password Input',
	component: DefaultPasswordInput,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'This component should be used within a form tag as part of a group of inputs in a form. It handles password input scenarios, including visibility toggling, and ensures that both password and confirmation fields are managed and validated properly.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof DefaultPasswordInput>;

export const Default: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
			// eslint-disable-next-line react-hooks/rules-of-hooks
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
			// eslint-disable-next-line react-hooks/rules-of-hooks
		} = useForm();

		return <PasswordInput errors={errors} register={register} hasToConfirm />;
	},
	args: {
		hasToConfirm: false,
	},
};
