import {
	QueueSidebarCount,
	QueueSidebarHeaderWrapper,
	QueueSidebarSubtitle,
	QueueSidebarTitle,
	QueueSidebarTitleRow,
} from '../styles/QueuePanel.styles';
import type { QueueSidebarHeaderProps } from '../types/QueuePanel.types';

export const QueueSidebarHeader = ({
	count,
	subtitle,
	title,
}: QueueSidebarHeaderProps) => (
	<QueueSidebarHeaderWrapper>
		<QueueSidebarTitleRow>
			<QueueSidebarTitle>{title}</QueueSidebarTitle>
			{count !== undefined ? <QueueSidebarCount>{count}</QueueSidebarCount> : null}
		</QueueSidebarTitleRow>
		{subtitle ? <QueueSidebarSubtitle>{subtitle}</QueueSidebarSubtitle> : null}
	</QueueSidebarHeaderWrapper>
);
