export type SlotStatus = 'available' | 'booked-jupiter' | 'booked-google' | 'cancelled';
export type DeliveryMode = 'online' | 'in-person';

export interface IWeekSlot {
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

const today = new Date();
const monday = new Date(today);
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
const pad = (n: number) => String(n).padStart(2, '0');
const dateStr = (offset: number) => {
	const d = new Date(monday);
	d.setDate(monday.getDate() + offset);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const makeSlots = (
	dateOffset: number,
	slots: Omit<IWeekSlot, 'date' | 'id'>[],
): IWeekSlot[] =>
	slots.map((slot, i) => ({ ...slot, date: dateStr(dateOffset), id: `${dateOffset}-${i}` }));

// Working days Mon–Fri with explicit available + booked + cancelled slots
export const MOCK_WEEK_DATA: Record<string, IWeekSlot[]> = {
	[dateStr(0)]: makeSlots(0, [
		{ startTime: '09:00', duration: 60, status: 'available' },
		{ startTime: '10:00', duration: 60, status: 'available' },
		{ startTime: '14:00', duration: 60, status: 'available' },
	]),
	[dateStr(1)]: makeSlots(1, [
		{
			startTime: '09:00',
			duration: 60,
			status: 'booked-jupiter',
			patientName: 'Maria Silva',
			therapyType: 'Cognitive Behavioral Therapy',
			deliveryMode: 'online',
			timezone: 'GMT-3 (São Paulo)',
			notes: 'Follow-up session on anxiety management techniques. Patient has shown progress with breathing exercises.',
		},
		{ startTime: '10:00', duration: 60, status: 'available' },
		{
			startTime: '11:00',
			duration: 60,
			status: 'booked-google',
			patientName: 'João Costa',
			therapyType: 'Individual Therapy',
			deliveryMode: 'in-person',
			timezone: 'GMT-3 (São Paulo)',
			notes: 'Initial consultation. Patient referred by Dr. Santos.',
		},
		{ startTime: '14:00', duration: 60, status: 'available' },
		{ startTime: '15:00', duration: 60, status: 'available' },
		{ startTime: '16:00', duration: 60, status: 'available' },
	]),
	[dateStr(2)]: makeSlots(2, [
		{ startTime: '09:00', duration: 60, status: 'available' },
		{
			startTime: '10:00',
			duration: 60,
			status: 'booked-jupiter',
			patientName: 'Ana Oliveira',
			therapyType: 'Family Therapy',
			deliveryMode: 'in-person',
			timezone: 'GMT-3 (São Paulo)',
			notes: 'Joint session with partner scheduled.',
		},
		{ startTime: '11:00', duration: 60, status: 'available' },
		{
			startTime: '14:00',
			duration: 60,
			status: 'booked-jupiter',
			patientName: 'Pedro Santos',
			therapyType: 'Psychodynamic Therapy',
			deliveryMode: 'online',
			timezone: 'GMT-3 (São Paulo)',
		},
		{
			startTime: '15:00',
			duration: 60,
			status: 'booked-google',
			patientName: 'Carla Mendes',
			therapyType: 'Group Therapy',
			deliveryMode: 'in-person',
			timezone: 'GMT-3 (São Paulo)',
		},
		{
			startTime: '16:00',
			duration: 60,
			status: 'cancelled',
			patientName: 'Rafael Lima',
			therapyType: 'Cognitive Behavioral Therapy',
			deliveryMode: 'online',
			timezone: 'GMT-3 (São Paulo)',
		},
	]),
	[dateStr(3)]: makeSlots(3, [
		{
			startTime: '09:00',
			duration: 60,
			status: 'booked-jupiter',
			patientName: 'Lucas Ferreira',
			therapyType: 'Cognitive Behavioral Therapy',
			deliveryMode: 'in-person',
			timezone: 'GMT-3 (São Paulo)',
		},
		{ startTime: '10:00', duration: 60, status: 'available' },
		{ startTime: '11:00', duration: 60, status: 'available' },
		{ startTime: '14:00', duration: 60, status: 'available' },
	]),
	[dateStr(4)]: makeSlots(4, [
		{
			startTime: '08:00',
			duration: 60,
			status: 'booked-jupiter',
			patientName: 'Sofia Martins',
			therapyType: 'Cognitive Behavioral Therapy',
			deliveryMode: 'online',
			timezone: 'GMT-3 (São Paulo)',
		},
		{ startTime: '10:00', duration: 60, status: 'available' },
		{ startTime: '15:00', duration: 60, status: 'available' },
	]),
};

export const WORKING_DAYS = [1, 2, 3, 4, 5]; // day.getDay(): 1=Mon, 5=Fri

export const TIME_SLOTS = [
	'08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
	'14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];
