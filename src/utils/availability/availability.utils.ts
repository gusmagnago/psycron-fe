import { StatusEnum } from '@psycron/api/user/availability/index.types';

interface CancellableSlot {
	canceledAt?: string | null;
	reopenedAt?: string | null;
	status?: string | null;
}

export const isCanceledSlotStatus = (
	status: string | null | undefined
): boolean => {
	const normalizedStatus = status?.toLowerCase();

	return (
		status === StatusEnum.CANCELED ||
		normalizedStatus === 'canceled' ||
		normalizedStatus === 'cancelled'
	);
};

export const isCanceledSlot = (
	slot: CancellableSlot | null | undefined
): boolean =>
	Boolean(
		slot &&
			(isCanceledSlotStatus(slot.status) ||
				Boolean(slot.canceledAt && !slot.reopenedAt))
	);
