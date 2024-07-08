import type { Meta, StoryObj } from '@storybook/react';

import { RadioButtonGroup } from './RadioButton';
import type { IRadioButtonGroup } from './RadioButton.types';

const DefaultRadioButton = (args: IRadioButtonGroup) => (
	<RadioButtonGroup {...args} />
);

const meta: Meta<typeof RadioButtonGroup> = {
	title: 'Elements / Radio Button ',
	component: DefaultRadioButton,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultRadioButton>;

const radioButtonArgs = {
	formLabel: 'Radio Button Group',
	items: [
		{ label: 'radio 1', value: 'radi1' },
		{ label: 'radio 2', value: 'radi2' },
		{ label: 'radio 3', value: 'radi3' },
		{ label: 'radio 4', value: 'radi4' },
	],
	row: false,
};

export const Default: Story = {
	render: (args) => <RadioButtonGroup {...args} />,
	args: radioButtonArgs,
};

export const Checked: Story = {
	render: (args) => <RadioButtonGroup {...args} />,
	args: { defaultValue: 'radi2', ...radioButtonArgs },
};

export const Row: Story = {
	render: (args) => <RadioButtonGroup {...args} row />,
	args: { ...radioButtonArgs },
};
