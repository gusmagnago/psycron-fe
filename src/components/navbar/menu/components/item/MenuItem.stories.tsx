import { DashboardIcon } from '@psycron/components/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { MenuItem } from './MenuItem';
import type { IMenuItem } from './MenuItem.types';

const DefaultMenuItem = (args: IMenuItem) => <MenuItem {...args} />;

const meta: Meta<typeof MenuItem> = {
	title: 'Components / Navbar / Components / Menu Item',
	component: DefaultMenuItem,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultMenuItem>;

const menuItemArgs = {
	icon: <DashboardIcon />,
	isFooterIcon: false,
	name: 'dashboard',
	path: '',
};

export const Default: Story = {
	render: (args) => <MenuItem {...args} />,
	args: menuItemArgs,
};
