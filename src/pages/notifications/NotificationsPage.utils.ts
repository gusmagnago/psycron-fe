import type {
	INotificationPatient,
	INotificationRecord,
	NotificationChannel,
	NotificationStatus,
} from '@psycron/api/notifications/index.types';
import { palette } from '@psycron/theme/palette/palette.theme';

export const DEFAULT_NOTIFICATION_LIMIT = 20;

export const getPatientName = (
	patient?: INotificationPatient | null
): string => {
	if (!patient) return '';
	if (patient.name) return patient.name;

	return [patient.firstName, patient.lastName].filter(Boolean).join(' ');
};

export const getNotificationCardTone = (
	status: NotificationStatus
): 'error' | 'info' | 'neutral' | 'success' | 'warning' => {
	switch (status) {
		case 'DELIVERED':
			return 'success';
		case 'FAILED':
			return 'error';
		case 'PENDING':
			return 'warning';
		case 'SENT':
			return 'info';
		default:
			return 'neutral';
	}
};

export const getStatusColor = (status: NotificationStatus): string => {
	switch (status) {
		case 'DELIVERED':
			return palette.success.main;
		case 'FAILED':
			return palette.error.main;
		case 'PENDING':
			return palette.warning.main;
		case 'SENT':
			return palette.info.main;
		default:
			return palette.gray['06'];
	}
};

export const getChannelLabelKey = (channel: NotificationChannel): string =>
	`notifications.channels.${channel.toLowerCase()}`;

export const getStatusLabelKey = (status: NotificationStatus): string =>
	`notifications.statuses.${status.toLowerCase()}`;

export const getMessageTypeLabelKey = (messageType: string): string =>
	`notifications.message-types.${messageType.toLowerCase()}`;

export const getNotificationPreview = (
	notification: INotificationRecord
): string => {
	const content = notification.content.trim();
	if (content.length <= 120) return content;

	return `${content.slice(0, 117)}...`;
};

export const toInputDate = (value?: string | null): string => {
	if (!value) return '';

	return value.slice(0, 10);
};
