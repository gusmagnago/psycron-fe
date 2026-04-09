import type { UseFormReturn } from 'react-hook-form';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import type { IBufferTimeAdviceRequest } from '@psycron/api/jupiter';
import type { IClinicAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type { IBufferTimeInsights } from '../components/buffer-time-editor/BufferTimeEditor.types';

export type DrawerKey =
	| 'buffer-time'
	| 'google-calendar'
	| 'recurrence-pattern'
	| 'session-address'
	| 'session-duration'
	| 'session-type'
	| 'specialty'
	| 'timezone'
	| 'working-hours'
	| null;

export interface AddressFormValues {
	clinicAddress: IClinicAddress;
}

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

export interface AvailabilityStatusStats {
	activeHoursPerWeek: number;
	percentBooked: number;
	upcomingBookings: number;
}

export interface UseAvailabilitySettingsReturn {
	activeCount: number;
	activeDrawer: DrawerKey;
	addressFormMethods: UseFormReturn<AddressFormValues>;
	availability: IAvailabilityRecord | null | undefined;
	bannerDismissed: boolean;
	bufferAdviceRequest: IBufferTimeAdviceRequest | null;
	bufferInput: string;
	bufferInsights: IBufferTimeInsights;
	cancelTimezoneWarning: () => void;
	checklistItems: ChecklistItem[];
	closeDrawer: () => void;
	configuredCount: number;
	confirmTimezoneSave: () => void;
	endTimeInput: string;
	firstMissingRecommended: ChecklistItem | undefined;
	handleAddressSave: () => void;
	handleBufferSave: () => void;
	handleGoogleCalendarConnect: () => void;
	handleJupiterCta: () => void;
	handleRecurrencePatternSave: () => void;
	handleSessionDurationSave: () => void;
	handleSessionTypeSave: () => void;
	handleSpecialtySave: () => void;
	handleTimezoneSave: () => void;
	handleWorkingHoursSave: () => void;
	isAddressSaving: boolean;
	isConnecting: boolean;
	isJupiterCtaEnabled: boolean;
	isLoading: boolean;
	isSaving: boolean;
	openDrawer: (key: DrawerKey) => void;
	progress: number;
	recurrencePatternInput: string;
	renderActionLabel: (item: ChecklistItem) => string;
	sessionDurationInput: string;
	sessionTypeInput: string;
	setBannerDismissed: (dismissed: boolean) => void;
	setBufferInput: (value: string) => void;
	setEndTimeInput: (value: string) => void;
	setRecurrencePatternInput: (value: string) => void;
	setSessionDurationInput: (value: string) => void;
	setSessionTypeInput: (value: string) => void;
	setSpecialtyDetailInput: (value: string) => void;
	setSpecialtyInput: (value: string) => void;
	setStartTimeInput: (value: string) => void;
	setTimezoneInput: (value: string) => void;
	showTimezoneWarning: boolean;
	specialtyDetailInput: string;
	startTimeInput: string;
	statusStats: AvailabilityStatusStats;
	timezoneInput: string;
	toggleWorkingDay: (day: string) => void;
	workingDaysInput: string[];
}
