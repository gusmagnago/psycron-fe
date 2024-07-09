import type { Meta, StoryObj } from '@storybook/react';

import { EditUser } from './EditUser';

const DefaultUserDetails = () => <EditUser />;

const meta: Meta<typeof EditUser> = {
	title: 'Components / User / Edit User',
	component: DefaultUserDetails,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultUserDetails>;

export const Default: Story = {
	render: () => <EditUser />,
};
