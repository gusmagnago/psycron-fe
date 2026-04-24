import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import { format, isPast } from 'date-fns';

import type {
	CancellationReasonOption,
	CancellationRecoveryBuildRowsInput,
	CancellationRecoveryFilters,
	CancellationRecoveryRow,
	CancellationRecoveryState,
} from './CancellationRecoveryPage.types';

const getRecoveryState = (
	slot: IAvailabilityDateRef['slots'][number]
): CancellationRecoveryState =>
	slot.reopenedAt ? 'reopened' : 'pending_follow_up';

const getPatientName = (slot: IAvailabilityDateRef['slots'][number]): string =>
	slot.patientSummary?.fullName ||
	slot.cancelledPatientName ||
	'';

const getSlotStartDateTime = (row: Pick<CancellationRecoveryRow, 'date' | 'startTime'>) =>
	new Date(`${row.date.slice(0, 10)}T${row.startTime}:00`);

export const buildCancellationRecoveryRows = ({
	dates,
}: CancellationRecoveryBuildRowsInput): CancellationRecoveryRow[] =>
	(dates ?? [])
		.flatMap((date) =>
			(date.slots ?? [])
				.filter((slot) => slot.canceledAt)
				.map((slot) => ({
					availabilityDayId: date.dateId,
					canceledAt: slot.canceledAt,
					cancelledPatientName: slot.cancelledPatientName,
					customReason: slot.customReason,
					date: date.date,
					deliveryMode: slot.deliveryMode ?? null,
					endTime: slot.endTime,
					patientId: slot.patientId ?? null,
					patientName: getPatientName(slot),
					reasonCode: slot.reasonCode ?? null,
					recoveryState: getRecoveryState(slot),
					reopenedAt: slot.reopenedAt ?? null,
					slotId: slot._id,
					slotStatus: slot.status,
					startTime: slot.startTime,
					triggeredBy: slot.triggeredBy ?? null,
				}))
		)
		.sort((a, b) => {
			const aTime = a.canceledAt
				? new Date(a.canceledAt).getTime()
				: getSlotStartDateTime(a).getTime();
			const bTime = b.canceledAt
				? new Date(b.canceledAt).getTime()
				: getSlotStartDateTime(b).getTime();

			return bTime - aTime;
		});

export const filterCancellationRecoveryRows = (
	rows: CancellationRecoveryRow[],
	filters: CancellationRecoveryFilters
): CancellationRecoveryRow[] =>
	rows.filter((row) => {
		const patientQuery = filters.patientQuery.trim().toLowerCase();
		const patientName = row.patientName.toLowerCase();
		const matchesPatient = !patientQuery || patientName.includes(patientQuery);
		const matchesReason =
			filters.reasonCode === 'all' ||
			String(row.reasonCode ?? 'unknown') === filters.reasonCode;
		const matchesWhoCancelled =
			filters.cancelledBy === 'all' ||
			(filters.cancelledBy === 'patient' && row.triggeredBy === 'PATIENT') ||
			(filters.cancelledBy === 'therapist' && row.triggeredBy === 'THERAPIST') ||
			(filters.cancelledBy === 'unknown' && !row.triggeredBy);
		const deliveryMode = row.deliveryMode ?? 'unknown';
		const matchesDelivery =
			filters.deliveryMode === 'all' || filters.deliveryMode === deliveryMode;
		const slotDateTime = getSlotStartDateTime(row);
		const matchesPeriod =
			filters.period === 'all' ||
			(filters.period === 'past' && isPast(slotDateTime)) ||
			(filters.period === 'upcoming' && !isPast(slotDateTime));

		return (
			matchesPatient &&
			matchesReason &&
			matchesWhoCancelled &&
			matchesDelivery &&
			matchesPeriod
		);
	});

export const getCancellationReasonOptions = (
	rows: CancellationRecoveryRow[]
): CancellationReasonOption[] => {
	const uniqueReasonCodes = [...new Set(rows.map((row) => row.reasonCode).filter(Boolean))]
		.map((reasonCode) => Number(reasonCode))
		.sort((a, b) => a - b);

	return uniqueReasonCodes.map((reasonCode) => ({
		labelKey: `globals.cancellation-reason.${reasonCode}`,
		value: String(reasonCode),
	}));
};

export const getRecoveryStateLabelKey = (
	state: CancellationRecoveryState
): string =>
	state === 'reopened'
		? 'availability.cancellation-recovery.state.reopened'
		: 'availability.cancellation-recovery.state.pending-follow-up';

export const getCancelledByLabelKey = (
	triggeredBy?: CancellationRecoveryRow['triggeredBy']
): string => {
	if (triggeredBy === 'PATIENT') {
		return 'availability.cancellation-recovery.cancelled-by.patient';
	}

	if (triggeredBy === 'THERAPIST') {
		return 'availability.cancellation-recovery.cancelled-by.therapist';
	}

	return 'availability.cancellation-recovery.cancelled-by.unknown';
};

export const getDeliveryModeLabelKey = (
	deliveryMode?: CancellationRecoveryRow['deliveryMode']
): string => {
	if (deliveryMode === 'online') {
		return 'availability.cancellation-recovery.delivery.online';
	}

	if (deliveryMode === 'in-person') {
		return 'availability.cancellation-recovery.delivery.in-person';
	}

	return 'availability.cancellation-recovery.delivery.unknown';
};

export const getRecoveryRowTitle = (row: CancellationRecoveryRow): string =>
	row.patientName || row.cancelledPatientName || row.slotId;

export const getRecoveryStats = (rows: CancellationRecoveryRow[]) => ({
	pendingFollowUp: rows.filter((row) => row.recoveryState === 'pending_follow_up')
		.length,
	reopened: rows.filter((row) => row.recoveryState === 'reopened').length,
	total: rows.length,
});

export const findRecoveryRowBySlotId = (
	rows: CancellationRecoveryRow[],
	slotId?: string | null
): CancellationRecoveryRow | null => {
	if (!slotId) return null;

	return rows.find((row) => row.slotId === slotId) ?? null;
};

export const isReopenAvailable = (row: CancellationRecoveryRow): boolean =>
	row.recoveryState === 'pending_follow_up' &&
	Boolean(row.availabilityDayId) &&
	row.slotStatus === 'CANCELED';

export const formatRecoverySearchRange = (baseDate: Date) => ({
	from: format(
		new Date(baseDate.getFullYear(), baseDate.getMonth() - 6, 1),
		'yyyy-MM-dd'
	),
	to: format(
		new Date(baseDate.getFullYear(), baseDate.getMonth() + 4, 0),
		'yyyy-MM-dd'
	),
});
