import { getDateLocale } from '@psycron/utils/date/date.utils';
import { format, isAfter, isSameDay, parseISO } from 'date-fns';
import type { TFunction } from 'i18next';

import type { PatientSessionRow } from '../../PatientsPage.types';

import type {
	SessionDrawerRescheduleGroup,
	SessionDrawerRescheduleSlot,
} from './SessionDrawer.types';

export const THERAPIST_CANCEL_REASONS = [
	{ label: 'globals.cancellation-reason.2', value: 2 },
	{ label: 'globals.cancellation-reason.5', value: 5 },
	{ label: 'globals.cancellation-reason.1', value: 1 },
	{ label: 'globals.cancellation-reason.7', value: 7 },
] as const;

export const getSessionDrawerAccentColor = (
	session: PatientSessionRow
): string => {
	if (session.isCancelled) return '#E05B5B';
	if (session.isPast) return '#94A3B8';

	return '#2F9E44';
};

export const getSessionDrawerTitleKey = (
	session: PatientSessionRow
): string => {
	if (session.isCancelled)
		return 'patients.profile.session-drawer.cancelled-title';
	if (session.isPast)
		return 'patients.profile.session-drawer.completed-title';

	return 'patients.profile.session-drawer.upcoming-title';
};

export const getSessionDrawerStatusKey = (
	session: PatientSessionRow
): string => {
	if (session.isCancelled) return 'patients.profile.sessions.cancelled';
	if (session.isPast) return 'patients.profile.sessions.completed';

	return 'patients.profile.sessions.upcoming';
};

export const getSessionRecoveryStatusLabelKey = (
	recoveryStatus?: PatientSessionRow['recoveryStatus']
): string | null => {
	if (recoveryStatus === 'ARCHIVED') {
		return 'availability.cancellation-recovery.state.archived';
	}

	if (recoveryStatus === 'FOLLOWED_UP') {
		return 'availability.cancellation-recovery.state.followed-up';
	}

	if (recoveryStatus === 'REBOOKED') {
		return 'availability.cancellation-recovery.state.rebooked';
	}

	if (recoveryStatus === 'REOPENED') {
		return 'availability.cancellation-recovery.state.reopened';
	}

	if (recoveryStatus === 'PENDING_FOLLOW_UP') {
		return 'availability.cancellation-recovery.state.pending-follow-up';
	}

	return null;
};

export const getSessionDrawerRescheduleGroups = ({
	availabilityDates,
	language,
	sessionSlotId,
}: {
	availabilityDates?: Array<{
		date: string;
		dateId: string | number;
		slots?: Array<{
			_id: string;
			endTime: string;
			startTime: string;
			status: string;
		}>;
	}>;
	language: string;
	sessionSlotId: string;
}): SessionDrawerRescheduleGroup[] => {
	const today = new Date();

	return (availabilityDates ?? [])
		.map((dateRef) => {
			const dayDate = parseISO(dateRef.date);
			const slots = (dateRef.slots ?? [])
				.filter((slot) => slot.status === 'AVAILABLE')
				.filter((slot) => slot._id !== sessionSlotId)
				.filter((slot) => {
					if (isAfter(dayDate, today)) return true;
					if (!isSameDay(dayDate, today)) return false;

					return slot.startTime > format(today, 'HH:mm');
				})
				.map(
					(slot): SessionDrawerRescheduleSlot => ({
						availabilityDayId: String(dateRef.dateId),
						date: dateRef.date,
						endTime: slot.endTime,
						slotId: slot._id,
						startTime: slot.startTime,
					})
				);

			return {
				date: dateRef.date,
				formattedDate: format(dayDate, 'EEEE, MMM d', {
					locale: getDateLocale(language),
				}),
				slots,
			};
		})
		.filter((group) => group.slots.length > 0)
		.slice(0, 8);
};

export const getSessionDrawerMutationErrorKey = ({
	error,
	isCancelled,
}: {
	error: unknown;
	isCancelled: boolean;
}): string => {
	const isNoChange = error instanceof Error && error.message === 'no-change';
	const isMissingSlot = error instanceof Error && error.message === 'missing-slot';

	if (isMissingSlot) return 'patients.profile.session-drawer.reschedule-prompt';
	if (isNoChange) return 'patients.profile.session-drawer.update-no-change';

	return isCancelled
		? 'patients.profile.session-drawer.reschedule-error'
		: 'patients.profile.session-drawer.update-error';
};

export const getSessionDrawerMutationSeverity = (error: unknown) =>
	error instanceof Error &&
	(error.message === 'no-change' || error.message === 'missing-slot')
		? 'info'
		: 'error';

export const getSessionCancellationReasonLabel = ({
	customReason,
	fallback,
	reasonCode,
	t,
}: {
	customReason?: string | null;
	fallback: string;
	reasonCode?: number | null;
	t: TFunction;
}): string => {
	if (reasonCode == null) return fallback;

	const reason = t(`globals.cancellation-reason.${reasonCode}`);
	const shouldShowCustom =
		(reasonCode === 6 || reasonCode === 7) && customReason;

	return shouldShowCustom ? `${reason} - ${customReason}` : reason;
};
