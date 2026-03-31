import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { format, isWithinInterval, parseISO } from 'date-fns';

import type { IWeekSlot, SlotStatus } from '../AvailabilityWeekPage.types';

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

const toSlotStatus = (status: string): SlotStatus | null => {
	if (status === 'AVAILABLE') return 'available';
	if (status === 'BOOKED') return 'booked-jupiter';
	if (status === 'CANCELLED' || status === 'CANCELED') return 'cancelled';
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
		isAvailabilityDatesEmpty,
	} = useAvailability();
	const weekDates = (
		availabilityData?.dates ?? ([] as IAvailabilityDateRef[])
	).filter((d) =>
		isWithinInterval(parseISO(d.date), { start: weekStart, end: weekEnd })
	);

	const weekData: Record<string, IWeekSlot[]> = {};

	weekDates.forEach((d) => {
		const slots = d.slots ?? [];
		if (!slots.length) return;

		const dayStr = format(parseISO(d.date), 'yyyy-MM-dd');

		const realSlots = slots
			.map((slot, j): IWeekSlot | null => {
				const status = toSlotStatus(slot.status);
				if (!status) return null;
				return {
					_id: slot._id,
					address: slot.address ?? null,
					availabilityDayId: String(d.dateId),
					date: dayStr,
					duration: computeDuration(slot.startTime, slot.endTime),
					id: slot._id ?? `${dayStr}-${j}`,
					letPatientChooseAddress: slot.letPatientChooseAddress ?? false,
					notes: slot.note,
					patientId: slot.patientId ? String(slot.patientId) : undefined,
					patientName: slot.patientSummary?.fullName ?? undefined,
					startTime: slot.startTime,
					status,
				};
			})
			.filter((s): s is IWeekSlot => s !== null);

		if (bufferTimeMinutes > 0) {
			const occupiedTimes = new Set(realSlots.map((s) => s.startTime));
			const bufferSlots: IWeekSlot[] = [];

			realSlots.forEach((slot) => {
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
					startTime: bufferStart,
					status: 'buffer',
				});
			});

			weekData[dayStr] = [...realSlots, ...bufferSlots].sort((a, b) =>
				a.startTime.localeCompare(b.startTime)
			);
		} else {
			weekData[dayStr] = realSlots;
		}
	});

	return {
		isAvailabilityDatesEmpty,
		isLoading: availabilityDataIsLoading,
		weekData,
	};
};
