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
	getDateLocale,
} from '@psycron/utils/date/date.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, format, isAfter, isSameDay, parseISO } from 'date-fns';

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
	SessionDrawerProps,
	SessionDrawerRescheduleGroup,
	SessionDrawerRescheduleSlot,
} from './SessionDrawer.types';

const THERAPIST_CANCEL_REASONS = [
	{ label: 'globals.cancellation-reason.2', value: 2 },
	{ label: 'globals.cancellation-reason.5', value: 5 },
	{ label: 'globals.cancellation-reason.1', value: 1 },
	{ label: 'globals.cancellation-reason.7', value: 7 },
] as const;

type DrawerMode = 'details' | 'cancel' | 'reschedule';

export const SessionDrawer = ({
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
	const [sessionStartTime, setSessionStartTime] = useState(session.slot.startTime);
	const [sessionEndTime, setSessionEndTime] = useState(session.slot.endTime);
	const [selectedRescheduleSlot, setSelectedRescheduleSlot] =
		useState<SessionDrawerRescheduleSlot | null>(null);

	useEffect(() => {
		setSessionStartTime(session.slot.startTime);
		setSessionEndTime(session.slot.endTime);
		setDrawerMode('details');
		setReasonCode('');
		setCustomReason('');
		setSelectedRescheduleSlot(null);
	}, [session]);

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

	const rescheduleSlotGroups = useMemo<SessionDrawerRescheduleGroup[]>(() => {
		const today = new Date();

		return (availabilityCalendar?.dates ?? [])
			.map((dateRef) => {
				const dayDate = parseISO(dateRef.date);
				const slots = (dateRef.slots ?? [])
					.filter((slot) => slot.status === 'AVAILABLE')
					.filter((slot) => slot._id !== session.slot._id)
					.filter((slot) => {
						if (isAfter(dayDate, today)) return true;
						if (!isSameDay(dayDate, today)) return false;

						return slot.startTime > format(today, 'HH:mm');
					})
					.map(
						(slot): SessionDrawerRescheduleSlot => ({
							availabilityDayId: String(dateRef.dateId),
							date: dateRef.date,
							endTime: slot.endTime,
							slotId: slot._id,
							startTime: slot.startTime,
						})
					);

				return {
					date: dateRef.date,
					formattedDate: format(dayDate, 'EEEE, MMM d', {
						locale: getDateLocale(i18n.language),
					}),
					slots,
				};
			})
			.filter((group) => group.slots.length > 0)
			.slice(0, 8);
	}, [availabilityCalendar?.dates, i18n.language, session.slot._id]);

	const handleClose = () => {
		if (rescheduleM.isPending || cancelM.isPending) return;
		setDrawerMode('details');
		setReasonCode('');
		setCustomReason('');
		setSelectedRescheduleSlot(null);
		onClose();
	};

	const rescheduleM = useMutation({
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
			const isNoChange = err instanceof Error && err.message === 'no-change';
			const isMissingSlot =
				err instanceof Error && err.message === 'missing-slot';
			showAlert({
				message: t(
					isMissingSlot
						? 'patients.profile.session-drawer.reschedule-prompt'
						: isNoChange
							? 'patients.profile.session-drawer.update-no-change'
							: session.isCancelled
								? 'patients.profile.session-drawer.reschedule-error'
								: 'patients.profile.session-drawer.update-error'
				),
				severity: isNoChange || isMissingSlot ? 'info' : 'error',
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
			queryClient.invalidateQueries({ queryKey: ['patientDetails', patientId] });
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			capture(PostHogEvent.PatientCenterSessionRescheduled, {
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
			queryClient.invalidateQueries({ queryKey: ['patientDetails', patientId] });
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			capture(PostHogEvent.PatientCenterSessionCancelled, {
				session_date: session.date,
			});
			onClose();
		},
	});

	const notifyM = useMutation({
		mutationFn: () => notifyPatientForSession(therapistId ?? '', session.slot._id),
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
			queryClient.invalidateQueries({ queryKey: ['patientDetails', patientId] });
			queryClient.invalidateQueries({
				queryKey: ['patientListItem', therapistId, patientId],
			});
			capture(PostHogEvent.PatientCenterSessionNotified, {
				session_date: session.date,
			});
		},
	});

	const accentColor = session.isCancelled
		? '#E05B5B'
		: session.isPast
			? '#94A3B8'
			: '#2F9E44';

	const getTitle = (): string => {
		if (session.isCancelled)
			return t('patients.profile.session-drawer.cancelled-title');
		if (session.isPast)
			return t('patients.profile.session-drawer.completed-title');

		return t('patients.profile.session-drawer.upcoming-title');
	};

	const getStatusLabel = (): string => {
		if (session.isCancelled) return t('patients.profile.sessions.cancelled');
		if (session.isPast) return t('patients.profile.sessions.completed');

		return t('patients.profile.sessions.upcoming');
	};

	const renderCancellationReason = (): string => {
		if (session.reasonCode == null) return fallback;

		const reason = t(`globals.cancellation-reason.${session.reasonCode}`);
		const shouldShowCustom =
			(session.reasonCode === 6 || session.reasonCode === 7) &&
			session.customReason;

		return shouldShowCustom ? `${reason} - ${session.customReason}` : reason;
	};

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
								setDrawerMode('details');
								setSelectedRescheduleSlot(null);
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
							setDrawerMode('details');
							setReasonCode('');
							setCustomReason('');
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
			accentColor={accentColor}
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
			statusLabel={getStatusLabel()}
			subtitle={`${patientName} · ${formatDateTimeRange(
				session.startsAt,
				session.slot.startTime,
				session.slot.endTime,
				i18n.language
			)}`}
			title={getTitle()}
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
						{getStatusLabel()}
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
							<DetailValue>{renderCancellationReason()}</DetailValue>
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
										? t(
												'patients.profile.session-drawer.notification-sent'
											)
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
									? t(
											`patients.profile.delivery.${session.slot.deliveryMode}`
										)
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
										? t(
												'patients.profile.session-drawer.notification-sent'
											)
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
							label={t(
								'patients.profile.session-drawer.cancel-custom-reason'
							)}
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
