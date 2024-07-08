import type { Meta, StoryObj } from '@storybook/react';

import { CardActions } from './CardActions/CardActions';
import type { CardActionsProps } from './CardActions/CardActions.types';
import { CardTitle } from './CardTitle/CardTitle';
import type { CardTitleProps } from './CardTitle/CardTitle.types';
import { Card } from './Card';
import type { CardProps } from './Card.types';

const DefaultCardComponent = (args: CardProps) => <Card {...args} />;

const CardTitleComponent = (args: CardTitleProps) => <CardTitle {...args} />;

const CardActionComponent = (args: CardActionsProps) => (
	<CardActions {...args} />
);

const meta: Meta<typeof Card> = {
	title: 'Components / Card',
	component: DefaultCardComponent,
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DefaultCardComponent>;

type CardTitleStory = StoryObj<typeof CardTitleComponent>;

type CardActionsStory = StoryObj<typeof CardActionComponent>;

const cardTitleMock = {
	title: 'Title',
	subheader: 'Subheader',
	hasFirstChip: true,
	firstChip: () => alert('First Chip clicked'),
	firstChipName: 'first chip',
	secondChip: () => alert('second Chip clicked'),
	secondChipName: 'second chip',
};

const cardActionsMock = {
	actionName: 'Action Only',
	onClick: () => alert('Action Only Clicked'),
	secondAction: () => alert('Second Action Clicked'),
	secondActionName: 'Second Action',
	tertiaryAction: () => alert('tertiary Action Clicked'),
	tertiaryActionName: 'tertiary Action',
};

export const Default: Story = {
	render: (args) => <DefaultCardComponent {...args} />,
	args: {
		cardTitleProps: { hasSecondChip: false, ...cardTitleMock },
		cardActionsProps: {
			hasSecondAction: true,
			hasTertiary: false,
			...cardActionsMock,
		},
		children: <p>This is default content</p>,
		cardTitle: true,
	},
};

export const WithSecondChip: Story = {
	render: (args) => <DefaultCardComponent {...args} />,
	args: {
		cardTitleProps: { hasSecondChip: true, ...cardTitleMock },
		cardActionsProps: {
			hasTertiary: false,
			hasSecondAction: true,
			...cardActionsMock,
		},
		children: <p>This is content with a second chip</p>,
		cardTitle: true,
	},
};

export const WithTertiaryAction: Story = {
	render: (args) => <DefaultCardComponent {...args} />,
	args: {
		cardTitleProps: cardTitleMock,
		cardActionsProps: {
			hasSecondAction: true,
			hasTertiary: true,
			...cardActionsMock,
		},
		children: <p>This is content with a tertiary action</p>,
		cardTitle: true,
	},
};

export const TitleOnly: CardTitleStory = {
	render: (args) => <CardTitleComponent {...args} />,
	args: { hasSecondChip: true, ...cardTitleMock },
};

export const ActionsOnly: CardActionsStory = {
	render: (args) => <CardActionComponent {...args} />,
	args: { hasSecondAction: true, hasTertiary: true, ...cardActionsMock },
};
