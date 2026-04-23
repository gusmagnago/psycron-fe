import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { capitalizeDateLabel } from '@psycron/utils/date/date.utils';
import { format, isPast, parseISO, startOfDay } from 'date-fns';

import { buildPublicSlotsByDay } from '../../booking/BookAppointment.utils';

import type {
	NextAppointmentsMonthGroup,
	PublicPatientAgenda,
	SessionRow,
} from './AppointmentsList.types';

export const buildSessionRows = (patient?: PublicPatientAgenda): SessionRow[] => {
	const cancelledBySlotId = new Map(
		(patient?.cancelledAppointments ?? []).map((item) => [item.slotId, item])
	);
	const includedSlotIds = new Set<string>();

	const sessionRows = (patient?.sessionDates ?? []).flatMap((group) =>
		group.slots.map((slot) => {
			includedSlotIds.add(slot._id);
			const sessionDate = format(parseISO(group.date), 'yyyy-MM-dd');
			const cancelled = cancelledBySlotId.get(slot._id);
			const endDateTime = parseISO(`${sessionDate}T${slot.endTime}:00`);
			const slotIsPast = isPast(endDateTime);
			const isCancelled =
				slot.status === StatusEnum.CANCELED ||
				slot.status?.toLowerCase() === 'canceled' ||
				slot.status?.toLowerCase() === 'cancelled' ||
				Boolean(cancelled);

			return {
				canceledAt: cancelled?.cancelledAt ?? slot.canceledAt,
				customReason: cancelled?.customReason,
				date: sessionDate,
				dateId: group._id,
				endDateTime,
				isPast: slotIsPast,
				reasonCode: cancelled?.reasonCode,
				slot,
				status: isCancelled ? 'cancelled' : slotIsPast ? 'past' : 'booked',
				therapistId: patient?.therapistId ?? '',
				triggeredBy: cancelled?.triggeredBy,
			};
		})
	);

	const standaloneCancelledRows = (patient?.cancelledAppointments ?? [])
		.filter((appointment) => !includedSlotIds.has(appointment.slotId))
		.map((appointment) => {
			const sessionDate = format(parseISO(appointment.date), 'yyyy-MM-dd');

			return {
				canceledAt: appointment.cancelledAt,
				customReason: appointment.customReason,
				date: sessionDate,
				dateId: appointment.slotId,
				endDateTime: parseISO(`${sessionDate}T${appointment.endTime}:00`),
				isPast: true,
				reasonCode: appointment.reasonCode,
				slot: {
					_id: appointment.slotId,
					endTime: appointment.endTime,
					startTime: appointment.startTime,
					status: StatusEnum.CANCELED,
				},
				status: 'cancelled' as const,
				therapistId: patient?.therapistId ?? '',
				triggeredBy: appointment.triggeredBy,
			};
		});

	return [...sessionRows, ...standaloneCancelledRows];
};

export const groupSessionsByDay = (sessions: SessionRow[]) => {
	const grouped = new Map<string, SessionRow[]>();

	for (const session of sessions) {
		grouped.set(session.date, [...(grouped.get(session.date) ?? []), session]);
	}

	return grouped;
};

export const getAppointmentDates = (appointmentsByDay: Map<string, SessionRow[]>) =>
	Array.from(appointmentsByDay.keys())
		.map((day) => parseISO(day))
		.sort((a, b) => a.getTime() - b.getTime());

export const getNextUpcomingAppointments = (
	sessions: SessionRow[],
	today: Date
) =>
	sessions
		.filter(
			(session) =>
				session.status === 'booked' &&
				startOfDay(parseISO(session.date)).getTime() >= startOfDay(today).getTime()
		)
		.sort(
			(a, b) =>
				new Date(`${a.date}T${a.slot.startTime}:00`).getTime() -
				new Date(`${b.date}T${b.slot.startTime}:00`).getTime()
		);

export const groupNextAppointmentsByMonth = ({
	appointments,
	dateLocale,
}: {
	appointments: SessionRow[];
	dateLocale: Locale;
}): NextAppointmentsMonthGroup[] => {
	const groups = new Map<string, SessionRow[]>();

	for (const appointment of appointments) {
		const monthKey = format(parseISO(appointment.date), 'yyyy-MM');
		groups.set(monthKey, [...(groups.get(monthKey) ?? []), appointment]);
	}

	return Array.from(groups.entries()).map(([monthKey, monthAppointments]) => ({
		appointments: monthAppointments,
		monthKey,
		title: capitalizeDateLabel(
			format(parseISO(`${monthKey}-01`), 'MMMM yyyy', {
				locale: dateLocale,
			})
		),
	}));
};

export const getSessionCounts = (sessions: SessionRow[]) => ({
	cancelledCount: sessions.filter((session) => session.status === 'cancelled').length,
	pastCount: sessions.filter((session) => session.status === 'past').length,
	upcomingCount: sessions.filter((session) => session.status === 'booked').length,
});

export const getAppointmentCardTone = (status: SessionRow['status']) => {
	if (status === 'cancelled') return 'cancelled';
	if (status === 'past') return 'past';

	return 'confirmed';
};

export const getAppointmentStatusLabelKey = (status: SessionRow['status']) => {
	if (status === 'cancelled') return 'booking.patient-drawer.cancelled-badge';
	if (status === 'past') return 'booking.patient-drawer.completed-badge';

	return 'booking.patient-drawer.confirmed-badge';
};

export const getRescheduleSlotsByDay = ({
	availabilityDates,
	selectedSlotId,
	today,
}: {
	availabilityDates?: Parameters<typeof buildPublicSlotsByDay>[0]['dates'];
	selectedSlotId?: string;
	today: Date;
}) => {
	const grouped = buildPublicSlotsByDay({
		dates: availabilityDates ?? [],
		filters: {
			dateFrom: format(startOfDay(today), 'yyyy-MM-dd'),
			dateTo: format(parseISO('2099-12-31'), 'yyyy-MM-dd'),
			timeOfDay: 'all',
		},
		today: startOfDay(today),
	});

	return new Map(
		Array.from(grouped.entries())
			.map(([day, slots]) => [
				day,
				slots.filter((slot) => slot.slotId !== selectedSlotId),
			] as const)
			.filter(([, slots]) => slots.length > 0)
	);
};
