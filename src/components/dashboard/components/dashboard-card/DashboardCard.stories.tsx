import { Box } from '@mui/material';
import mockAppointments from '@psycron/assets/mock/appointments/mockAppointments.json';
import { Appointment, PatientManager } from '@psycron/components/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { DashboardCard } from './DashboardCard';
import type { IDashboardCardProps } from './DashboardCard.types';

const DefaultDashboardCard = (args: IDashboardCardProps) => (
	<DashboardCard {...args} />
);

const items = mockAppointments;

const meta: Meta<typeof DashboardCard> = {
	title: 'Components / Dashboard / Components / Dashbard Card',
	component: DefaultDashboardCard,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `The DashboardCard component displays a list of appointments or patients within a dashboard interface.
                It provides real-time updates and session management features, enhancing user interaction and experience.`,
			},
		},
	},
	args: {
		titleKey: 'This is a title',
		items: items,
		iconTitleKey: 'This is the Icon title key',
		icon: <PatientManager />,
		isPatientCard: true,
		navigateToURL: '',
	},
};

export default meta;

type Story = StoryObj<typeof DefaultDashboardCard>;

export const Default: Story = {
	render: (args) => <DashboardCard {...args} />,
};

export const PatientsCard: Story = {
	render: (args) => <DashboardCard {...args} />,
	args: {
		titleKey: 'Patients',
		items: items,
		iconTitleKey: 'Patients manager',
		icon: <PatientManager />,
	},
};

export const EmptyPatientsCard: Story = {
	render: (args) => <DashboardCard {...args} />,
	args: {
		titleKey: 'Patients',
		items: [],
		iconTitleKey: 'Patients manager',
		icon: <PatientManager />,
	},
};

export const AppointmentsCard: Story = {
	render: (args) => <DashboardCard {...args} />,
	args: {
		titleKey: 'Appointments',
		items: items,
		iconTitleKey: 'Appointments manager',
		icon: <Appointment />,
		isPatientCard: false,
	},
};

export const EmptyAppointmentsCard: Story = {
	render: (args) => (
		<Box height={'100%'}>
			<Box height={200}>
				<DashboardCard {...args} />
			</Box>
		</Box>
	),
	args: {
		titleKey: 'Appointments',
		items: [],
		iconTitleKey: 'Appointments manager',
		icon: <Appointment />,
		isPatientCard: false,
	},
};
