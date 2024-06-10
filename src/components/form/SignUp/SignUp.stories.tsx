import type { Meta, StoryObj } from '@storybook/react';

import { SignUp } from './SignUp';

const DefaultSignUp = () => <SignUp />;

const meta: Meta<typeof SignUp> = {
	title: 'SignUp',
	component: DefaultSignUp,
};

export default meta;

type Story = StoryObj<typeof DefaultSignUp>;

export const Default: Story = {
	render: () => <SignUp />,
};
