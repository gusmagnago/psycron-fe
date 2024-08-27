import type { ReactNode } from 'react';
import type { ISignInForm } from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';

export interface AuthContextType {
	isAuthenticated: boolean;
	isSessionLoading: boolean;
	isSessionSuccess: boolean;
	logout: () => void;
	signIn: (data: ISignInForm) => void;
	signInError: string | null;
	signUp: (data: ISignUpForm) => void;
	signUpError: string | null;
	user?: ITherapist;
}

export interface AuthProviderProps {
	children: ReactNode;
}

export interface IUserData {
	isAuthenticated: boolean;
	user?: ITherapist;
}

export interface IBaseUser {
	_id: string;
	address: IAddress;
	contacts: IContactInfo;
	createdAt?: Date;
	firstName: string;
	lastName: string;
	updatedAt?: Date;
}
export interface ITherapist extends IBaseUser {
	availability: Array<{
		date: Date;
		slots: Array<{ endTime: string; startTime: string }>;
	}>;
	password: string;
	patients?: IPatient[];
	role: 'THERAPIST' | 'ADMIN';
	speciality?: string;
	stripeCustomerID?: string;
	subscriptions?: [];
}

export interface IPatient extends IBaseUser {
	createdBy?: string;
	receivedNotifications?: INotification[];
	role: 'PATIENT';
}

export interface IContactInfo {
	email: string;
	phone?: string;
	whatsapp?: string;
}

export interface IAddress {
	address?: string;
	administrativeArea?: string;
	city?: string;
	country?: string;
	moreInfo?: string;
	postalCode?: string;
	route?: string;
	streetNumber?: string;
	sublocality?: string;
}

export interface INotification {
	body: string;
	dateUpdated: Date;
	from: string;
	method: string;
}
