import type {
	INotification,
	IPatient,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { isCanceledSlot } from '@psycron/utils/availability/availability.utils';
import { getPatientFullName } from '@psycron/utils/patient/patient.utils';
import { isPast } from 'date-fns';

import type {
	PatientListItem,
	PatientListSortDirection,
	PatientListSortField,
	PatientListSortOption,
	PatientSessionRow,
	PatientStats,
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
					isCancelled: isCanceledSlot(slot),
					isPast: isPast(startsAt),
					reasonCode: slot.reasonCode,
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
				isCancelled: true,
				isPast: isPast(startsAt),
				reasonCode: appointment.reasonCode,
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

export const getRecentSessions = (
	sessions: PatientSessionRow[],
	limit = 6
): PatientSessionRow[] =>
	[...sessions]
		.sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime())
		.slice(0, limit);

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
