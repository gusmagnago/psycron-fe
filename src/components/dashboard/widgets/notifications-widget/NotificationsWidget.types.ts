import type { DashboardNotifications24h } from '@psycron/api/dashboard/index.types';
import type { NotificationStatus } from '@psycron/api/notifications/index.types';

export interface NotificationsWidgetProps {
	colSpan?: number;
	isLoading?: boolean;
	onStatusClick: (status?: NotificationStatus) => void;
	onViewFeed: () => void;
	summary?: DashboardNotifications24h;
}
