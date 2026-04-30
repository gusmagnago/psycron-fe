import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	getNotifications,
	retryNotification,
} from '@psycron/api/notifications';
import type { INotificationRecord } from '@psycron/api/notifications/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
	NotificationFilters,
	UseNotificationsPageStateParams,
	UseNotificationsPageStateResult,
} from '../NotificationsPage.types';
import { DEFAULT_NOTIFICATION_LIMIT } from '../NotificationsPage.utils';

const DEFAULT_FILTERS: NotificationFilters = {
	q: '',
};

const getActiveFilterCount = (filters: NotificationFilters): number =>
	[
		filters.channel,
		filters.from,
		filters.messageType,
		filters.q.trim(),
		filters.status,
		filters.to,
	].filter(Boolean).length;

export const useNotificationsPageState = ({
	t,
}: UseNotificationsPageStateParams): UseNotificationsPageStateResult => {
	const queryClient = useQueryClient();
	const { showAlert } = useAlert();
	const [filters, setFilters] =
		useState<NotificationFilters>(DEFAULT_FILTERS);
	const [selectedNotificationId, setSelectedNotificationId] = useState<
		string | null
	>(null);
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

	const activeFilterCount = useMemo(
		() => getActiveFilterCount(filters),
		[filters]
	);

	const notificationsQuery = useInfiniteQuery({
		queryKey: ['notifications', filters],
		queryFn: ({ pageParam }) =>
			getNotifications({
				channel: filters.channel,
				cursor: pageParam,
				from: filters.from || undefined,
				limit: DEFAULT_NOTIFICATION_LIMIT,
				messageType: filters.messageType || undefined,
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
			!notifications.some((notification) => notification._id === selectedNotificationId)
		) {
			setSelectedNotificationId(notifications[0]._id);
		}
	}, [notifications, selectedNotificationId]);

	const selectedNotification = useMemo(
		() =>
			notifications.find(
				(notification) => notification._id === selectedNotificationId
			) ?? null,
		[notifications, selectedNotificationId]
	);

	const retryMutation = useMutation({
		mutationFn: retryNotification,
		onSuccess: ({ notification }) => {
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
		closeFiltersDrawer: () => setIsFiltersDrawerOpen(false),
		fetchNextPage: () => {
			void notificationsQuery.fetchNextPage();
		},
		filters,
		hasNextPage: Boolean(notificationsQuery.hasNextPage),
		isFetchingNextPage: notificationsQuery.isFetchingNextPage,
		isFiltersDrawerOpen,
		isLoading: notificationsQuery.isLoading,
		isRetrying: retryMutation.isPending,
		notifications,
		openFiltersDrawer: () => setIsFiltersDrawerOpen(true),
		retrySelectedNotification: (notificationId: string) => {
			retryMutation.mutate(notificationId);
		},
		selectedNotification,
		selectedNotificationId,
		setFilters,
		setSelectedNotificationId,
		updateFilter,
	};
};
