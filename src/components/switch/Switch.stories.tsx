import type { Meta, StoryObj } from '@storybook/react';

// import { Switch } from './components/item/Switch';
import { SwitchGroup } from './SwitchGroup';
import type { ISwitchGroupProps } from './SwitchGroup.types';

const DefaultSwitchGroup = (args: ISwitchGroupProps) => (
	<SwitchGroup {...args} />
);

const meta: Meta<typeof SwitchGroup> = {
	title: 'Elements / Switch',
	component: DefaultSwitchGroup,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultSwitchGroup>;

const switchArgs = {
	items: [
		{ label: 'switch 1' },
		{ label: 'switch 2' },
		{ label: 'switch 3' },
	],
	small: false,
};

export const Default: Story = {
	render: (args) => <SwitchGroup {...args} />,
	args: switchArgs,
};

export const DefaultChecked: Story = {
	render: (args) => <SwitchGroup {...args} />,
	args: {
		items: switchArgs.items.map((item, index) =>
			index === 0 ? { ...item, defaultChecked: true } : item,
		),
	},
};

export const Required: Story = {
	render: (args) => <SwitchGroup {...args} />,
	args: {
		items: switchArgs.items.map((item, index) =>
			index === 0 ? { ...item, required: true } : item,
		),
	},
};

export const Disabled: Story = {
	render: (args) => <SwitchGroup {...args} />,
	args: {
		items: switchArgs.items.map((item, index) =>
			index === 0 ? { ...item, disabled: true } : item,
		),
	},
};

export const Small: Story = {
	render: (args) => <SwitchGroup {...args} small />,
	args: switchArgs,
};
