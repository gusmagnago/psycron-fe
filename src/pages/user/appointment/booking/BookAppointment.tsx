import { type UIEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Skeleton, Typography } from '@mui/material';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { bookAppointmentFromLink } from '@psycron/api/patient';
import { recordConsent } from '@psycron/api/patient/consent';
import { getAvailabilityCalendar, getUserById } from '@psycron/api/user';
import { Button } from '@psycron/components/button/Button';
import { Calendar, ClockIn, Globe, MapPin } from '@psycron/components/icons';
import { Text } from '@psycron/components/text/Text';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { PublicBookingShell } from '@psycron/layouts/public-booking/PublicBookingShell';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	capitalizeDateLabel,
	getDateLocale,
} from '@psycron/utils/date/date.utils';
import { formatPatientAddress } from '@psycron/utils/patient/patient.utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addWeeks, format, isSameMonth, parseISO, startOfDay } from 'date-fns';

import { PatientDrawerShell } from '../shared/PatientDrawerShell';
import { PublicSchedulingCalendar } from '../shared/PublicSchedulingCalendar';
import type { PublicSchedulingViewMode } from '../shared/PublicSchedulingCalendar.types';

import { PublicBookingForm } from './components/PublicBookingForm';
import { TherapistCard } from './components/TherapistCard';
import {
	AvailableSlotsScroll,
	BookingMetaIcon,
	BookingMetaList,
	BookingMetaRow,
	BookingMetaText,
	BookingSidebar,
	BookingTitleBlock,
	EmptyState,
	FilterTimeRow,
	NextAppointmentsMonth,
	NextAppointmentsMonthTitle,
	PageWrapper,
	SkeletonCard,
	SkeletonLayout,
	SlotButton,
	TimeFilterChip,
} from './BookAppointment.styles';
import type {
	IBookingFilters,
	IBookingFormValues,
	IPublicSlot,
	TimeOfDay,
} from './BookAppointment.types';
import { buildPublicSlotsByDay } from './BookAppointment.utils';

const TIME_OF_DAY_OPTIONS: { label: string; value: TimeOfDay }[] = [
	{ label: 'booking.filter.time-all', value: 'all' },
	{ label: 'booking.filter.time-morning', value: 'morning' },
	{ label: 'booking.filter.time-afternoon', value: 'afternoon' },
	{ label: 'booking.filter.time-evening', value: 'evening' },
];
const AVAILABLE_DAYS_BATCH_SIZE = 5;

const getDurationMinutes = (slot?: IPublicSlot | null): number | null => {
	if (!slot) return null;
	const [startHour, startMinute] = slot.startTime.split(':').map(Number);
	const [endHour, endMinute] = slot.endTime.split(':').map(Number);

	return endHour * 60 + endMinute - (startHour * 60 + startMinute);
};

export const BookAppointment = () => {
	const { i18n, t } = useTranslation();
	const { userId: therapistId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { showAlert } = useAlert();

	const today = startOfDay(new Date());
	const dateLocale = getDateLocale(i18n.language);
	const defaultTo = format(addWeeks(today, 12), 'yyyy-MM-dd');
	const defaultFrom = format(today, 'yyyy-MM-dd');

	const [filters, setFilters] = useState<IBookingFilters>({
		dateFrom: defaultFrom,
		dateTo: defaultTo,
		timeOfDay: 'all',
	});
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [visibleMonth, setVisibleMonth] = useState<Date>(today);
	const [calendarViewMode, setCalendarViewMode] =
		useState<PublicSchedulingViewMode>('month');
	const [selectedSlot, setSelectedSlot] = useState<IPublicSlot | null>(null);
	const [visibleAvailableDaysCount, setVisibleAvailableDaysCount] = useState(
		AVAILABLE_DAYS_BATCH_SIZE
	);
	const sharedSlotId = searchParams.get('slotId');
	const availableSlotsScrollRef = useRef<HTMLDivElement | null>(null);
	const pendingScrollDayKeyRef = useRef<string | null>(null);

	const methods = useForm<IBookingFormValues>({
		defaultValues: {
			countryCode: '',
			consentAccepted: false,
			email: '',
			firstName: '',
			lastName: '',
			notifyByEmail: true,
			notifyByWhatsapp: true,
			phone: '',
			recurrencePattern: 'SINGLE',
		},
		mode: 'onChange',
	});

	const { data, isLoading } = useQuery({
		enabled: Boolean(therapistId),
		queryFn: () => getAvailabilityCalendar(therapistId ?? ''),
		queryKey: ['publicAvailability', therapistId],
	});

	const { data: therapist } = useQuery({
		enabled: Boolean(therapistId),
		queryFn: () => getUserById(therapistId ?? ''),
		queryKey: ['publicTherapist', therapistId],
	});

	const slotsByDay = useMemo(
		() =>
			buildPublicSlotsByDay({
				dates: data?.dates ?? [],
				filters,
				today,
			}),
		[data?.dates, filters, today]
	);

	const availableDates = useMemo(
		() => Array.from(slotsByDay.keys()).map((day) => parseISO(day)),
		[slotsByDay]
	);

	const selectedDayKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
	const selectedDaySlots = selectedDayKey ? (slotsByDay.get(selectedDayKey) ?? []) : [];
	const availableDayGroups = useMemo(
		() =>
			Array.from(slotsByDay.entries()).map(([dayKey, daySlots]) => ({
				dayKey,
				slots: daySlots,
				title: capitalizeDateLabel(
					format(parseISO(dayKey), 'EEEE, MMMM d', {
						locale: dateLocale,
					})
				),
			})),
		[dateLocale, slotsByDay]
	);
	const displayedAvailableDayGroups = useMemo(
		() => availableDayGroups.slice(0, visibleAvailableDaysCount),
		[availableDayGroups, visibleAvailableDaysCount]
	);

	const bookingMutation = useMutation({
		mutationFn: (values: IBookingFormValues) => {
			if (!therapistId || !selectedSlot) throw new Error('Missing context');
			const {
				address,
				countryCode,
				email,
				firstName,
				lastName,
				phone,
				recurrencePattern,
				whatsapp,
			} = values;
			const fullPhone = countryCode ? `${countryCode}${phone}` : phone;
			const fullWhatsapp = whatsapp
				? countryCode
					? `${countryCode}${whatsapp}`
					: whatsapp
				: undefined;

			return bookAppointmentFromLink({
				therapistId,
				data: {
					availabilityDayId: selectedSlot.availabilityDayId,
					...(address ? { patientAddress: address } : {}),
					patient: {
						contacts: {
							email,
							phone: fullPhone,
							...(fullWhatsapp ? { whatsapp: fullWhatsapp } : {}),
						},
						firstName,
						lastName,
					},
					recurrencePattern,
					shouldReplicate:
						recurrencePattern !== 'SINGLE' && recurrencePattern !== 'NOT_YET',
					slotId: selectedSlot.slotId,
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
			});
		},
		onError: () => {
			showAlert({ message: t('booking.error'), severity: 'error' });
		},
		onSuccess: (res, values) => {
			if (selectedSlot && therapistId) {
				capture(PostHogEvent.PublicBookAppointmentSubmitted, {
					date: selectedSlot.date,
					recurrence_pattern: values.recurrencePattern,
					slot_id: selectedSlot.slotId,
					therapist_id: therapistId,
				});
			}
			recordConsent(res.patient._id, {
				channel: 'web_booking',
				purpose: 'data_processing',
				version: '1.0',
			})
				.then(() => {
					capture(PostHogEvent.ConsentGranted, {
						channel: 'web_booking',
						purpose: 'data_processing',
					});
				})
				.catch(() => {
					showAlert({ message: t('booking.error'), severity: 'error' });
				});
			navigate(`../${therapistId}/${res.patient._id}/appointment-confirmation`, {
				replace: true,
			});
		},
	});

	useEffect(() => {
		if (!therapistId) return;

		capture(PostHogEvent.PublicBookAppointmentOpened, {
			therapist_id: therapistId,
		});
	}, [therapistId]);

	useEffect(() => {
		if (selectedDate || availableDates.length === 0) return;
		setSelectedDate(availableDates[0]);
		if (availableDates[0] && !isSameMonth(availableDates[0], visibleMonth)) {
			setVisibleMonth(availableDates[0]);
		}
	}, [availableDates, selectedDate, visibleMonth]);

	useEffect(() => {
		if (!sharedSlotId) return;

		for (const [day, slots] of slotsByDay.entries()) {
			const matchedSlot = slots.find(
				(slot) => !slot.isBooked && slot.slotId === sharedSlotId
			);

			if (matchedSlot) {
				const matchedDate = parseISO(day);
				setSelectedDate(matchedDate);
				setVisibleMonth(matchedDate);
				setSelectedSlot(matchedSlot);
				return;
			}
		}
	}, [sharedSlotId, slotsByDay]);

	useEffect(() => {
		if (!selectedSlot || !selectedDate) return;
		const slotDate = parseISO(selectedSlot.date);
		if (format(slotDate, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')) {
			setSelectedSlot(null);
		}
	}, [selectedDate, selectedSlot]);

	useEffect(() => {
		setVisibleAvailableDaysCount(AVAILABLE_DAYS_BATCH_SIZE);
	}, [filters, calendarViewMode, therapistId]);

	useEffect(() => {
		const pendingDayKey = pendingScrollDayKeyRef.current;

		if (!pendingDayKey) return;

		const dayNode = availableSlotsScrollRef.current?.querySelector<HTMLElement>(
			`[data-slot-day="${pendingDayKey}"]`
		);

		if (!dayNode) return;

		dayNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
		pendingScrollDayKeyRef.current = null;
	}, [displayedAvailableDayGroups]);

	const handleClose = () => {
		setSelectedSlot(null);
		methods.reset();
		if (searchParams.has('slotId')) {
			const nextParams = new URLSearchParams(searchParams);
			nextParams.delete('slotId');
			setSearchParams(nextParams, { replace: true });
		}
	};

	const handleSubmit = methods.handleSubmit((values) => {
		bookingMutation.mutate(values);
	});

	const selectedDuration = useMemo(() => getDurationMinutes(selectedSlot), [selectedSlot]);

	const handleAvailableSlotsScroll = (event: UIEvent<HTMLElement>) => {
		const container = event.currentTarget;
		const daySections = Array.from(
			container.querySelectorAll<HTMLElement>('[data-slot-day]')
		);
		const isNearBottom =
			container.scrollTop + container.clientHeight >=
			container.scrollHeight - container.clientHeight / 2;
		const containerTop = container.getBoundingClientRect().top;
		const firstVisibleDay =
			daySections.find((section) => section.getBoundingClientRect().bottom > containerTop) ??
			daySections[0];
		const visibleDayKey = firstVisibleDay?.dataset.slotDay;

		if (visibleDayKey && visibleDayKey !== selectedDayKey) {
			const visibleDay = parseISO(visibleDayKey);
			setSelectedDate(visibleDay);
			setVisibleMonth(visibleDay);
		}

		if (isNearBottom) {
			setVisibleAvailableDaysCount((current) =>
				Math.min(current + AVAILABLE_DAYS_BATCH_SIZE, availableDayGroups.length)
			);
		}
	};

	const handleCalendarDateSelect = (date: Date) => {
		const dayKey = format(date, 'yyyy-MM-dd');
		const dayIndex = availableDayGroups.findIndex((group) => group.dayKey === dayKey);

		setSelectedDate(date);
		setVisibleMonth(date);
		setSelectedSlot(null);
		capture(PostHogEvent.PublicBookAppointmentDaySelected, {
			date: dayKey,
			source: 'calendar',
			view: calendarViewMode,
		});

		if (dayIndex >= 0) {
			setVisibleAvailableDaysCount((current) =>
				Math.max(current, dayIndex + 1, AVAILABLE_DAYS_BATCH_SIZE)
			);
			pendingScrollDayKeyRef.current = dayKey;
		}
	};

	if (isLoading) {
		return (
			<PublicBookingShell>
				<PageWrapper>
					<SkeletonLayout>
						<SkeletonCard>
							<Skeleton height='100%' variant='rounded' />
						</SkeletonCard>
						<SkeletonCard>
							<Skeleton height='100%' variant='rounded' />
						</SkeletonCard>
						<SkeletonCard>
							<Skeleton height='100%' variant='rounded' />
						</SkeletonCard>
					</SkeletonLayout>
				</PageWrapper>
			</PublicBookingShell>
		);
	}

	return (
		<PublicBookingShell>
			<PageWrapper>
				<PublicSchedulingCalendar
					detailBody={
						displayedAvailableDayGroups.length > 0 ? (
							<AvailableSlotsScroll
								onScroll={handleAvailableSlotsScroll}
								ref={availableSlotsScrollRef}
							>
								{displayedAvailableDayGroups.map(({ dayKey, slots, title }) => (
									<NextAppointmentsMonth data-slot-day={dayKey} key={dayKey}>
										<NextAppointmentsMonthTitle>
											{title}
										</NextAppointmentsMonthTitle>
								{slots.map((slot) => (
											<SlotButton
												isBooked={slot.isBooked}
												isSelected={slot.slotId === selectedSlot?.slotId}
												key={slot.slotId}
												label={
													slot.isBooked
														? t('booking.slot.taken')
														: `${slot.startTime} - ${slot.endTime}`
												}
												onClick={() => {
													if (!slot.isBooked) {
														setSelectedDate(parseISO(slot.date));
														setSelectedSlot(slot);
														capture(
															PostHogEvent.PublicBookAppointmentSlotSelected,
															{
																date: slot.date,
																slot_id: slot.slotId,
																start_time: slot.startTime,
															}
														);
													}
												}}
											/>
										))}
									</NextAppointmentsMonth>
								))}
							</AvailableSlotsScroll>
						) : (
							<EmptyState>
								<Typography variant='subtitle1'>
									{t('booking.calendar.no-times-title')}
								</Typography>
								<Typography color='text.secondary' variant='body2'>
									{t('booking.calendar.no-times-body')}
								</Typography>
							</EmptyState>
						)
					}
					detailSubtitle={
						selectedDate
							? `${selectedDaySlots.filter((slot) => !slot.isBooked).length} ${t('booking.calendar.available-count')}`
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
						const daySlots = slotsByDay.get(dateKey) ?? [];
						const availableCount = daySlots.filter((slot) => !slot.isBooked).length;
						const bookedCount = daySlots.filter((slot) => slot.isBooked).length;

						return {
							countLabel:
								daySlots.length > 0
									? String(availableCount || bookedCount)
									: undefined,
							disabled: daySlots.length === 0,
							highlighted: selectedDayKey === dateKey,
							indicatorCount: daySlots.length === 0 ? 0 : Math.min(availableCount || bookedCount, 3),
							tone:
								availableCount > 0
									? 'info'
									: bookedCount > 0
										? 'neutral'
										: 'neutral',
							};
					}}
					greetingTitle={t('booking.calendar.booking-greeting')}
					language={i18n.language}
					mainSubtitle={t('booking.calendar.subtitle')}
					mainTitle={t('booking.calendar.title')}
					monthLabel={t('booking.calendar.view-month')}
					month={visibleMonth}
					onMonthChange={setVisibleMonth}
					onSelectDate={handleCalendarDateSelect}
					onViewModeChange={(view) => {
						setCalendarViewMode(view);
						capture(PostHogEvent.PublicBookAppointmentViewChanged, {
							view,
						});
					}}
					selectedDate={selectedDate}
					sidebar={
						<BookingSidebar>
							{therapist ? <TherapistCard therapist={therapist} /> : null}
							<BookingTitleBlock>
								<Text fontWeight={700} variant='h4'>
									{t('booking.page.title')}
								</Text>
								<Typography color='text.secondary' variant='body2'>
									{t('booking.calendar.sidebar-description')}
								</Typography>
							</BookingTitleBlock>

							<BookingMetaList>
								<BookingMetaRow>
									<BookingMetaIcon>
										<ClockIn color={palette.brand.dark} />
									</BookingMetaIcon>
									<BookingMetaText>
										<Typography variant='subtitle2'>
											{t('booking.calendar.duration-heading')}
										</Typography>
										<Typography color='text.secondary' variant='body2'>
											{selectedDuration
												? t('booking.patient-drawer.duration', {
														minutes: selectedDuration,
													})
												: t('booking.calendar.duration-pending')}
										</Typography>
									</BookingMetaText>
								</BookingMetaRow>

								<BookingMetaRow>
									<BookingMetaIcon>
										{selectedSlot?.deliveryMode === 'in-person' ||
										selectedSlot?.address ||
										selectedSlot?.letPatientChooseAddress ? (
											<MapPin color={palette.info.main} />
										) : (
											<Globe color={palette.info.main} />
										)}
									</BookingMetaIcon>
									<BookingMetaText>
										<Typography variant='subtitle2'>
											{t('booking.patient-drawer.location-label')}
										</Typography>
										<Typography color='text.secondary' variant='body2'>
											{selectedSlot
												? selectedSlot.deliveryMode === 'in-person' ||
												  selectedSlot.address ||
												  selectedSlot.letPatientChooseAddress
													? formatPatientAddress(
															selectedSlot.address,
															t('booking.patient-drawer.location-in-person')
														)
													: t('booking.patient-drawer.location-online')
												: t('booking.calendar.location-pending')}
										</Typography>
									</BookingMetaText>
								</BookingMetaRow>

								<BookingMetaRow>
									<BookingMetaIcon>
										<Calendar color={palette.secondary.main} />
									</BookingMetaIcon>
									<BookingMetaText>
										<Typography variant='subtitle2'>
											{t('booking.calendar.date-heading')}
										</Typography>
										<Typography color='text.secondary' variant='body2'>
											{selectedDate
												? capitalizeDateLabel(
														format(selectedDate, 'EEEE, MMM d', {
															locale: dateLocale,
														})
													)
												: t('booking.calendar.date-pending')}
										</Typography>
									</BookingMetaText>
								</BookingMetaRow>
							</BookingMetaList>
						</BookingSidebar>
					}
					topActions={
						<FilterTimeRow>
							{TIME_OF_DAY_OPTIONS.map(({ label, value }) => (
								<TimeFilterChip
									isActive={filters.timeOfDay === value}
									key={value}
									onClick={() => {
										setFilters((current) => ({ ...current, timeOfDay: value }));
										capture(
											PostHogEvent.PublicBookAppointmentTimeFilterChanged,
											{
												time_of_day: value,
											}
										);
									}}
								>
									{t(label)}
								</TimeFilterChip>
							))}
						</FilterTimeRow>
					}
					topActionsPosition='below'
					viewMode={calendarViewMode}
					weekLabel={t('booking.calendar.view-week')}
				/>

				{selectedSlot ? (
					<PatientDrawerShell
						accentColor={palette.success.main}
						actions={
							<Button
								disabled={bookingMutation.isPending}
								onClick={handleSubmit}
								variant='contained'
							>
								{t('booking.confirm')}
							</Button>
						}
						ariaLabel={t('booking.drawer.aria-label')}
						closeLabel={t('common.close')}
						onClose={handleClose}
						roleLabel={t('booking.patient-drawer.role')}
						statusLabel={t('booking.patient-drawer.available-badge')}
						subtitle={t('booking.patient-drawer.available-subtitle')}
						title={t('booking.patient-drawer.available-title')}
					>
						{therapist ? <TherapistCard therapist={therapist} /> : null}
						<Typography variant='body2'>
							{t('booking.patient-drawer.when', {
								date: capitalizeDateLabel(
									format(parseISO(selectedSlot.date), 'EEEE, MMM d', {
										locale: dateLocale,
									})
								),
								time: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
							})}
						</Typography>
						{selectedDuration ? (
							<Typography color='text.secondary' variant='body2'>
								{t('booking.patient-drawer.duration', {
									minutes: selectedDuration,
								})}
							</Typography>
						) : null}
						<Typography color='text.secondary' variant='body2'>
							{selectedSlot.deliveryMode === 'in-person'
								? formatPatientAddress(
										selectedSlot.address,
										t('booking.patient-drawer.location-in-person')
									)
								: t('booking.patient-drawer.location-online')}
						</Typography>
						<PublicBookingForm
							letPatientChooseAddress={selectedSlot.letPatientChooseAddress ?? false}
							methods={methods}
							therapistName={
								therapist
									? `${therapist.firstName} ${therapist.lastName}`
									: t('globals.therapist')
							}
						/>
					</PatientDrawerShell>
				) : null}
			</PageWrapper>
		</PublicBookingShell>
	);
};
