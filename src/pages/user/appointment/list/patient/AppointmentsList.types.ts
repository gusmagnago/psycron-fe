import type {
	IPublicPatientSessionsResponse,
	IPublicSessionSlot,
} from '@psycron/api/patient/index.types';

export type AppointmentStatus = 'booked' | 'cancelled' | 'past';
export type DrawerMode = 'details' | 'cancel' | 'reschedule';

export interface SessionRow {
	canceledAt?: string | null;
	customReason?: string;
	date: string;
	dateId: string;
	endDateTime: Date;
	isPast: boolean;
	reasonCode?: number;
	slot: IPublicSessionSlot;
	status: AppointmentStatus;
	therapistId: string;
	triggeredBy?: 'PATIENT' | 'THERAPIST';
}

export type PublicPatientAgenda =
	IPublicPatientSessionsResponse['patient'] | undefined;

export interface NextAppointmentsMonthGroup {
	appointments: SessionRow[];
	monthKey: string;
	title: string;
}
