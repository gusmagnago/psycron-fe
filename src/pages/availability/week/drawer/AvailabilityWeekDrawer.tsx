import { useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { IPatientSearchResult } from '@psycron/api/user/availability/index.types';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { Account, Alert, Available, Ban, Google } from '@psycron/components/icons';
import { Modal } from '@psycron/components/modal/Modal';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import type {
	ISlotAddress,
	PreferredContactType,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { useJupiterAvailabilityConfig } from '@psycron/hooks/useJupiterAvailabilityConfig';
import { useSecureStorage } from '@psycron/hooks/useSecureStorage';
import i18n from '@psycron/i18n';
import { BufferTimeEditor } from '@psycron/pages/availability/components/buffer-time-editor/BufferTimeEditor';
import {
	buildBufferAdviceRequest,
	getBufferInsights,
} from '@psycron/pages/availability/components/buffer-time-editor/BufferTimeEditor.utils';
import { palette } from '@psycron/theme/palette/palette.theme';
import { THERAPIST_ID } from '@psycron/utils/tokens';
import { format, parseISO } from 'date-fns';
import { enGB, ptBR } from 'date-fns/locale';

import { DrawerActions } from './components/DrawerActions';
import { useBookingForm } from './hooks/useBookingForm';
import { useBufferTimeSetting } from './hooks/useBufferTimeSetting';
import { useDrawerActions } from './hooks/useDrawerActions';
import { useEditSlotForm } from './hooks/useEditSlotForm';
import { usePatientSearch } from './hooks/usePatientSearch';
import {
	useBlockSlot,
	useCancelSlot,
	useReschedule,
	useUnblockSlot,
} from './hooks/useSlotActions';
import { useSlotAddress } from './hooks/useSlotAddress';
import { SlotAvailableBody } from './views/slot-available-body/SlotAvailableBody';
import { SlotBlockedBody } from './views/slot-blocked-body/SlotBlockedBody';
import { SlotBookedBody } from './views/slot-booked-body/SlotBookedBody';
import {
	DeliveryBadge,
	PastDisabledFooter,
} from './views/slot-booked-body/SlotBookedBody.styles';
import { isPastAppointment } from './views/slot-booked-body/SlotBookedBody.utils';
import { SlotBookingConflictView } from './views/slot-booking-conflict/SlotBookingConflictView';
import { ConflictBody } from './views/slot-booking-conflict/SlotBookingConflictView.styles';
import { SlotBreakBody } from './views/slot-break-body/SlotBreakBody';
import { SlotCancelChoiceView } from './views/slot-cancel-choice-view/SlotCancelChoiceView';
import { SlotCancelReasonForm } from './views/slot-cancel-reason-form/SlotCancelReasonForm';
import { SlotCancelledBody } from './views/slot-cancelled-body/SlotCancelledBody';
import { SlotEditForm } from './views/slot-edit-form/SlotEditForm';
import { SlotReschedulePicker } from './views/slot-reschedule-picker/SlotReschedulePicker';
import {
	AvailableBadge,
	AvailableBadgeText,
	BlockConfirmWrapper,
	BlockReasonField,
	CancelViewBody,
	ConfirmedBadge,
	ConfirmedBadgeText,
	DrawerBadgeRow,
	DrawerDetailLabel,
	DrawerTitleRow,
	SourceBadge,
	SourceBadgeText,
} from './AvailabilityWeekDrawer.styles';
import type {
	DrawerView,
	IAvailabilityWeekDrawerProps,
	IExistingBooking,
	IRescheduleSlot,
	LocationChoice,
} from './AvailabilityWeekDrawer.types';
import {
	buildAvailabilityBookingLink,
	computeEndTime,
	computeTimeStrings,
	EMPTY_ADDRESS,
	getAvailableSessionDeliveryLabel,
	getBookedDeliveryLabel,
	getBookedShareWith,
	getCancelledSubtitle,
	getDrawerTitle,
	getInitialLocationChoice,
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
	const [locationChoice, setLocationChoice] = useState<LocationChoice>(() =>
		getInitialLocationChoice(slot)
	);

	useEffect(() => {
		setLocationChoice(getInitialLocationChoice(slot));
		setOverrideAddress(!!slot.address);
	}, [slot]);

	// ─── Slot flags ───────────────────────────────────────────────────────────
	const isAvailable = slot.status === 'available';
	const isBuffer = slot.status === 'buffer';
	const isBlocked = slot.status === 'blocked';
	const isCancelled = slot.status === 'cancelled';
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

	const slotId = isBuffer ? null : (slot._id ?? slot.id);
	const {
		availabilityData,
		appointmentDetailsBySlotId,
		isAppointmentDetailsBySlotIdLoading,
	} = useAvailability(
		undefined,
		slot.availabilityDayId,
		slotId,
		isBuffer ? undefined : slot.patientId
	);

	const patientSearch = usePatientSearch(therapistId);
	const [existingBooking, setExistingBooking] =
		useState<IExistingBooking | null>(null);

	const {
		conflict,
		confirmWithExisting,
		dismissConflict,
		isChecking,
		isSubmitting,
		methods,
		submitBooking,
	} = useBookingForm(
		slot,
		therapistId,
		locationChoice,
		slotAddress.address,
		onClose,
		patientSearch.selectedPatient?._id,
		sessionType
	);
	const watchedPatientTimeZone = useWatch({
		control: methods.control,
		name: 'timeZone',
	});

	const applyPatientToForm = (patient: IPatientSearchResult) => {
		if (!patient) return;
		patientSearch.setSelectedPatient(patient);
		patientSearch.setSearchQuery(patient.firstName);

		const hasWhatsApp = !!patient.contacts.whatsapp;
		const isPhoneWpp =
			hasWhatsApp && patient.contacts.whatsapp === patient.contacts.phone;

		const currentValues = methods.getValues();
		methods.reset({
			...currentValues,
			firstName: patient.firstName,
			lastName: patient.lastName,
			email: patient.contacts.email ?? '',
			phone: patient.contacts.phone ?? '',
			whatsapp: patient.contacts.whatsapp ?? '',
			hasWhatsApp,
			isPhoneWpp,
			preferredContact: patient.preferredContact
				? { type: patient.preferredContact as PreferredContactType }
				: undefined,
			timeZone: patient.timeZone ?? '',
		});
	};

	const findExistingBooking = (patientId: string): IExistingBooking | null => {
		if (!availabilityData?.dates) return null;
		for (const day of availabilityData.dates) {
			for (const s of day.slots ?? []) {
				if (s.patientId === patientId && s.status === StatusEnum.BOOKED) {
					return {
						date: day.date,
						patientName: s.patientSummary?.fullName ?? '',
						slotId: s._id,
						startTime: s.startTime,
					};
				}
			}
		}
		return null;
	};

	const handlePatientSelect = (patient: IPatientSearchResult) => {
		if (!patient) return;

		const existing = findExistingBooking(patient._id);
		if (existing) {
			// Store patient temporarily so we can apply after confirmation
			patientSearch.setSelectedPatient(patient);
			patientSearch.setSearchQuery(patient.firstName);
			setExistingBooking({
				...existing,
				patientName: `${patient.firstName} ${patient.lastName}`,
			});
			return;
		}

		applyPatientToForm(patient);
	};

	const handleExistingBookingConfirm = () => {
		setExistingBooking(null);
		applyPatientToForm(patientSearch.selectedPatient);
	};

	const handleExistingBookingDismiss = () => {
		setExistingBooking(null);
		patientSearch.clearSelection();
		patientSearch.setSearchQuery('');
		methods.setValue('firstName', '', { shouldValidate: false });
	};

	const handleSelectionClear = () => {
		patientSearch.clearSelection();
		methods.reset();
	};

	const editSlotForm = useEditSlotForm(
		slot,
		therapistId,
		showAddressInEdit,
		() => setView('default')
	);

	const blockSlot = useBlockSlot(slot, therapistId, onClose);
	const unblockSlot = useUnblockSlot(slot, therapistId, onClose);
	const cancelSlot = useCancelSlot(slot, therapistId, onClose);

	const reschedule = useReschedule(
		slot,
		therapistId,
		appointmentDetailsBySlotId,
		onClose
	);
	const bufferTime = useBufferTimeSetting(
		availability?.bufferTimeMinutes ?? slot.duration,
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

	const handleCustomAddressChange = (
		field: keyof ISlotAddress,
		value: string
	) => {
		slotAddress.setAddress({
			...(slotAddress.address ?? EMPTY_ADDRESS),
			[field]: value,
		});
	};

	const handleEditAddressChange = (
		field: keyof ISlotAddress,
		value: string
	) => {
		editSlotForm.setAddress({
			...(editSlotForm.address ?? EMPTY_ADDRESS),
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
		appointmentDetailsBySlotId?.appointment?.patient?.timeZone ??
		watchedPatientTimeZone ??
		undefined;

	const {
		patientTimeStr,
		patientTimeZoneName,
		therapistTimeStr,
		therapistTimeZoneName,
	} = useMemo(() => {
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
	const bookingLink = therapistId
		? buildAvailabilityBookingLink(therapistId, slot._id ?? slot.id)
		: '';
	const shareTitle = t('availability.week.drawer.booking-share-title', {
		date: formattedDate,
		time: `${slot.startTime} – ${endTime}`,
	});
	const shareText = t('availability.week.drawer.booking-share-text');

	const patientName = appointmentDetailsBySlotId?.appointment?.patient
		? [
				appointmentDetailsBySlotId.appointment.patient.firstName,
				appointmentDetailsBySlotId.appointment.patient.lastName,
			]
				.filter(Boolean)
				.join(' ') || undefined
		: (slot.patientName || (isGoogle ? (slot.notes || undefined) : undefined));
	const bookedShareWith = getBookedShareWith(t, patientName);
	const cancelledSubtitle = getCancelledSubtitle(t, slot.triggeredBy);
	const drawerTitle = getDrawerTitle({
		isAvailable,
		isBuffer,
		isBlocked,
		isCancelled,
		patientName,
		t,
	});
	const slotTimeLabel = `${slot.startTime} – ${endTime}`;
	const availableSessionDeliveryLabel = getAvailableSessionDeliveryLabel(
		t,
		sessionType
	);
	const isBookedOnline =
		slot.deliveryMode === 'online' ||
		(!slot.deliveryMode && sessionType === 'ONLINE');
	const bookedDeliveryLabel = getBookedDeliveryLabel(t, isBookedOnline);
	const reopenedCancellationNote =
		isAvailable && slot.canceledAt && slot.reopenedAt
			? t('availability.week.drawer.reopened-note-text', {
					date: format(parseISO(slot.canceledAt), 'PPP', {
						locale: dateLocale,
					}),
					name:
						slot.cancelledPatientName ??
						t('availability.week.drawer.reopened-note-fallback-name'),
				})
			: undefined;
	const bufferInsights = useMemo(
		() =>
			getBufferInsights({
				availability,
				availabilityData,
				bufferInput: bufferTime.bufferInput,
			}),
		[availability, availabilityData, bufferTime.bufferInput]
	);
	const bufferAdviceRequest = useMemo(
		() =>
			buildBufferAdviceRequest({
				availability,
				availabilityData,
				bufferInput: bufferTime.bufferInput,
				locale: i18n.language.startsWith('pt') ? 'pt' : 'en',
			}),
		[availability, availabilityData, bufferTime.bufferInput]
	);

	// ─── Available slot groups for reschedule picker ──────────────────────────

	const todayStr = format(new Date(), 'yyyy-MM-dd');
	const isPast = isBooked && isPastAppointment(slot.date);

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

	// ─── Detail rows (available slots only) ──────────────────────────────────
	const sessionDetails = {
		date: formattedDate,
		duration: timeSub,
		patientTime:
			isBooked || isAvailable ? (patientTimeStr ?? therapistTimeStr) : null,
		patientTimeZoneName:
			isBooked || isAvailable
				? (patientTimeZoneName ?? therapistTimeZoneName)
				: null,
		therapistTime: therapistTimeStr,
		therapistTimeZoneName,
	};

	const renderDefaultBody = () => {
		if (isCancelled) {
			return (
				<SlotCancelledBody
					canceledAt={slot.canceledAt}
					customReason={slot.customReason}
					reasonCode={slot.reasonCode}
					sessionDetails={sessionDetails}
				/>
			);
		}

		if (isBlocked) {
			return (
				<SlotBlockedBody
					blockedAt={slot.blockedAt}
					blockReason={slot.blockReason}
					sessionDetails={sessionDetails}
				/>
			);
		}

		if (isBooked) {
			return (
				<SlotBookedBody
					appointmentDetails={appointmentDetailsBySlotId}
					isGoogle={isGoogle}
					isLoading={isAppointmentDetailsBySlotIdLoading}
					isPast={isPast}
					patientName={patientName}
					sessionDetails={sessionDetails}
					sessionType={sessionType}
					slot={slot}
					bookingLink={bookingLink}
					shareText={shareText}
					shareTitle={shareTitle}
					shareWith={bookedShareWith}
				/>
			);
		}

		if (isBuffer) {
			return <SlotBreakBody sessionDetails={sessionDetails} />;
		}

		return (
			<>
				<SlotAvailableBody
					bookingLink={bookingLink}
					customAddress={slotAddress.address}
					locationChoice={locationChoice}
					methods={methods}
					onCustomAddressChange={handleCustomAddressChange}
					onLocationChoiceChange={handleLocationChoiceChange}
					onPatientSelect={handlePatientSelect}
					onSelectionClear={handleSelectionClear}
					reopenedCancellationNote={reopenedCancellationNote}
					results={patientSearch.results}
					searchIsLoading={patientSearch.isLoading}
					searchQuery={patientSearch.searchQuery}
					selectedPatient={patientSearch.selectedPatient}
					sessionDetails={sessionDetails}
					sessionType={sessionType}
					setSearchQuery={patientSearch.setSearchQuery}
					shareText={shareText}
					shareTitle={shareTitle}
				/>
			</>
		);
	};

	const renderBody = () => {
		switch (view) {
			case 'buffer-edit':
				return (
					<BlockConfirmWrapper>
						<CancelViewBody>
							{t('availability.week.drawer.break-edit-body')}
						</CancelViewBody>
						<BufferTimeEditor
							adviceRequest={bufferAdviceRequest}
							bufferInput={bufferTime.bufferInput}
							insights={bufferInsights}
							onChange={bufferTime.setBufferInput}
						/>
					</BlockConfirmWrapper>
				);
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
					<BlockConfirmWrapper>
						<CancelViewBody>
							{t('availability.week.drawer.block-confirm-body')}
						</CancelViewBody>
						<BlockReasonField
							fullWidth
							multiline
							rows={2}
							placeholder={t(
								'availability.week.drawer.block-reason-placeholder'
							)}
							value={blockSlot.blockReason}
							onChange={(e) => blockSlot.setBlockReason(e.target.value)}
							size='small'
							variant='outlined'
						/>
					</BlockConfirmWrapper>
				);
			case 'unblock-confirm':
				return (
					<CancelViewBody>
						{t('availability.week.drawer.unblock-confirm-body')}
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
				return renderDefaultBody();
		}
	};

	const renderDrawerActions = () => {
		if (isCancelled) {
			return (
				<>
					<PastDisabledFooter>
						<Alert color={palette.warning.main} />
						{cancelledSubtitle}
					</PastDisabledFooter>
					<DrawerActions config={drawerActions} />
				</>
			);
		}

		if (isBuffer && view === 'default') {
			return <DrawerActions config={drawerActions} />;
		}

		if (isPast) {
			return (
				<PastDisabledFooter>
					<Alert color={palette.gray['05']} />
					{t('availability.week.drawer.booked-past-disabled')}
				</PastDisabledFooter>
			);
		}

		return <DrawerActions config={drawerActions} />;
	};

	const renderDrawerTitle = () => {
		if (isBlocked) {
			return (
				<DrawerTitleRow>
					{drawerTitle}
					<Ban color={palette.error.main} />
				</DrawerTitleRow>
			);
		}

		if (isCancelled) {
			return (
				<DrawerTitleRow>
					{drawerTitle}
					<Alert color={palette.warning.main} />
				</DrawerTitleRow>
			);
		}

		return drawerTitle;
	};

	const renderHeaderMeta = () => {
		if (isBuffer) {
			return (
				<DrawerDetailLabel>
					{t('availability.week.drawer.break-subtitle')}
				</DrawerDetailLabel>
			);
		}

		if (!isAvailable && !isBlocked && !isCancelled) {
			return <DrawerDetailLabel>{formattedDate}</DrawerDetailLabel>;
		}

		if (isBlocked) {
			return (
				<DrawerDetailLabel>
					{t('availability.week.drawer.blocked-subtitle')}
				</DrawerDetailLabel>
			);
		}

		if (isCancelled) {
			return <DrawerDetailLabel>{cancelledSubtitle}</DrawerDetailLabel>;
		}

		return null;
	};

	const renderHeaderBadges = () => {
		if (isAvailable || isBuffer || isBlocked || isCancelled) {
			return (
				<>
					<ConfirmedBadge>
						<ConfirmedBadgeText>{slotTimeLabel}</ConfirmedBadgeText>
					</ConfirmedBadge>
					{isAvailable && (
						<AvailableBadge>
							<Available color={palette.success.dark} />
							<AvailableBadgeText>
								{t('availability.week.drawer.available-status-open')}
							</AvailableBadgeText>
						</AvailableBadge>
					)}
					{isAvailable && availableSessionDeliveryLabel && (
						<DeliveryBadge isOnline={sessionType === 'ONLINE'}>
							{availableSessionDeliveryLabel}
						</DeliveryBadge>
					)}
				</>
			);
		}

		return (
			<>
				<DeliveryBadge isOnline={isBookedOnline}>
					{bookedDeliveryLabel}
				</DeliveryBadge>
				<SourceBadge isGoogle={isGoogle}>
					{isGoogle
						? <Google color={palette.brand.google} />
						: <Account color={palette.brand.purple} />
					}
					<SourceBadgeText isGoogle={isGoogle}>
						{t(isGoogle
							? 'availability.week.drawer.source-google'
							: 'availability.week.drawer.source-manual'
						)}
					</SourceBadgeText>
				</SourceBadge>
			</>
		);
	};

	// ─── Actions ──────────────────────────────────────────────────────────────
	const drawerActions = useDrawerActions({
		blockSlot,
		bufferTime: {
			inputIsValid: bufferTime.isValid,
			removeMutation: bufferTime.removeMutation,
			reset: bufferTime.reset,
			saveMutation: bufferTime.saveMutation,
		},
		cancelSlot,
		editSlotForm,
		hasConflict: !!conflict,
		isAvailable,
		isBuffer,
		isBlocked,
		isCancelled,
		isChecking,
		isPast,
		isSubmitting,
		reschedule,
		setView,
		submitBooking,
		unblockSlot,
		view,
	});

	// ─── Header badges ────────────────────────────────────────────────────────
	return (
		<>
			<Drawer
				ariaLabel={drawerTitle}
				title={renderDrawerTitle()}
				actions={renderDrawerActions()}
				headerExtra={
					<>
						{renderHeaderMeta()}
						<DrawerBadgeRow>{renderHeaderBadges()}</DrawerBadgeRow>
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
			{existingBooking && (
				<Modal
					openModal
					title={t('availability.week.drawer.existing-booking-title')}
					onClose={handleExistingBookingDismiss}
					cardActionsProps={{
						actionName: t('availability.week.drawer.existing-booking-confirm'),
						onClick: handleExistingBookingConfirm,
						hasSecondAction: true,
						secondActionName: t(
							'availability.week.drawer.existing-booking-cancel'
						),
						secondAction: handleExistingBookingDismiss,
					}}
				>
					<ConflictBody>
						{t('availability.week.drawer.existing-booking-body', {
							name: existingBooking.patientName,
							date: format(parseISO(existingBooking.date), 'PPP', {
								locale: dateLocale,
							}),
							time: existingBooking.startTime,
						})}
					</ConflictBody>
				</Modal>
			)}
		</>
	);
};
