import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { bookAppointmentFromLink } from '@psycron/api/patient';
import {
	cancelAppointmentByPatient,
	editSlotStatus,
} from '@psycron/api/user/availability';
import type {
	AppointmentDetailsBySlotIdResponse,
	CancellationReasonEnum as CancellationReasonType,
} from '@psycron/api/user/availability/index.types';
import { CancellationReasonEnum } from '@psycron/api/user/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
	IAvailabilityWeekDrawerProps,
	IRescheduleSlot,
} from '../AvailabilityWeekDrawer.types';

// ─── useBlockSlot ─────────────────────────────────────────────────────────────

export const useBlockSlot = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	onBlocked: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const [blockReason, setBlockReason] = useState('');

	const mutation = useMutation({
		mutationFn: () =>
			editSlotStatus({
				availabilityDayId: slot.availabilityDayId ?? '',
				data: {
					...(blockReason ? { blockReason } : {}),
					newStatus: 'BLOCKED',
					startTime: slot.startTime,
				},
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.drawer.block-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			capture(PostHogEvent.AvailabilitySlotBlocked, {
				slot_start_time: slot.startTime,
			});
			showAlert({
				message: t('availability.week.drawer.block-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onBlocked();
		},
	});

	return { blockReason, mutation, setBlockReason };
};

// ─── useUnblockSlot ──────────────────────────────────────────────────────────

export const useUnblockSlot = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	onUnblocked: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () =>
			editSlotStatus({
				availabilityDayId: slot.availabilityDayId ?? '',
				data: { newStatus: 'AVAILABLE', startTime: slot.startTime },
				slotId: slot._id ?? slot.id,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.week.drawer.unblock-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			capture(PostHogEvent.AvailabilitySlotUnblocked, {
				slot_start_time: slot.startTime,
			});
			showAlert({
				message: t('availability.week.drawer.unblock-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onUnblocked();
		},
	});

	return { mutation };
};

// ─── useCancelSlot ────────────────────────────────────────────────────────────

export const useCancelSlot = (
	slot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	onCancelled: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [reasonCode, setReasonCode] = useState<CancellationReasonType | null>(
		null
	);
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
			showAlert({
				message: t('availability.week.drawer.cancel-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			capture(PostHogEvent.AppointmentCancelled, {
				reason_code: String(reasonCode),
				triggered_by: 'therapist',
			});
			showAlert({
				message: t('availability.week.drawer.cancel-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onCancelled();
		},
	});

	const reset = () => {
		setReasonCode(null);
		setCustomReason('');
	};

	return {
		customReason,
		mutation,
		reasonCode,
		reset,
		setCustomReason,
		setReasonCode,
	};
};

// ─── useReschedule ────────────────────────────────────────────────────────────

export const useReschedule = (
	currentSlot: IAvailabilityWeekDrawerProps['slot'],
	therapistId: string | null,
	appointmentDetails: AppointmentDetailsBySlotIdResponse | undefined,
	onRescheduled: () => void
) => {
	const { t } = useTranslation();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [selectedSlot, setSelectedSlot] = useState<IRescheduleSlot | null>(
		null
	);

	const mutation = useMutation({
		mutationFn: async () => {
			if (!selectedSlot || !currentSlot.patientId || !appointmentDetails)
				return;

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
			showAlert({
				message: t('availability.week.drawer.reschedule-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			capture(PostHogEvent.AppointmentRescheduled, {
				new_slot_start_time: selectedSlot?.startTime ?? '',
				reason_code: String(CancellationReasonEnum.SCHEDULE_CONFLICT),
			});
			showAlert({
				message: t('availability.week.drawer.reschedule-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			onRescheduled();
		},
	});

	return { mutation, selectedSlot, setSelectedSlot };
};
