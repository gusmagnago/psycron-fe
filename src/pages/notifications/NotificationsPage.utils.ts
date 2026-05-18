import type {
	INotificationPatient,
	INotificationRecord,
	NotificationChannel,
	NotificationMessageType,
	NotificationStatus,
} from '@psycron/api/notifications/index.types';
import {
	AVAILABILITYWEEK_BASE,
	PATIENTS,
} from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	formatDateTimeRange,
	formatLocalizedDate,
} from '@psycron/utils/date/date.utils';
import { format } from 'date-fns';
import type { TFunction } from 'i18next';

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
	'WHATSAPP',
	'EMAIL',
	'ICALENDAR',
];

export const NOTIFICATION_STATUSES: NotificationStatus[] = [
	'FAILED',
	'PENDING',
	'SENT',
	'DELIVERED',
];

export const NOTIFICATION_MESSAGE_TYPES = [
	'APPOINTMENT_CONFIRMATION',
	'APPOINTMENT_UPDATED',
	'REMINDER',
	'CONFLICT',
	'ACCOUNT_SETUP',
	'DAILY_SCHEDULE_SUMMARY',
] satisfies NotificationMessageType[];

export const DEFAULT_NOTIFICATION_LIMIT = 20;

export const getPatientName = (
	patient?: INotificationPatient | null
): string => {
	if (!patient) return '';
	if (patient.name) return patient.name;

	return [patient.firstName, patient.lastName].filter(Boolean).join(' ');
};

export const normalizeNotificationStatus = (
	status?: NotificationStatus | null
): NotificationStatus => status ?? 'SENT';

export const normalizeNotificationChannel = (
	channel?: NotificationChannel | null
): NotificationChannel => channel ?? 'EMAIL';

export const getNotificationCardTone = (
	status?: NotificationStatus | null
): 'error' | 'info' | 'neutral' | 'success' | 'warning' => {
	switch (normalizeNotificationStatus(status)) {
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

export const getStatusColor = (status?: NotificationStatus | null): string => {
	switch (normalizeNotificationStatus(status)) {
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

export const getChannelLabelKey = (
	channel?: NotificationChannel | null
): string =>
	`notifications.channels.${normalizeNotificationChannel(channel).toLowerCase()}`;

export const getStatusLabelKey = (
	status?: NotificationStatus | null
): string =>
	`notifications.statuses.${normalizeNotificationStatus(status).toLowerCase()}`;

export const getMessageTypeLabelKey = (
	messageType?: string | null
): string => `notifications.message-types.${(messageType ?? 'unknown').toLowerCase()}`;

export const formatNotificationDateTime = (
	value: string | null | undefined,
	language: string,
	fallback = '-'
): string => formatLocalizedDate(value, fallback, language, 'PPp');

export const formatNotificationAppointment = (
	notification: INotificationRecord,
	language: string,
	fallback = '-'
): string => {
	const appointment = notification.appointment;

	if (appointment?.date && appointment.startTime && appointment.endTime) {
		return formatDateTimeRange(
			new Date(appointment.date),
			appointment.startTime,
			appointment.endTime,
			language
		);
	}

	if (appointment?.date) {
		return formatNotificationDateTime(appointment.date, language, fallback);
	}

	// Appointment not hydrated — fall back to payload formattedEventDetails
	const eventDetails = notification.payload?.formattedEventDetails;
	if (typeof eventDetails === 'string' && eventDetails.trim()) {
		return eventDetails;
	}

	return notification.appointmentId ?? fallback;
};

export const formatNotificationDeliveryDate = (
	notification: INotificationRecord,
	language: string,
	fallback = '-'
): string => {
	if (notification.status === 'FAILED' || notification.status === 'PENDING') {
		return fallback;
	}

	return formatNotificationDateTime(
		notification.deliveredAt ?? notification.sentAt,
		language,
		fallback
	);
};

const APPOINTMENT_MESSAGE_TYPES: NotificationMessageType[] = [
	'APPOINTMENT_CONFIRMATION',
	'APPOINTMENT_UPDATED',
	'REMINDER',
];

export const isNotificationResendable = (
	notification: INotificationRecord
): boolean => {
	if (notification.status === 'FAILED') return true;

	// Appointment hydrated — trust its isUpcoming flag
	if (notification.appointment) {
		return Boolean(notification.appointment.isUpcoming);
	}

	// Appointment not hydrated — optimistically allow resend for appointment-related types;
	// the backend validates the actual slot date on retry
	return APPOINTMENT_MESSAGE_TYPES.includes(
		notification.messageType as NotificationMessageType
	);
};

export const getPatientProfilePath = (
	notification: INotificationRecord
): string | null =>
	notification.patientId ? `${PATIENTS}/${notification.patientId}` : null;

export const getAppointmentCalendarPath = (
	notification: INotificationRecord
): string | null => {
	if (!notification.appointment?.date) return null;

	const date = format(new Date(notification.appointment.date), 'yyyy-MM-dd');
	const params = notification.appointmentId
		? `?slotId=${notification.appointmentId}`
		: '';

	return `${AVAILABILITYWEEK_BASE}/${date}${params}`;
};



export const getNotificationContextLines = (
	notification: INotificationRecord,
	t: TFunction,
	language: string
): string[] => {
	const lines = [
		t('notifications.context.channel-status', {
			channel: t(getChannelLabelKey(notification.channel)),
			status: t(getStatusLabelKey(notification.status)),
		}),
		t('notifications.context.sent-at', {
			value: formatNotificationDateTime(notification.sentAt, language),
		}),
	];

	if (notification.deliveredAt) {
		lines.push(
			t('notifications.context.delivered-at', {
				value: formatNotificationDeliveryDate(notification, language),
			})
		);
	}

	const appointmentLabel = formatNotificationAppointment(notification, language);
	if (appointmentLabel !== '-') {
		lines.push(
			t('notifications.context.appointment', { value: appointmentLabel })
		);
	}

	if (notification.icsContent) {
		lines.push(t('notifications.context.calendar-invite-attached'));
	}

	if (notification.error) {
		lines.push(t('notifications.context.error', { value: notification.error }));
	}

	return lines;
};

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
