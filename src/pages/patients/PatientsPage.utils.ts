import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { isCanceledSlot } from '@psycron/utils/availability/availability.utils';
import { getPatientFullName } from '@psycron/utils/patient/patient.utils';
import { isPast } from 'date-fns';

import type {
	PatientListItem,
	PatientListSort,
	PatientSessionRow,
	PatientStats,
} from './PatientsPage.types';

const getSessionStartDate = (date: string, startTime: string): Date =>
	new Date(`${String(date).slice(0, 10)}T${startTime}:00`);

export const getPatientSessions = (
	patient?: IPatient
): PatientSessionRow[] =>
	(patient?.sessionDates ?? [])
		.flatMap((sessionDate) =>
			(sessionDate.slots ?? []).map((slot) => {
				const startsAt = getSessionStartDate(
					sessionDate.date,
					slot.startTime
				);

				return {
					date: sessionDate.date,
					isCancelled: isCanceledSlot(slot),
					isPast: isPast(startsAt),
					slot,
					startsAt,
				};
			})
		)
		.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

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
	sortBy: PatientListSort
): PatientListItem[] => {
	switch (sortBy) {
		case 'last-appointment-desc':
			return [...items].sort((a, b) => {
				if (!a.lastAppointmentDate && !b.lastAppointmentDate) return 0;
				if (!a.lastAppointmentDate) return 1;
				if (!b.lastAppointmentDate) return -1;
				return (
					new Date(b.lastAppointmentDate).getTime() -
					new Date(a.lastAppointmentDate).getTime()
				);
			});
		case 'total-sessions-desc':
			return [...items].sort((a, b) => b.totalSessions - a.totalSessions);
		case 'name-asc':
		default:
			return [...items].sort((a, b) => a.fullName.localeCompare(b.fullName));
	}
};
