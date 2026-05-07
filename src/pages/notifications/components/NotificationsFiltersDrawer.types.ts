import type { NotificationFilters, NotificationSortOption } from '../NotificationsPage.types';

export interface NotificationsFiltersDrawerProps {
	activeFilterCount: number;
	filters: NotificationFilters;
	isOpen: boolean;
	onClose: () => void;
	onUpdateFilter: <Key extends keyof NotificationFilters>(
		key: Key,
		value: NotificationFilters[Key]
	) => void;
	onUpdateSort: (value: NotificationSortOption) => void;
	sortOption: NotificationSortOption;
}
