import type { Meta, StoryObj } from '@storybook/react';

import { AddPatientForm } from './AddPatientForm';
import type { AddPatientProps } from './AddPatientForm.types';

const DefaultAddPatient = (args: AddPatientProps) => (
	<AddPatientForm {...args} />
);

const meta: Meta<typeof AddPatientForm> = {
	title: 'Form / AddPatient',
	component: DefaultAddPatient,
	tags: ['autodocs'],
	args: {
		shortButton: false,
	},
	parameters: {
		docs: {
			description: {
				component: `
          The AddPatientForm component is a form for adding a new patient. It includes sections for entering the patient's name, contact information, and address. 
          The form can be opened either with a button or an icon button, depending on the shortButton prop. 
          It uses react-hook-form for form state management and validation, and displays error messages for invalid inputs. 
          The form is wrapped in a FormWrapper component that provides the form layout and handles form submission.
          `,
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof DefaultAddPatient>;

export const Default: Story = {
	render: (args) => {
		return <AddPatientForm {...args} />;
	},
};

export const WithShortButton: Story = {
	render: (args) => {
		return <AddPatientForm {...args} />;
	},
	args: {
		shortButton: true,
	},
};
