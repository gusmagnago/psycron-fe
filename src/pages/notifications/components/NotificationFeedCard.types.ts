import type { INotificationRecord } from '@psycron/api/notifications/index.types';

export interface NotificationFeedCardProps {
	isRetrying: boolean;
	isSelected: boolean;
	notification: INotificationRecord;
	onOpenPatientSettings: (patientId: string) => void;
	onRetry: (notificationId: string) => void;
	onSelect: (notificationId: string) => void;
}
