import type {
	IPatient,
	ISlot,
	ISlotAddress,
	ISODateString,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface IInitiateAvailabilityResponse {
	sessionId: string;
}

export interface IAvailabilityData {
	consultationDuration?: number;
	step?: number;
	therapistId: string;
	weekdays?: string[];
}

export interface IUpdateAvailabilitySession {
	data: Partial<IAvailabilityData>;
	sessionId: string;
}

export interface ISessionResponse {
	_id: string;
	completed: boolean;
	consultationDuration: number;
	createdAt: Date;
	step: number;
	updatedAt: Date;
	weekdays: IWeekdays[]; // Corrected to the new format
}

export interface IWeekdays {
	dayName: IWeekdaysNames;
	slots: string[];
}

export type IDayName =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

export type IWeekdaysNames =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

export interface Appointment {
	availabilityId: string;
	dateHour: Date;
	therapistId: string;
}

export interface BookAppointmentResponse {
	message: string;
}

export interface AppointmentDetailsBySlotIdResponse {
	appointment: {
		_id: string;
		address?: ISlotAddress | null;
		canceledAt?: ISODateString | null;
		customReason?: string | null;
		date: ISODateString;
		endTime: string;
		letPatientChooseAddress?: boolean;
		patient: Partial<IPatient>;
		patientId?: string;
		reasonCode?: string | null;
		startTime: string;
		status: ISlot['status'];
	};
}

export interface ISlotSelection {
	dayName: IDayName;
	slots: string[];
}

export type RecurrencePattern = 'WEEKLY' | 'MONTHLY';

export interface ICompleteSessionAvailabilityData {
	recurrencePattern: RecurrencePattern;
	selectedSlots: ISlotSelection[];
	timezone: string;
}

export enum StatusEnum {
	AVAILABLE = 'AVAILABLE',
	BLOCKED = 'BLOCKED',
	BOOKED = 'BOOKED',
	CANCELLED = 'CANCELLED',
	EMPTY = 'EMPTY',
	ONHOLD = 'ONHOLD',
}

export interface IAvailabilityDate {
	date: string;
	slots: Array<{
		_id: string;
		canceledAt?: string | null;
		customReason?: string | null;
		endTime: string;
		note?: string;
		patientId?: string;
		reasonCode?: CancellationReasonEnum | null;
		source?: 'jupiter' | 'google';
		startTime: string;
		status: StatusEnum;
	}>;
}

export interface ICompleteSessionAvailabilityResponse {
	availability: {
		_id: string;
		availabilityDates: IAvailabilityDate[];
		consultationDuration: number;
		createAvailabilitySession: string;
		createdAt: string;
		therapistId: string;
		updatedAt: string;
	};
	status: string;
}

export interface IEditSlotStatus {
	availabilityDayId: string;
	data: IEditSlotStatusData;
	slotId: string | null;
	therapistId: string;
}

export interface IEditSlotStatusData {
	newStatus: StatusEnum;
	startTime: string;
}

export interface IPublicSlotDetailsResponse {
	availabilityDayId: string;
	date: Date;
	patientId?: string;
	slotId: string;
	startTime: string;
}

export enum CancellationReasonEnum {
	EMERGENCY = 1,
	SCHEDULE_CONFLICT = 2,
	FINANCIAL_ISSUES = 3,
	MENTAL_HEALTH = 4,
	NO_SHOW = 5,
	OTHER = 6,
}

export interface CancelAppointmentPayload {
	customReason?: string;
	patientId: string;
	reasonCode: CancellationReasonEnum;
	slotId: string;
	therapistId: string;
	triggeredBy: 'PATIENT' | 'THERAPIST';
}

export interface CancelAppointmentResponse {
	message: string;
	slotId: string;
}

export interface CancelAppointmentFormData {
	customReason?: string;
	reasonCode: string;
	triggeredBy: string;
}

export interface IPatientConflictCandidate {
	_id: string;
	firstName: string;
	lastName: string;
}

export type ICheckDuplicateResponse =
	| { conflict: false }
	| { conflict: true; match: 'single'; patient: IPatientConflictCandidate }
	| {
			conflict: true;
			match: 'multiple';
			patients: IPatientConflictCandidate[];
	  };

export interface ICheckDuplicatePayload {
	contacts: {
		email?: string;
		phone: string;
	};
}

export interface IBookSlotByTherapistPayload {
	availabilityDayId: string;
	existingPatientId?: string;
	patient: {
		contacts: {
			email?: string;
			phone?: string;
			whatsapp?: string;
		};
		firstName: string;
		lastName: string;
		preferredContact?: {
			type: string;
			value: string;
		};
	};
	patientAddress?: ISlotAddress;
	recurrencePattern?: string;
	shareAddress: boolean;
	shouldReplicate: boolean;
	slotId: string;
	therapistId: string;
	timeZone: string;
}

export interface IBookSlotByTherapistResponse {
	appointmentInfo: {
		date: string;
		time: string;
	};
	message: string;
	patient: Partial<IPatient>;
	status: string;
	therapistId: string;
}
