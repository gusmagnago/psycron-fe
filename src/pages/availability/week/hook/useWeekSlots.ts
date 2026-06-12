import { StatusEnum } from '@psycron/api/user/availability/index.types';
import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { isCanceledSlotStatus } from '@psycron/utils/availability/availability.utils';
import { format, isWithinInterval, parseISO } from 'date-fns';

import type {
	IStackedWeekSlot,
	IWeekSlot,
	SlotStatus,
} from '../AvailabilityWeekPage.types';
import {
	stackDaySlots,
	STATUS_STACK_ORDER,
} from '../AvailabilityWeekStacking.utils';

type WeekSlotSource = 'google' | 'jupiter';

const computeDuration = (startTime: string, endTime: string): number => {
	const [sh, sm] = startTime.split(':').map(Number);
	const [eh, em] = endTime.split(':').map(Number);
	return eh * 60 + em - (sh * 60 + sm);
};

const addMinutes = (time: string, minutes: number): string => {
	const [h, m] = time.split(':').map(Number);
	const total = h * 60 + m + minutes;
	const newH = Math.floor(total / 60) % 24;
	const newM = total % 60;
	return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

const toSlotStatus = (
	status: string,
	source?: WeekSlotSource
): SlotStatus | null => {
	if (status === StatusEnum.AVAILABLE) return 'available';
	if (status === StatusEnum.BLOCKED) return 'blocked';
	if (status === StatusEnum.BUSY) return 'busy';
	if (status === StatusEnum.BOOKED)
		return source === 'google' ? 'booked-google' : 'booked-jupiter';
	if (isCanceledSlotStatus(status)) return 'cancelled';
	return null;
};

export const useWeekSlots = (
	weekStart: Date,
	weekEnd: Date,
	bufferTimeMinutes: number
) => {
	const {
		availabilityData,
		availabilityDataIsLoading,
	} = useAvailability();
	const weekDates = (
		availabilityData?.dates ?? ([] as IAvailabilityDateRef[])
	).filter((d) =>
		isWithinInterval(parseISO(d.date), { start: weekStart, end: weekEnd })
	);

	const weekData: Record<string, IStackedWeekSlot[]> = {};

	weekDates.forEach((d) => {
		const slots = d.slots ?? [];
		if (!slots.length) return;

		const dayStr = format(parseISO(d.date), 'yyyy-MM-dd');

		const realSlots = slots
			.map((slot, j): IWeekSlot | null => {
				const rawStatus = toSlotStatus(slot.status, slot.source);
				if (!rawStatus) return null;
				const status =
					rawStatus === 'available' && slot.canceledAt && !slot.reopenedAt
						? 'cancelled' as const
						: rawStatus;
				return {
					_id: slot._id,
					address: slot.address ?? null,
					availabilityDayId: String(d.dateId),
					blockedAt: slot.blockedAt ?? undefined,
					blockReason: slot.blockReason ?? undefined,
					canceledAt: slot.canceledAt ?? undefined,
					cancelledPatientName: slot.cancelledPatientName ?? undefined,
					customReason: slot.customReason ?? undefined,
					date: dayStr,
					deliveryMode: slot.deliveryMode ?? null,
					duration: computeDuration(slot.startTime, slot.endTime),
					googleColorId: slot.googleColorId ?? null,
					googleEventId: slot.googleEventId ?? null,
					googleHtmlLink: slot.googleHtmlLink ?? null,
					googleLocation: slot.googleLocation ?? null,
					googleMeetLink: slot.googleMeetLink ?? null,
					id: slot._id ?? `${dayStr}-${j}`,
					letPatientChooseAddress: slot.letPatientChooseAddress ?? false,
					notes: slot.note,
					patientId: slot.patientId ? String(slot.patientId) : undefined,
					patientName: slot.patientSummary?.fullName ?? undefined,
					reasonCode: slot.reasonCode ?? undefined,
					reopenedAt: slot.reopenedAt ?? undefined,
					startTime: slot.startTime,
					status,
					triggeredBy: slot.triggeredBy ?? undefined,
				};
			})
			.filter((s): s is IWeekSlot => s !== null);

		// Deterministic stacking + jupiter-google double-booking detection.
		// Google events are first-class — nothing is merged or clipped here.
		const stackedSlots = stackDaySlots(realSlots);

		if (bufferTimeMinutes > 0) {
			const occupiedTimes = new Set(stackedSlots.map((s) => s.startTime));
			const bufferSlots: IStackedWeekSlot[] = [];

			stackedSlots.forEach((slot) => {
				if (slot.status !== 'booked-jupiter' && slot.status !== 'booked-google')
					return;

				const bufferStart = addMinutes(slot.startTime, slot.duration);
				const [h] = bufferStart.split(':').map(Number);
				if (h >= 24) return;
				if (occupiedTimes.has(bufferStart)) return;

				bufferSlots.push({
					bufferFor: slot.status,
					date: dayStr,
					duration: bufferTimeMinutes,
					id: `buffer-${slot.id}`,
					stackOrder: STATUS_STACK_ORDER.buffer,
					startTime: bufferStart,
					status: 'buffer',
				});
			});

			weekData[dayStr] = [...stackedSlots, ...bufferSlots].sort((a, b) =>
				a.startTime.localeCompare(b.startTime)
			);
		} else {
			weekData[dayStr] = stackedSlots;
		}
	});

	return {
		isLoading: availabilityDataIsLoading,
		weekData,
	};
};
