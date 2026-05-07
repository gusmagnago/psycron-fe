export interface INotificationSettingsChannelForm {
	email: boolean;
	whatsapp: boolean;
}

export interface INotificationSettingsForm {
	appointmentConfirmation: INotificationSettingsChannelForm;
	appointmentUpdated: INotificationSettingsChannelForm;
	calendarInvite: { enabled: boolean };
	reminder: INotificationSettingsChannelForm & {
		enabled: boolean;
		leadTimeMinutes: number;
	};
}

export const REMINDER_LEAD_TIME_OPTIONS = [
	{ labelKey: 'notifications.settings.reminder.lead-time.30m', value: 30 },
	{ labelKey: 'notifications.settings.reminder.lead-time.1h', value: 60 },
	{ labelKey: 'notifications.settings.reminder.lead-time.2h', value: 120 },
	{ labelKey: 'notifications.settings.reminder.lead-time.24h', value: 1440 },
	{ labelKey: 'notifications.settings.reminder.lead-time.48h', value: 2880 },
] as const;

export const DEFAULT_NOTIFICATION_SETTINGS: INotificationSettingsForm = {
	appointmentConfirmation: { email: true, whatsapp: true },
	appointmentUpdated: { email: true, whatsapp: true },
	calendarInvite: { enabled: true },
	reminder: { email: true, enabled: true, leadTimeMinutes: 60, whatsapp: true },
};

export interface NotificationSettingsDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export type ChannelPath = 'appointmentConfirmation' | 'appointmentUpdated';

export type ChannelSectionConfig = {
	descKey: string;
	field: ChannelPath;
	titleKey: string;
};
