import type { Meta, StoryObj } from '@storybook/react';

import { Navbar } from './Navbar';

const DefaultNavbar = () => <Navbar />;

const meta: Meta<typeof Navbar> = {
	title: 'Components / Navbar',
	component: DefaultNavbar,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultNavbar>;

export const Default: Story = {
	render: () => <Navbar />,

};


