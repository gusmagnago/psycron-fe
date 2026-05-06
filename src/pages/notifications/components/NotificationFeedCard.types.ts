import type { INotificationRecord } from '@psycron/api/notifications/index.types';

export interface NotificationFeedCardProps {
	isRetrying: boolean;
	isSelected: boolean;
	notification: INotificationRecord;
	onRetry: (notificationId: string) => void;
	onSelect: (notificationId: string) => void;
}
