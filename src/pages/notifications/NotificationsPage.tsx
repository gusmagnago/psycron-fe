import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { Button } from '@psycron/components/button/Button';
import { Checkbox } from '@psycron/components/checkbox/Checkbox';
import {
	FEATURE_PAGE_COLORS,
	FeaturePageLayout,
	FeaturePageQueue,
} from '@psycron/components/feature-page-layout';
import {
	QueueEmptyState,
	QueueFiltersTrigger,
	QueueList,
	QueueSearchField,
	QueueSidebarHeader,
	QueueStats,
} from '@psycron/components/queue-panel';

import { NotificationDetailPanel } from './components/NotificationDetailPanel';
import { NotificationFeedCard } from './components/NotificationFeedCard';
import { NotificationsFiltersDrawer } from './components/NotificationsFiltersDrawer';
import { useNotificationsPageState } from './hooks/useNotificationsPageState';
import { BulkActionsRow } from './NotificationsPage.styles';
import { getMessageTypeLabelKey } from './NotificationsPage.utils';

export const NotificationsPage = () => {
	const { t } = useTranslation();
	const [isBulkRetrySelected, setIsBulkRetrySelected] = useState(false);
	const [isFeedExpanded, setIsFeedExpanded] = useState(false);
	const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
	const {
		activeFilterCount,
		archiveNotification,
		closeFiltersDrawer,
		fetchNextPage,
		filters,
		hasNextPage,
		isArchiving,
		isFetchingNextPage,
		isFiltersDrawerOpen,
		isLoading,
		isRetrying,
		openFiltersDrawer,
		resendableNotificationIds,
		resendVisibleNotifications,
		retrySelectedNotification,
		selectedNotification,
		selectedNotificationId,
		setSelectedNotificationId,
		setSortOption,
		sortedNotifications,
		sortOption,
		stats,
		updateFilter,
	} = useNotificationsPageState({ t });

	const queueSummary = (
		<>
			<QueueSidebarHeader
				count={sortedNotifications.length}
				subtitle={t('notifications.queue.subtitle')}
				title={t('notifications.queue.title')}
			/>
			<QueueStats items={stats} />
		</>
	);

	const queueControls = (
		<>
			<QueueSearchField
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
					disabled={!isBulkRetrySelected || resendableNotificationIds.length === 0}
					loading={isRetrying}
					onClick={resendVisibleNotifications}
					small
				>
					{t('notifications.bulk.action')}
				</Button>
			</BulkActionsRow>
		</>
	);

	const queueList = (
		<QueueList>
			{sortedNotifications.length ? (
				sortedNotifications.map((notification) => (
					<NotificationFeedCard
						isRetrying={isRetrying}
						isSelected={notification._id === selectedNotificationId}
						key={notification._id}
						notification={notification}
						onRetry={retrySelectedNotification}
						onSelect={(id) => {
							setSelectedNotificationId(id);
							setIsMobileDetailOpen(true);
						}}
					/>
				))
			) : (
				<QueueEmptyState message={t('notifications.empty')} />
			)}
			{hasNextPage ? (
				<Button loading={isFetchingNextPage} onClick={fetchNextPage} secondary>
					{t('notifications.load-more')}
				</Button>
			) : null}
		</QueueList>
	);

	return (
		<FeaturePageLayout
			ariaLabel={t('notifications.accessibility.page')}
			colors={FEATURE_PAGE_COLORS.notifications}
			isLoading={isLoading}
			subTitle={t('notifications.subtitle')}
			title={t('notifications.title')}
		>
			<FeaturePageQueue
				accessibility={{
					detailLabel: t('notifications.accessibility.detail'),
					queueLabel: t('notifications.accessibility.queue'),
				}}
				analytics={{
					onEvent: ({ properties }) => {
						capture(PostHogEvent.FeaturePageQueueExpansionChanged, {
							is_expanded: properties.isExpanded,
							surface: properties.surface,
						});
					},
					surface: 'notifications',
				}}
				detailTitle={
					selectedNotification
						? t(getMessageTypeLabelKey(selectedNotification.messageType))
						: ''
				}
				isDetailOpen={isMobileDetailOpen}
				isQueueExpanded={isFeedExpanded}
				onDetailClose={() => setIsMobileDetailOpen(false)}
				onQueueExpandedChange={setIsFeedExpanded}
				queueControls={queueControls}
				queueList={queueList}
				queueSummary={queueSummary}
			>
				<NotificationDetailPanel
					archiveNotification={archiveNotification}
					isArchiving={isArchiving}
					isRetrying={isRetrying}
					notification={selectedNotification}
					onRetry={retrySelectedNotification}
				/>
			</FeaturePageQueue>
			<NotificationsFiltersDrawer
				activeFilterCount={activeFilterCount}
				filters={filters}
				isOpen={isFiltersDrawerOpen}
				onClose={closeFiltersDrawer}
				onUpdateFilter={updateFilter}
				onUpdateSort={setSortOption}
				sortOption={sortOption}
			/>
		</FeaturePageLayout>
	);
};
