import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';
import type { IAvatarProps } from './Avatar.types';

const DefaultAvatar = (args: IAvatarProps) => <Avatar {...args} />;

const meta: Meta<typeof Avatar> = {
	title: 'Elements / Avatar',
	component: DefaultAvatar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `
        The Avatar component generates a stylized avatar based on user initials or an image, suitable for displaying user profiles or identities. 
        It dynamically assigns background colors based on the user's name to ensure visual distinction. 
        It supports customization through props like size and image source.
      `,
			},
		},
	},
	argTypes: {
		firstName: {
			control: 'text',
		},
		lastName: {
			control: 'text',
		},
		large: {
			control: 'boolean',
		},
		src: {
			control: 'text',
		},
	},
};

export default meta;

type Story = StoryObj<typeof DefaultAvatar>;

const avatarArgs = {
	firstName: 'Joan',
	lastName: 'Donna',
	large: false,
};

export const Default: Story = {
	render: (args) => <Avatar {...args} />,
	args: avatarArgs,
};

export const Large: Story = {
	render: (args) => <Avatar {...args} large />,
	args: { ...avatarArgs },
};

export const WithImage: Story = {
	render: (args) => <Avatar {...args} large src='/images/avatar.png' />,
	args: { ...avatarArgs },
};
