import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Checkbox } from '@psycron/components/checkbox/Checkbox';
import {
	QueueEmptyState,
	QueueFiltersTrigger,
	QueueSidebarHeader,
	QueueStats,
} from '@psycron/components/queue-panel';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { Maximize2, Minimize2 } from 'lucide-react';

import { NotificationDetailPanel } from './components/NotificationDetailPanel';
import { NotificationFeedCard } from './components/NotificationFeedCard';
import { NotificationsFiltersDrawer } from './components/NotificationsFiltersDrawer';
import { useNotificationsPageState } from './hooks/useNotificationsPageState';
import {
	BulkActionsRow,
	DetailPanelWrapper,
	ExpandableFeedContent,
	FeedToggleWrapper,
	NotificationsLayout,
	NotificationsList,
	NotificationsSidebar,
	SearchField,
} from './NotificationsPage.styles';
import type { NotificationSortOption } from './NotificationsPage.types';
import { isNotificationResendable } from './NotificationsPage.utils';

export const NotificationsPage = () => {
	const { t } = useTranslation();
	const [isBulkRetrySelected, setIsBulkRetrySelected] = useState(false);
	const [isFeedExpanded, setIsFeedExpanded] = useState(false);
	const [sortOption, setSortOption] =
		useState<NotificationSortOption>('newest');
	const {
		activeFilterCount,
		closeFiltersDrawer,
		fetchNextPage,
		filters,
		hasNextPage,
		isFetchingNextPage,
		isFiltersDrawerOpen,
		isLoading,
		isRetrying,
		notifications,
		openFiltersDrawer,
		retrySelectedNotification,
		selectedNotification,
		selectedNotificationId,
		setSelectedNotificationId,
		updateFilter,
	} = useNotificationsPageState({ t });

	const resendableNotificationIds = useMemo(
		() =>
			notifications
				.filter(isNotificationResendable)
				.map((notification) => notification._id),
		[notifications]
	);

	const sortedNotifications = useMemo(() => {
		const sorted = [...notifications];

		switch (sortOption) {
			case 'oldest':
				return sorted.sort(
					(first, second) =>
						new Date(first.sentAt).getTime() - new Date(second.sentAt).getTime()
				);
			case 'status':
				return sorted.sort((first, second) =>
					first.status.localeCompare(second.status)
				);
			case 'newest':
			default:
				return sorted.sort(
					(first, second) =>
						new Date(second.sentAt).getTime() - new Date(first.sentAt).getTime()
				);
		}
	}, [notifications, sortOption]);

	const stats = useMemo(() => {
		const sent = notifications.filter(
			(notification) => notification.status === 'SENT'
		).length;
		const failed = notifications.filter(
			(notification) => notification.status === 'FAILED'
		).length;
		const delivered = notifications.filter(
			(notification) => notification.status === 'DELIVERED'
		).length;

		return [
			{ label: t('notifications.stats.total'), value: notifications.length },
			{ label: t('notifications.stats.sent'), value: sent },
			{ label: t('notifications.stats.failed'), value: failed },
			{ label: t('notifications.stats.delivered'), value: delivered },
		];
	}, [notifications, t]);

	const resendVisibleNotifications = (): void => {
		resendableNotificationIds.forEach(retrySelectedNotification);
	};

	return (
		<PageLayout
			isLoading={isLoading}
			subTitle={t('notifications.subtitle')}
			title={t('notifications.title')}
		>
			<NotificationsLayout isExpanded={isFeedExpanded}>
				<NotificationsSidebar>
					<QueueSidebarHeader
						count={notifications.length}
						subtitle={t('notifications.queue.subtitle')}
						title={t('notifications.queue.title')}
					/>
					<FeedToggleWrapper>
						<Button
							onClick={() => setIsFeedExpanded((current) => !current)}
							small
							tertiary
						>
							{isFeedExpanded ? <Minimize2 /> : <Maximize2 />}
							{isFeedExpanded
								? t('notifications.layout.collapse-feed')
								: t('notifications.layout.expand-feed')}
						</Button>
					</FeedToggleWrapper>
					<QueueStats items={stats} />
					<ExpandableFeedContent isExpanded={isFeedExpanded}>
						<SearchField
							label={t('notifications.search.placeholder')}
							onChange={(event) => updateFilter('q', event.target.value)}
								size='small'
								value={filters.q}
							/>

							<QueueFiltersTrigger
								activeFilterCount={activeFilterCount}
								controlsId='notifications-filters-drawer'
								isOpen={isFiltersDrawerOpen}
								onOpen={openFiltersDrawer}
								summaryActive={t('notifications.filters.summary-active', {
									count: activeFilterCount,
								})}
								summaryDefault={t('notifications.filters.summary-default')}
								title={t('notifications.filters.title')}
							/>

							<BulkActionsRow>
								<Checkbox
									checked={isBulkRetrySelected}
									label={t('notifications.bulk.resend-eligible')}
									onChange={(_, checked) => setIsBulkRetrySelected(checked)}
								/>
								<Button
									disabled={
										!isBulkRetrySelected ||
										resendableNotificationIds.length === 0
									}
									loading={isRetrying}
									onClick={resendVisibleNotifications}
									small
								>
									{t('notifications.bulk.action')}
								</Button>
							</BulkActionsRow>

							<NotificationsList>
								{sortedNotifications.length ? (
									sortedNotifications.map((notification) => (
										<NotificationFeedCard
											isRetrying={isRetrying}
											isSelected={notification._id === selectedNotificationId}
											key={notification._id}
											notification={notification}
											onRetry={retrySelectedNotification}
											onSelect={setSelectedNotificationId}
										/>
									))
								) : (
									<QueueEmptyState message={t('notifications.empty')} />
								)}
								{hasNextPage ? (
									<Button
										loading={isFetchingNextPage}
										onClick={fetchNextPage}
										secondary
									>
										{t('notifications.load-more')}
									</Button>
								) : null}
							</NotificationsList>
					</ExpandableFeedContent>
				</NotificationsSidebar>

				<DetailPanelWrapper isHidden={isFeedExpanded}>
					<NotificationDetailPanel
						isRetrying={isRetrying}
						notification={selectedNotification}
						onRetry={retrySelectedNotification}
					/>
				</DetailPanelWrapper>
			</NotificationsLayout>

			<NotificationsFiltersDrawer
				activeFilterCount={activeFilterCount}
				filters={filters}
				isOpen={isFiltersDrawerOpen}
				onClose={closeFiltersDrawer}
				onUpdateSort={setSortOption}
				onUpdateFilter={updateFilter}
				sortOption={sortOption}
			/>
		</PageLayout>
	);
};
