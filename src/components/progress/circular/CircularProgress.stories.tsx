import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { CircularProgress } from './CircularProgress';
import type { ICircularProgressProps } from './CircularProgress.types';

const DefaultCircularProgress = (args: ICircularProgressProps) => (
	<CircularProgress {...args} />
);

const meta: Meta<typeof CircularProgress> = {
	title: 'Elements / CircularProgress',
	component: DefaultCircularProgress,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `This component component provides a visually engaging 3D representation of progress using React Three Fiber and Three.js. 
				It leverages the capabilities of @react-three/fiber to render a customizable progress indicator in the form of a cylinder, 
				with interactive hover effects and real-time updates
      `,
			},
		},
	},
	args: {
		progress: [0, 100],
	},
};

export default meta;

type Story = StoryObj<typeof DefaultCircularProgress>;

export const Default: Story = {
	render: (args) => (
		<Box
			height={400}
			width={'100%'}
			display='flex'
			alignItems='center'
			justifyContent='center'
		>
			<CircularProgress {...args} />
		</Box>
	),
};

export const WithProgress: Story = {
	render: (args) => (
		<Box
			height={400}
			width={'100%'}
			display='flex'
			alignItems='center'
			justifyContent='center'
		>
			<CircularProgress {...args} />
		</Box>
	),
	args: {
		progress: [60, 40],
	},
};

export const FullProgress: Story = {
	render: (args) => (
		<Box
			height={400}
			width={'100%'}
			display='flex'
			alignItems='center'
			justifyContent='center'
		>
			<CircularProgress {...args} />
		</Box>
	),
	args: {
		progress: [100, 0],
	},
};
