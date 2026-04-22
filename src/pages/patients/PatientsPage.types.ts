import type {
	IPatient,
	ISlot,
	ISODateString,
	PreferredContactType,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type PatientStatus = NonNullable<IPatient['status']>;

export type PatientListStatusFilter = 'active' | 'all' | 'inactive';

export type PatientListSortField =
	| 'last-appointment'
	| 'name'
	| 'total-sessions';
export type PatientListSortDirection = 'asc' | 'desc';

export interface PatientListSortOption {
	defaultDirection: PatientListSortDirection;
	direction: PatientListSortDirection;
	field: PatientListSortField;
	labelKey: string;
}

export interface PatientListItem extends IPatient {
	fullName: string;
	isActive: boolean;
	lastAppointmentDate: string | null;
	preferredContactType?: PreferredContactType;
	searchableText: string;
	totalSessions: number;
}

export interface PatientSessionRow {
	date: ISODateString;
	isCancelled: boolean;
	isPast: boolean;
	slot: ISlot;
	startsAt: Date;
}

export interface PatientStats {
	cancelledSessions: number;
	pastSessions: number;
	totalSessions: number;
	upcomingSessions: number;
}
