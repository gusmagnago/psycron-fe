import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import type { TFunction } from 'i18next';

export type CancellationRecoveryPeriodFilter = 'all' | 'past' | 'upcoming';
export type CancellationRecoveryWhoCancelledFilter =
	| 'all'
	| 'patient'
	| 'therapist'
	| 'unknown';
export type CancellationRecoveryDeliveryModeFilter =
	| 'all'
	| 'in-person'
	| 'online'
	| 'unknown';
export type CancellationRecoveryState =
	| 'pending_follow_up'
	| 'overdue'
	| 'followed_up'
	| 'reopened'
	| 'rebooked'
	| 'archived';
export type CancellationRecoveryDrawerMode = 'details' | 'reschedule';

export interface CancellationRecoveryRow {
	availabilityDayId?: string;
	canceledAt?: string | null;
	cancelledPatientId?: string | null;
	cancelledPatientName?: string | null;
	customReason?: string | null;
	date: string;
	deliveryMode?: 'in-person' | 'online' | null;
	endTime: string;
	followedUpAt?: string | null;
	followedUpBy?: string | null;
	patientId?: string | null;
	patientName: string;
	reasonCode?: number | null;
	rebookedAppointmentId?: string | null;
	recoveryState: CancellationRecoveryState;
	recoveryStatus?:
		| 'PENDING_FOLLOW_UP'
		| 'FOLLOWED_UP'
		| 'REOPENED'
		| 'REBOOKED'
		| 'ARCHIVED'
		| null;
	reopenedAt?: string | null;
	slotId: string;
	slotStatus: string;
	startTime: string;
	triggeredBy?: 'PATIENT' | 'THERAPIST' | null;
}

export interface CancellationRecoveryFilters {
	cancelledBy: CancellationRecoveryWhoCancelledFilter;
	deliveryMode: CancellationRecoveryDeliveryModeFilter;
	patientQuery: string;
	period: CancellationRecoveryPeriodFilter;
	reasonCode: string;
}

export interface CancellationReasonOption {
	labelKey: string;
	value: string;
}

export interface CancellationRecoveryStats {
	archived: number;
	followedUp: number;
	overdue: number;
	pendingFollowUp: number;
	rebooked: number;
	reopened: number;
	total: number;
}

export interface CancellationRecoveryBuildRowsInput {
	dates?: IAvailabilityDateRef[];
}

export interface CancellationRecoveryFilterControls {
	activeFilterCount: number;
	filters: CancellationRecoveryFilters;
	reasonOptions: CancellationReasonOption[];
	setCancelledBy: (cancelledBy: CancellationRecoveryWhoCancelledFilter) => void;
	setDeliveryMode: (
		deliveryMode: CancellationRecoveryDeliveryModeFilter
	) => void;
	setPatientQuery: (patientQuery: string) => void;
	setPeriod: (period: CancellationRecoveryPeriodFilter) => void;
	setReasonCode: (reasonCode: string) => void;
}

export interface CancellationRecoveryFiltersProps {
	controls: CancellationRecoveryFilterControls;
}

export interface CancellationRecoveryFiltersDrawerProps {
	controls: CancellationRecoveryFilterControls;
	isOpen: boolean;
	onClose: () => void;
}

export interface CancellationRecoverySidebarProps {
	activeFilterCount: number;
	isFiltersDrawerOpen: boolean;
	onOpenFilters: () => void;
	onSelectRow: (slotId: string) => void;
	rows: CancellationRecoveryRow[];
	selectedSlotId: string | null;
	stats: CancellationRecoveryStats;
}

export interface CancellationRecoveryDetailPanelProps {
	isReopening: boolean;
	onOpenPatient: (patientId: string) => void;
	onRebook: (patientId: string, slotId: string) => void;
	onReopen: (row: CancellationRecoveryRow) => void;
	row: CancellationRecoveryRow | null;
}

export interface UseCancellationRecoveryFiltersResult
	extends CancellationRecoveryFilterControls {}

export interface UseCancellationRecoveryPageStateParams {
	t: TFunction;
}
