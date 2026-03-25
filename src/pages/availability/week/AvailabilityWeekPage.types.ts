export type SlotStatus = 'available' | 'booked-jupiter' | 'booked-google' | 'cancelled';
export type DeliveryMode = 'online' | 'in-person';

export interface IWeekSlot {
	_id?: string;
	availabilityDayId?: string;
	date: string; // 'YYYY-MM-DD'
	deliveryMode?: DeliveryMode;
	duration: number; // minutes
	id: string;
	notes?: string;
	patientName?: string;
	startTime: string; // 'HH:mm'
	status: SlotStatus;
	therapyType?: string;
	timezone?: string;
}
