import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import {
	capitalizeDateLabel,
	getDateLocale,
} from '@psycron/utils/date/date.utils';
import { format, isPast, parseISO } from 'date-fns';

import type {
	CancellationReasonOption,
	CancellationRecoveryBuildRowsInput,
	CancellationRecoveryFilters,
	CancellationRecoveryRow,
	CancellationRecoveryState,
} from './CancellationRecoveryPage.types';

const getRecoveryState = (
	slot: IAvailabilityDateRef['slots'][number],
	date: string
): CancellationRecoveryState => {
	if (slot.recoveryStatus === 'FOLLOWED_UP') return 'followed_up';
	if (slot.recoveryStatus === 'REBOOKED') return 'rebooked';
	if (slot.recoveryStatus === 'ARCHIVED') return 'archived';
	if (slot.recoveryStatus === 'REOPENED' || slot.reopenedAt) return 'reopened';
	const slotDateTime = new Date(`${date.slice(0, 10)}T${slot.startTime}:00`);
	if (isPast(slotDateTime)) return 'overdue';
	return 'pending_follow_up';
};

const getPatientName = (slot: IAvailabilityDateRef['slots'][number]): string =>
	slot.patientSummary?.fullName || slot.cancelledPatientName || '';

const getPatientDetails = (slot: IAvailabilityDateRef['slots'][number]) => {
	if (slot?.patientSummary) {
		return {
			patientId: slot?.patientSummary?._id,
			patientFullName: slot?.patientSummary?.fullName,
		};
	} else if (slot?.cancelledPatientId && slot?.cancelledPatientName) {
		return {
			patientId: slot?.cancelledPatientId,
			patientFullName: slot?.cancelledPatientName,
		};
	} else {
		return {
			patientId: null,
			patientFullName: '',
		};
	}
};

const getSlotStartDateTime = (
	row: Pick<CancellationRecoveryRow, 'date' | 'startTime'>
) => new Date(`${row.date.slice(0, 10)}T${row.startTime}:00`);

export const buildCancellationRecoveryRows = ({
	dates,
}: CancellationRecoveryBuildRowsInput): CancellationRecoveryRow[] =>
	(dates ?? [])
		.flatMap((date) =>
			(date.slots ?? [])
				.filter((slot) => slot.canceledAt)
				.map((slot) => {
					const patientDetails = getPatientDetails(slot);

					return {
						availabilityDayId: date.dateId,
						canceledAt: slot.canceledAt,
						cancelledPatientId: slot.cancelledPatientId ?? null,
						cancelledPatientName: slot.cancelledPatientName,
						customReason: slot.customReason,
						date: date.date,
						deliveryMode: slot.deliveryMode ?? null,
						endTime: slot.endTime,
						followedUpAt: slot.followedUpAt ?? null,
						followedUpBy: slot.followedUpBy ?? null,
						patientId: patientDetails?.patientId ?? null,
						patientName: patientDetails.patientFullName || getPatientName(slot),
						reasonCode: slot.reasonCode ?? null,
						rebookedAppointmentId: slot.rebookedAppointmentId ?? null,
						recoveryState: getRecoveryState(slot, date.date),
						recoveryStatus: slot.recoveryStatus ?? null,
						reopenedAt: slot.reopenedAt ?? null,
						slotId: slot._id,
						slotStatus: slot.status,
						startTime: slot.startTime,
						triggeredBy: slot.triggeredBy ?? null,
					};
				})
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
			(filters.cancelledBy === 'therapist' &&
				row.triggeredBy === 'THERAPIST') ||
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
	const uniqueReasonCodes = [
		...new Set(rows.map((row) => row.reasonCode).filter(Boolean)),
	]
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
		: state === 'followed_up'
			? 'availability.cancellation-recovery.state.followed-up'
			: state === 'rebooked'
				? 'availability.cancellation-recovery.state.rebooked'
				: state === 'archived'
					? 'availability.cancellation-recovery.state.archived'
					: state === 'overdue'
						? 'availability.cancellation-recovery.state.overdue'
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
	archived: rows.filter((row) => row.recoveryState === 'archived').length,
	followedUp: rows.filter((row) => row.recoveryState === 'followed_up').length,
	overdue: rows.filter((row) => row.recoveryState === 'overdue').length,
	pendingFollowUp: rows.filter(
		(row) => row.recoveryState === 'pending_follow_up'
	).length,
	rebooked: rows.filter((row) => row.recoveryState === 'rebooked').length,
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
	row.slotStatus === 'CANCELED' &&
	!isPast(getSlotStartDateTime(row));

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

export const formatRecoveryDateTime = (
	row: CancellationRecoveryRow,
	language: string
) =>
	`${capitalizeDateLabel(
		format(parseISO(row.date), 'EEEE, MMM d', {
			locale: getDateLocale(language),
		})
	)} · ${row.startTime} - ${row.endTime}`;
