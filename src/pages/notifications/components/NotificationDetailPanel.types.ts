import type { INotificationRecord } from '@psycron/api/notifications/index.types';

export interface NotificationDetailPanelProps {
	archiveNotification: (notificationId: string) => void;
	isArchiving: boolean;
	isRetrying: boolean;
	notification: INotificationRecord | null;
	onRetry: (notificationId: string) => void;
}
