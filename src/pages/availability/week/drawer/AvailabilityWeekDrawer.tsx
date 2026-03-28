import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAppointmentDetailsBySlotId } from '@psycron/api/user/availability';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import {
	Account,
	Appointment,
	Calendar,
	Google,
	Jupiter,
	MapPin,
	Watch,
} from '@psycron/components/icons';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import i18n from '@psycron/i18n';
import { palette } from '@psycron/theme/palette/palette.theme';
import { THERAPIST_ID } from '@psycron/utils/tokens';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { useBookingForm } from './hooks/useBookingForm';
import { useEditSlotForm } from './hooks/useEditSlotForm';
import {
	useBlockSlot,
	useCancelSlot,
	useReschedule,
} from './hooks/useSlotActions';
import { useSlotAddress } from './hooks/useSlotAddress';
import { SlotAvailableBody } from './views/SlotAvailableBody';
import { SlotCancelChoiceView } from './views/SlotCancelChoiceView';
import { SlotCancelReasonForm } from './views/SlotCancelReasonForm';
import { SlotDetailView } from './views/SlotDetailView';
import { SlotEditForm } from './views/SlotEditForm';
import { SlotReschedulePicker } from './views/SlotReschedulePicker';
import {
	CancelViewBody,
	ConfirmedBadge,
	ConfirmedBadgeText,
	DrawerBadgeRow,
	DrawerDetailLabel,
	SourceBadge,
	SourceBadgeText,
} from './AvailabilityWeekDrawer.styles';
import type {
	DrawerView,
	IAvailabilityWeekDrawerProps,
	IDrawerDetail,
	IRescheduleSlot,
} from './AvailabilityWeekDrawer.types';
import {
	computeEndTime,
	computeTimeStrings,
	STATUS_CONFIG,
} from './AvailabilityWeekDrawer.utils';

export const AvailabilityWeekDrawer = ({
	slot,
	onClose,
}: IAvailabilityWeekDrawerProps) => {
	const { t } = useTranslation();
	const therapistId = useSecureStorage(THERAPIST_ID);
	const { userDetails } = useUserDetails(therapistId ?? undefined);
	const { availability } = useJupiterAvailabilityConfig();

	// ─── View state ───────────────────────────────────────────────────────────
	const [view, setView] = useState<DrawerView>('default');
	const [shareAddress, setShareAddress] = useState(false);
	const [overrideAddress, setOverrideAddress] = useState(
		() => !!slot.address
	);

	// ─── Slot flags ───────────────────────────────────────────────────────────
	const isAvailable = slot.status === 'available';
	const isBooked =
		slot.status === 'booked-jupiter' || slot.status === 'booked-google';
	const isGoogle = slot.status === 'booked-google';
	const sessionType = availability?.sessionType;
	const hasInPersonAddress = !!userDetails?.clinicAddress?.street;
	const isInPersonSession =
		sessionType === 'IN_PERSON' || sessionType === 'BOTH';
	const showSessionLocation =
		isAvailable && isInPersonSession && hasInPersonAddress;
	const showAddressInEdit =
		isBooked && isInPersonSession && hasInPersonAddress;

	// ─── Hooks ────────────────────────────────────────────────────────────────
	const slotAddress = useSlotAddress(slot, therapistId);

	const { isSubmitting, methods, submitBooking } = useBookingForm(
		slot,
		therapistId,
		shareAddress
	);

	const editSlotForm = useEditSlotForm(
		slot,
		therapistId,
		showAddressInEdit,
		() => setView('default')
	);

	const blockSlot = useBlockSlot(slot, therapistId, onClose);
	const cancelSlot = useCancelSlot(slot, therapistId, onClose);

	const slotId = slot._id ?? slot.id;
	const { data: appointmentDetails } = useQuery({
		enabled: isBooked && !!therapistId && !!slotId && !!slot.availabilityDayId,
		queryFn: () =>
			getAppointmentDetailsBySlotId(
				therapistId ?? '',
				slot.availabilityDayId ?? '',
				slotId
			),
		queryKey: ['slotAppointmentDetails', slotId],
		staleTime: 1000 * 60 * 5,
	});

	const reschedule = useReschedule(
		slot,
		therapistId,
		appointmentDetails,
		onClose
	);

	// ─── Toggle handlers ──────────────────────────────────────────────────────
	const handleShareAddressToggle = (val: boolean) => {
		setShareAddress(val);
		if (val) {
			setOverrideAddress(false);
			slotAddress.clear();
		}
	};

	const handleOverrideAddressToggle = (val: boolean) => {
		setOverrideAddress(val);
		if (!val) slotAddress.clear();
	};

	// ─── Address field updaters ───────────────────────────────────────────────
	const emptyAddress: ISlotAddress = {
		city: '',
		country: '',
		postcode: '',
		street: '',
	};

	const handleSlotAddressChange = (
		field: keyof ISlotAddress,
		value: string
	) => {
		slotAddress.setAddress({
			...(slotAddress.address ?? emptyAddress),
			[field]: value,
		});
	};

	const handleEditAddressChange = (
		field: keyof ISlotAddress,
		value: string
	) => {
		editSlotForm.setAddress({
			...(editSlotForm.address ?? emptyAddress),
			[field]: value,
		});
	};

	// ─── Derived data ─────────────────────────────────────────────────────────
	const dateLocale = i18n.language.startsWith('pt') ? ptBR : enGB;
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

	const patientName = appointmentDetails?.appointment?.patient
		? [
				appointmentDetails.appointment.patient.firstName,
				appointmentDetails.appointment.patient.lastName,
			]
				.filter(Boolean)
				.join(' ') || undefined
		: undefined;

	// ─── Available slot groups for reschedule picker ──────────────────────────
	const { availabilityData } = useAvailability();
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

	// ─── Detail rows ──────────────────────────────────────────────────────────
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

	// ─── Body ─────────────────────────────────────────────────────────────────
	const renderBody = () => {
		switch (view) {
			case 'editing':
				return (
					<SlotEditForm
						address={editSlotForm.address}
						endTime={editSlotForm.endTime}
						note={editSlotForm.note}
						onAddressChange={handleEditAddressChange}
						onAddressClear={() => editSlotForm.setAddress(null)}
						onEndTimeChange={editSlotForm.setEndTime}
						onNoteChange={editSlotForm.setNote}
						onOverrideAddressToggle={(val) => {
							setOverrideAddress(val);
							if (!val) editSlotForm.setAddress(null);
						}}
						onStartTimeChange={editSlotForm.setStartTime}
						overrideAddress={overrideAddress}
						showAddressSection={showAddressInEdit}
						startTime={editSlotForm.startTime}
					/>
				);
			case 'block-confirm':
				return (
					<CancelViewBody>
						{t('availability.week.drawer.block-confirm-body')}
					</CancelViewBody>
				);
			case 'reschedule-or-cancel':
				return (
					<SlotCancelChoiceView
						onCancel={() => setView('cancel-reason')}
						onReschedule={() => setView('reschedule-slots')}
					/>
				);
			case 'cancel-reason':
				return (
					<SlotCancelReasonForm
						customReason={cancelSlot.customReason}
						onCustomReasonChange={cancelSlot.setCustomReason}
						onReasonChange={cancelSlot.setReasonCode}
						reasonCode={cancelSlot.reasonCode}
					/>
				);
			case 'reschedule-slots':
				return (
					<SlotReschedulePicker
						availableSlotGroups={availableSlotGroups}
						onSelectSlot={reschedule.setSelectedSlot}
						selectedSlot={reschedule.selectedSlot}
					/>
				);
			default:
				return (
					<>
						<SlotDetailView details={details} />
						{isAvailable && (
							<SlotAvailableBody
								address={slotAddress.address}
								isAddressDirty={slotAddress.isDirty}
								isAddressSaving={slotAddress.mutation.isPending}
								methods={methods}
								onAddressChange={handleSlotAddressChange}
								onAddressSave={() => slotAddress.mutation.mutate()}
								onOverrideAddressToggle={handleOverrideAddressToggle}
								onShareAddressToggle={handleShareAddressToggle}
								overrideAddress={overrideAddress}
								shareAddress={shareAddress}
								showSessionLocation={showSessionLocation}
							/>
						)}
					</>
				);
		}
	};

	// ─── Actions ──────────────────────────────────────────────────────────────
	const renderActions = () => {
		switch (view) {
			case 'editing':
				return (
					<>
						<Button
							fullWidth
							disabled={
								editSlotForm.mutation.isPending || !editSlotForm.isDirty
							}
							onClick={() => editSlotForm.mutation.mutate()}
							tertiary
							variant='contained'
						>
							{t('availability.week.drawer.edit-save')}
						</Button>
						<Button
							fullWidth
							disabled={editSlotForm.mutation.isPending}
							onClick={() => setView('default')}
						>
							{t('common.cancel')}
						</Button>
					</>
				);
			case 'block-confirm':
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
							onClick={() => setView('default')}
						>
							{t('availability.week.drawer.cancel-back')}
						</Button>
					</>
				);
			case 'reschedule-or-cancel':
				return (
					<Button fullWidth onClick={() => setView('default')}>
						{t('availability.week.drawer.cancel-back')}
					</Button>
				);
			case 'cancel-reason':
				return (
					<>
						<Button
							fullWidth
							disabled={
								!cancelSlot.reasonCode || cancelSlot.mutation.isPending
							}
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
								setView('reschedule-or-cancel');
								cancelSlot.reset();
							}}
						>
							{t('availability.week.drawer.cancel-back')}
						</Button>
					</>
				);
			case 'reschedule-slots':
				return (
					<>
						<Button
							fullWidth
							disabled={
								!reschedule.selectedSlot || reschedule.mutation.isPending
							}
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
								setView('reschedule-or-cancel');
								reschedule.setSelectedSlot(null);
							}}
						>
							{t('availability.week.drawer.cancel-back')}
						</Button>
					</>
				);
			default:
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
								onClick={() => setView('block-confirm')}
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
							onClick={() => setView('editing')}
						>
							{t('availability.week.drawer.edit')}
						</Button>
						<Button
							fullWidth
							severity='error'
							onClick={() => setView('reschedule-or-cancel')}
						>
							{t('availability.week.drawer.cancel-appointment')}
						</Button>
					</>
				);
		}
	};

	// ─── Header badges ────────────────────────────────────────────────────────
	const statusCfg = STATUS_CONFIG[slot.status];

	return (
		<Drawer
			ariaLabel={
				isAvailable
					? t('availability.week.drawer.book-slot')
					: (patientName ?? '')
			}
			title={
				isAvailable
					? t('availability.week.drawer.book-slot')
					: (patientName ?? '')
			}
			actions={renderActions()}
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
		>
			{renderBody()}
		</Drawer>
	);
};
