import type { TooltipProps } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import type { Meta, StoryObj } from '@storybook/react';

import { Info } from '../icons';

import { Tooltip } from './Tooltip';

const DefaultTooltip = (args: TooltipProps) => <Tooltip {...args} />;

const meta: Meta<typeof Tooltip> = {
	title: 'Elements / Tooltip',
	component: DefaultTooltip,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultTooltip>;

const tooltipArgs: TooltipProps = {
	children: <Info color={palette.info.main} />,
	title: 'should show something after hovering',
	placement: 'bottom',
};

export const Default: Story = {
	render: (args) => <Tooltip {...args} />,
	args: tooltipArgs,
};
