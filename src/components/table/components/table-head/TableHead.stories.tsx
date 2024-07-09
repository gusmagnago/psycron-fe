import headCell from '@psycron/assets/mock/table/mockedHeadItems.json';
import type { Meta, StoryObj } from '@storybook/react';

import { TableHead } from './TableHead';
import type { ITableHeadProps } from './TableHead.types';

const DefaultTableHead = (args: ITableHeadProps) => <TableHead {...args} />;

const meta: Meta<typeof TableHead> = {
	title: 'Components / Table / Components / TableHead',
	component: DefaultTableHead,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `The TableHead component is responsible for rendering the header of a table, displaying a row of header cells using the TableCell component. 
				It ensures that header cells are appropriately styled and aligned.`,
			},
		},
	},
	args: {
		headItems: headCell,
	},
};

export default meta;

type Story = StoryObj<typeof DefaultTableHead>;

export const Default: Story = {
	render: (args) => <TableHead {...args} />,
};
