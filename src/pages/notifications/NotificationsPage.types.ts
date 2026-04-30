import type {
	INotificationRecord,
	NotificationChannel,
	NotificationStatus,
} from '@psycron/api/notifications/index.types';

export interface NotificationFilters {
	channel?: NotificationChannel;
	from?: string;
	messageType?: string;
	q: string;
	status?: NotificationStatus;
	to?: string;
}

export type NotificationSortOption = 'newest' | 'oldest' | 'status';

export interface UseNotificationsPageStateParams {
	t: (key: string, options?: Record<string, unknown>) => string;
}

export interface UseNotificationsPageStateResult {
	activeFilterCount: number;
	closeFiltersDrawer: () => void;
	fetchNextPage: () => void;
	filters: NotificationFilters;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	isFiltersDrawerOpen: boolean;
	isLoading: boolean;
	isRetrying: boolean;
	notifications: INotificationRecord[];
	openFiltersDrawer: () => void;
	retrySelectedNotification: (notificationId: string) => void;
	selectedNotification: INotificationRecord | null;
	selectedNotificationId: string | null;
	setFilters: (filters: NotificationFilters) => void;
	setSelectedNotificationId: (notificationId: string | null) => void;
	updateFilter: <Key extends keyof NotificationFilters>(
		key: Key,
		value: NotificationFilters[Key]
	) => void;
}
