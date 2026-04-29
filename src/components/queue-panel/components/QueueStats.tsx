import {
	QueueStatCard,
	QueueStatLabel,
	QueueStatsGrid,
	QueueStatValue,
} from '../styles/QueuePanel.styles';
import type { QueueStatsProps } from '../types/QueuePanel.types';

export const QueueStats = ({ items }: QueueStatsProps) => (
	<QueueStatsGrid>
		{items.map((item) => (
			<QueueStatCard key={String(item.label)}>
				<QueueStatLabel>{item.label}</QueueStatLabel>
				<QueueStatValue>{item.value}</QueueStatValue>
			</QueueStatCard>
		))}
	</QueueStatsGrid>
);
