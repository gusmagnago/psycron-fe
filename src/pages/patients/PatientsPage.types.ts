import type { ReactElement } from 'react';
import type {
	IPatientWorkspaceSummary,
	PatientWorkspaceQueueFilter,
} from '@psycron/api/patient/index.types';
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
	| 'billing'
	| 'contact'
	| 'last-appointment'
	| 'name'
	| 'next-action'
	| 'next-session'
	| 'total-sessions';
export type PatientListSortDirection = 'asc' | 'desc';

export type PatientWorkspaceQueue = 'all' | PatientWorkspaceQueueFilter;

export interface PatientWorkQueueCard {
	clearDescriptionKey: string;
	count?: number;
	descriptionKey: string;
	icon: ReactElement<{
		'data-testid'?: string;
		id?: string;
	}>;
	id: string;
	labelKey: string;
	queue: PatientWorkspaceQueueFilter;
}

export type PatientNextAction =
	| 'add-contact'
	| 'add-contact-and-billing'
	| 'ready'
	| 'review-duplicate'
	| 'review-scheduling'
	| 'send-follow-up'
	| 'set-billing';

export type PatientNextSessionState =
	| 'approaching'
	| 'imminent'
	| 'none'
	| 'normal'
	| 'now';

export type PatientWorkspaceColumn =
	| 'billing'
	| 'contact'
	| 'next-action'
	| 'next-session'
	| 'patient'
	| 'sessions';

export type PatientWorkspaceFilterableColumn = Exclude<
	PatientWorkspaceColumn,
	'sessions'
>;

export interface PatientWorkspaceColumnFilterOption {
	label: string;
	value: string;
}

export interface PatientWorkspaceSortState {
	/**
	 * `null` when the active sort field has no matching table column
	 * (`last-appointment`), so no header claims `aria-sort`.
	 */
	column: PatientWorkspaceColumn | null;
	direction: PatientListSortDirection;
}

export type PatientWorkspaceSummary = IPatientWorkspaceSummary;

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

export interface PatientWorkspaceRow extends PatientListItem {
	billingConfigured: boolean;
	hasContact: boolean;
	nextAction: PatientNextAction;
	nextSessionDate: string | null;
	uiRowKey: string;
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
