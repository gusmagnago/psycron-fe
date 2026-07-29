import type {
	IBookSessionWithLink,
	IContactInfo,
	IPatient,
	IPatientBilling,
	IPatientNotificationChannelPreference,
	IPatientNotificationPreferences,
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

export type PatientsSortField =
	| 'billing'
	| 'contact'
	| 'last-appointment'
	| 'name'
	| 'next-action'
	| 'next-session'
	| 'total-sessions';
export type PatientsSortDirection = 'asc' | 'desc';
export type PatientsStatusFilter = 'all' | 'active' | 'inactive';

export interface IGetPatientsParams {
	dir?: PatientsSortDirection;
	limit?: number;
	page?: number;
	q?: string;
	queue?: PatientWorkspaceQueueFilter;
	sort?: PatientsSortField;
	status?: PatientsStatusFilter;
}

export type PatientWorkspaceQueueFilter =
	| 'billing'
	| 'contact'
	| 'duplicate'
	| 'needs-attention'
	| 'recovery';

export interface IGetPatientsResponse {
	limit: number;
	page: number;
	patients: IPatient[];
	total: number;
	/**
	 * Absent until psycron-be #120 is deployed, and absent on any cached page
	 * fetched before it. The workspace guards every read — the type has to
	 * agree, or the guards look like dead code.
	 */
	workspaceSummary?: IPatientWorkspaceSummary;
}

export interface IPatientWorkspaceSummary {
	billing: number;
	duplicate: number;
	missingContact: number;
	needsAttention: number;
	recovery: number;
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

export interface ICreateManualPatient {
	patient: Pick<PatientPartial, 'firstName' | 'lastName' | 'contacts'> & {
		timeZone?: string;
	};
	therapistId: string;
}

export interface ICreatePatientResponse {
	message: string;
	patient: IPatient;
	status: 'success' | 'error';
}

export type SessionDelivery = 'in_person' | 'online';

export interface ICreatePatientForm {
	consentAccepted?: boolean;
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
			followedUpAt?: string | null;
			followedUpBy?: string | null;
			reasonCode?: number;
			rebookedAppointmentId?: string | null;
			recoveryStatus?:
				| 'PENDING_FOLLOW_UP'
				| 'FOLLOWED_UP'
				| 'REOPENED'
				| 'REBOOKED'
				| 'ARCHIVED'
				| null;
			reopenedAt?: string | null;
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

export interface IUpdatePatientNotificationPreferencesPayload {
	appointmentConfirmation?: IPatientNotificationChannelPreference;
	appointmentUpdated?: IPatientNotificationChannelPreference;
	calendarInvite?: { enabled: boolean };
	reminder?: IPatientNotificationChannelPreference & { enabled: boolean };
}

export interface IUpdatePatientNotificationPreferencesResponse {
	notificationPreferences: IPatientNotificationPreferences;
}
