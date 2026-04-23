import type {
	IBookSessionWithLink,
	IContactInfo,
	IPatient,
	IPatientBilling,
	IPreferredContact,
	ISlotAddress,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type { IResponse } from '../user/index.types';

export interface IBookAppointment {
	data: IBookSessionWithLink;
	therapistId: string;
}

export interface IBookAppointmentResponse extends IResponse {
	appointmentInfo: string;
	message: string;
	patient: IPatient;
	status: string;
	therapistId: string;
}

export interface IPatientByIdResponse {
	patient: IPatient;
}

export interface PatientFormData {
	_id?: string;
	address?: ISlotAddress | null;
	billing?: IPatientBilling | null;
	countryCode?: string;
	email?: string;
	firstName: string;
	lastName: string;
	phone: string;
	preferredContact?: IPreferredContact | null;
	timeZone?: string;
	whatsapp?: string;
}
export interface IEditPatientDetailsById {
	patient: PatientFormData;
	patientId: string;
}

export interface IEditPatientDetailsByIdResponse {
	message: string;
	patient: IPatient;
	status: string;
}

export interface PatientPartial {
	contacts: IContactInfo;
	firstName: string;
	lastName: string;
	preferredContact?: IPreferredContact;
}

export interface ICreatePatient {
	availabilityDayId: string;
	patient: PatientPartial;
	slotId: string;
	therapistId: string;
}

export interface ICreatePatientResponse {
	message: string;
	patient: IPatient;
	status: 'success' | 'error';
}

export type SessionDelivery = 'in_person' | 'online';

export interface ICreatePatientForm {
	countryCode: string;
	email?: string;
	firstName: string;
	hasWhatsApp?: boolean;
	isPhoneWpp?: boolean;
	lastName: string;
	phone: string;
	preferredContact?: IPreferredContact;
	recurrencePattern?: RecurrencePattern;
	sessionDelivery?: SessionDelivery;
	timeZone?: string;
	whatsapp?: string;
}

export interface IPublicSessionSlot {
	_id: string;
	address?: ISlotAddress | null;
	canceledAt?: string | null;
	deliveryMode?: 'online' | 'in-person' | null;
	endTime: string;
	letPatientChooseAddress?: boolean;
	patientId?: string;
	preferredContact?: IPreferredContact | null;
	startTime: string;
	status: string;
}

export interface IPublicSessionDate {
	_id: string;
	date: string;
	slots: IPublicSessionSlot[];
}

export interface IPublicPatientSessionsResponse {
	patient: {
		_id: string;
		cancelledAppointments: Array<{
			cancelledAt: string;
			customReason?: string;
			date: string;
			endTime: string;
			reasonCode?: number;
			slotId: string;
			startTime: string;
			triggeredBy: 'PATIENT' | 'THERAPIST';
		}>;
		firstName: string;
		lastName: string;
		sessionDates: IPublicSessionDate[];
		therapistId: string;
		timeZone?: string;
	};
	status: string;
}

export enum RecurrencePattern {
	ALL_APPOINTMENTS = 'allAppointments',
	SINGLE = 'single',
	UNTIL_END_OF_MONTH = 'endMonth',
	UNTIL_END_OF_YEAR = 'endYear',
}
