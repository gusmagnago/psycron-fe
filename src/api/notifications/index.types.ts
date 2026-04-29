export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';

export type NotificationStatus = 'DELIVERED' | 'FAILED' | 'PENDING' | 'SENT';

export type NotificationMessageType =
	| 'APPOINTMENT_CONFIRMATION'
	| 'CANCELLATION'
	| 'REMINDER'
	| 'RESCHEDULE'
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
	messageType: NotificationMessageType;
	patient?: INotificationPatient | null;
	patientId?: string | null;
	payload?: Record<string, unknown> | null;
	sentAt: string;
	status: NotificationStatus;
}

export interface IGetNotificationsParams {
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
