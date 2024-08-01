import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';
import type { IButtonProps } from './Button.types';

const DefaultButton = (args: IButtonProps) => <Button {...args} />;

const meta: Meta<typeof Button> = {
	title: 'Elements / Button',
	component: DefaultButton,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultButton>;

const buttonArgs = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClick: (e: any) =>
		alert(`${e.target.parentNode.dataset.name} button clicked`),
	children: 'button text',
};

export const Primary: Story = {
	render: (args) => <Button {...args} />,
	args: buttonArgs,
};

export const Secondary: Story = {
	render: (args) => <Button {...args} />,
	args: { secondary: true, ...buttonArgs },
};

export const Tertiary: Story = {
	render: (args) => <Button {...args} />,
	args: { tertiary: true, ...buttonArgs },
};
