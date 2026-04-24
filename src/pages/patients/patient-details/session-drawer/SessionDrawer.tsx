import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { editAppointment } from '@psycron/api/appointment';
import { editSlot } from '@psycron/api/availability';
import { getAvailabilityCalendar } from '@psycron/api/user';
import {
	cancelAppointmentByPatient,
	notifyPatientForSession,
} from '@psycron/api/user/availability';
import type { CancellationReasonEnum } from '@psycron/api/user/availability/index.types';
import { Button } from '@psycron/components/button/Button';
import { ShareButton } from '@psycron/components/button/share/ShareButton';
import {
	AlarmClock,
	AlarmClockCheck,
	AlarmClockMinus,
	AlarmClockOff,
	AlarmClockPlus,
} from '@psycron/components/icons';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { PatientDrawerShell } from '@psycron/pages/user/appointment/shared/PatientDrawerShell';
import {
	formatDateTimeRange,
	formatLocalizedDate,
} from '@psycron/utils/date/date.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, format } from 'date-fns';

import {
	getSessionCancellationNotificationWasSent,
	getSessionCancelledByLabelKey,
} from '../../PatientsPage.utils';
import {
	DetailLabel,
	DetailValue,
	DrawerDetailItem,
	DrawerDetailsList,
	DrawerFormGrid,
	SessionStatus,
} from '../PatientProfilePage.styles';

import {
	CancelForm,
	CancelReasonGrid,
	CancelReasonOption,
	NotificationRow,
	RescheduleEmpty,
	RescheduleGroup,
	RescheduleGroupLabel,
	ReschedulePicker,
	RescheduleSlotChip,
	RescheduleSlotsRow,
} from './SessionDrawer.styles';
import type {
	DrawerMode,
	SessionDrawerProps,
	SessionDrawerRescheduleSlot,
} from './SessionDrawer.types';
import {
	getSessionCancellationReasonLabel,
	getSessionDrawerAccentColor,
	getSessionDrawerMutationErrorKey,
	getSessionDrawerMutationSeverity,
	getSessionDrawerRescheduleGroups,
	getSessionDrawerStatusKey,
	getSessionDrawerTitleKey,
	THERAPIST_CANCEL_REASONS,
} from './SessionDrawer.utils';

export const SessionDrawer = ({
	initialMode,
	notifications,
	onClose,
	onRescheduleSuccess,
	patientId,
	patientName,
	publicSessionsLink,
	session,
	therapistId,
}: SessionDrawerProps) => {
	const { i18n, t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [drawerMode, setDrawerMode] = useState<DrawerMode>('details');
	const [reasonCode, setReasonCode] = useState<number | ''>('');
	const [customReason, setCustomReason] = useState('');
	const [sessionStartTime, setSessionStartTime] = useState(
		session.slot.startTime
	);
	const [sessionEndTime, setSessionEndTime] = useState(session.slot.endTime);
	const [selectedRescheduleSlot, setSelectedRescheduleSlot] =
		useState<SessionDrawerRescheduleSlot | null>(null);

	useEffect(() => {
		setSessionStartTime(session.slot.startTime);
		setSessionEndTime(session.slot.endTime);
		setDrawerMode(initialMode ?? 'details');
		setReasonCode('');
		setCustomReason('');
		setSelectedRescheduleSlot(null);
	}, [initialMode, session]);

	const canTimeEdit = Boolean(
		session.availabilityDayId && !session.isCancelled && !session.isPast
	);
	const notificationWasSent = getSessionCancellationNotificationWasSent(
		session,
		notifications
	);
	const fallback = t('patients.list.not-available');
	const rescheduleSearchStart = format(new Date(), 'yyyy-MM-dd');
	const rescheduleSearchEnd = format(addMonths(new Date(), 3), 'yyyy-MM-dd');

	const { data: availabilityCalendar } = useQuery({
		queryKey: [
			'patientSessionDrawerAvailability',
			therapistId,
			rescheduleSearchStart,
			rescheduleSearchEnd,
		],
		queryFn: () =>
			getAvailabilityCalendar(therapistId ?? '', {
				from: rescheduleSearchStart,
				to: rescheduleSearchEnd,
			}),
		enabled: Boolean(therapistId) && drawerMode === 'reschedule',
		staleTime: 1000 * 60,
	});

	const rescheduleSlotGroups = useMemo(
		() =>
			getSessionDrawerRescheduleGroups({
				availabilityDates: availabilityCalendar?.dates,
				language: i18n.language,
				sessionSlotId: session.slot._id,
			}),
		[availabilityCalendar?.dates, i18n.language, session.slot._id]
	);

	const resetDrawerState = (nextMode: DrawerMode = 'details') => {
		setDrawerMode(nextMode);
		setReasonCode('');
		setCustomReason('');
		setSelectedRescheduleSlot(null);
	};

	const handleClose = () => {
		if (rescheduleM.isPending || cancelM.isPending) return;
		resetDrawerState();
		onClose();
	};

	const rescheduleM = useMutation<
		| Awaited<ReturnType<typeof editAppointment>>
		| Awaited<ReturnType<typeof editSlot>>,
		unknown,
		void
	>({
		mutationFn: () => {
			if (session.isCancelled) {
				if (!selectedRescheduleSlot) throw new Error('missing-slot');

				return editAppointment({
					availabilityDayId: selectedRescheduleSlot.availabilityDayId,
					newSlotId: selectedRescheduleSlot.slotId,
					oldSlotId: session.slot._id,
					patientId,
					therapistId: therapistId ?? '',
				});
			}

			if (!session.availabilityDayId)
				throw new Error('Missing availability day id');

			if (
				sessionStartTime === session.slot.startTime &&
				sessionEndTime === session.slot.endTime
			) {
				throw new Error('no-change');
			}

			return editSlot({
				availabilityDayId: session.availabilityDayId,
				endTime: sessionEndTime,
				slotId: session.slot._id,
				startTime: sessionStartTime,
				therapistId: therapistId ?? '',
			});
		},
		onError: (err) => {
			showAlert({
				message: t(
					getSessionDrawerMutationErrorKey({
						error: err,
						isCancelled: session.isCancelled,
					})
				),
				severity: getSessionDrawerMutationSeverity(err),
			});
		},
		onSuccess: () => {
			showAlert({
				message: t(
					session.isCancelled
						? 'patients.profile.session-drawer.reschedule-success'
						: 'patients.profile.session-drawer.update-success'
				),
				severity: 'success',
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails', patientId],
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			capture(PostHogEvent.AppointmentRescheduled, {
				new_slot_start_time: session.isCancelled
					? (selectedRescheduleSlot?.startTime ?? '')
					: sessionStartTime,
				source: 'patient_center_drawer',
				triggered_by: 'therapist',
			});
			capture(PostHogEvent.PatientCenterSessionRescheduled, {
				mode: session.isCancelled ? 'cancelled' : 'upcoming',
				session_date: session.date,
			});
			onRescheduleSuccess();
		},
	});

	const cancelM = useMutation({
		mutationFn: () =>
			cancelAppointmentByPatient({
				...(customReason ? { customReason } : {}),
				patientId,
				reasonCode: reasonCode as CancellationReasonEnum,
				slotId: session.slot._id,
				therapistId: therapistId ?? '',
				triggeredBy: 'THERAPIST',
			}),
		onError: () => {
			showAlert({
				message: t('patients.profile.session-drawer.cancel-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			showAlert({
				message: t('patients.profile.session-drawer.cancel-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails', patientId],
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			capture(PostHogEvent.AppointmentCancelled, {
				reason_code: String(reasonCode),
				source: 'patient_center_drawer',
				triggered_by: 'therapist',
			});
			capture(PostHogEvent.PatientCenterSessionCancelled, {
				reason_code: String(reasonCode),
				session_date: session.date,
			});
			onClose();
		},
	});

	const notifyM = useMutation({
		mutationFn: () =>
			notifyPatientForSession(therapistId ?? '', session.slot._id),
		onError: () => {
			showAlert({
				message: t('patients.profile.session-drawer.notify-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			showAlert({
				message: t('patients.profile.session-drawer.notify-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails', patientId],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientListItem', therapistId, patientId],
			});
			capture(PostHogEvent.PatientCenterSessionNotified, {
				session_status: session.isCancelled ? 'cancelled' : 'upcoming',
				session_date: session.date,
			});
		},
	});

	const renderNotifyIconButton = () => {
		const tooltipText = notifyM.isPending
			? t('patients.profile.session-drawer.notify-sending')
			: notificationWasSent
				? t('patients.profile.session-drawer.notification-sent')
				: session.isPast
					? t('patients.profile.session-drawer.notification-not-sent')
					: t('patients.profile.session-drawer.notify');

		const isDisabled =
			notifyM.isPending || notificationWasSent || session.isPast;

		const icon = notifyM.isPending ? (
			<AlarmClock color='currentColor' />
		) : notificationWasSent ? (
			<AlarmClockCheck color='currentColor' />
		) : session.isPast ? (
			<AlarmClockOff color='currentColor' />
		) : session.isCancelled ? (
			<AlarmClockMinus color='currentColor' />
		) : (
			<AlarmClockPlus color='currentColor' />
		);

		return (
			<Tooltip placement='left' title={tooltipText}>
				<span>
					<IconButton
						aria-label={tooltipText}
						disabled={isDisabled}
						onClick={isDisabled ? undefined : () => notifyM.mutate()}
						size='small'
					>
						{icon}
					</IconButton>
				</span>
			</Tooltip>
		);
	};

	const renderActions = () => {
		if (session.isPast) return undefined;

		if (session.isCancelled) {
			if (drawerMode === 'reschedule') {
				return (
					<>
						<Button
							disabled={!selectedRescheduleSlot || rescheduleM.isPending}
							fullWidth
							loading={rescheduleM.isPending}
							onClick={() => rescheduleM.mutate()}
						>
							{t('patients.profile.session-drawer.reschedule-confirm')}
						</Button>
						<Button
							disabled={rescheduleM.isPending}
							fullWidth
							onClick={() => {
								resetDrawerState();
							}}
							variant='text'
						>
							{t('common.back')}
						</Button>
					</>
				);
			}

			return (
				<>
					<Button
						disabled={rescheduleM.isPending}
						fullWidth
						onClick={() => setDrawerMode('reschedule')}
					>
						{t('patients.profile.session-drawer.reschedule')}
					</Button>
					{!notificationWasSent ? (
						<Button
							disabled={notifyM.isPending}
							fullWidth
							loading={notifyM.isPending}
							onClick={() => notifyM.mutate()}
							secondary
						>
							{t('patients.profile.session-drawer.notify')}
						</Button>
					) : null}
				</>
			);
		}

		if (drawerMode === 'cancel') {
			return (
				<>
					<Button
						disabled={!reasonCode || cancelM.isPending}
						fullWidth
						loading={cancelM.isPending}
						onClick={() => cancelM.mutate()}
						severity='error'
					>
						{t('patients.profile.session-drawer.cancel-confirm')}
					</Button>
					<Button
						disabled={cancelM.isPending}
						fullWidth
						onClick={() => {
							resetDrawerState();
						}}
						variant='text'
					>
						{t('common.back')}
					</Button>
				</>
			);
		}

		return (
			<>
				<Button
					disabled={rescheduleM.isPending}
					fullWidth
					loading={rescheduleM.isPending}
					onClick={() => rescheduleM.mutate()}
				>
					{t('patients.profile.session-drawer.reschedule')}
				</Button>
				<Button
					disabled={rescheduleM.isPending}
					fullWidth
					onClick={() => setDrawerMode('cancel')}
					severity='error'
				>
					{t('patients.profile.session-drawer.cancel-session')}
				</Button>
			</>
		);
	};

	return (
		<PatientDrawerShell
			accentColor={getSessionDrawerAccentColor(session)}
			actions={renderActions()}
			ariaLabel={t('patients.profile.session-drawer.title')}
			closeLabel={t('common.close')}
			headerExtra={
				!session.isCancelled && !session.isPast ? (
					<ShareButton
						absoluteUrl={publicSessionsLink}
						preferNativeShare
						shareWith={patientName}
						textKey={t('patients.profile.share.text')}
						titleKey={t('patients.profile.share.title')}
					/>
				) : null
			}
			hideFallbackClose={session.isCancelled || session.isPast}
			onClose={handleClose}
			roleLabel={t('patients.profile.session-drawer.role')}
			statusLabel={t(getSessionDrawerStatusKey(session))}
			subtitle={`${patientName} · ${formatDateTimeRange(
				session.startsAt,
				session.slot.startTime,
				session.slot.endTime,
				i18n.language
			)}`}
			title={t(getSessionDrawerTitleKey(session))}
		>
			<DrawerDetailsList>
				<DrawerDetailItem>
					<DetailLabel>{t('globals.date')}</DetailLabel>
					<DetailValue>
						{formatLocalizedDate(session.date, fallback, i18n.language)}
					</DetailValue>
				</DrawerDetailItem>
				<DrawerDetailItem>
					<DetailLabel>{t('globals.time')}</DetailLabel>
					<DetailValue>
						{session.slot.startTime} – {session.slot.endTime}
					</DetailValue>
				</DrawerDetailItem>
				<DrawerDetailItem>
					<DetailLabel>
						{t('patients.profile.session-drawer.status')}
					</DetailLabel>
					<SessionStatus
						isCancelled={session.isCancelled}
						isPast={session.isPast}
					>
						{t(getSessionDrawerStatusKey(session))}
					</SessionStatus>
				</DrawerDetailItem>
				{session.isCancelled ? (
					<>
						<DrawerDetailItem>
							<DetailLabel>
								{t('patients.profile.session-drawer.cancelled-at')}
							</DetailLabel>
							<DetailValue>
								{formatLocalizedDate(
									session.canceledAt,
									fallback,
									i18n.language,
									'PPP p'
								)}
							</DetailValue>
						</DrawerDetailItem>
						<DrawerDetailItem>
							<DetailLabel>
								{t('patients.profile.session-drawer.cancellation-reason')}
							</DetailLabel>
							<DetailValue>
								{getSessionCancellationReasonLabel({
									customReason: session.customReason,
									fallback,
									reasonCode: session.reasonCode,
									t,
								})}
							</DetailValue>
						</DrawerDetailItem>
						<DrawerDetailItem>
							<DetailLabel>
								{t('patients.profile.session-drawer.cancelled-by')}
							</DetailLabel>
							<DetailValue>
								{t(getSessionCancelledByLabelKey(session.triggeredBy))}
							</DetailValue>
						</DrawerDetailItem>
						<DrawerDetailItem>
							<DetailLabel>
								{t('patients.profile.session-drawer.notification')}
							</DetailLabel>
							<NotificationRow>
								<DetailValue>
									{notificationWasSent
										? t('patients.profile.session-drawer.notification-sent')
										: t(
												'patients.profile.session-drawer.notification-not-sent'
											)}
								</DetailValue>
								{renderNotifyIconButton()}
							</NotificationRow>
						</DrawerDetailItem>
					</>
				) : (
					<>
						<DrawerDetailItem>
							<DetailLabel>
								{t('patients.profile.session-drawer.delivery')}
							</DetailLabel>
							<DetailValue>
								{session.slot.deliveryMode
									? t(`patients.profile.delivery.${session.slot.deliveryMode}`)
									: t('patients.profile.delivery.not-set')}
							</DetailValue>
						</DrawerDetailItem>
						<DrawerDetailItem>
							<DetailLabel>
								{t('patients.profile.session-drawer.notification')}
							</DetailLabel>
							<NotificationRow>
								<DetailValue>
									{notificationWasSent
										? t('patients.profile.session-drawer.notification-sent')
										: t(
												'patients.profile.session-drawer.notification-not-sent'
											)}
								</DetailValue>
								{renderNotifyIconButton()}
							</NotificationRow>
						</DrawerDetailItem>
					</>
				)}
			</DrawerDetailsList>

			{canTimeEdit ? (
				<DrawerFormGrid>
					<TextField
						fullWidth
						label={t('availability.week.drawer.edit-start-time')}
						onChange={(event) => setSessionStartTime(event.target.value)}
						size='small'
						type='time'
						value={sessionStartTime}
					/>
					<TextField
						fullWidth
						label={t('availability.week.drawer.edit-end-time')}
						onChange={(event) => setSessionEndTime(event.target.value)}
						size='small'
						type='time'
						value={sessionEndTime}
					/>
				</DrawerFormGrid>
			) : null}

			{drawerMode === 'reschedule' && session.isCancelled ? (
				<ReschedulePicker>
					<DetailLabel>
						{t('patients.profile.session-drawer.reschedule-prompt')}
					</DetailLabel>
					{rescheduleSlotGroups.length === 0 ? (
						<RescheduleEmpty>
							{t('patients.profile.session-drawer.reschedule-no-slots')}
						</RescheduleEmpty>
					) : (
						rescheduleSlotGroups.map((group) => (
							<RescheduleGroup key={group.date}>
								<RescheduleGroupLabel>
									{group.formattedDate}
								</RescheduleGroupLabel>
								<RescheduleSlotsRow>
									{group.slots.map((slot) => {
										const isSelected =
											selectedRescheduleSlot?.slotId === slot.slotId;

										return (
											<RescheduleSlotChip
												isSelected={isSelected}
												key={slot.slotId}
												onClick={() => setSelectedRescheduleSlot(slot)}
												type='button'
											>
												{slot.startTime} - {slot.endTime}
											</RescheduleSlotChip>
										);
									})}
								</RescheduleSlotsRow>
							</RescheduleGroup>
						))
					)}
				</ReschedulePicker>
			) : null}

			{drawerMode === 'cancel' ? (
				<CancelForm>
					<DetailLabel>
						{t('patients.profile.session-drawer.cancel-reason-prompt')}
					</DetailLabel>
					<CancelReasonGrid>
						{THERAPIST_CANCEL_REASONS.map(({ label, value }) => (
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
					{reasonCode === 7 ? (
						<TextField
							fullWidth
							label={t('patients.profile.session-drawer.cancel-custom-reason')}
							multiline
							onChange={(event) => setCustomReason(event.target.value)}
							rows={3}
							size='small'
							value={customReason}
						/>
					) : null}
				</CancelForm>
			) : null}
		</PatientDrawerShell>
	);
};
