import type { Meta, StoryObj } from '@storybook/react';

import { Payment, SendInvoice } from '../icons';

import { Slider } from './Slider';
import type { ISliderProps } from './Slider.types';

const DefaultSlider = (args: ISliderProps) => <Slider {...args} />;

const meta: Meta<typeof Slider> = {
	title: 'Elements / Slider',
	component: DefaultSlider,
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
		},
		startIcon: {
			control: 'select',
			options: [null, 'Icon1', 'Icon2'],
			mapping: {
				Icon1: <Payment />,
				Icon2: <SendInvoice />,
			},
		},
		endIcon: {
			control: 'select',
			options: [null, 'Icon1', 'Icon2'],
			mapping: {
				Icon1: <SendInvoice />,
				Icon2: <Payment />,
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof DefaultSlider>;

const SliderArgs: ISliderProps = {
	label: '',
};

export const Default: Story = {
	render: (args) => <Slider {...args} />,
	args: SliderArgs,
};

export const WithStartIcon: Story = {
	render: (args) => <Slider {...args} />,
	args: { startIcon: <Payment />, ...SliderArgs },
};

export const WithEndIcon: Story = {
	render: (args) => <Slider {...args} />,
	args: { endIcon: <SendInvoice />, ...SliderArgs },
};

export const WithBothIcons: Story = {
	render: (args) => <Slider {...args} />,
	args: {
		startIcon: <Payment />,
		endIcon: <SendInvoice />,
		...SliderArgs,
	},
};
