import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { NameForm } from './NameForm';
import type { NameFormProps } from './NameForm.types';

const DefaultNameForm = (args: NameFormProps<FieldValues>) => (
	<NameForm {...args} />
);

const meta: Meta<typeof NameForm> = {
	title: 'Components / Form / Components / Name Form',
	component: DefaultNameForm,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
        This component is typically used within a larger form to capture user name information efficiently. 
        It provides validation feedback and supports localization.
      `,
			},
		},
	},
	args: {
		placeholderFirstName: undefined,
		placeholderLastName: undefined,
	},
};

export default meta;

type Story = StoryObj<typeof DefaultNameForm>;

export const Default: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
			// eslint-disable-next-line react-hooks/rules-of-hooks
		} = useForm();

		return <NameForm errors={errors} register={register} />;
	},
};

export const WithPlaceHolder: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
			// eslint-disable-next-line react-hooks/rules-of-hooks
		} = useForm();

		return (
			<NameForm
				errors={errors}
				register={register}
				placeholderFirstName='John'
				placeholderLastName='Doe'
			/>
		);
	},
};
