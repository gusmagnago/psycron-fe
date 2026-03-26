import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';

export type DrawerKey =
	| 'buffer-time'
	| 'google-calendar'
	| 'session-duration'
	| 'session-type'
	| 'timezone'
	| 'working-hours'
	| null;

export interface ChecklistItem {
	descKey: string;
	id: string;
	isConfigured: boolean;
	isDisabled: boolean;
	isRecommended: boolean;
	onConfigure?: () => void;
	titleKey: string;
}

export type ConfigResolver = (availability: IAvailabilityRecord) => boolean;

export interface ChecklistConfig {
	configuredBy: ConfigResolver;
	descKey: string;
	disabled?: boolean;
	id: string;
	isRecommended: boolean;
	onConfigureDrawer?: DrawerKey;
	titleKey: string;
}

export interface UseAvailabilitySettingsReturn {
	activeDrawer: DrawerKey;
	availability: IAvailabilityRecord | null | undefined;
	bannerDismissed: boolean;
	bufferInput: string;
	checklistItems: ChecklistItem[];
	closeDrawer: () => void;
	configuredCount: number;
	endTimeInput: string;
	firstMissingRecommended: ChecklistItem | undefined;
	handleBufferSave: () => void;
	handleGoogleCalendarConnect: () => void;
	handleJupiterCta: () => void;
	handleSessionDurationSave: () => void;
	handleSessionTypeSave: () => void;
	handleTimezoneSave: () => void;
	handleWorkingHoursSave: () => void;
	isLoading: boolean;
	isSaving: boolean;
	openDrawer: (key: DrawerKey) => void;
	progress: number;
	renderActionLabel: (item: ChecklistItem) => string;
	sessionDurationInput: string;
	sessionTypeInput: string;
	setBannerDismissed: (dismissed: boolean) => void;
	setBufferInput: (value: string) => void;
	setEndTimeInput: (value: string) => void;
	setSessionDurationInput: (value: string) => void;
	setSessionTypeInput: (value: string) => void;
	setStartTimeInput: (value: string) => void;
	setTimezoneInput: (value: string) => void;
	startTimeInput: string;
	timezoneInput: string;
	toggleWorkingDay: (day: string) => void;
	workingDaysInput: string[];
}
