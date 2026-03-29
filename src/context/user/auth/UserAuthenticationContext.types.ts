import type { ReactNode } from 'react';
import type { StatusEnum } from '@psycron/api/user/availability/index.types';
import type {
	ISignInForm,
	IVerifyEmailResponse,
} from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUpEmail.types';

export type ISODateString = string;
export type MongoId = string;

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
	email: string;
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
	_id: MongoId;
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

	availability: MongoId[];
	clinicAddress?: IClinicAddress;
	// GDPR/LGPD
	consent?: IConsent;
	consentHistory?: IConsentHistoryEntry[];

	deletedAt?: ISODateString | null;
	google: IGoogleUser;
	googleCalendar?: IGoogleCalendar;
	googleId?: string;
	notifications: MongoId[];
	// local-only
	password?: string;
	// IDs (because BE is not populating in /users/:id)
	patients: MongoId[];
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

export interface ISlot {
	_id: MongoId;
	address?: ISlotAddress | null;
	canceledAt?: ISODateString | null;
	customReason?: string | null;
	endTime: string;
	letPatientChooseAddress?: boolean;
	note?: string;
	patientId?: MongoId;
	reasonCode?: string | null;
	startTime: string;
	status: StatusEnum;
}

export interface IAvailabilityDate {
	_id: MongoId;
	date: ISODateString;
	slots: ISlot[];
}

export interface ISessionDatesGroup {
	_id?: MongoId;
	date: ISODateString;
	slots: ISlot[];
}

export interface IPatient extends IBaseUser {
	cancelledAppointments?: ICancelledAppointment[];
	createdBy?: ITherapist | MongoId;
	notifications?: INotification[];

	role: 'PATIENT';
	sessionDates: ISessionDatesGroup[];
	timeZone?: string;
}

export interface IBookSessionWithLink {
	availabilityDayId: MongoId;
	patient: Partial<IPatient>;
	shareAddress?: boolean;
	shouldReplicate?: boolean;
	slotId: MongoId;
	timeZone: string;
}

export interface ICancelledAppointment {
	cancelledAt: ISODateString;
	customReason?: string;
	date: ISODateString;
	endTime: string;
	reasonCode?: number;
	slotId: MongoId;
	startTime: string;
	triggeredBy: 'PATIENT' | 'THERAPIST';
}
