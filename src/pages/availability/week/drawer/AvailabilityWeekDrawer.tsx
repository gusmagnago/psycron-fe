import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { Drawer } from '@psycron/components/drawer/Drawer';
import {
	Account,
	Appointment,
	Calendar,
	Globe,
	Google,
	Jupiter,
	Mail,
	MapPin,
	Phone,
	Watch,
	WhatsApp,
} from '@psycron/components/icons';
import { Modal } from '@psycron/components/modal/Modal';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import i18n from '@psycron/i18n';
import { palette } from '@psycron/theme/palette/palette.theme';
import { THERAPIST_ID } from '@psycron/utils/tokens';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { DrawerActions } from './components/DrawerActions';
import { useBookingForm } from './hooks/useBookingForm';
import { useDrawerActions } from './hooks/useDrawerActions';
import { useEditSlotForm } from './hooks/useEditSlotForm';
import {
	useBlockSlot,
	useCancelSlot,
	useReschedule,
} from './hooks/useSlotActions';
import { useSlotAddress } from './hooks/useSlotAddress';
import { SlotAvailableBody } from './views/slot-available-body/SlotAvailableBody';
import { SlotBookingConflictView } from './views/slot-booking-conflict/SlotBookingConflictView';
import { SlotCancelChoiceView } from './views/slot-cancel-choice-view/SlotCancelChoiceView';
import { SlotCancelReasonForm } from './views/slot-cancel-reason-form/SlotCancelReasonForm';
import { SlotDetailView } from './views/slot-detail-view/SlotDetailView';
import { SlotEditForm } from './views/slot-edit-form/SlotEditForm';
import { SlotReschedulePicker } from './views/slot-reschedule-picker/SlotReschedulePicker';
import {
	CancelViewBody,
	ConfirmedBadge,
	ConfirmedBadgeText,
	ContactLinkAnchor,
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
	LocationChoice,
} from './AvailabilityWeekDrawer.types';
import {
	buildContactLink,
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
	const [overrideAddress, setOverrideAddress] = useState(() => !!slot.address);

	const getInitialLocationChoice = (): LocationChoice => {
		if (slot.letPatientChooseAddress) return 'patient';
		if (slot.address) return 'custom';
		return 'clinic';
	};
	const [locationChoice, setLocationChoice] = useState<LocationChoice>(
		getInitialLocationChoice
	);

	useEffect(() => {
		setLocationChoice(getInitialLocationChoice());
		setOverrideAddress(!!slot.address);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slot.address, slot.letPatientChooseAddress]);

	// ─── Slot flags ───────────────────────────────────────────────────────────
	const isAvailable = slot.status === 'available';
	const isBooked =
		slot.status === 'booked-jupiter' || slot.status === 'booked-google';
	const isGoogle = slot.status === 'booked-google';
	const sessionType = availability?.sessionType;
	const hasInPersonAddress = !!userDetails?.clinicAddress?.street;
	const isInPersonSession =
		sessionType === 'IN_PERSON' || sessionType === 'BOTH';
	const showAddressInEdit = isBooked && isInPersonSession && hasInPersonAddress;

	// ─── Hooks ────────────────────────────────────────────────────────────────
	const slotAddress = useSlotAddress(
		slot,
		therapistId,
		availability?.specialty
	);

	const {
		conflict,
		confirmWithExisting,
		dismissConflict,
		isChecking,
		isSubmitting,
		methods,
		submitBooking,
	} = useBookingForm(slot, therapistId, locationChoice, slotAddress.address, onClose);

	const editSlotForm = useEditSlotForm(
		slot,
		therapistId,
		showAddressInEdit,
		() => setView('default')
	);

	const blockSlot = useBlockSlot(slot, therapistId, onClose);
	const cancelSlot = useCancelSlot(slot, therapistId, onClose);

	const slotId = slot._id ?? slot.id;
	const { availabilityData, appointmentDetailsBySlotId } = useAvailability(
		undefined,
		slot.availabilityDayId,
		slotId,
		slot.patientId
	);

	const reschedule = useReschedule(
		slot,
		therapistId,
		appointmentDetailsBySlotId,
		onClose
	);

	// ─── Location choice handler ───────────────────────────────────────────────
	const handleLocationChoiceChange = (choice: LocationChoice) => {
		setLocationChoice(choice);
		if (choice === 'patient') {
			slotAddress.setLetPatientChoose(true);
			slotAddress.clear();
		} else {
			if (locationChoice === 'patient') {
				slotAddress.setLetPatientChoose(false);
			}
			if (choice !== 'custom') {
				slotAddress.clear();
			}
		}
	};

	// ─── Custom address field updater ─────────────────────────────────────────
	const emptyAddress: ISlotAddress = {
		city: '',
		country: '',
		postcode: '',
		street: '',
	};

	const handleCustomAddressChange = (
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

	const patientTZOverride =
		appointmentDetailsBySlotId?.appointment?.patient?.timeZone ?? undefined;

	const { therapistTimeStr, patientTimeStr } = useMemo(() => {
		const therapistTZ =
			userDetails?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
		return computeTimeStrings(
			slot,
			endTime,
			therapistTZ,
			dateLocale,
			patientTZOverride
		);
	}, [slot, endTime, userDetails?.timeZone, dateLocale, patientTZOverride]);

	const timeSub = `${t('availability.week.drawer.session-duration')}${slot.duration} ${t('availability.week.drawer.minutes')}`;

	const patientName = appointmentDetailsBySlotId?.appointment?.patient
		? [
				appointmentDetailsBySlotId.appointment.patient.firstName,
				appointmentDetailsBySlotId.appointment.patient.lastName,
			]
				.filter(Boolean)
				.join(' ') || undefined
		: undefined;

	// ─── Available slot groups for reschedule picker ──────────────────────────

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
	const DASH = '—';
	const apptPatient = appointmentDetailsBySlotId?.appointment?.patient;
	const appt = appointmentDetailsBySlotId?.appointment;

	// ─── Contact link ─────────────────────────────────────────────────────────
	const contactLink = isBooked
		? buildContactLink(apptPatient?.preferredContact)
		: null;

	const CONTACT_LINK_ICON: Record<
		'google_meet' | 'phone' | 'whatsapp' | 'zoom',
		JSX.Element
	> = {
		google_meet: <Google color={palette.brand.purple} />,
		phone: <Phone color={palette.brand.purple} />,
		whatsapp: <WhatsApp color={palette.brand.purple} />,
		zoom: <Globe color={palette.brand.purple} />,
	};

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
				{
					icon: <Mail color={palette.brand.purple} />,
					key: 'email',
					label: t('availability.week.drawer.patient-email'),
					value: apptPatient?.contacts?.email ?? DASH,
				},
				{
					icon: <Phone color={palette.brand.purple} />,
					key: 'phone',
					label: t('availability.week.drawer.patient-phone'),
					value: apptPatient?.contacts?.phone ?? DASH,
				},
				...(apptPatient?.contacts?.whatsapp &&
				apptPatient.contacts.whatsapp !== apptPatient.contacts.phone
					? [
							{
								icon: <WhatsApp color={palette.brand.purple} />,
								key: 'whatsapp',
								label: 'WhatsApp',
								value: apptPatient.contacts.whatsapp,
							},
						]
					: []),
				...(appt?.address
					? [
							{
								icon: <MapPin color={palette.brand.purple} />,
								key: 'appointment-address',
								label: t('availability.week.drawer.appointment-address'),
								value: [
									appt.address.street,
									appt.address.city,
									appt.address.country,
								]
									.filter(Boolean)
									.join(', '),
							},
						]
					: appt?.letPatientChooseAddress
						? [
								{
									icon: <MapPin color={palette.brand.purple} />,
									key: 'appointment-address',
									label: t('availability.week.drawer.appointment-address'),
									value: t('availability.week.drawer.patient-provides-address'),
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
						{isAvailable ? (
							<SlotAvailableBody
								customAddress={slotAddress.address}
								locationChoice={locationChoice}
								methods={methods}
								onCustomAddressChange={handleCustomAddressChange}
								onLocationChoiceChange={handleLocationChoiceChange}
								sessionType={sessionType}
							/>
						) : (
							<Box></Box>
						)}
					</>
				);
		}
	};

	// ─── Actions ──────────────────────────────────────────────────────────────
	const drawerActions = useDrawerActions({
		blockSlot,
		cancelSlot,
		editSlotForm,
		hasConflict: !!conflict,
		isAvailable,
		isChecking,
		isSubmitting,
		reschedule,
		setView,
		submitBooking,
		view,
	});

	// ─── Header badges ────────────────────────────────────────────────────────
	const statusCfg = STATUS_CONFIG[slot.status];

	return (
		<>
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
			actions={
				<>
					{contactLink && view === 'default' && (
						<ContactLinkAnchor
							href={contactLink.href}
							rel='noopener noreferrer'
							target='_blank'
						>
							{CONTACT_LINK_ICON[contactLink.type]}
							{t(contactLink.labelKey)}
						</ContactLinkAnchor>
					)}
					<DrawerActions config={drawerActions} />
				</>
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
		>
			{renderBody()}
		</Drawer>
		{conflict && (
			<Modal
				openModal
				title={t('availability.week.drawer.conflict-title')}
				onClose={dismissConflict}
				cardActionsProps={
					conflict.kind === 'single'
						? {
								actionName: t('availability.week.drawer.conflict-confirm', {
									name: conflict.patient.firstName,
								}),
								onClick: () => confirmWithExisting(conflict.patient._id),
								hasSecondAction: true,
								secondActionName: t(
									'availability.week.drawer.conflict-change-details'
								),
								secondAction: dismissConflict,
							}
						: {
								actionName: t(
									'availability.week.drawer.conflict-change-details'
								),
								onClick: dismissConflict,
							}
				}
			>
				<SlotBookingConflictView conflict={conflict} />
			</Modal>
		)}
		</>
	);
};
