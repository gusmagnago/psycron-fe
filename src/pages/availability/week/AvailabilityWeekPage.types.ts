import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type SlotStatus = 'available' | 'blocked' | 'booked-google' | 'booked-jupiter' | 'buffer' | 'cancelled';
export type DeliveryMode = 'online' | 'in-person';

export interface IWeekSlot {
	_id?: string;
	address?: ISlotAddress | null;
	availabilityDayId?: string;
	blockReason?: string;
	blockedAt?: string;
	bufferFor?: 'booked-google' | 'booked-jupiter'; // only set when status === 'buffer'
	date: string; // 'YYYY-MM-DD'
	deliveryMode?: DeliveryMode | null;
	duration: number; // minutes
	id: string;
	letPatientChooseAddress?: boolean;
	notes?: string;
	patientId?: string;
	patientName?: string;
	startTime: string; // 'HH:mm'
	status: SlotStatus;
	therapyType?: string;
	timezone?: string;
}

export interface IAvailabilityWeekMobileDay {
	allSlots: IWeekSlot[];
	availableSlotCount: number;
	date: Date;
	dateStr: string;
	fullyBlocked: boolean;
	hiddenCount: number;
	isExpanded: boolean;
	isFreeOnlyDay: boolean;
	isPastDay: boolean;
	isToday: boolean;
	visibleSlots: IWeekSlot[];
}
