import bodyCells from '@psycron/assets/mock/table/mockedBodyItems.json';
import type { Meta, StoryObj } from '@storybook/react';

import {
	patientsTablerowsData,
	transformPatientsData,
} from '../../patients/row/rows';

import { TableBody } from './TableBody';
import type { ITableBodyProps } from './TableBody.types';

const DefaultTableBody = (args: ITableBodyProps) => <TableBody {...args} />;

const meta: Meta<typeof TableBody> = {
	title: 'Components / Table / Components / TableBody',
	component: DefaultTableBody,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `The TableBody component is responsible for rendering the body of a table, displaying rows of data using the TableCell component. 
				It handles styling, spacing, and dividers between cells and rows.`,
			},
		},
	},
	args: {
		bodyItems: bodyCells,
	},
};

export default meta;

type Story = StoryObj<typeof DefaultTableBody>;

export const Default: Story = {
	render: (args) => <TableBody {...args} />,
	args: {
		bodyItems: transformPatientsData(patientsTablerowsData),
	},
};
