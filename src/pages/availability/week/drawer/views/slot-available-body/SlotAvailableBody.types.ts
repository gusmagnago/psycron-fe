import type { UseFormReturn } from 'react-hook-form';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import type { IPatientSearchResult } from '@psycron/api/user/availability/index.types';

import type { ISlotLocationSectionProps } from '../slot-location-section/SlotLocationSection.types';

export interface ISlotAvailableBodyProps extends ISlotLocationSectionProps {
	bookingLink: string;
	methods: UseFormReturn<ICreatePatientForm>;
	onPatientSelect: (patient: IPatientSearchResult) => void;
	onSelectionClear: () => void;
	results: IPatientSearchResult[];
	searchIsLoading: boolean;
	searchQuery: string;
	selectedPatient: IPatientSearchResult | null;
	sessionType?: string;
	setSearchQuery: (query: string) => void;
	shareText: string;
	shareTitle: string;
}
