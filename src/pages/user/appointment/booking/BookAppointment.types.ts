import type { ISlotAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type TimeOfDay = 'all' | 'morning' | 'afternoon' | 'evening';

export interface IPublicSlot {
	address?: ISlotAddress | null;
	availabilityDayId: string;
	date: string;
	deliveryMode?: 'online' | 'in-person' | null;
	endTime: string;
	isBooked: boolean;
	letPatientChooseAddress?: boolean;
	slotId: string;
	startTime: string;
}

export interface IBookingFilters {
	dateFrom: string;
	dateTo: string;
	timeOfDay: TimeOfDay;
}

export interface IBookingFormValues {
	address?: ISlotAddress;
	consentAccepted: boolean;
	countryCode: string;
	email: string;
	firstName: string;
	hasWhatsApp?: boolean;
	isPhoneWpp?: boolean;
	lastName: string;
	notifyByEmail: boolean;
	notifyByWhatsapp: boolean;
	phone: string;
	recurrencePattern: string;
	whatsapp?: string;
}
