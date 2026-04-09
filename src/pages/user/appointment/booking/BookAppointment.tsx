import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { bookAppointmentFromLink } from '@psycron/api/patient';
import { getAvailabilityCalendar, getUserById } from '@psycron/api/user';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { Text } from '@psycron/components/text/Text';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { PublicBookingShell } from '@psycron/layouts/public-booking/PublicBookingShell';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addWeeks, format, parseISO, startOfDay } from 'date-fns';

import { PublicBookingForm } from './components/PublicBookingForm';
import { TherapistCard } from './components/TherapistCard';
import {
	Datepiker,
	DayLabel,
	DaySection,
	EmptyState,
	FiltersRow,
	FilterTimeRow,
	PageWrapper,
	SkeletonDay,
	SkeletonRow,
	SlotChip,
	SlotsRow,
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

export const BookAppointment = () => {
	const { t } = useTranslation();
	const { userId: therapistId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { showAlert } = useAlert();

	const today = startOfDay(new Date());
	const defaultTo = format(addWeeks(today, 4), 'yyyy-MM-dd');
	const defaultFrom = format(today, 'yyyy-MM-dd');

	const [filters, setFilters] = useState<IBookingFilters>({
		dateFrom: defaultFrom,
		dateTo: defaultTo,
		timeOfDay: 'all',
	});
	const [selectedSlot, setSelectedSlot] = useState<IPublicSlot | null>(null);
	const sharedSlotId = searchParams.get('slotId');

	const methods = useForm<IBookingFormValues>({
		defaultValues: {
			countryCode: '',
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
		onSuccess: (res) => {
			const patientId = res.patient._id;
			navigate(`../${therapistId}/${patientId}/appointment-confirmation`, {
				replace: true,
			});
		},
	});

	useEffect(() => {
		if (!sharedSlotId || selectedSlot) return;

		for (const slots of slotsByDay.values()) {
			const matchedSlot = slots.find(
				(slot) => !slot.isBooked && slot.slotId === sharedSlotId
			);

			if (matchedSlot) {
				setSelectedSlot(matchedSlot);
				return;
			}
		}
	}, [selectedSlot, sharedSlotId, slotsByDay]);

	const handleSlotClick = useCallback((slot: IPublicSlot) => {
		if (slot.isBooked) return;
		setSelectedSlot(slot);
	}, []);

	const handleClose = useCallback(() => {
		setSelectedSlot(null);
		methods.reset();
		if (searchParams.has('slotId')) {
			const nextParams = new URLSearchParams(searchParams);
			nextParams.delete('slotId');
			setSearchParams(nextParams, { replace: true });
		}
	}, [methods, searchParams, setSearchParams]);

	const handleSubmit = methods.handleSubmit((values) => {
		bookingMutation.mutate(values);
	});

	if (isLoading) {
		return (
			<PublicBookingShell>
				<PageWrapper>
				<Skeleton
					height={80}
					sx={{ borderRadius: '14px', mb: 3 }}
					variant='rectangular'
				/>
				<SkeletonDay>
					<Skeleton height={18} variant='text' width={140} />
					<SkeletonRow>
						{Array.from({ length: 6 }).map((_, i) => (
							<Skeleton
								height={36}
								key={i}
								sx={{ borderRadius: '20px' }}
								variant='rectangular'
								width={68}
							/>
						))}
					</SkeletonRow>
				</SkeletonDay>
				<SkeletonDay>
					<Skeleton height={18} variant='text' width={120} />
					<SkeletonRow>
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton
								height={36}
								key={i}
								sx={{ borderRadius: '20px' }}
								variant='rectangular'
								width={68}
							/>
						))}
					</SkeletonRow>
				</SkeletonDay>
				</PageWrapper>
			</PublicBookingShell>
		);
	}

	return (
		<PublicBookingShell>
			<PageWrapper>
			{therapist && <TherapistCard therapist={therapist} />}
			<Text mb={3} variant='h4' fontWeight={600}>
				{t('booking.page.title')}
			</Text>
			<FiltersRow>
				<Datepiker
					InputLabelProps={{ shrink: true }}
					inputProps={{ min: defaultFrom }}
					label={t('booking.filter.from')}
					onChange={(e) =>
						setFilters((f) => ({ ...f, dateFrom: e.target.value }))
					}
					size='small'
					type='date'
					value={filters.dateFrom}
				/>
				<Datepiker
					InputLabelProps={{ shrink: true }}
					inputProps={{ min: filters.dateFrom }}
					label={t('booking.filter.to')}
					onChange={(e) =>
						setFilters((f) => ({ ...f, dateTo: e.target.value }))
					}
					size='small'
					type='date'
					value={filters.dateTo}
				/>
			</FiltersRow>

			<FilterTimeRow>
				{TIME_OF_DAY_OPTIONS.map(({ label, value }) => (
					<TimeFilterChip
						isActive={filters.timeOfDay === value}
						key={value}
						onClick={() => setFilters((f) => ({ ...f, timeOfDay: value }))}
					>
						{t(label)}
					</TimeFilterChip>
				))}
			</FilterTimeRow>

			{slotsByDay.size === 0 ? (
				<EmptyState>
					<Text color='text.secondary' variant='body2'>
						{t('booking.no-slots')}
					</Text>
				</EmptyState>
			) : (
				Array.from(slotsByDay.entries()).map(([day, daySlots]) => (
					<DaySection key={day}>
						<DayLabel>{format(parseISO(day), 'EEEE, MMMM d')}</DayLabel>
						<SlotsRow>
							{daySlots.map((slot) => (
								<SlotChip
									isBooked={slot.isBooked}
									key={slot.slotId}
									label={
										slot.isBooked ? t('booking.slot.taken') : slot.startTime
									}
									onClick={() => handleSlotClick(slot)}
								/>
							))}
						</SlotsRow>
					</DaySection>
				))
			)}

			{selectedSlot && (
				<Drawer
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
					onClose={handleClose}
					title={`${selectedSlot.startTime} · ${format(parseISO(selectedSlot.date), 'MMM d')}`}
				>
					<PublicBookingForm
						letPatientChooseAddress={
							selectedSlot.letPatientChooseAddress ?? false
						}
						methods={methods}
					/>
				</Drawer>
			)}
		</PageWrapper>
		</PublicBookingShell>
	);
};
