import type {
	IPatient,
	ISlot,
	ISODateString,
	PreferredContactType,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type PatientStatus = NonNullable<IPatient['status']>;

export type PatientListStatusFilter = 'active' | 'all' | 'inactive';

export type SessionTimelineFilter = 'all' | 'cancelled' | 'completed' | 'upcoming';

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
	cancelledSessions: number;
	fullName: string;
	isActive: boolean;
	lastAppointmentDate: string | null;
	preferredContactType?: PreferredContactType;
	searchableText: string;
	totalSessions: number;
	unresolvedCancelledSessions: number;
}

export interface PatientSessionRow {
	availabilityDayId?: string;
	canceledAt?: ISODateString | null;
	customReason?: string | null;
	date: ISODateString;
	followedUpAt?: ISODateString | null;
	followedUpBy?: string | null;
	isCancelled: boolean;
	isPast: boolean;
	reasonCode?: number | null;
	rebookedAppointmentId?: string | null;
	recoveryStatus?:
		| 'PENDING_FOLLOW_UP'
		| 'FOLLOWED_UP'
		| 'REOPENED'
		| 'REBOOKED'
		| 'ARCHIVED'
		| null;
	reopenedAt?: ISODateString | null;
	slot: Partial<ISlot> & Pick<ISlot, '_id' | 'endTime' | 'startTime'>;
	startsAt: Date;
	triggeredBy?: 'PATIENT' | 'THERAPIST' | null;
}

export interface PatientStats {
	cancelledSessions: number;
	pastSessions: number;
	totalSessions: number;
	upcomingSessions: number;
}
