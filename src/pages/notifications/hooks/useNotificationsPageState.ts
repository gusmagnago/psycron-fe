import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import {
	archiveNotification,
	getNotifications,
	retryNotification,
} from '@psycron/api/notifications';
import type { INotificationRecord } from '@psycron/api/notifications/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
	NotificationFilters,
	NotificationSortOption,
	UseNotificationsPageStateParams,
	UseNotificationsPageStateResult,
} from '../NotificationsPage.types';
import {
	DEFAULT_NOTIFICATION_LIMIT,
	isNotificationResendable,
} from '../NotificationsPage.utils';

const DEFAULT_FILTERS: NotificationFilters = {
	q: '',
};

const getActiveFilterCount = (filters: NotificationFilters): number =>
	[
		filters.archived,
		filters.channel,
		filters.from,
		filters.messageType,
		filters.patientId,
		filters.q.trim(),
		filters.status,
		filters.to,
	].filter(Boolean).length;

const sortNotifications = (
	notifications: INotificationRecord[],
	option: NotificationSortOption
): INotificationRecord[] => {
	const sorted = [...notifications];

	switch (option) {
		case 'oldest':
			return sorted.sort(
				(a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
			);
		case 'status':
			return sorted.sort((a, b) => a.status.localeCompare(b.status));
		case 'newest':
		default:
			return sorted.sort(
				(a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
			);
	}
};

export const useNotificationsPageState = ({
	t,
}: UseNotificationsPageStateParams): UseNotificationsPageStateResult => {
	const queryClient = useQueryClient();
	const { showAlert } = useAlert();
	const location = useLocation();
	const locationState = location.state as {
		patientId?: string;
		status?: NotificationFilters['status'];
	} | null;
	const [filters, setFilters] = useState<NotificationFilters>({
		...DEFAULT_FILTERS,
		patientId: locationState?.patientId,
		status: locationState?.status,
	});
	const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const [sortOption, setSortOption] = useState<NotificationSortOption>('newest');

	const activeFilterCount = useMemo(
		() => getActiveFilterCount(filters),
		[filters]
	);

	const notificationsQuery = useInfiniteQuery({
		queryKey: ['notifications', filters],
		queryFn: ({ pageParam }) =>
			getNotifications({
				archived: filters.archived,
				channel: filters.channel,
				cursor: pageParam,
				from: filters.from || undefined,
				limit: DEFAULT_NOTIFICATION_LIMIT,
				messageType: filters.messageType || undefined,
				patientId: filters.patientId || undefined,
				q: filters.q.trim() || undefined,
				status: filters.status,
				to: filters.to || undefined,
			}),
		getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
		initialPageParam: undefined as string | undefined,
	});

	const notifications = useMemo(
		() =>
			notificationsQuery.data?.pages.flatMap((page) => page.notifications) ?? [],
		[notificationsQuery.data?.pages]
	);

	useEffect(() => {
		if (!notifications.length) {
			setSelectedNotificationId(null);
			return;
		}

		if (
			!selectedNotificationId ||
			!notifications.some((n) => n._id === selectedNotificationId)
		) {
			setSelectedNotificationId(notifications[0]._id);
		}
	}, [notifications, selectedNotificationId]);

	const selectedNotification = useMemo(
		() => notifications.find((n) => n._id === selectedNotificationId) ?? null,
		[notifications, selectedNotificationId]
	);

	const sortedNotifications = useMemo(
		() => sortNotifications(notifications, sortOption),
		[notifications, sortOption]
	);

	const resendableNotificationIds = useMemo(
		() => notifications.filter(isNotificationResendable).map((n) => n._id),
		[notifications]
	);

	const stats = useMemo(
		() => [
			{ label: t('notifications.stats.total'), value: notifications.length },
			{
				label: t('notifications.stats.sent'),
				value: notifications.filter((n) => n.status === 'SENT').length,
			},
			{
				label: t('notifications.stats.failed'),
				value: notifications.filter((n) => n.status === 'FAILED').length,
			},
		],
		[notifications, t]
	);

	const retryMutation = useMutation({
		mutationFn: retryNotification,
		onSuccess: ({ notification }, notificationId) => {
			const original = notifications.find((n) => n._id === notificationId);
			capture(PostHogEvent.NotificationResent, {
				channel: notification.channel,
				message_type: notification.messageType,
				notification_id: notification._id,
				previous_status: original?.status ?? 'UNKNOWN',
			});
			queryClient.setQueriesData<{
				pageParams: unknown[];
				pages: Array<{ notifications: INotificationRecord[] }>;
			}>({ queryKey: ['notifications'] }, (old) => {
				if (!old) return old;

				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						notifications: page.notifications.map((item) =>
							item._id === notification._id ? notification : item
						),
					})),
				};
			});
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			showAlert({
				message: t('notifications.retry.success'),
				severity: 'success',
			});
		},
		onError: () => {
			showAlert({
				message: t('notifications.retry.error'),
				severity: 'error',
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});

	const archiveMutation = useMutation({
		mutationFn: archiveNotification,
		onSuccess: (_, notificationId) => {
			const notification = notifications.find((n) => n._id === notificationId);
			if (notification) {
				capture(PostHogEvent.NotificationArchived, {
					channel: notification.channel,
					message_type: notification.messageType,
					notification_id: notificationId,
				});
			}
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
			showAlert({
				message: t('notifications.archive.success'),
				severity: 'success',
			});
		},
		onError: () => {
			showAlert({
				message: t('notifications.archive.error'),
				severity: 'error',
			});
		},
	});

	const retrySelectedNotification = useCallback(
		(notificationId: string): void => {
			retryMutation.mutate(notificationId);
		},
		[retryMutation]
	);

	const resendVisibleNotifications = useCallback((): void => {
		resendableNotificationIds.forEach(retrySelectedNotification);
	}, [resendableNotificationIds, retrySelectedNotification]);

	const updateFilter = useCallback(
		<Key extends keyof NotificationFilters>(
			key: Key,
			value: NotificationFilters[Key]
		): void => {
			setFilters((prev) => ({ ...prev, [key]: value }));
		},
		[]
	);

	return {
		activeFilterCount,
		archiveNotification: (id) => archiveMutation.mutate(id),
		closeFiltersDrawer: () => {
			if (getActiveFilterCount(filters) > 0) {
				capture(PostHogEvent.NotificationFiltersApplied, {
					channel: filters.channel,
					has_date_range: Boolean(filters.from || filters.to),
					has_patient_filter: Boolean(filters.patientId),
					has_search: Boolean(filters.q.trim()),
					message_type: filters.messageType,
					status: filters.status,
				});
			}
			setIsFiltersDrawerOpen(false);
		},
		fetchNextPage: () => {
			void notificationsQuery.fetchNextPage();
		},
		filters,
		hasNextPage: Boolean(notificationsQuery.hasNextPage),
		isArchiving: archiveMutation.isPending,
		isFetchingNextPage: notificationsQuery.isFetchingNextPage,
		isFiltersDrawerOpen,
		isLoading: notificationsQuery.isLoading,
		isRetrying: retryMutation.isPending,
		notifications,
		openFiltersDrawer: () => setIsFiltersDrawerOpen(true),
		resendableNotificationIds,
		resendVisibleNotifications,
		retrySelectedNotification,
		selectedNotification,
		selectedNotificationId,
		setFilters,
		setSelectedNotificationId,
		setSortOption,
		sortedNotifications,
		sortOption,
		stats,
		updateFilter,
	};
};
