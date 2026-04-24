import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';

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
export type CancellationRecoveryState = 'pending_follow_up' | 'reopened';
export type CancellationRecoveryDrawerMode = 'details' | 'reschedule';

export interface CancellationRecoveryRow {
	availabilityDayId?: string;
	canceledAt?: string | null;
	cancelledPatientName?: string | null;
	customReason?: string | null;
	date: string;
	deliveryMode?: 'in-person' | 'online' | null;
	endTime: string;
	patientId?: string | null;
	patientName: string;
	reasonCode?: number | null;
	recoveryState: CancellationRecoveryState;
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

export interface CancellationRecoveryBuildRowsInput {
	dates?: IAvailabilityDateRef[];
}
