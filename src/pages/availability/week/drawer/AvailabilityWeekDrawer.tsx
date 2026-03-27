import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import { Box } from '@mui/material';
import { editSlot } from '@psycron/api/availability';
import { bookAppointmentFromLink } from '@psycron/api/patient';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import {
	cancelAppointmentByPatient,
	editSlotStatus,
	getAppointmentDetailsBySlotId,
} from '@psycron/api/user/availability';
import type {
	AppointmentDetailsBySlotIdResponse,
	CancellationReasonEnum as CancellationReasonType,
} from '@psycron/api/user/availability/index.types';
import {
	CancellationReasonEnum,
	StatusEnum,
} from '@psycron/api/user/availability/index.types';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { ContactsForm } from '@psycron/components/form/components/contacts/ContactsForm';
import { NameForm } from '@psycron/components/form/components/name/NameForm';
import {
	Account,
	Appointment,
	Calendar,
	Google,
	Jupiter,
	MapPin,
	Watch,
} from '@psycron/components/icons';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { usePatient } from '@psycron/context/patient/PatientContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { getFormattedContacts } from '@psycron/hooks/useFormattedContacts';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import i18n from '@psycron/i18n';
import { palette } from '@psycron/theme/palette/palette.theme';
import { THERAPIST_ID } from '@psycron/utils/tokens';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import {
	CancelChoiceCard,
	CancelChoiceCardSub,
	CancelChoiceCardTitle,
	CancelChoiceWrapper,
	CancelViewBody,
	ConfirmedBadge,
	ConfirmedBadgeText,
	DrawerBadgeRow,
	DrawerDetailIcon,
	DrawerDetailLabel,
	DrawerDetailRow,
	DrawerDetailsList,
	DrawerDetailSub,
	DrawerDetailValue,
	DrawerDetailWrapper,
	FormWrapper,
	SlotPickerChip,
	SlotPickerChipsRow,
	SlotPickerDateLabel,
	SlotPickerGroup,
	SlotPickerList,
	SourceBadge,
	SourceBadgeText,
} from './AvailabilityWeekDrawer.styles';
import type {
	IAvailabilityWeekDrawerProps,
	IDrawerDetail,
} from './AvailabilityWeekDrawer.types';
import {
	computeEndTime,
	computeTimeStrings,
	STATUS_CONFIG,
} from './AvailabilityWeekDrawer.utils';

type CancelView =
	| 'block-confirm'
	| 'cancel-reason'
	| 'reschedule-or-cancel'
	| 'reschedule-slots';

interface IRescheduleSlot {
	availabilityDayId: string;
	slotId: string;
	startTime: string;
}

const CANCEL_REASONS = [
	CancellationReasonEnum.EMERGENCY,
	CancellationReasonEnum.SCHEDULE_CONFLICT,
	CancellationReasonEnum.FINANCIAL_ISSUES,
	CancellationReasonEnum.MENTAL_HEALTH,
	CancellationReasonEnum.NO_SHOW,
	CancellationReasonEnum.OTHER,
] as const;

// ─── useBookingForm ────────────────────────────────────────────────────────────

const useBookingForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null
) => {
	const { bookAppointmentWithLink } = usePatient();
	const methods = useForm<ICreatePatientForm>({ mode: 'onChange' });
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = (formData: ICreatePatientForm) => {
		const { email, firstName, lastName } = formData;
		const { fullPhone, fullWhatsapp } = getFormattedContacts(formData);

		bookAppointmentWithLink({
			therapistId,
			data: {
				availabilityDayId: slot.availabilityDayId ?? '',
				slotId: slot._id ?? slot.id,
				patient: {
					firstName,
					lastName,
					contacts: {
						email,
						phone: fullPhone,
						...(fullWhatsapp ? { whatsapp: fullWhatsapp } : {}),
					},
				},
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				shouldReplicate: false,
			},
		});
	};

	return { isSubmitting, methods, submitBooking: handleSubmit(onSubmit) };
};

// ─── useEditSlotForm ───────────────────────────────────────────────────────────

const useEditSlotForm = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	onSaved: (patch: { endTime?: string; note?: string; startTime?: string }) => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [startTime, setStartTime] = useState(slot.startTime);
	const [endTime, setEndTime] = useState(computeEndTime(slot.startTime, slot.duration));
	const [note, setNote] = useState(slot.notes ?? '');

	const mutation = useMutation({
		mutationFn: () =>
			editSlot({
				availabilityDayId: slot.availabilityDayId ?? '',
				endTime,
				note: note || undefined,
				slotId: slot._id ?? slot.id,
				startTime,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({ message: t('availability.week.drawer.edit-error'), severity: 'error' });
		},
		onSuccess: (data) => {
			showAlert({
				message: data.wasBooked
					? t('availability.week.drawer.edit-success-booked')
					: t('availability.week.drawer.edit-success'),
				severity: data.wasBooked ? 'warning' : 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onSaved({ endTime, note: note || undefined, startTime });
		},
	});

	return { endTime, mutation, note, setEndTime, setNote, setStartTime, startTime };
};

// ─── useBlockSlot ──────────────────────────────────────────────────────────────

const useBlockSlot = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	onBlocked: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () =>
			editSlotStatus({
				availabilityDayId: slot.availabilityDayId ?? '',
				data: { newStatus: 'BLOCKED', startTime: slot.startTime },
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({ message: t('availability.week.drawer.block-error'), severity: 'error' });
		},
		onSuccess: () => {
			showAlert({ message: t('availability.week.drawer.block-success'), severity: 'success' });
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onBlocked();
		},
	});

	return { mutation };
};

// ─── useCancelSlot ─────────────────────────────────────────────────────────────

const useCancelSlot = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	onCancelled: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [reasonCode, setReasonCode] = useState<CancellationReasonType | null>(null);
	const [customReason, setCustomReason] = useState('');

	const mutation = useMutation({
		mutationFn: () =>
			cancelAppointmentByPatient({
				...(customReason ? { customReason } : {}),
				patientId: slot.patientId ?? '',
				reasonCode: reasonCode!,
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
				triggeredBy: 'THERAPIST',
			}),
		onError: () => {
			showAlert({ message: t('availability.week.drawer.cancel-error'), severity: 'error' });
		},
		onSuccess: () => {
			showAlert({ message: t('availability.week.drawer.cancel-success'), severity: 'success' });
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onCancelled();
		},
	});

	const reset = () => {
		setReasonCode(null);
		setCustomReason('');
	};

	return { customReason, mutation, reasonCode, reset, setCustomReason, setReasonCode };
};

// ─── useReschedule ─────────────────────────────────────────────────────────────

const useReschedule = (
	currentSlot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	appointmentDetails: AppointmentDetailsBySlotIdResponse | undefined,
	onRescheduled: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [selectedSlot, setSelectedSlot] = useState<IRescheduleSlot | null>(null);

	const mutation = useMutation({
		mutationFn: async () => {
			if (!selectedSlot || !currentSlot.patientId || !appointmentDetails) return;

			await cancelAppointmentByPatient({
				patientId: currentSlot.patientId,
				reasonCode: CancellationReasonEnum.SCHEDULE_CONFLICT,
				slotId: currentSlot._id ?? currentSlot.id,
				therapistId: therapistId ?? '',
				triggeredBy: 'THERAPIST',
			});

			await bookAppointmentFromLink({
				therapistId: therapistId ?? '',
				data: {
					availabilityDayId: selectedSlot.availabilityDayId,
					patient: appointmentDetails.appointment.patient,
					shouldReplicate: false,
					slotId: selectedSlot.slotId,
					timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				},
			});
		},
		onError: () => {
			showAlert({ message: t('availability.week.drawer.reschedule-error'), severity: 'error' });
		},
		onSuccess: () => {
			showAlert({ message: t('availability.week.drawer.reschedule-success'), severity: 'success' });
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onRescheduled();
		},
	});

	return { mutation, selectedSlot, setSelectedSlot };
};

// ─── AvailabilityWeekDrawer ────────────────────────────────────────────────────

export const AvailabilityWeekDrawer = ({
	slot,
	onClose,
}: IAvailabilityWeekDrawerProps) => {
	const { t } = useTranslation();
	const therapistId = useSecureStorage(THERAPIST_ID);
	const { userDetails } = useUserDetails(therapistId ?? undefined);
	const [isEditing, setIsEditing] = useState(false);
	const [cancelView, setCancelView] = useState<CancelView | null>(null);

	const { isSubmitting, methods, submitBooking } = useBookingForm(slot, therapistId);
	const {
		endTime: editEndTime,
		mutation: editMutation,
		note: editNote,
		setEndTime: setEditEndTime,
		setNote: setEditNote,
		setStartTime: setEditStartTime,
		startTime: editStartTime,
	} = useEditSlotForm(slot, therapistId, () => setIsEditing(false));

	const blockSlot = useBlockSlot(slot, therapistId, onClose);
	const cancelSlot = useCancelSlot(slot, therapistId, onClose);

	const isAvailable = slot.status === 'available';
	const isBooked = slot.status === 'booked-jupiter' || slot.status === 'booked-google';
	const isGoogle = slot.status === 'booked-google';

	const slotId = slot._id ?? slot.id;
	const { data: appointmentDetails } = useQuery({
		queryKey: ['slotAppointmentDetails', slotId],
		queryFn: () =>
			getAppointmentDetailsBySlotId(
				therapistId ?? '',
				slot.availabilityDayId ?? '',
				slotId
			),
		enabled: isBooked && !!therapistId && !!slotId && !!slot.availabilityDayId,
		staleTime: 1000 * 60 * 5,
	});

	const reschedule = useReschedule(slot, therapistId, appointmentDetails, onClose);

	const patientName = appointmentDetails?.appointment?.patient
		? [
				appointmentDetails.appointment.patient.firstName,
				appointmentDetails.appointment.patient.lastName,
			]
				.filter(Boolean)
				.join(' ') || undefined
		: undefined;

	// ─── Available slots for reschedule picker ────────────────────────────────
	const { availabilityData } = useAvailability();
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;
	const todayStr = format(new Date(), 'yyyy-MM-dd');

	const availableSlotGroups = useMemo(() => {
		if (!availabilityData?.dates) return [];
		return availabilityData.dates
			.filter((d) => d.date >= todayStr)
			.reduce<
				Array<{
					availabilityDayId: string;
					date: string;
					formattedDate: string;
					slots: IRescheduleSlot[];
				}>
			>((groups, d) => {
				const available = (d.slots ?? []).filter(
					(s) => s.status === StatusEnum.AVAILABLE
				);
				if (!available.length) return groups;
				groups.push({
					availabilityDayId: String(d.dateId),
					date: d.date,
					formattedDate: format(parseISO(d.date), 'EEE, dd MMM', {
						locale: dateLocale,
					}),
					slots: available.map((s) => ({
						availabilityDayId: String(d.dateId),
						slotId: String(s._id),
						startTime: s.startTime,
					})),
				});
				return groups;
			}, []);
	}, [availabilityData?.dates, todayStr, dateLocale]);

	// ─── Slot details ─────────────────────────────────────────────────────────
	const statusCfg = STATUS_CONFIG[slot.status];
	const endTime = computeEndTime(slot.startTime, slot.duration);
	const formattedDate = format(parseISO(slot.date), 'PPPP', {
		locale: dateLocale,
	});

	const { therapistTimeStr, patientTimeStr } = useMemo(() => {
		const therapistTZ =
			userDetails?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
		return computeTimeStrings(slot, endTime, therapistTZ, dateLocale);
	}, [slot, endTime, userDetails?.timeZone, dateLocale]);

	const timeSub = `${t('availability.week.drawer.session-duration')}${slot.duration} ${t('availability.week.drawer.minutes')}`;

	const details: IDrawerDetail[] = isAvailable
		? [
				{
					icon: <Calendar color={palette.brand.purple} />,
					key: 'date',
					label: t('availability.week.drawer.date'),
					value: formattedDate,
				},
				{
					icon: <Watch color={palette.brand.purple} />,
					key: 'time',
					label: t('availability.week.drawer.your-time'),
					sub: timeSub,
					value: therapistTimeStr,
				},
			]
		: [
				{
					icon: <Watch color={palette.brand.purple} />,
					key: 'time',
					label: t('availability.week.drawer.your-time'),
					sub: timeSub,
					value: therapistTimeStr,
				},
				...(patientTimeStr
					? [
							{
								icon: <MapPin color={palette.brand.purple} />,
								key: 'patient-time',
								label: t('availability.week.drawer.patient-time'),
								value: patientTimeStr,
							},
						]
					: []),
				...(slot.therapyType
					? [
							{
								icon: <Account color={palette.brand.purple} />,
								key: 'therapy-type',
								label: t('availability.week.drawer.session-type'),
								value: slot.therapyType,
							},
						]
					: []),
				...(slot.notes
					? [
							{
								icon: <Appointment color={palette.brand.purple} />,
								key: 'notes',
								label: t('availability.week.drawer.notes'),
								value: slot.notes,
							},
						]
					: []),
			];

	// ─── Actions ──────────────────────────────────────────────────────────────
	const getActions = () => {
		if (isEditing) {
			return (
				<>
					<Button
						fullWidth
						disabled={editMutation.isPending}
						onClick={() => editMutation.mutate()}
						tertiary
						variant='contained'
					>
						{t('availability.week.drawer.edit-save')}
					</Button>
					<Button
						fullWidth
						disabled={editMutation.isPending}
						onClick={() => setIsEditing(false)}
					>
						{t('common.cancel')}
					</Button>
				</>
			);
		}

		if (cancelView === 'block-confirm') {
			return (
				<>
					<Button
						fullWidth
						disabled={blockSlot.mutation.isPending}
						onClick={() => blockSlot.mutation.mutate()}
						severity='error'
						variant='contained'
					>
						{t('availability.week.drawer.block-confirm')}
					</Button>
					<Button
						fullWidth
						disabled={blockSlot.mutation.isPending}
						onClick={() => setCancelView(null)}
					>
						{t('availability.week.drawer.cancel-back')}
					</Button>
				</>
			);
		}

		if (cancelView === 'reschedule-or-cancel') {
			return (
				<Button fullWidth onClick={() => setCancelView(null)}>
					{t('availability.week.drawer.cancel-back')}
				</Button>
			);
		}

		if (cancelView === 'cancel-reason') {
			return (
				<>
					<Button
						fullWidth
						disabled={!cancelSlot.reasonCode || cancelSlot.mutation.isPending}
						onClick={() => cancelSlot.mutation.mutate()}
						severity='error'
						variant='contained'
					>
						{t('availability.week.drawer.cancel-confirm')}
					</Button>
					<Button
						fullWidth
						disabled={cancelSlot.mutation.isPending}
						onClick={() => {
							setCancelView('reschedule-or-cancel');
							cancelSlot.reset();
						}}
					>
						{t('availability.week.drawer.cancel-back')}
					</Button>
				</>
			);
		}

		if (cancelView === 'reschedule-slots') {
			return (
				<>
					<Button
						fullWidth
						disabled={!reschedule.selectedSlot || reschedule.mutation.isPending}
						onClick={() => reschedule.mutation.mutate()}
						tertiary
						variant='contained'
					>
						{t('availability.week.drawer.reschedule-confirm')}
					</Button>
					<Button
						fullWidth
						disabled={reschedule.mutation.isPending}
						onClick={() => {
							setCancelView('reschedule-or-cancel');
							reschedule.setSelectedSlot(null);
						}}
					>
						{t('availability.week.drawer.cancel-back')}
					</Button>
				</>
			);
		}

		if (isAvailable) {
			return (
				<>
					<Button
						fullWidth
						disabled={isSubmitting}
						onClick={submitBooking}
						tertiary
						variant='contained'
					>
						{t('availability.week.drawer.confirm-booking')}
					</Button>
					<Button
						fullWidth
						severity='error'
						onClick={() => setCancelView('block-confirm')}
					>
						{t('availability.week.drawer.block-slot')}
					</Button>
				</>
			);
		}

		return (
			<>
				<Button
					fullWidth
					tertiary
					onClick={() => {
						setIsEditing(true);
						setCancelView(null);
					}}
				>
					{t('availability.week.drawer.edit')}
				</Button>
				<Button
					fullWidth
					severity='error'
					onClick={() => setCancelView('reschedule-or-cancel')}
				>
					{t('availability.week.drawer.cancel-appointment')}
				</Button>
			</>
		);
	};

	// ─── Body ─────────────────────────────────────────────────────────────────
	const getBody = () => {
		if (isEditing) {
			return (
				<FormWrapper>
					<TextField
						fullWidth
						label={t('availability.week.drawer.edit-start-time')}
						onChange={(e) => setEditStartTime(e.target.value)}
						size='small'
						type='time'
						value={editStartTime}
					/>
					<TextField
						fullWidth
						label={t('availability.week.drawer.edit-end-time')}
						onChange={(e) => setEditEndTime(e.target.value)}
						size='small'
						type='time'
						value={editEndTime}
					/>
					<TextField
						fullWidth
						label={t('availability.week.drawer.edit-note')}
						maxRows={4}
						multiline
						onChange={(e) => setEditNote(e.target.value)}
						size='small'
						value={editNote}
					/>
				</FormWrapper>
			);
		}

		if (cancelView === 'block-confirm') {
			return (
				<CancelViewBody>
					{t('availability.week.drawer.block-confirm-body')}
				</CancelViewBody>
			);
		}

		if (cancelView === 'reschedule-or-cancel') {
			return (
				<CancelChoiceWrapper>
					<CancelChoiceCard onClick={() => setCancelView('reschedule-slots')}>
						<CancelChoiceCardTitle>
							{t('availability.week.drawer.reschedule')}
						</CancelChoiceCardTitle>
						<CancelChoiceCardSub>
							{t('availability.week.drawer.reschedule-choice-sub')}
						</CancelChoiceCardSub>
					</CancelChoiceCard>
					<CancelChoiceCard isDanger onClick={() => setCancelView('cancel-reason')}>
						<CancelChoiceCardTitle>
							{t('availability.week.drawer.cancel-appointment')}
						</CancelChoiceCardTitle>
						<CancelChoiceCardSub>
							{t('availability.week.drawer.cancel-choice-sub')}
						</CancelChoiceCardSub>
					</CancelChoiceCard>
				</CancelChoiceWrapper>
			);
		}

		if (cancelView === 'cancel-reason') {
			return (
				<FormWrapper>
					<TextField
						select
						fullWidth
						label={t('availability.week.drawer.cancel-reason-label')}
						onChange={(e) =>
							cancelSlot.setReasonCode(
								Number(e.target.value) as CancellationReasonType
							)
						}
						size='small'
						value={cancelSlot.reasonCode ?? ''}
					>
						{CANCEL_REASONS.map((val) => (
							<MenuItem key={val} value={val}>
								{t(`globals.cancellation-reason.${val}`)}
							</MenuItem>
						))}
					</TextField>
					{cancelSlot.reasonCode === CancellationReasonEnum.OTHER && (
						<TextField
							fullWidth
							label={t('availability.week.drawer.cancel-custom-reason-label')}
							maxRows={3}
							multiline
							onChange={(e) => cancelSlot.setCustomReason(e.target.value)}
							size='small'
							value={cancelSlot.customReason}
						/>
					)}
				</FormWrapper>
			);
		}

		if (cancelView === 'reschedule-slots') {
			return (
				<>
					<CancelViewBody>
						{t('availability.week.drawer.reschedule-select-prompt')}
					</CancelViewBody>
					<SlotPickerList>
						{availableSlotGroups.map((group) => (
							<SlotPickerGroup key={group.date}>
								<SlotPickerDateLabel>{group.formattedDate}</SlotPickerDateLabel>
								<SlotPickerChipsRow>
									{group.slots.map((s) => {
										const isSelected =
											reschedule.selectedSlot?.slotId === s.slotId;
										return (
											<SlotPickerChip
												key={s.slotId}
												isSelected={isSelected}
												onClick={() => reschedule.setSelectedSlot(s)}
											>
												{s.startTime}
											</SlotPickerChip>
										);
									})}
								</SlotPickerChipsRow>
							</SlotPickerGroup>
						))}
					</SlotPickerList>
				</>
			);
		}

		return (
			<>
				<DrawerDetailsList>
					{details.map(({ icon, key, label, sub, value }) => (
						<DrawerDetailRow key={key}>
							<DrawerDetailIcon>{icon}</DrawerDetailIcon>
							<DrawerDetailWrapper>
								<DrawerDetailLabel>{label}</DrawerDetailLabel>
								<DrawerDetailValue>{value}</DrawerDetailValue>
								{sub && <DrawerDetailSub>{sub}</DrawerDetailSub>}
							</DrawerDetailWrapper>
						</DrawerDetailRow>
					))}
				</DrawerDetailsList>

				{isAvailable && (
					<FormProvider {...methods}>
						<Box component='form'>
							<FormWrapper>
								<NameForm<ICreatePatientForm>
									required
									fields={{ firstName: 'firstName', lastName: 'lastName' }}
									labelFirstName={t(
										'availability.week.drawer.patient-first-name'
									)}
									labelLastName={t('availability.week.drawer.patient-last-name')}
									placeholderFirstName={t(
										'availability.week.drawer.patient-first-name'
									)}
									placeholderLastName={t(
										'availability.week.drawer.patient-last-name'
									)}
								/>
								<ContactsForm<ICreatePatientForm>
									atLeastOneContact
									fullWidth
									labelEmail={t('availability.week.drawer.patient-email')}
									placeholderEmail={t('availability.week.drawer.patient-email')}
									fields={{
										email: 'email',
										hasWhatsApp: 'hasWhatsApp',
										isPhoneWpp: 'isPhoneWpp',
										phone: 'phone',
										whatsapp: 'whatsapp',
									}}
								/>
							</FormWrapper>
						</Box>
					</FormProvider>
				)}
			</>
		);
	};

	return (
		<Drawer
			ariaLabel={
				isAvailable ? t('availability.week.drawer.book-slot') : (patientName ?? '')
			}
			title={
				isAvailable ? t('availability.week.drawer.book-slot') : (patientName ?? '')
			}
			headerExtra={
				<>
					{!isAvailable && (
						<DrawerDetailLabel>{formattedDate}</DrawerDetailLabel>
					)}
					<DrawerBadgeRow>
						{isAvailable ? (
							<ConfirmedBadge>
								<ConfirmedBadgeText>
									{slot.startTime} – {endTime}
								</ConfirmedBadgeText>
							</ConfirmedBadge>
						) : (
							<>
								{statusCfg && (
									<ConfirmedBadge badgeColor={statusCfg.badgeColor}>
										<ConfirmedBadgeText>
											{t(statusCfg.labelKey)}
										</ConfirmedBadgeText>
									</ConfirmedBadge>
								)}
								<SourceBadge isGoogle={isGoogle}>
									{isGoogle ? (
										<Google color={palette.white} />
									) : (
										<Jupiter color={palette.brand.purple} />
									)}
									<SourceBadgeText isGoogle={isGoogle}>
										{isGoogle ? 'Google' : 'Júpiter'}
									</SourceBadgeText>
								</SourceBadge>
							</>
						)}
					</DrawerBadgeRow>
				</>
			}
			onClose={onClose}
			actions={getActions()}
		>
			{getBody()}
		</Drawer>
	);
};
