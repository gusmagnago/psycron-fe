import type { Meta, StoryObj } from '@storybook/react';

import { CardActions } from './card-actions/CardActions';
import type { CardActionsProps } from './card-actions/CardActions.types';
import { CardTitle } from './card-title/CardTitle';
import type { CardTitleProps } from './card-title/CardTitle.types';
import { Card } from './Card';
import type { CardProps } from './Card.types';

const DefaultCardComponent = (args: CardProps) => <Card {...args} />;

const CardTitleComponent = (args: CardTitleProps) => <CardTitle {...args} />;

const CardActionComponent = (args: CardActionsProps) => (
	<CardActions {...args} />
);

const meta: Meta<typeof Card> = {
	title: 'Card',
	component: DefaultCardComponent,
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
	hasSecondChip: false,
	secondChip: () => alert('second Chip clicked'),
	secondChipName: 'second chip',
};

const cardActionsMock = {
	actionName: 'Action Only',
	onClick: () => alert('Action Only Clicked'),
	secondAction: () => alert('Second Action Clicked'),
	secondActionName: 'Second Action',
	hasTertiary: true,
	tertiaryAction: () => alert('tertiary Action Clicked'),
	tertiaryActionName: 'tertiary Action',
}

export const Default: Story = {
	render: (args) => <DefaultCardComponent {...args} />,
	args: {
		cardTitleProps: cardTitleMock,
		cardActionsProps: cardActionsMock,
		content: <p>This is default content</p>,
		cardTitle: true,
	},
};

export const WithSecondChip: Story = {
	render: (args) => <DefaultCardComponent {...args} />,
	args: {
		cardTitleProps: cardTitleMock,
		cardActionsProps: cardActionsMock,
		content: <p>This is content with a second chip</p>,
		cardTitle: true,
	},
};

export const WithTertiaryAction: Story = {
	render: (args) => <DefaultCardComponent {...args} />,
	args: {
		cardTitleProps: cardTitleMock,
		cardActionsProps: cardActionsMock,
		content: <p>This is content with a tertiary action</p>,
		cardTitle: true,
	},
};

export const TitleOnly: CardTitleStory = {
	render: (args) => <CardTitleComponent {...args} />,
	args: cardTitleMock,
};

export const ActionsOnly: CardActionsStory = {
	render: (args) => <CardActionComponent {...args} />,
	args: cardActionsMock,
};
