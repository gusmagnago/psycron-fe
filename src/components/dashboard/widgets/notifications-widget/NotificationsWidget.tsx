import { useTranslation } from 'react-i18next';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import {
	Calendar,
	ChevronRight,
	Mail,
	WhatsApp,
} from '@psycron/components/icons';

import {
	ChannelCounter,
	ChannelCounters,
	NotificationFooter,
	NotificationSkeleton,
	NotificationsRoot,
	NotificationStatButton,
	NotificationStatLabel,
	NotificationStatsGrid,
	NotificationStatValue,
	ViewFeedButton,
} from './NotificationsWidget.styles';
import type { NotificationsWidgetProps } from './NotificationsWidget.types';

export const NotificationsWidget = ({
	colSpan,
	isLoading,
	onStatusClick,
	onViewFeed,
	summary,
}: NotificationsWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { t } = useTranslation();

	useBentoTileChrome({
		actions: '',
		title: t('page.dashboard.widgets.notifications.title'),
	});

	if (isLoading || !summary) {
		return (
			<NotificationsRoot isWide={isWide}>
				<NotificationStatsGrid>
					{Array.from({ length: 3 }, (_, index) => (
						<NotificationSkeleton
							height={84}
							key={`notification-skeleton-${index}`}
							variant='rectangular'
						/>
					))}
				</NotificationStatsGrid>
				<NotificationSkeleton height={24} variant='rectangular' width='70%' />
			</NotificationsRoot>
		);
	}

	const stats = [
		{
			label: t('page.dashboard.widgets.notifications.sent'),
			onClick: () => onStatusClick('SENT'),
			value: summary.sent,
		},
		{
			label: t('page.dashboard.widgets.notifications.failed'),
			onClick: () => onStatusClick('FAILED'),
			value: summary.failed,
		},
		{
			label: t('page.dashboard.widgets.notifications.queued'),
			onClick: () => onStatusClick('PENDING'),
			value: summary.queued,
		},
	];

	return (
		<NotificationsRoot>
			<NotificationStatsGrid>
				{stats.map((stat) => (
					<NotificationStatButton
						key={stat.label}
						onClick={stat.onClick}
						type='button'
					>
						<NotificationStatLabel>{stat.label}</NotificationStatLabel>
						<NotificationStatValue>{stat.value}</NotificationStatValue>
					</NotificationStatButton>
				))}
			</NotificationStatsGrid>

			<NotificationFooter>
				<ChannelCounters>
					<ChannelCounter>
						<WhatsApp />
						{summary.channels.WHATSAPP}
					</ChannelCounter>
					<ChannelCounter>
						<Mail />
						{summary.channels.EMAIL}
					</ChannelCounter>
					<ChannelCounter>
						<Calendar />
						{summary.channels.ICALENDAR}
					</ChannelCounter>
				</ChannelCounters>
				<ViewFeedButton onClick={onViewFeed} type='button'>
					{t('page.dashboard.widgets.notifications.view-feed')}
					<ChevronRight />
				</ViewFeedButton>
			</NotificationFooter>
		</NotificationsRoot>
	);
};
