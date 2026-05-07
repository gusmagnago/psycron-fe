import {
	QueueSidebarCount,
	QueueSidebarHeaderWrapper,
	QueueSidebarSubtitle,
	QueueSidebarTitle,
	QueueSidebarTitleRow,
} from '../styles/QueuePanel.styles';
import type { QueueSidebarHeaderProps } from '../types/QueuePanel.types';

export const QueueSidebarHeader = ({
	action,
	count,
	subtitle,
	title,
}: QueueSidebarHeaderProps) => (
	<QueueSidebarHeaderWrapper>
		<QueueSidebarTitleRow>
			<QueueSidebarTitle>{title}</QueueSidebarTitle>
			{count !== undefined || action ? (
				<QueueSidebarTitleRow as='span'>
					{count !== undefined ? (
						<QueueSidebarCount>{count}</QueueSidebarCount>
					) : null}
					{action ?? null}
				</QueueSidebarTitleRow>
			) : null}
		</QueueSidebarTitleRow>
		{subtitle ? <QueueSidebarSubtitle>{subtitle}</QueueSidebarSubtitle> : null}
	</QueueSidebarHeaderWrapper>
);
