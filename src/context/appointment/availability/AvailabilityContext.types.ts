import type { ReactNode } from 'react';
import type {
	IAvailabilityResponse,
	IDateInfo,
} from '@psycron/api/user/index.types';
import type { ISlot } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface AvailabilityContextType {
	availabilityData?: IAvailabilityResponse;
	availabilityDataIsLoading: boolean;
	firstDate: IDateInfo;
	isAvailabilityDatesEmpty: boolean;
	lastDate: IDateInfo;
	totalPages: number;
}

export interface AvailabilityProviderProps {
	children: ReactNode;
}

export interface UseAvailabilityProps {
	initialDaySelected?: IDateInfo;
	slotId?: string;
}

export type ISelectedSlot = {
	availabilityDayId: string;
	date: Date;
	patientId?: string;
	slot: ISlot;
	therapistId?: string;
};
