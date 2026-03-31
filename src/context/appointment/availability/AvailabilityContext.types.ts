import type { ReactNode } from 'react';
import type {
	IAvailabilityResponse,
	IDateInfo,
} from '@psycron/api/user/index.types';

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
