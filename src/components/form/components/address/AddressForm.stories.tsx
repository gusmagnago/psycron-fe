import { FormProvider, useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AddressForm } from './AddressForm';
import type { AddressFormProps } from './AddressForm.types';

type StoryFormValues = {
	clinicAddress: {
		city: string;
		country: string;
		postcode: string;
		street: string;
	};
};

const DefaultAddressForm = (args: AddressFormProps<StoryFormValues>) => {
	 
	const methods = useForm<StoryFormValues>();
	return (
		<FormProvider {...methods}>
			<AddressForm {...args} />
		</FormProvider>
	);
};

const meta: Meta<typeof DefaultAddressForm> = {
	title: 'Components / Form / Components / Address Form',
	component: DefaultAddressForm,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'This component should be used within a FormProvider. It handles complex address input scenarios, including auto-completion via Google Maps Places API and structured error management.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof DefaultAddressForm>;

export const Default: Story = {
	render: () => <DefaultAddressForm />,
};
