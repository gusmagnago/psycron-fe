import type { Meta, StoryObj } from '@storybook/react';

import { PatientCardItem } from './PatientCardItem';
import type { IPatientCardItemProps } from './PatientCardItem.types';

const DefaultPatientCardItem = (args: IPatientCardItemProps) => (
	<PatientCardItem {...args} />
);

const meta: Meta<typeof PatientCardItem> = {
	title: 'Components / Patients / Components / Patient Card Item',
	component: DefaultPatientCardItem,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
      `,
			},
		},
	},
	args: {
		firstName: 'Jane',
		lastName: 'Smith',
		appointNamentInfo: {
			appointments: 3,
			currency: 'EUR',
			next: 'July 14, 2024 17:45pm',
			value: '150',
		},
		patientId: '2345654321klbhjvgjhbnlm43211',
	},
};

export default meta;

type Story = StoryObj<typeof DefaultPatientCardItem>;

export const Default: Story = {
	render: (args) => <PatientCardItem {...args} />,
};
