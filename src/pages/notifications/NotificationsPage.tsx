import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import {
	QueueEmptyState,
	QueueFiltersTrigger,
	QueueSidebarHeader,
	QueueStats,
} from '@psycron/components/queue-panel';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { getDateLocale } from '@psycron/utils/date/date.utils';
import { format } from 'date-fns';

import { NotificationDetailDrawer } from './components/NotificationDetailDrawer';
import { NotificationsFiltersDrawer } from './components/NotificationsFiltersDrawer';
import { useNotificationsPageState } from './hooks/useNotificationsPageState';
import {
	DetailEyebrow,
	DetailHeader,
	DetailPanel,
	DetailSubtitle,
	DetailTitle,
	DetailTitleRow,
	NotificationCard,
	NotificationCardDate,
	NotificationCardMetaRow,
	NotificationChannelLabel,
	NotificationPreview,
	NotificationsLayout,
	NotificationsList,
	NotificationsSidebar,
	NotificationStatusPill,
	NotificationTitle,
	SearchField,
} from './NotificationsPage.styles';
import {
	getChannelLabelKey,
	getMessageTypeLabelKey,
	getNotificationCardTone,
	getNotificationPreview,
	getPatientName,
	getStatusColor,
	getStatusLabelKey,
} from './NotificationsPage.utils';

export const NotificationsPage = () => {
	const { i18n, t } = useTranslation();
	const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
	const dateLocale = getDateLocale(i18n.language);
	const {
		activeFilterCount,
		fetchNextPage,
		filters,
		hasNextPage,
		isFetchingNextPage,
		isFiltersDrawerOpen,
		isLoading,
		isRetrying,
		notifications,
		openFiltersDrawer,
		closeFiltersDrawer,
		retrySelectedNotification,
		selectedNotification,
		selectedNotificationId,
		setSelectedNotificationId,
		updateFilter,
	} = useNotificationsPageState({ t });

	const openNotification = (notificationId: string): void => {
		setSelectedNotificationId(notificationId);
		setIsDetailDrawerOpen(true);
	};

	const stats = useMemo(() => {
		const failed = notifications.filter(
			(notification) => notification.status === 'FAILED'
		).length;
		const delivered = notifications.filter(
			(notification) => notification.status === 'DELIVERED'
		).length;

		return [
			{ label: t('notifications.stats.total'), value: notifications.length },
			{ label: t('notifications.stats.failed'), value: failed },
			{ label: t('notifications.stats.delivered'), value: delivered },
		];
	}, [notifications, t]);

	return (
		<PageLayout
			isLoading={isLoading}
			subTitle={t('notifications.subtitle')}
			title={t('notifications.title')}
		>
			<NotificationsLayout>
				<NotificationsSidebar>
					<QueueSidebarHeader
						count={notifications.length}
						subtitle={t('notifications.queue.subtitle')}
						title={t('notifications.queue.title')}
					/>
					<QueueStats items={stats} />

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

					<NotificationsList>
						{notifications.length ? (
							notifications.map((notification) => {
								const patientName = getPatientName(notification.patient);

								return (
									<NotificationCard
										isSelected={notification._id === selectedNotificationId}
										key={notification._id}
										onClick={() => openNotification(notification._id)}
										tone={getNotificationCardTone(notification.status)}
										type='button'
									>
										<NotificationCardMetaRow>
											<NotificationChannelLabel>
												{t(getChannelLabelKey(notification.channel))}
											</NotificationChannelLabel>
											<NotificationStatusPill
												statusColor={getStatusColor(notification.status)}
												title={notification.error ?? undefined}
											>
												{t(getStatusLabelKey(notification.status))}
											</NotificationStatusPill>
										</NotificationCardMetaRow>
										<NotificationTitle>
											{patientName || t('notifications.detail.unknown-patient')}
										</NotificationTitle>
										<NotificationPreview>
											{t(getMessageTypeLabelKey(notification.messageType), {
												defaultValue: notification.messageType,
											})}
											{' · '}
											{getNotificationPreview(notification)}
										</NotificationPreview>
										<NotificationCardDate>
											{format(new Date(notification.sentAt), 'PPp', {
												locale: dateLocale,
											})}
										</NotificationCardDate>
									</NotificationCard>
								);
							})
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
				</NotificationsSidebar>

				<DetailPanel>
					{selectedNotification ? (
						<>
							<DetailHeader>
								<DetailEyebrow>
									{t(getChannelLabelKey(selectedNotification.channel))}
								</DetailEyebrow>
								<DetailTitleRow>
									<DetailTitle>
										{getPatientName(selectedNotification.patient) ||
											t('notifications.detail.unknown-patient')}
									</DetailTitle>
									<NotificationStatusPill
										statusColor={getStatusColor(selectedNotification.status)}
										title={selectedNotification.error ?? undefined}
									>
										{t(getStatusLabelKey(selectedNotification.status))}
									</NotificationStatusPill>
								</DetailTitleRow>
								<DetailSubtitle>
									{t(getMessageTypeLabelKey(selectedNotification.messageType), {
										defaultValue: selectedNotification.messageType,
									})}
									{' · '}
									{format(new Date(selectedNotification.sentAt), 'PPp', {
										locale: dateLocale,
									})}
								</DetailSubtitle>
							</DetailHeader>
							<NotificationPreview>
								{getNotificationPreview(selectedNotification)}
							</NotificationPreview>
							<Button
								onClick={() => setIsDetailDrawerOpen(true)}
								secondary
							>
								{t('notifications.drawer.open')}
							</Button>
						</>
					) : (
						<QueueEmptyState message={t('notifications.empty')} />
					)}
				</DetailPanel>
			</NotificationsLayout>

			<NotificationsFiltersDrawer
				activeFilterCount={activeFilterCount}
				filters={filters}
				isOpen={isFiltersDrawerOpen}
				onClose={closeFiltersDrawer}
				onUpdateFilter={updateFilter}
			/>

			{isDetailDrawerOpen && selectedNotification ? (
				<NotificationDetailDrawer
					isRetrying={isRetrying}
					notification={selectedNotification}
					onClose={() => setIsDetailDrawerOpen(false)}
					onRetry={retrySelectedNotification}
				/>
			) : null}
		</PageLayout>
	);
};
