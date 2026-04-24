import type { ReactNode } from 'react';

import {
	QueueSidebarCount,
	QueueSidebarHeaderWrapper,
	QueueSidebarSubtitle,
	QueueSidebarTitle,
	QueueSidebarTitleRow,
} from './QueueDetail.styles';

type QueueSidebarHeaderProps = {
	count?: ReactNode;
	subtitle?: ReactNode;
	title: ReactNode;
};

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
