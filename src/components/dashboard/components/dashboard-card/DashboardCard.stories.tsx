import { Appointment, PatientManager } from '@psycron/components/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { DashboardCard } from './DashboardCard';
import type { IDashboardCardProps } from './DashboardCard.types';

const DefaultDashboardCard = (args: IDashboardCardProps) => (
	<DashboardCard {...args} />
);

const items = [
	{
		firstName: 'John',
		lastName: 'Doe',
		appointmentInfo: {
			appointments: 5,
			currency: 'USD',
			next: '2024-07-01T18:00:00',
			value: '200',
			duration: 60
		},
		patientId: '23456543213456743211',
	},
	{
		firstName: 'Jane',
		lastName: 'Dona',
		appointmentInfo: {
			appointments: 3,
			currency: 'EUR',
			next: '2024-07-01T19:00:00',
			value: '150',
			duration: 60
		},
		patientId: '2345654321klbhjvgjhbnlm43211',
	},
	{
		firstName: 'Johan',
		lastName: 'Smthing',
		appointmentInfo: {
			appointments: 3,
			currency: 'EUR',
			next: '2024-07-01T20:00:00',
			value: '150',
			duration: 60
		},
		patientId: '2345654321klbhjvgjhbnlm43211',
	},
	{
		firstName: 'Jupi',
		lastName: 'Ferraz',
		appointmentInfo: {
			appointments: 3,
			currency: 'EUR',
			next: '2024-07-01T21:00:00',
			value: '150',
			duration: 60
		},
		patientId: '2345654321klbhjvgjhbnlm43211',
	},
];

const meta: Meta<typeof DashboardCard> = {
	title: 'Components / Dashboard / Components / Dashbard Card',
	component: DefaultDashboardCard,
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
		titleKey: 'This is a title',
		items: items,
		iconTitleKey: 'This is the Icon title key',
		icon: <PatientManager />,
		isPatientCard: true,
		navigateToURL: ''
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
