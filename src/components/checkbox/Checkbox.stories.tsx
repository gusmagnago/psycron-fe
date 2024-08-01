import type { FieldValues } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';
import type { ICheckboxProps } from './Checkbox.types';

const DefaultCheckbox = (args: ICheckboxProps<FieldValues>) => (
	<Checkbox {...args} />
);

const meta: Meta<typeof Checkbox> = {
	title: 'Elements / Checkbox',
	component: DefaultCheckbox,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultCheckbox>;

const checkboxArgs = {
	// eslint-disable-next-line no-console
	onChange: () => console.log('check'),
	labelKey: 'check text',
};

export const Default: Story = {
	render: (args) => <Checkbox {...args} />,
	args: checkboxArgs,
};
