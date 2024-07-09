import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from './Pagination';
import type { IPaginationProps } from './Pagination.types';

const DefaultPagination = (args: IPaginationProps) => <Pagination {...args} />;

const meta: Meta<typeof Pagination> = {
	title: 'Components / Table / Components / Pagination',
	component: DefaultPagination,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'The Pagination component provides a paginated navigation control, making use of Material-UI\'s Pagination component to handle page navigation.',
			},
		},
	},
	args: {
		totalPages: 10,
		currentPage: 1,
	},
};

export default meta;

type Story = StoryObj<typeof DefaultPagination>;

export const Default: Story = {
	render: (args) => <Pagination {...args} />,
};
