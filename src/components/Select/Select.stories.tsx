import type { SelectChangeEvent } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';
import type { SelectProps } from './Select.types';

const DefaultSelect = (args: SelectProps) => <Select {...args} />;

const meta: Meta<typeof Select> = {
	title: 'Select',
	component: DefaultSelect,
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof DefaultSelect>;

const selectArgs = {
	items: [
		{ name: 'Item 1', value: 1 },
		{ name: 'Item 2', value: 2 },
		{ name: 'Item 3', value: 3 },
	],
	// eslint-disable-next-line no-console
	onChangeSelect: (e: SelectChangeEvent<string>) => console.log('t', e.target),
	selectLabel: 'Testing Select',
	required: true,
	disabled: false
};

export const Default: Story = {
	render: (args) => <Select {...args} />,
	args: selectArgs
};
