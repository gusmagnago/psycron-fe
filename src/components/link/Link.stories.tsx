import type { Meta, StoryObj } from '@storybook/react';

import { Link } from './Link';
import type { ILinkProps } from './Link.types';

const DefaultLink = (args: ILinkProps) => <Link {...args} />;

const meta: Meta<typeof Link> = {
	title: 'Elements / Link',
	component: DefaultLink,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultLink>;

const linkArgs = {
	to: '/',
	children: 'link text',
};

export const Default: Story = {
	render: (args) => <Link {...args} />,
	args: { firstLetterUpper: false, ...linkArgs },
};

export const FirstLetterUpper: Story = {
	render: (args) => <Link {...args} firstLetterUpper />,
	args: { ...linkArgs },
};
