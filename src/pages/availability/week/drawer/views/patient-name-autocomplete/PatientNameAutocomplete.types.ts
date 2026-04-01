import type { UseFormReturn } from 'react-hook-form';
import type { ICreatePatientForm } from '@psycron/api/patient/index.types';
import type { IPatientSearchResult } from '@psycron/api/user/availability/index.types';

export interface IPatientNameAutocompleteProps {
	methods: UseFormReturn<ICreatePatientForm>;
	onPatientSelect: (patient: IPatientSearchResult) => void;
	onSelectionClear: () => void;
	results: IPatientSearchResult[];
	searchIsLoading: boolean;
	searchQuery: string;
	selectedPatient: IPatientSearchResult | null;
	setSearchQuery: (query: string) => void;
}
