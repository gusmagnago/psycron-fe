import type { ReactNode } from 'react';

import {
	QueueEmptyState as QueueEmptyStateContainer,
	QueueEmptyStateText,
} from './QueueDetail.styles';

type QueueEmptyStateProps = {
	children?: ReactNode;
	message: ReactNode;
};

export const QueueEmptyState = ({
	children,
	message,
}: QueueEmptyStateProps) => (
	<QueueEmptyStateContainer>
		{children}
		<QueueEmptyStateText>{message}</QueueEmptyStateText>
	</QueueEmptyStateContainer>
);
