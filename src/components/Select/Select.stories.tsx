import type { SelectChangeEvent } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';
import type { SelectProps } from './Select.types';

const DefaultSelect = (args: SelectProps) => <Select {...args} />;

const meta: Meta<typeof Select> = {
	title: 'Select',
	component: DefaultSelect,
};

export default meta;

type Story = StoryObj<typeof DefaultSelect>;

const selectArgs = {
	items: [
		{ name: 'Item 1', value: 1 },
		{ name: 'Item 2', value: 2 },
		{ name: 'Item 3', value: 3 },
	],
	onChangeSelect: (e: SelectChangeEvent<string>) => console.log('t', e.target),
	selectLabel: 'Testing Select'
};

export const Default: Story = {
	render: (args) => <Select {...args} />,
	args: selectArgs
};
