import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { ContactsForm } from './ContactsForm';
import type { ContactsFormProps } from './ContactsForm.types';

const DefaultContactsForm = (args: ContactsFormProps<FieldValues>) => (
	<ContactsForm {...args} />
);

const meta: Meta<typeof ContactsForm> = {
	title: 'Components / Form / Components / Contacts',
	component: DefaultContactsForm,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
        The ContactsForm component facilitates the capture of contact information, 
        including email and phone details, optionally including WhatsApp contact information.

        ### Usage
        This component integrates with forms to manage contact details efficiently. It includes fields for:
        
        - Email: A mandatory email field for entering contact email addresses.
        - Phone Number: Utilizes the PhoneInput component for inputting phone numbers.
        - WhatsApp Integration: Includes a checkbox to indicate whether the contact prefers WhatsApp communication:
          - If selected, an additional checkbox determines whether the provided phone number doubles as the WhatsApp number.
          - If different, an alternate phone number can be entered for WhatsApp.
      `,
			},
		},
	},

};

export default meta;

type Story = StoryObj<typeof DefaultContactsForm>;

export const Default: Story = {
	render: () => {
		const {
			register,
			getValues,
			setValue,
			formState: { errors },
		} = useForm();

		return <ContactsForm errors={errors} register={register} getPhoneValue={getValues} setPhoneValue={setValue}/>;
	},
};
