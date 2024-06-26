import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { UserDetailsCard } from './UserDetailsCard';
import type { IUserDetailsCardProps } from './UserDetailsCard.types';

const DefaultUserDetailsCard = (args: IUserDetailsCardProps) => (

	<UserDetailsCard {...args} />

);

const meta: Meta<typeof UserDetailsCard> = {
	title: 'Components / User / Components /User Details Card',
	component: DefaultUserDetailsCard,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultUserDetailsCard>;

const mockUserDetailsCardProps = {
	plan: {
		name: 'Premium',
		status: 'paid',
	},
	user: {
		contacts: {
			address: {
				address: '123 Main St, Apt 4B',
				administrativeArea: 'California',
				city: 'Los Angeles',
				country: 'USA',
				moreInfo: 'Near the big park',
				postalCode: '90001',
				route: 'Main St',
				streetNumber: '123',
				sublocality: 'Downtown',
			},
			phone: '+1 234 567 8901',
		},
		email: 'john.doe@example.com',
		firstName: 'John',
		image: 'https://via.placeholder.com/150',
		lastName: 'Doe',
		pass: 'securepassword123',
		patients: [0, 1, 2, 3, 4, 5, 6],
	},
};

export const Default: Story = {
	render: (args) => (
		<Box>
			<UserDetailsCard {...args} />
		</Box>
	),
	args: mockUserDetailsCardProps,
};
