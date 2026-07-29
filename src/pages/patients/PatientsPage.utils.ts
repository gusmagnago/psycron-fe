import type {
	INotification,
	IPatient,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { isCanceledSlot } from '@psycron/utils/availability/availability.utils';
import { formatLocalizedDate } from '@psycron/utils/date/date.utils';
import {
	getPatientBillingViewModel,
	getPatientFullName,
	isPatientBillingConfigured,
} from '@psycron/utils/patient/patient.utils';
import { isPast } from 'date-fns';
import type { TFunction } from 'i18next';

import type {
	PatientListItem,
	PatientListSortDirection,
	PatientListSortField,
	PatientListSortOption,
	PatientNextAction,
	PatientNextSessionState,
	PatientSessionRow,
	PatientStats,
	PatientWorkspaceColumn,
	PatientWorkspaceColumnFilterOption,
	PatientWorkspaceRow,
} from './PatientsPage.types';

export const PATIENT_LIST_SORT_OPTIONS: PatientListSortOption[] = [
	{
		defaultDirection: 'asc',
		direction: 'asc',
		field: 'name',
		labelKey: 'patients.list.sort-name',
	},
	{
		defaultDirection: 'asc',
		direction: 'desc',
		field: 'name',
		labelKey: 'patients.list.sort-name-desc',
	},
	{
		defaultDirection: 'desc',
		direction: 'asc',
		field: 'last-appointment',
		labelKey: 'patients.list.sort-last-appointment-asc',
	},
	{
		defaultDirection: 'desc',
		direction: 'desc',
		field: 'last-appointment',
		labelKey: 'patients.list.sort-last-appointment',
	},
	{
		defaultDirection: 'desc',
		direction: 'asc',
		field: 'total-sessions',
		labelKey: 'patients.list.sort-total-sessions-asc',
	},
	{
		defaultDirection: 'desc',
		direction: 'desc',
		field: 'total-sessions',
		labelKey: 'patients.list.sort-total-sessions',
	},
];

export const encodePatientListSortValue = (
	field: PatientListSortField,
	direction: PatientListSortDirection
): string => `${field}-${direction}`;

export const decodePatientListSortValue = (
	value: string
): {
	direction: PatientListSortDirection;
	field: PatientListSortField;
} => {
	const option = PATIENT_LIST_SORT_OPTIONS.find(
		(item) => encodePatientListSortValue(item.field, item.direction) === value
	);

	return option
		? { direction: option.direction, field: option.field }
		: { direction: 'asc', field: 'name' };
};

export const getPatientListSortDefaultDirection = (
	field: PatientListSortField
): PatientListSortDirection =>
	PATIENT_LIST_SORT_OPTIONS.find((item) => item.field === field)
		?.defaultDirection ?? 'asc';

const getSessionStartDate = (date: string, startTime: string): Date =>
	new Date(`${String(date).slice(0, 10)}T${startTime}:00`);

export const getPatientSessions = (
	patient?: IPatient
): PatientSessionRow[] => {
	const includedSlotIds = new Set<string>();
	const sessionRows = (patient?.sessionDates ?? [])
		.flatMap((sessionDate) =>
			(sessionDate.slots ?? []).map((slot) => {
				includedSlotIds.add(slot._id);
				const startsAt = getSessionStartDate(
					sessionDate.date,
					slot.startTime
				);

				return {
					availabilityDayId: sessionDate._id,
					canceledAt: slot.canceledAt,
					customReason: slot.customReason,
					date: sessionDate.date,
					followedUpAt: slot.followedUpAt,
					followedUpBy: slot.followedUpBy,
					isCancelled: isCanceledSlot(slot),
					isPast: isPast(startsAt),
					reasonCode: slot.reasonCode,
					rebookedAppointmentId: slot.rebookedAppointmentId,
					recoveryStatus: slot.recoveryStatus,
					reopenedAt: slot.reopenedAt,
					slot,
					startsAt,
					triggeredBy: slot.triggeredBy,
				};
			})
		);
	const standaloneCancelledRows = (patient?.cancelledAppointments ?? [])
		.filter((appointment) => !includedSlotIds.has(appointment.slotId))
		.map((appointment) => {
			const startsAt = getSessionStartDate(
				appointment.date,
				appointment.startTime
			);

			return {
				canceledAt: appointment.cancelledAt,
				customReason: appointment.customReason,
				date: appointment.date,
				followedUpAt: appointment.followedUpAt,
				followedUpBy: appointment.followedUpBy,
				isCancelled: true,
				isPast: isPast(startsAt),
				reasonCode: appointment.reasonCode,
				rebookedAppointmentId: appointment.rebookedAppointmentId,
				recoveryStatus: appointment.recoveryStatus,
				reopenedAt: appointment.reopenedAt,
				slot: {
					_id: appointment.slotId,
					endTime: appointment.endTime,
					startTime: appointment.startTime,
				},
				startsAt,
				triggeredBy: appointment.triggeredBy,
			};
		});

	return [...sessionRows, ...standaloneCancelledRows].sort(
		(a, b) => a.startsAt.getTime() - b.startsAt.getTime()
	);
};

export const getPatientStats = (
	sessions: PatientSessionRow[]
): PatientStats => {
	const totalSessions = sessions.length;
	const cancelledSessions = sessions.filter(
		(session) => session.isCancelled
	).length;
	const upcomingSessions = sessions.filter(
		(session) => !session.isPast && !session.isCancelled
	).length;

	return {
		cancelledSessions,
		pastSessions: totalSessions - upcomingSessions - cancelledSessions,
		totalSessions,
		upcomingSessions,
	};
};

export const getPatientCancellationCount = (patient?: IPatient): number =>
	getPatientStats(getPatientSessions(patient)).cancelledSessions;

export const isPatientCancelledSessionResolved = (
	session: PatientSessionRow,
	sessions: PatientSessionRow[] = []
): boolean => {
	if (!session.isCancelled) return true;
	if (
		session.recoveryStatus === 'ARCHIVED' ||
		session.recoveryStatus === 'FOLLOWED_UP' ||
		session.recoveryStatus === 'REBOOKED' ||
		session.recoveryStatus === 'REOPENED'
	) {
		return true;
	}

	return Boolean(
		session.followedUpAt ||
			session.rebookedAppointmentId ||
			session.reopenedAt ||
			hasLaterActiveSession(session, sessions)
	);
};

const hasLaterActiveSession = (
	cancelledSession: PatientSessionRow,
	sessions: PatientSessionRow[]
): boolean =>
	sessions.some(
		(session) =>
			!session.isCancelled &&
			session.slot._id !== cancelledSession.slot._id &&
			session.startsAt.getTime() > cancelledSession.startsAt.getTime()
	);

export const getPatientUnresolvedCancellationCount = (
	patient?: IPatient
): number => {
	const sessions = getPatientSessions(patient);

	return sessions.filter(
		(session) =>
			session.isCancelled && !isPatientCancelledSessionResolved(session, sessions)
	).length;
};

export const getLastCompletedSession = (
	sessions: PatientSessionRow[]
): PatientSessionRow | undefined =>
	[...sessions]
		.reverse()
		.find((session) => session.isPast && !session.isCancelled);

export const getNextSession = (
	sessions: PatientSessionRow[]
): PatientSessionRow | undefined =>
	sessions.find((session) => !session.isPast && !session.isCancelled);

export const getSessionsAscending = (
	sessions: PatientSessionRow[]
): PatientSessionRow[] =>
	[...sessions].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

export const getSessionCancelledByLabelKey = (
	triggeredBy?: PatientSessionRow['triggeredBy']
): string => {
	if (triggeredBy === 'PATIENT') {
		return 'patients.profile.session-drawer.cancelled-by-patient';
	}

	if (triggeredBy === 'THERAPIST') {
		return 'patients.profile.session-drawer.cancelled-by-therapist';
	}

	return 'patients.profile.session-drawer.cancelled-by-unknown';
};

export const getSessionCancellationNotificationWasSent = (
	session: PatientSessionRow,
	notifications?: INotification[]
): boolean => {
	if (!notifications?.length) return false;

	const canceledAtTime = session.canceledAt
		? new Date(session.canceledAt).getTime()
		: null;

	return notifications.some((notification) => {
		const sentAtTime = new Date(notification.sentAt).getTime();
		const notificationText =
			`${notification.content} ${notification.messageType}`.toLowerCase();
		const isCancellationNotification =
			notificationText.includes('cancel') ||
			notificationText.includes('cancelad');

		if (!isCancellationNotification) return false;
		if (!canceledAtTime || Number.isNaN(canceledAtTime)) return true;
		if (Number.isNaN(sentAtTime)) return false;

		return sentAtTime >= canceledAtTime;
	});
};

export const getPreferredContactLabelKey = (type?: string): string => {
	switch (type) {
		case 'phone':
			return 'patients.profile.preferred-contact.phone';
		case 'whatsapp':
			return 'patients.profile.preferred-contact.whatsapp';
		case 'google_meet':
			return 'patients.profile.preferred-contact.google-meet';
		case 'zoom':
			return 'patients.profile.preferred-contact.zoom';
		default:
			return 'patients.profile.preferred-contact.not-set';
	}
};

export const mapPatientToListItem = (patient: IPatient): PatientListItem => {
	const sessions = getPatientSessions(patient);
	const stats = getPatientStats(sessions);
	const fullName = getPatientFullName(patient);
	const searchableText = [
		fullName,
		patient.contacts?.email,
		patient.contacts?.phone,
		patient.contacts?.whatsapp,
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return {
		...patient,
		fullName,
		cancelledSessions: stats.cancelledSessions,
		isActive: stats.upcomingSessions > 0,
		lastAppointmentDate:
			sessions.length > 0
				? sessions[sessions.length - 1].startsAt.toISOString()
				: null,
		preferredContactType: patient.preferredContact?.type,
		searchableText,
		totalSessions: stats.totalSessions,
		unresolvedCancelledSessions: getPatientUnresolvedCancellationCount(patient),
	};
};

const MINUTE_IN_MS = 60 * 1000;
const SESSION_DURATION_FALLBACK_IN_MS = 60 * MINUTE_IN_MS;

export const getPatientNextSessionState = (
	nextSessionDate: string | null,
	now: Date = new Date()
): PatientNextSessionState => {
	if (!nextSessionDate) return 'none';

	const startsAt = new Date(nextSessionDate).getTime();
	const difference = startsAt - now.getTime();

	if (difference <= 0 && difference > -SESSION_DURATION_FALLBACK_IN_MS) {
		return 'now';
	}

	if (difference > 0 && difference < 15 * MINUTE_IN_MS) return 'imminent';
	if (difference >= 15 * MINUTE_IN_MS && difference <= 120 * MINUTE_IN_MS) {
		return 'approaching';
	}

	return 'normal';
};

export const getPatientNextAction = ({
	billingConfigured,
	hasContact,
	hasFutureSession,
	isPossibleDuplicate,
	unresolvedCancelledSessions,
}: {
	billingConfigured: boolean;
	hasContact: boolean;
	hasFutureSession: boolean;
	isPossibleDuplicate: boolean;
	unresolvedCancelledSessions: number;
}): PatientNextAction => {
	if (isPossibleDuplicate) return 'review-duplicate';
	if (unresolvedCancelledSessions > 0) return 'send-follow-up';
	if (!hasContact && !billingConfigured) return 'add-contact-and-billing';
	if (!hasContact) return 'add-contact';
	if (!billingConfigured) return 'set-billing';
	if (!hasFutureSession) return 'review-scheduling';

	return 'ready';
};

export const mapPatientToWorkspaceRow = (
	patient: IPatient,
	options: {
		isPossibleDuplicate: boolean;
		now?: Date;
		uiRowKey: string;
	}
): PatientWorkspaceRow => {
	const listItem = mapPatientToListItem(patient);
	const nextSession = getNextSession(getPatientSessions(patient));
	const nextSessionDate = nextSession?.startsAt.toISOString() ?? null;
	const hasContact = Boolean(
		patient.contacts?.email ||
			patient.contacts?.phone ||
			patient.contacts?.whatsapp
	);
	const billingConfigured = isPatientBillingConfigured(patient.billing);

	return {
		...listItem,
		billingConfigured,
		hasContact,
		nextAction: getPatientNextAction({
			billingConfigured,
			hasContact,
			hasFutureSession: Boolean(nextSession),
			isPossibleDuplicate: options.isPossibleDuplicate,
			unresolvedCancelledSessions: listItem.unresolvedCancelledSessions,
		}),
		nextSessionDate,
		nextSessionState: getPatientNextSessionState(
			nextSessionDate,
			options.now
		),
		uiRowKey: options.uiRowKey,
	};
};

export const sortPatientListItems = (
	items: PatientListItem[],
	sortField: PatientListSortField,
	sortDirection: PatientListSortDirection
): PatientListItem[] => {
	const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

	return [...items].sort((a, b) => {
		switch (sortField) {
			case 'last-appointment': {
				if (!a.lastAppointmentDate && !b.lastAppointmentDate) return 0;
				if (!a.lastAppointmentDate) return 1;
				if (!b.lastAppointmentDate) return -1;
				return (
					(new Date(a.lastAppointmentDate).getTime() -
						new Date(b.lastAppointmentDate).getTime()) *
					directionMultiplier
				);
			}
			case 'total-sessions':
				return (a.totalSessions - b.totalSessions) * directionMultiplier;
			case 'name':
			default:
				return (
					a.fullName.localeCompare(b.fullName, undefined, {
						sensitivity: 'base',
					}) * directionMultiplier
				);
		}
	});
};

/**
 * Display label + comparable value for a workspace column. Used by the column
 * filter dropdown and by client-side sorting/filtering of the loaded rows.
 */
export const getPatientColumnFilterOption = (
	patient: PatientWorkspaceRow,
	column: PatientWorkspaceColumn,
	language: string,
	t: TFunction
): PatientWorkspaceColumnFilterOption => {
	switch (column) {
		case 'billing': {
			const billing = getPatientBillingViewModel(patient.billing, language, t);
			const label = [billing.summaryPrimary, billing.summarySecondary]
				.filter(Boolean)
				.join(' ');
			return { label, value: label.toLocaleLowerCase(language) };
		}
		case 'contact': {
			const contact =
				patient.contacts?.phone ||
				patient.contacts?.email ||
				patient.contacts?.whatsapp ||
				t('patients.list.contact-missing');
			return { label: contact, value: contact.toLocaleLowerCase(language) };
		}
		case 'next-action':
			return {
				label: t(`patients.list.next-actions.${patient.nextAction}`),
				value: patient.nextAction,
			};
		case 'next-session': {
			const label = patient.nextSessionDate
				? formatLocalizedDate(
						patient.nextSessionDate,
						t('patients.list.next-session.none'),
						language,
						'PPp'
					)
				: t('patients.list.next-session.none');
			return { label, value: patient.nextSessionDate ?? 'none' };
		}
		case 'sessions':
			return {
				label: String(patient.totalSessions),
				value: String(patient.totalSessions),
			};
		case 'patient':
		default:
			return {
				label: patient.fullName,
				value: patient.fullName.toLocaleLowerCase(language),
			};
	}
};

/** Comparable value for client-side column sorting (numeric where possible). */
export const getPatientColumnSortValue = (
	patient: PatientWorkspaceRow,
	column: PatientWorkspaceColumn,
	language: string,
	t: TFunction
): number | string => {
	if (column === 'sessions') return patient.totalSessions;
	if (column === 'next-session') {
		return patient.nextSessionDate
			? new Date(patient.nextSessionDate).getTime()
			: Number.MAX_SAFE_INTEGER;
	}
	return getPatientColumnFilterOption(patient, column, language, t).label;
};
