import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type SlotStatus =
	| 'available'
	| 'blocked'
	| 'booked-google'
	| 'booked-jupiter'
	| 'buffer'
	| 'busy'
	| 'cancelled';
export type DeliveryMode = 'online' | 'in-person';

export interface IWeekSlot {
	_id?: string;
	address?: ISlotAddress | null;
	availabilityDayId?: string;
	blockReason?: string;
	blockedAt?: string;
	bufferFor?: 'booked-google' | 'booked-jupiter'; // only set when status === 'buffer'
	canceledAt?: string;
	cancelledPatientName?: string;
	customReason?: string;
	date: string; // 'YYYY-MM-DD'
	deliveryMode?: DeliveryMode | null;
	duration: number; // minutes
	// Google-imported event metadata — first-class rendering (real color,
	// meet link, location) and the edit/delete round-trip need these.
	googleColorId?: string | null;
	googleEventId?: string | null;
	googleHtmlLink?: string | null;
	googleLocation?: string | null;
	googleMeetLink?: string | null;
	id: string;
	letPatientChooseAddress?: boolean;
	notes?: string;
	patientId?: string;
	patientName?: string;
	reasonCode?: number;
	reopenedAt?: string;
	startTime: string; // 'HH:mm'
	status: SlotStatus;
	therapyType?: string;
	timezone?: string;
	triggeredBy?: 'PATIENT' | 'THERAPIST';
}

/**
 * Output of the stacking layer (AvailabilityWeekStacking.utils). Google
 * events are first-class — nothing is merged or clipped; this only adds a
 * deterministic z-order and double-booking detection.
 */
export interface IStackedWeekSlot extends IWeekSlot {
	// True when a booked-jupiter and booked-google slot overlap in time — a
	// real double-booking that must be surfaced, never hidden.
	hasConflict?: boolean;
	stackOrder: number;
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
