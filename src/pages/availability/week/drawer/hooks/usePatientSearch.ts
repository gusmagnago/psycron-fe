import { useEffect, useState } from 'react';
import { searchPatients } from '@psycron/api/user/availability';
import type { IPatientSearchResult } from '@psycron/api/user/availability/index.types';
import { useQuery } from '@tanstack/react-query';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export const usePatientSearch = (therapistId: string | null) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [selectedPatient, setSelectedPatient] =
		useState<IPatientSearchResult | null>(null);

	useEffect(() => {
		if (searchQuery.length < MIN_QUERY_LENGTH) {
			setDebouncedQuery('');
			return;
		}

		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const { data, isLoading } = useQuery({
		queryKey: ['patientSearch', therapistId, debouncedQuery],
		queryFn: () => searchPatients(therapistId!, debouncedQuery),
		enabled: !!therapistId && debouncedQuery.length >= MIN_QUERY_LENGTH,
		staleTime: 1000 * 60,
	});

	const clearSelection = () => {
		setSelectedPatient(null);
		setSearchQuery('');
	};

	return {
		clearSelection,
		isLoading: isLoading && debouncedQuery.length >= MIN_QUERY_LENGTH,
		results: data?.patients ?? [],
		searchQuery,
		selectedPatient,
		setSearchQuery,
		setSelectedPatient,
	};
};
