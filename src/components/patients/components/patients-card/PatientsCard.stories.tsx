import type { Meta, StoryObj } from '@storybook/react';

import { PatientsCard } from './PatientsCard';

const DefaultPatientsCard = () => <PatientsCard />;

const meta: Meta<typeof PatientsCard> = {
	title: 'Components / Patients / Components / Patients Card',
	component: DefaultPatientsCard,
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

type Story = StoryObj<typeof DefaultPatientsCard>;

export const Default: Story = {
	render: () => <PatientsCard />,
};
