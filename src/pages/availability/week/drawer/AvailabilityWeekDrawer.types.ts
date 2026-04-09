import type { ReactNode } from 'react';

import type { IWeekSlot } from '../AvailabilityWeekPage.types';

export type DrawerView =
	| 'block-confirm'
	| 'cancel-reason'
	| 'default'
	| 'editing'
	| 'reschedule-or-cancel'
	| 'reschedule-slots'
	| 'unblock-confirm';

export type LocationChoice = 'clinic' | 'custom' | 'patient';

export interface IExistingBooking {
	date: string;
	patientName: string;
	slotId: string;
	startTime: string;
}

export interface IRescheduleSlot {
	availabilityDayId: string;
	slotId: string;
	startTime: string;
}

export interface IAvailabilityWeekDrawerProps {
	onClose: () => void;
	slot: IWeekSlot;
}

export interface IDrawerDetail {
	icon: ReactNode;
	key: string;
	label: string;
	sub?: string;
	value: string;
}
