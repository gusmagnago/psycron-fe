import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from './Progress';
import type { IProgressProps } from './Progress.types';



const DefaultProgress = (args: IProgressProps) => (
	<Progress {...args} />
);

const meta: Meta<typeof Progress> = {
	title: 'Elements / Progress',
	component: DefaultProgress,
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
		showLabel: false,
		duration: undefined,
		size: 1000000
	},
};

export default meta;

type Story = StoryObj<typeof DefaultProgress>;

export const Default: Story = {
	render: (args) => <Progress {...args} />,
};

export const InProgress: Story = {
	render: (args) => {
		return <Progress {...args} />
	},
};

export const InProgressWithLabel: Story = {
	render: (args) => {
		return <Progress {...args} />
	},
	args: {
		showLabel: true,
		size: 10
	}
};

export const ProgressTimer: Story = {
	render: (args) => {

		return <Progress {...args} />
	},
	args: {
		showLabel: true,
		duration: 5
	}
};