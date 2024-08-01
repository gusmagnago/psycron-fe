import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { AppLayout } from './AppLayout';

const AppLayoutStory = () => <AppLayout />;

const meta: Meta<typeof AppLayout> = {
	title: 'Layouts / App Layout',
	component: AppLayoutStory,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AppLayoutStory>;

const layoutArgs = {
	children: (
		<Box sx={{ backgroundColor: 'pink' }} m={5}>
            this is a children
		</Box>
	),
};

export const Default: Story = {
	render: () => <AppLayout />,
	args: layoutArgs,
};
