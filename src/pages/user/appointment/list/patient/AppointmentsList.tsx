import { type UIEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import { editAppointment } from '@psycron/api/appointment';
import { getPublicPatientSessions } from '@psycron/api/patient';
import type {
	IPublicSessionDate,
	IPublicSessionSlot,
} from '@psycron/api/patient/index.types';
import { getAvailabilityCalendar, getUserById } from '@psycron/api/user';
import {
	cancelAppointmentByPatient,
	type CancellationReasonEnum,
} from '@psycron/api/user/availability';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { Avatar } from '@psycron/components/avatar/Avatar';
import { Button } from '@psycron/components/button/Button';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { PublicBookingShell } from '@psycron/layouts/public-booking/PublicBookingShell';
import {
	capitalizeDateLabel,
	getDateLocale,
} from '@psycron/utils/date/date.utils';
import { formatPatientAddress } from '@psycron/utils/patient/patient.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isPast, isSameMonth, parseISO, startOfDay } from 'date-fns';

import {
	AgendaAppointmentCard,
	AgendaAppointmentHeader,
	AgendaDayList,
	AgendaSidebar,
	AgendaStatCard,
	AgendaStatGrid,
	BookingTitleBlock,
	EmptyState,
	NextAppointmentsMonth,
	NextAppointmentsMonthTitle,
	NextAppointmentsScroll,
	PageWrapper,
	StatusBadge,
} from '../../booking/BookAppointment.styles';
import type { IPublicSlot } from '../../booking/BookAppointment.types';
import { buildPublicSlotsByDay } from '../../booking/BookAppointment.utils';
import { PatientDrawerShell } from '../../shared/PatientDrawerShell';
import { PublicSchedulingCalendar } from '../../shared/PublicSchedulingCalendar';
import type { PublicSchedulingViewMode } from '../../shared/PublicSchedulingCalendar.types';

import {
	ActionsRow,
	CancelReasonGrid,
	CancelReasonOption,
	DetailList,
	DetailRow,
	DrawerSection,
	DrawerSectionTitle,
	InfoCard,
	InlineForm,
	RescheduleDay,
	ReschedulePicker,
	RescheduleSlotChip,
	RescheduleSlots,
	TherapistRow,
	TherapistText,
} from './AppointmentsList.styles';

const CANCEL_REASONS = [
	{ label: 'booking.cancel.reason.emergency', value: 1 },
	{ label: 'booking.cancel.reason.schedule-conflict', value: 2 },
	{ label: 'booking.cancel.reason.financial', value: 3 },
	{ label: 'booking.cancel.reason.mental-health', value: 4 },
	{ label: 'booking.cancel.reason.other', value: 6 },
] as const;
const NEXT_APPOINTMENTS_BATCH_SIZE = 8;

type AppointmentStatus = 'booked' | 'cancelled' | 'past';
type DrawerMode = 'details' | 'cancel' | 'reschedule';

interface SessionRow {
	canceledAt?: string | null;
	customReason?: string;
	date: string;
	dateId: string;
	endDateTime: Date;
	isPast: boolean;
	reasonCode?: number;
	slot: IPublicSessionSlot;
	status: AppointmentStatus;
	therapistId: string;
	triggeredBy?: 'PATIENT' | 'THERAPIST';
}

const formatDateTime = (
	date: string,
	startTime: string,
	endTime: string,
	language: string
): string =>
	`${capitalizeDateLabel(format(parseISO(date), 'EEEE, MMM d', { locale: getDateLocale(language) }))} · ${startTime} - ${endTime}`;

const getDurationMinutes = (startTime: string, endTime: string): number => {
	const [startHour, startMinute] = startTime.split(':').map(Number);
	const [endHour, endMinute] = endTime.split(':').map(Number);

	return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

const getSessionTypeLabel = (
	slot: Pick<IPublicSessionSlot, 'address' | 'deliveryMode' | 'letPatientChooseAddress'>,
	t: (key: string) => string
): string => {
	if (
		slot.deliveryMode === 'in-person' ||
		slot.address ||
		slot.letPatientChooseAddress
	) {
		return t('booking.patient-drawer.session-in-person');
	}

	return t('booking.patient-drawer.session-online');
};

export const AppointmentsList = () => {
	const { i18n, t } = useTranslation();
	const { patientId, locale } = useParams<{ locale: string; patientId: string }>();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const dateLocale = getDateLocale(i18n.language);

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [visibleMonth, setVisibleMonth] = useState<Date>(startOfDay(new Date()));
	const [calendarViewMode, setCalendarViewMode] =
		useState<PublicSchedulingViewMode>('month');
	const [highlightedDayKey, setHighlightedDayKey] = useState<string | null>(null);
	const [visibleNextAppointmentsCount, setVisibleNextAppointmentsCount] = useState(
		NEXT_APPOINTMENTS_BATCH_SIZE
	);
	const [selectedAppointment, setSelectedAppointment] = useState<SessionRow | null>(
		null
	);
	const [drawerMode, setDrawerMode] = useState<DrawerMode>('details');
	const [reasonCode, setReasonCode] = useState<number | ''>('');
	const [customReason, setCustomReason] = useState('');
	const [selectedRescheduleSlot, setSelectedRescheduleSlot] =
		useState<IPublicSlot | null>(null);

	const { data, isLoading } = useQuery({
		enabled: Boolean(patientId),
		queryFn: () => getPublicPatientSessions(patientId!),
		queryKey: ['publicPatientSessions', patientId],
	});

	const therapistId = data?.patient?.therapistId;

	const { data: therapist } = useQuery({
		enabled: Boolean(therapistId),
		queryFn: () => getUserById(therapistId!),
		queryKey: ['publicAgendaTherapist', therapistId],
	});

	const { data: availability } = useQuery({
		enabled: Boolean(therapistId) && drawerMode === 'reschedule',
		queryFn: () => getAvailabilityCalendar(therapistId!),
		queryKey: ['publicAgendaAvailability', therapistId],
	});

	const sessions = useMemo<SessionRow[]>(() => {
		const cancelledBySlotId = new Map(
			(data?.patient?.cancelledAppointments ?? []).map((item) => [item.slotId, item])
		);
		const includedSlotIds = new Set<string>();

		const sessionRows = (data?.patient?.sessionDates ?? []).flatMap((group: IPublicSessionDate) =>
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
					therapistId: data?.patient?.therapistId ?? '',
					triggeredBy: cancelled?.triggeredBy,
				};
			})
		);

		const standaloneCancelledRows = (data?.patient?.cancelledAppointments ?? [])
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
					therapistId: data?.patient?.therapistId ?? '',
					triggeredBy: appointment.triggeredBy,
				};
			});

		return [...sessionRows, ...standaloneCancelledRows];
	}, [
		data?.patient?.cancelledAppointments,
		data?.patient?.sessionDates,
		data?.patient?.therapistId,
	]);

	const appointmentsByDay = useMemo(() => {
		const grouped = new Map<string, SessionRow[]>();

		for (const session of sessions) {
			const key = session.date;
			grouped.set(key, [...(grouped.get(key) ?? []), session]);
		}

		return grouped;
	}, [sessions]);

	const appointmentDates = useMemo(
		() => Array.from(appointmentsByDay.keys()).map((day) => parseISO(day)),
		[appointmentsByDay]
	);

	useEffect(() => {
		if (selectedDate || appointmentDates.length === 0) return;
		setSelectedDate(appointmentDates[0]);
		setHighlightedDayKey(format(appointmentDates[0], 'yyyy-MM-dd'));
		if (!isSameMonth(appointmentDates[0], visibleMonth)) {
			setVisibleMonth(appointmentDates[0]);
		}
	}, [appointmentDates, selectedDate, visibleMonth]);

	const selectedDayKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
	const selectedDayAppointments = selectedDayKey
		? (appointmentsByDay.get(selectedDayKey) ?? [])
		: [];
	const nextUpcomingAppointments = useMemo(
		() =>
			sessions
				.filter(
					(session) =>
						session.status === 'booked' &&
						startOfDay(parseISO(session.date)).getTime() >=
							startOfDay(new Date()).getTime()
				)
				.sort(
					(a, b) =>
						new Date(`${a.date}T${a.slot.startTime}:00`).getTime() -
						new Date(`${b.date}T${b.slot.startTime}:00`).getTime()
					),
		[sessions]
	);
	const displayedNextUpcomingAppointments = useMemo(
		() => nextUpcomingAppointments.slice(0, visibleNextAppointmentsCount),
		[nextUpcomingAppointments, visibleNextAppointmentsCount]
	);
	const nextAppointmentsByMonth = useMemo(() => {
		const groups = new Map<string, SessionRow[]>();

		for (const appointment of displayedNextUpcomingAppointments) {
			const monthKey = format(parseISO(appointment.date), 'yyyy-MM');
			groups.set(monthKey, [...(groups.get(monthKey) ?? []), appointment]);
		}

		return Array.from(groups.entries()).map(([monthKey, appointments]) => ({
			appointments,
			monthKey,
			title: capitalizeDateLabel(
				format(parseISO(`${monthKey}-01`), 'MMMM yyyy', {
					locale: dateLocale,
				})
			),
		}));
	}, [dateLocale, displayedNextUpcomingAppointments]);

	const upcomingCount = sessions.filter((session) => session.status === 'booked').length;
	const cancelledCount = sessions.filter(
		(session) => session.status === 'cancelled'
	).length;
	const pastCount = sessions.filter((session) => session.status === 'past').length;

	const rescheduleSlotsByDay = useMemo(() => {
		if (!availability || !selectedAppointment) return new Map<string, IPublicSlot[]>();

		const grouped = buildPublicSlotsByDay({
			dates: availability.dates ?? [],
			filters: {
				dateFrom: format(startOfDay(new Date()), 'yyyy-MM-dd'),
				dateTo: format(parseISO('2099-12-31'), 'yyyy-MM-dd'),
				timeOfDay: 'all',
			},
			today: startOfDay(new Date()),
		});

		return new Map(
			Array.from(grouped.entries())
				.map(([day, slots]) => [
					day,
					slots.filter((slot) => slot.slotId !== selectedAppointment.slot._id),
				] as const)
				.filter(([, slots]) => slots.length > 0)
		);
	}, [availability, selectedAppointment]);

	const closeDrawer = () => {
		setSelectedAppointment(null);
		setDrawerMode('details');
		setReasonCode('');
		setCustomReason('');
		setSelectedRescheduleSlot(null);
	};

	const cancelMutation = useMutation({
		mutationFn: ({
			slotId,
			therapistId: currentTherapistId,
		}: {
			slotId: string;
			therapistId: string;
		}) =>
			cancelAppointmentByPatient({
				...(customReason ? { customReason } : {}),
				patientId: patientId!,
				reasonCode: reasonCode as CancellationReasonEnum,
				slotId,
				therapistId: currentTherapistId,
				triggeredBy: 'PATIENT',
			}),
		onError: () => {
			showAlert({ message: t('booking.cancel.error'), severity: 'error' });
		},
		onSuccess: () => {
			showAlert({ message: t('booking.cancel.success'), severity: 'success' });
			queryClient.invalidateQueries({ queryKey: ['publicPatientSessions', patientId] });
			closeDrawer();
		},
	});

	const rescheduleMutation = useMutation({
		mutationFn: () => {
			if (!selectedAppointment || !selectedRescheduleSlot || !patientId) {
				throw new Error('Missing reschedule context');
			}

			return editAppointment({
				availabilityDayId: selectedRescheduleSlot.availabilityDayId,
				newSlotId: selectedRescheduleSlot.slotId,
				oldSlotId: selectedAppointment.slot._id,
				patientId,
				therapistId: selectedAppointment.therapistId,
			});
		},
		onError: () => {
			showAlert({
				message: t('booking.patient-drawer.reschedule-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			showAlert({
				message: t('booking.patient-drawer.reschedule-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['publicPatientSessions', patientId] });
			closeDrawer();
		},
	});

	const locationText = selectedAppointment
		? selectedAppointment.slot.deliveryMode === 'in-person' ||
		  selectedAppointment.slot.address ||
		  selectedAppointment.slot.letPatientChooseAddress
			? formatPatientAddress(
					selectedAppointment.slot.address,
					selectedAppointment.slot.letPatientChooseAddress
						? t('booking.patient-drawer.awaiting-address')
						: t('booking.patient-drawer.location-in-person')
				)
			: t('booking.patient-drawer.location-online')
		: '';

	const focusCalendarDate = (date: Date) => {
		setSelectedDate(date);
		setHighlightedDayKey(format(date, 'yyyy-MM-dd'));
		setVisibleMonth(date);
	};

	const handleNextAppointmentsScroll = (event: UIEvent<HTMLElement>) => {
		const container = event.currentTarget;
		const items = Array.from(
			container.querySelectorAll<HTMLElement>('[data-appointment-date]')
		);
		const isNearBottom =
			container.scrollTop + container.clientHeight >=
			container.scrollHeight - container.clientHeight / 2;
		const containerTop = container.getBoundingClientRect().top;
		const firstVisible =
			items.find((item) => item.getBoundingClientRect().bottom > containerTop) ??
			items[0];
		const appointmentDate = firstVisible?.dataset.appointmentDate;

		if (isNearBottom) {
			setVisibleNextAppointmentsCount((current) =>
				Math.min(
					current + NEXT_APPOINTMENTS_BATCH_SIZE,
					nextUpcomingAppointments.length
				)
			);
		}

		if (!appointmentDate || appointmentDate === highlightedDayKey) return;

		focusCalendarDate(parseISO(appointmentDate));
	};

	if (isLoading) {
		return (
			<PublicBookingShell>
				<PageWrapper>
					<Typography color='text.secondary'>{t('common.loading')}</Typography>
				</PageWrapper>
			</PublicBookingShell>
		);
	}

	const renderAppointmentCard = (appointment: SessionRow) => {
		const tone =
			appointment.status === 'cancelled'
				? 'cancelled'
				: appointment.status === 'past'
					? 'past'
					: 'confirmed';

		return (
			<AgendaAppointmentCard
				data-appointment-date={appointment.date}
				key={appointment.slot._id}
				onClick={() => {
					focusCalendarDate(parseISO(appointment.date));
					setSelectedAppointment(appointment);
					setDrawerMode('details');
				}}
				tone={tone}
			>
				<AgendaAppointmentHeader>
					<Typography variant='subtitle1'>
						{`${appointment.slot.startTime} - ${appointment.slot.endTime}`}
					</Typography>
					<StatusBadge tone={tone}>
						{appointment.status === 'cancelled'
							? t('booking.patient-drawer.cancelled-badge')
							: appointment.status === 'past'
								? t('booking.patient-drawer.completed-badge')
								: t('booking.patient-drawer.confirmed-badge')}
					</StatusBadge>
				</AgendaAppointmentHeader>
				<Typography color='text.secondary' variant='body2'>
					{capitalizeDateLabel(
						format(parseISO(appointment.date), 'MMM d', { locale: dateLocale })
					)}
					{' · '}
					{getSessionTypeLabel(appointment.slot, t)}
				</Typography>
				<Typography color='text.secondary' variant='body2'>
					{t('booking.patient-drawer.duration', {
						minutes: getDurationMinutes(
							appointment.slot.startTime,
							appointment.slot.endTime
						),
					})}
				</Typography>
			</AgendaAppointmentCard>
		);
	};

	return (
		<PublicBookingShell>
			<PageWrapper>
				<PublicSchedulingCalendar
					detailBody={
						<>
							<DrawerSection>
								<DrawerSectionTitle>
									{t('booking.calendar.selected-day-section')}
								</DrawerSectionTitle>
								{selectedDate ? (
									selectedDayAppointments.length > 0 ? (
										<AgendaDayList>
											{selectedDayAppointments.map(renderAppointmentCard)}
										</AgendaDayList>
									) : (
										<EmptyState>
											<Typography variant='subtitle1'>
												{t('booking.calendar.no-appointments-title')}
											</Typography>
											<Typography color='text.secondary' variant='body2'>
												{t('booking.calendar.no-appointments-body')}
											</Typography>
										</EmptyState>
									)
								) : (
									<EmptyState>
										<Typography variant='subtitle1'>
											{t('booking.calendar.no-date-title')}
										</Typography>
										<Typography color='text.secondary' variant='body2'>
											{t('booking.calendar.pick-a-day')}
										</Typography>
									</EmptyState>
								)}
							</DrawerSection>

							<DrawerSection>
								<DrawerSectionTitle>
									{t('booking.calendar.next-appointments-section')}
								</DrawerSectionTitle>
								{nextUpcomingAppointments.length > 0 ? (
									<NextAppointmentsScroll onScroll={handleNextAppointmentsScroll}>
										{nextAppointmentsByMonth.map(
											({ appointments, monthKey, title }) => (
												<NextAppointmentsMonth key={monthKey}>
													<NextAppointmentsMonthTitle>
														{title}
													</NextAppointmentsMonthTitle>
													<AgendaDayList>
														{appointments.map(renderAppointmentCard)}
													</AgendaDayList>
												</NextAppointmentsMonth>
											)
										)}
									</NextAppointmentsScroll>
								) : (
									<Typography color='text.secondary' variant='body2'>
										{t('booking.calendar.no-next-appointments')}
									</Typography>
								)}
							</DrawerSection>
						</>
					}
					detailSubtitle={
						selectedDate
							? `${selectedDayAppointments.length} ${t('booking.calendar.day-appointments')}`
							: t('booking.calendar.pick-a-day')
					}
					detailTitle={
						selectedDate
							? capitalizeDateLabel(
									format(selectedDate, 'EEEE, MMMM d', {
										locale: dateLocale,
									})
								)
							: t('booking.calendar.detail-title')
					}
					getDayMeta={(date) => {
						const dateKey = format(date, 'yyyy-MM-dd');
						const items = appointmentsByDay.get(dateKey) ?? [];
						const hasUpcoming = items.some((item) => item.status === 'booked');
						const hasCancelled = items.some((item) => item.status === 'cancelled');
						const hasPast = items.some((item) => item.status === 'past');

						return {
							countLabel: items.length > 0 ? String(items.length) : undefined,
							disabled: false,
							highlighted: highlightedDayKey === dateKey,
							indicatorCount: Math.min(items.length, 3),
							tone: hasCancelled
								? 'error'
								: hasUpcoming
									? 'success'
									: hasPast
										? 'neutral'
										: 'neutral',
							};
					}}
					greetingTitle={
						data?.patient?.firstName
							? t('booking.calendar.agenda-greeting', {
									name: data.patient.firstName,
								})
							: t('booking.calendar.agenda-greeting-fallback')
					}
					language={i18n.language}
					mainSubtitle={t('booking.calendar.agenda-subtitle')}
					mainTitle={t('booking.calendar.agenda-main-title')}
					monthLabel={t('booking.calendar.view-month')}
					month={visibleMonth}
					onMonthChange={setVisibleMonth}
					onSelectDate={focusCalendarDate}
					onViewModeChange={setCalendarViewMode}
					selectedDate={selectedDate}
					sidebar={
						<AgendaSidebar>
							<BookingTitleBlock>
								<Typography fontWeight={700} variant='h4'>
									{data?.patient?.firstName
										? t('booking.calendar.agenda-overview-heading', {
												name: data.patient.firstName,
												})
											: t('booking.calendar.agenda-overview-heading-fallback')}
								</Typography>
								<Typography color='text.secondary' variant='body2'>
									{t('booking.calendar.agenda-sidebar-description')}
								</Typography>
							</BookingTitleBlock>

							<AgendaStatGrid>
								<AgendaStatCard>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.appointments.upcoming')}
									</Typography>
									<Typography variant='h5'>{upcomingCount}</Typography>
								</AgendaStatCard>
								<AgendaStatCard>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.appointments.cancelled')}
									</Typography>
									<Typography variant='h5'>{cancelledCount}</Typography>
								</AgendaStatCard>
								<AgendaStatCard>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.appointments.past')}
									</Typography>
									<Typography variant='h5'>{pastCount}</Typography>
								</AgendaStatCard>
								<AgendaStatCard>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.calendar.active-days')}
									</Typography>
									<Typography variant='h5'>{appointmentDates.length}</Typography>
								</AgendaStatCard>
							</AgendaStatGrid>
						</AgendaSidebar>
					}
					topActions={
						<Button
							onClick={() => navigate(`/${locale}/${therapistId}/book-appointment`)}
							variant='contained'
						>
							{t('booking.patient-drawer.book-new')}
						</Button>
					}
					viewMode={calendarViewMode}
					weekLabel={t('booking.calendar.view-week')}
				/>

				{selectedAppointment ? (
					<PatientDrawerShell
						accentColor={
							selectedAppointment.status === 'cancelled'
								? '#E05B5B'
								: selectedAppointment.status === 'past'
									? '#94A3B8'
									: '#2F9E44'
						}
						actions={
							selectedAppointment.status === 'booked' ? (
								drawerMode === 'details' ? (
									<ActionsRow>
										<Button
											onClick={() => setDrawerMode('reschedule')}
											variant='outlined'
										>
											{t('booking.patient-drawer.reschedule')}
										</Button>
										<Button
											onClick={() => setDrawerMode('cancel')}
											severity='warning'
											variant='outlined'
										>
											{t('booking.patient-drawer.cancel')}
										</Button>
									</ActionsRow>
								) : drawerMode === 'cancel' ? (
									<ActionsRow>
										<Button
											disabled={!reasonCode || cancelMutation.isPending}
											onClick={() =>
												cancelMutation.mutate({
													slotId: selectedAppointment.slot._id,
													therapistId: selectedAppointment.therapistId,
												})
											}
											variant='contained'
										>
											{t('booking.cancel.confirm')}
										</Button>
										<Button
											onClick={() => setDrawerMode('details')}
											variant='text'
										>
											{t('common.cancel')}
										</Button>
									</ActionsRow>
								) : (
									<ActionsRow>
										<Button
											disabled={
												!selectedRescheduleSlot || rescheduleMutation.isPending
											}
											onClick={() => rescheduleMutation.mutate()}
											variant='contained'
										>
											{t('booking.patient-drawer.confirm-reschedule')}
										</Button>
										<Button
											onClick={() => {
												setDrawerMode('details');
												setSelectedRescheduleSlot(null);
											}}
											variant='text'
										>
											{t('common.cancel')}
										</Button>
									</ActionsRow>
								)
							) : selectedAppointment.status === 'cancelled' ? (
								<Button
									onClick={() =>
										navigate(`/${locale}/${selectedAppointment.therapistId}/book-appointment`)
									}
									variant='contained'
								>
									{t('booking.patient-drawer.book-new')}
								</Button>
							) : (
								<Button disabled variant='outlined'>
									{t('booking.patient-drawer.session-completed')}
								</Button>
							)
						}
						ariaLabel={t('booking.patient-drawer.aria-label')}
						closeLabel={t('common.close')}
						onClose={closeDrawer}
						roleLabel={t('booking.patient-drawer.role')}
						statusLabel={
							selectedAppointment.status === 'cancelled'
								? t('booking.patient-drawer.cancelled-badge')
								: selectedAppointment.status === 'past'
									? t('booking.patient-drawer.completed-badge')
									: t('booking.patient-drawer.confirmed-badge')
						}
						subtitle={
							selectedAppointment.status === 'cancelled' &&
							selectedAppointment.canceledAt
								? t('booking.patient-drawer.cancelled-notice', {
										date: capitalizeDateLabel(
											format(
												parseISO(selectedAppointment.canceledAt),
												'MMM d, yyyy',
												{ locale: dateLocale }
											)
										),
									})
								: formatDateTime(
										selectedAppointment.date,
										selectedAppointment.slot.startTime,
										selectedAppointment.slot.endTime,
										i18n.language
									)
						}
						title={
							selectedAppointment.status === 'cancelled'
								? t('booking.patient-drawer.cancelled-title')
								: selectedAppointment.status === 'past'
									? t('booking.patient-drawer.completed-title')
									: t('booking.patient-drawer.confirmed-title')
						}
					>
						<DrawerSection>
							<DrawerSectionTitle>
								{t('booking.patient-drawer.therapist-section')}
							</DrawerSectionTitle>
							<InfoCard>
								<TherapistRow>
									<Avatar
										firstName={therapist?.firstName ?? 'Psycron'}
										lastName={therapist?.lastName ?? 'Therapist'}
										src={therapist?.picture}
									/>
									<TherapistText>
										<Typography variant='subtitle1'>
											{therapist
												? `${therapist.firstName} ${therapist.lastName}`
												: t('booking.appointments.therapist-fallback')}
										</Typography>
										<Typography color='text.secondary' variant='body2'>
											{therapist?.specialities?.join(', ') ||
												t('booking.patient-drawer.specialty-fallback')}
										</Typography>
									</TherapistText>
								</TherapistRow>
							</InfoCard>
						</DrawerSection>

						<DrawerSection>
							<DrawerSectionTitle>
								{t('booking.patient-drawer.details-section')}
							</DrawerSectionTitle>
							<DetailList>
								<DetailRow>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.patient-drawer.when-label')}
									</Typography>
									<Typography variant='body2'>
										{formatDateTime(
											selectedAppointment.date,
											selectedAppointment.slot.startTime,
											selectedAppointment.slot.endTime,
											i18n.language
										)}
									</Typography>
								</DetailRow>
								<DetailRow>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.patient-drawer.session-type-label')}
									</Typography>
									<Typography variant='body2'>
										{getSessionTypeLabel(selectedAppointment.slot, t)}
									</Typography>
								</DetailRow>
								<DetailRow>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.patient-drawer.duration-label')}
									</Typography>
									<Typography variant='body2'>
										{t('booking.patient-drawer.duration', {
											minutes: getDurationMinutes(
												selectedAppointment.slot.startTime,
												selectedAppointment.slot.endTime
											),
										})}
									</Typography>
								</DetailRow>
								<DetailRow>
									<Typography color='text.secondary' variant='caption'>
										{t('booking.patient-drawer.location-label')}
									</Typography>
									<Typography variant='body2'>{locationText}</Typography>
								</DetailRow>
							</DetailList>
						</DrawerSection>

						{drawerMode === 'cancel' ? (
							<InlineForm>
								<Typography variant='body2'>
									{t('booking.cancel.reason-prompt')}
								</Typography>
								<CancelReasonGrid aria-label={t('booking.cancel.reason-label')}>
									{CANCEL_REASONS.map(({ label, value }) => (
										<CancelReasonOption
											isSelected={reasonCode === value}
											key={value}
											onClick={() => setReasonCode(value)}
											type='button'
										>
											{t(label)}
										</CancelReasonOption>
									))}
								</CancelReasonGrid>
								{reasonCode === 6 ? (
									<TextField
										fullWidth
										label={t('booking.cancel.custom-reason')}
										multiline
										onChange={(event) => setCustomReason(event.target.value)}
										rows={3}
										size='small'
										value={customReason}
									/>
								) : null}
							</InlineForm>
						) : null}

						{drawerMode === 'reschedule' ? (
							<DrawerSection>
								<DrawerSectionTitle>
									{t('booking.patient-drawer.reschedule-section')}
								</DrawerSectionTitle>
								<ReschedulePicker>
									{Array.from(rescheduleSlotsByDay.entries()).slice(0, 8).map(
										([day, slots]) => (
											<RescheduleDay key={day}>
												<Typography variant='body2'>
													{capitalizeDateLabel(
														format(parseISO(day), 'EEEE, MMM d', {
															locale: dateLocale,
														})
													)}
												</Typography>
												<RescheduleSlots>
													{slots.map((slot) => (
														<RescheduleSlotChip
															isSelected={
																selectedRescheduleSlot?.slotId ===
																slot.slotId
															}
															key={slot.slotId}
															onClick={() =>
																setSelectedRescheduleSlot(slot)
															}
														>
															{slot.startTime}
														</RescheduleSlotChip>
													))}
												</RescheduleSlots>
											</RescheduleDay>
										)
									)}
									{rescheduleSlotsByDay.size === 0 ? (
										<Typography color='text.secondary' variant='body2'>
											{t('booking.patient-drawer.no-reschedule-slots')}
										</Typography>
									) : null}
								</ReschedulePicker>
							</DrawerSection>
						) : null}
					</PatientDrawerShell>
				) : null}
			</PageWrapper>
		</PublicBookingShell>
	);
};
