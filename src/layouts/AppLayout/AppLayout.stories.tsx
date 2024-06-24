import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { AppLayout } from './AppLayout';
import type { IAppLayout } from './AppLayout.types';

const AppLayoutStory = (args: IAppLayout) => <AppLayout {...args} />;

const meta: Meta<typeof AppLayout> = {
	title: 'Layouts / App Layout',
	component: AppLayoutStory,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AppLayoutStory>;

const layoutArgs = {
	children: (
		<Box sx={{backgroundColor: 'pink'}} m={5}>
            this is a children
		</Box>
	)
};

export const Primary: Story = {
	render: (args) => <AppLayout {...args} />,
	args: layoutArgs,
};


