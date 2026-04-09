import type { ReactNode } from 'react';
import type { StatusEnum } from '@psycron/api/user/availability/index.types';
import type {
	ISignInForm,
	IVerifyEmailResponse,
} from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUpEmail.types';

export type ISODateString = string;

export type TherapistRole = 'THERAPIST' | 'ADMIN';
export type AuthProvider = 'local' | 'google';

export interface AuthContextType {
	isAuthenticated: boolean;
	isSessionLoading: boolean;
	isSessionSuccess: boolean;
	isSignInMutationLoading: boolean;
	isSignUpMutationLoading: boolean;
	isVerifyEmailLoading: boolean;
	logout: () => void;
	signIn: (data: ISignInForm) => void;
	signUp: (data: ISignUpForm) => void;
	user?: ITherapist;
	verifyEmailToken: (token: string) => Promise<IVerifyEmailResponse>;
}

export interface AuthProviderProps {
	children: ReactNode;
}

export interface IUserData {
	isAuthenticated: boolean;
	user?: ITherapist;
}

export interface IClinicAddress {
	city: string;
	country: string;
	postcode: string;
	street: string;
}

export interface IContactInfo {
	email?: string;
	hasWhatsApp?: boolean;
	isPhoneWpp?: boolean;

	phone?: string;
	whatsapp?: string;
}

export interface IGoogleCalendar {
	accessToken?: string;
	calendarId?: string;
	lastSyncAt?: ISODateString;
	refreshToken?: string;
	syncEnabled: boolean;
	tokenExpiresAt?: ISODateString;
}

export interface IConsent {
	dataProcessingAcceptedAt: ISODateString | null;
	marketingEmailsAcceptedAt: ISODateString | null;
	privacyPolicyAcceptedAt: ISODateString | null;
	termsAcceptedAt: ISODateString | null;
}

export interface IConsentHistoryEntry {
	action: 'granted' | 'withdrawn';
	ipAddress?: string;
	timestamp: ISODateString;
	type: string;
	userAgent?: string;
}

export interface IBaseUser {
	_id: string;
	contacts: IContactInfo;
	createdAt?: ISODateString;
	firstName: string;
	lastName: string;
	updatedAt?: ISODateString;
}

export interface ITherapist extends IBaseUser {
	anonymizedAt?: ISODateString | null;
	// Google fields (from BE payload)
	authProvider?: AuthProvider;

	availability: string[];
	clinicAddress?: IClinicAddress;
	// GDPR/LGPD
	consent?: IConsent;
	consentHistory?: IConsentHistoryEntry[];

	deletedAt?: ISODateString | null;
	google: IGoogleUser;
	googleCalendar?: IGoogleCalendar;
	googleId?: string;
	notifications: string[];
	// local-only
	password?: string;
	// IDs (because BE is not populating in /users/:id)
	patients: string[];
	picture?: string;
	role: TherapistRole;
	specialities?: string[];
	stripeCustomerID?: string;
	timeZone: string;
}

export interface IGoogleUser {
	email: string;
	familyName: string;
	givenName: string;
	id: string;
	name: string;
	picture: string;
	updatedAt: Date;
}

/**
 * Other entities used by other endpoints
 */

export interface INotification {
	channel: string;
	content: string;
	icsContent: string;
	id: string;
	messageType: string;
	sentAt: ISODateString;
}

export interface ISlotAddress {
	city: string;
	country: string;
	postcode: string;
	street: string;
}

export interface ISlotPatientSummary {
	_id: string;
	firstName: string;
	fullName: string;
	lastName: string;
}

export interface ISlot {
	_id: string;
	address?: ISlotAddress | null;
	blockReason?: string | null;
	blockedAt?: ISODateString | null;
	canceledAt?: ISODateString | null;
	cancelledPatientName?: string | null;
	customReason?: string | null;
	deliveryMode?: 'online' | 'in-person' | null;
	endTime: string;
	letPatientChooseAddress?: boolean;
	note?: string;
	patientId?: string;
	patientSummary?: ISlotPatientSummary | null;
	reasonCode?: number | null;
	reopenedAt?: ISODateString | null;
	startTime: string;
	status: StatusEnum;
	triggeredBy?: 'PATIENT' | 'THERAPIST' | null;
}

export interface IAvailabilityDate {
	_id: string;
	date: ISODateString;
	slots: ISlot[];
}

export interface ISessionDatesGroup {
	_id?: string;
	date: ISODateString;
	slots: ISlot[];
}

export type PreferredContactType = 'google_meet' | 'phone' | 'whatsapp' | 'zoom';

export interface IPreferredContact {
	type: PreferredContactType;
	value: string;
}

export interface IPatient extends IBaseUser {
	cancelledAppointments?: ICancelledAppointment[];
	createdBy?: ITherapist | string;
	notifications?: INotification[];
	preferredContact?: IPreferredContact | null;

	role: 'PATIENT';
	sessionDates: ISessionDatesGroup[];
	timeZone?: string;
}

export interface IBookSessionWithLink {
	availabilityDayId: string;
	notifyByEmail?: boolean;
	notifyByWhatsapp?: boolean;
	patient: Partial<IPatient>;
	patientAddress?: ISlotAddress;
	recurrencePattern?: string;
	shareAddress?: boolean;
	shouldReplicate?: boolean;
	slotId: string;
	timeZone: string;
}

export interface ICancelledAppointment {
	cancelledAt: ISODateString;
	customReason?: string;
	date: ISODateString;
	endTime: string;
	reasonCode?: number;
	slotId: string;
	startTime: string;
	triggeredBy: 'PATIENT' | 'THERAPIST';
}
