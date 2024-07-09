import type { Meta, StoryObj } from '@storybook/react';

import { DashboardCardItem } from './DashboardCardItem';
import type { IDashboarcCardItemProps } from './DashboardCardItem.types';

const DefaultDashboardCardItem = (args: IDashboarcCardItemProps) => (
	<DashboardCardItem {...args} />
);

const meta: Meta<typeof DashboardCardItem> = {
	title: 'Components / Dashboard / Components / Dashboard Card Item',
	component: DefaultDashboardCardItem,
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
		appointmentInfo: {
			next: '2024-07-01T17:15:00',
			currency: '€',
			appointments: 20,
			value: '20',
			duration: 60,
		},
		patientId: '2345654321klbhjvgjhbnlm43211',
		isPatientCard: true,
	},
};

export default meta;

type Story = StoryObj<typeof DefaultDashboardCardItem>;

export const Default: Story = {
	render: (args) => <DashboardCardItem {...args} />,
};

export const PatientsCard: Story = {
	render: (args) => <DashboardCardItem {...args} />,
};

export const AppointmentsCard: Story = {
	render: (args) => <DashboardCardItem {...args} isPatientCard={false} />,
};
