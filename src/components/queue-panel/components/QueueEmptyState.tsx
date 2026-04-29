import {
	QueueEmptyState as QueueEmptyStateContainer,
	QueueEmptyStateText,
} from '../styles/QueuePanel.styles';
import type { QueueEmptyStateProps } from '../types/QueuePanel.types';

export const QueueEmptyState = ({
	children,
	message,
}: QueueEmptyStateProps) => (
	<QueueEmptyStateContainer>
		{children}
		<QueueEmptyStateText>{message}</QueueEmptyStateText>
	</QueueEmptyStateContainer>
);
