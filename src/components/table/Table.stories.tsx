import bodyCells from '@psycron/assets/mock/table/mockedBodyItems.json';
import headCell from '@psycron/assets/mock/table/mockedHeadItems.json';
import type { Meta, StoryObj } from '@storybook/react';

import { Table } from './Table';
import type { ITableProps } from './Table.types';

const DefaultTable = (args: ITableProps) => <Table {...args} />;

const columnsToHideTablet = [
  'fullAmount',
  'hasDiscount',
  'discountVal',
  'latestPayment',
];
const columnsToHideMobile = ['paymentStatus', 'currency', 'action'];

const meta: Meta<typeof Table> = {
  title: 'Components / Table ',
  component: DefaultTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
  args: {
    headItems: headCell,
    bodyItems: bodyCells,
    columnsToHideTablet,
    columnsToHideMobile,
  },
};

export default meta;

type Story = StoryObj<typeof DefaultTable>;

export const Default: Story = {
  render: (args) => <Table {...args} />,
};
