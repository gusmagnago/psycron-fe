import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
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

	const stats = summary
		? [
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
			]
		: [];

	const body =
		isLoading || !summary ? (
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
		) : (
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
			</NotificationsRoot>
		);

	const footer =
		!isLoading && summary ? (
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
				<Button small tertiary onClick={onViewFeed}>
					{t('page.dashboard.widgets.notifications.view-feed')}
					<ChevronRight />
				</Button>
			</NotificationFooter>
		) : undefined;

	return (
		<WidgetLayout
			body={body}
			footer={footer}
			title={t('page.dashboard.widgets.notifications.title')}
		/>
	);
};
