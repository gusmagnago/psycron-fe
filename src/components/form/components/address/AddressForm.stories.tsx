import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { AddressForm } from './AddressForm';
import type { AddressComponentProps } from './AddressForm.types';

const DefaultAddressForm = (args: AddressComponentProps<FieldValues>) => (
	<AddressForm {...args} />
);

const meta: Meta<typeof AddressForm> = {
	title: 'Components / Form / Components / Address Form',
	component: DefaultAddressForm,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'This component should be used within a form tag as part of a group of inputs in a form. It handles complex address input scenarios, including auto-completion via Google Maps Places API and structured error management.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof DefaultAddressForm>;

export const Default: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
			// eslint-disable-next-line react-hooks/rules-of-hooks
		} = useForm();

		return <AddressForm errors={errors} register={register} />;
	},
};
