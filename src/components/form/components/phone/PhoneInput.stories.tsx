import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { PhoneInput } from './PhoneInput';
import type { PhoneInputProps } from './PhoneInput.types';

const DefaultPhoneInput = (args: PhoneInputProps<FieldValues>) => (
	<PhoneInput {...args} />
);

const meta: Meta<typeof PhoneInput> = {
	title: 'Components / Form / Components / Phone Input',
	component: DefaultPhoneInput,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
        This component should be used within a form tag as part of a group of inputs in a form. 
        It handles the phone number input scenario by allowing users to select their country, 
        automatically populating the country code, and providing validation feedback.
        
        Note: Phone number validation should be performed using libphonenumber-js library within Yup validations.
      `,
			},
		},
	},
	args: {
		registerName: 'phone',
	},
};

export default meta;

type Story = StoryObj<typeof DefaultPhoneInput>;

export const Default: Story = {
	render: () => {
		const {
			register,
			formState: { errors },
		} = useForm();

		return (
			<PhoneInput errors={errors} register={register} registerName='phone' />
		);
	},
};
