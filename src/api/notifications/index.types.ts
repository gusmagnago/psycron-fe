export type NotificationChannel = 'EMAIL' | 'ICALENDAR' | 'WHATSAPP';

export interface INotificationChannelPref {
	email: boolean;
	whatsapp: boolean;
}

export interface IReminderPref extends INotificationChannelPref {
	enabled: boolean;
	leadTimeMinutes: number;
}

export interface INotificationPreferencesPayload {
	appointmentConfirmation?: INotificationChannelPref;
	appointmentUpdated?: INotificationChannelPref;
	calendarInvite?: { enabled: boolean };
	reminder?: IReminderPref;
}

export interface IUpdateNotificationPreferencesResponse {
	notificationPreferences: {
		appointmentConfirmation: INotificationChannelPref;
		appointmentUpdated: INotificationChannelPref;
		calendarInvite: { enabled: boolean };
		reminder: IReminderPref;
	};
}

export type NotificationStatus = 'DELIVERED' | 'FAILED' | 'PENDING' | 'SENT';

export type NotificationMessageType =
	| 'ACCOUNT_SETUP'
	| 'APPOINTMENT_CONFIRMATION'
	| 'APPOINTMENT_UPDATED'
	| 'CONFLICT'
	| 'DAILY_SCHEDULE_SUMMARY'
	| 'NEW_BOOKING'
	| 'REMINDER'
	| 'WHATSAPP_ACTION_REQUIRED'
	| string;

export interface INotificationPatient {
	_id: string;
	firstName?: string;
	lastName?: string;
	name?: string;
}

export interface INotificationAppointment {
	_id?: string;
	date?: string;
	endTime?: string;
	isUpcoming?: boolean;
	startTime?: string;
}

export interface INotificationDeliveryMetadata {
	deliveredAt?: string | null;
	error?: string | null;
	sentAt?: string | null;
}

export interface INotificationRecord {
	_id: string;
	appointment?: INotificationAppointment | null;
	appointmentId?: string | null;
	channel: NotificationChannel;
	content: string;
	deliveredAt?: string | null;
	error?: string | null;
	icsContent?: string | null;
	isArchived?: boolean;
	messageType: NotificationMessageType;
	patient?: INotificationPatient | null;
	patientId?: string | null;
	payload?: Record<string, unknown> | null;
	sentAt: string;
	status: NotificationStatus;
}

export interface IGetNotificationsParams {
	archived?: boolean;
	channel?: NotificationChannel;
	cursor?: string;
	from?: string;
	limit?: number;
	messageType?: string;
	patientId?: string;
	q?: string;
	status?: NotificationStatus;
	to?: string;
}

export interface IGetNotificationsResponse {
	nextCursor?: string | null;
	notifications: INotificationRecord[];
	total?: number;
}

export interface IRetryNotificationResponse {
	notification: INotificationRecord;
}

export interface IArchiveNotificationResponse {
	_id: string;
	isArchived: boolean;
}

export interface IUnreadNotificationsCountResponse {
	unreadCount: number;
}

export interface IMarkNotificationReadResponse {
	_id: string;
	readAt: string;
}

export interface IMarkAllNotificationsReadResponse {
	modifiedCount: number;
}
