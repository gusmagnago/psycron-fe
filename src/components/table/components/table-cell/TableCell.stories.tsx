import type { Meta, StoryObj } from '@storybook/react';

import { TableCell } from './TableCell';
import type { ITableCellProps } from './TableCell.types';

const DefaultTableCell = (args: ITableCellProps) => <TableCell {...args} />;

const meta: Meta<typeof TableCell> = {
	title: 'Components / Table / Components / TableCell',
	component: DefaultTableCell,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: `The TableCell component is designed to display content within a table cell with various styles and behaviors based on the content type. 
				It includes support for date formatting, discount highlighting, and specific styling for full amounts. 
				Additionally, it handles action icons and tooltips for patient management.`,
			},
		},
	},
	args: {
		action: false,
		icon: false,
		id: 'fullName',
		isHead: false,
		isPatients: false,
		label: 'Jupiter Magnago Ferraz',
		numeric: false,
	},
};

export default meta;

type Story = StoryObj<typeof DefaultTableCell>;

export const Default: Story = {
	render: (args) => <TableCell {...args} />,
};

export const HeadCell: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		isHead: true,
		label: 'Full Name',
	},
};

export const Action: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		action: true,
		isPatients: true,
	},
};

export const Numeric: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		numeric: true,
		label: '200',
	},
};

export const HasDiscountYes: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		isPatients: true,
		id: 'hasDiscount',
		label: 'Yes',
	},
};

export const HasDiscountNo: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		isPatients: true,
		id: 'hasDiscount',
		label: 'No',
	},
};

export const FullAmount: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		isPatients: true,
		id: 'fullAmount',
		label: '500',
	},
};

export const NextSession: Story = {
	render: (args) => <TableCell {...args} />,
	args: {
		isPatients: true,
		id: 'nextSession',
		label: '2024-07-04T15:00:00',
	},
};
