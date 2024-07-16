import type { Meta, StoryObj } from '@storybook/react';
import { PaymentsCard } from './PaymentsCard';

const DefaultPaymentsCard = () => <PaymentsCard />;

const meta: Meta<typeof PaymentsCard> = {
  title: 'Components / Payments / Payments Card',
  component: DefaultPaymentsCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: ` The PaymentsCard component integrates visual feedback for tracking payment progress within a therapeutic context. 
				Encapsulated in a Paper container, it features a titled CardTitle with management capabilities and a circular progress indicator (CircularProgress) that dynamically reflects payment completion. 
				Designed for clarity and functionality, it leverages Box, Divider, and styled elements (StyledBox, StyledInner) for cohesive presentation, ensuring an intuitive user experience.
      `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DefaultPaymentsCard>;

export const Default: Story = {
  render: () => <PaymentsCard />,
};
