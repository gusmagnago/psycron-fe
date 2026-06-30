import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CustomError } from '@psycron/api/error';
import { getPatients } from '@psycron/api/patient';
import {
	getConflicts,
	scanPatientDuplicates,
} from '@psycron/api/user/conflicts';
import type { IPatientDuplicateConflictMetadata } from '@psycron/api/user/conflicts/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import useViewport from '@psycron/hooks/useViewport';
import { PATIENTS } from '@psycron/pages/urls';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
} from '@tanstack/react-query';

import type {
	PatientListSortDirection,
	PatientListSortField,
	PatientListStatusFilter,
} from '../PatientsPage.types';
import {
	getPatientListSortDefaultDirection,
	mapPatientToListItem,
} from '../PatientsPage.utils';

const PATIENTS_PAGE_SIZE = 20;

export const usePatientListPageState = () => {
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const { isSmallerThanTablet } = useViewport();
	const { isUserDetailsLoading, therapistId } = useUserDetails();
	const { showAlert } = useAlert();

	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [sortDirection, setSortDirection] = useState<PatientListSortDirection>(
		getPatientListSortDefaultDirection('name')
	);
	const [sortField, setSortField] = useState<PatientListSortField>('name');
	const [statusFilter, setStatusFilter] =
		useState<PatientListStatusFilter>('all');

	// Debounce the search box so we don't fire a request per keystroke.
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	const scanMutation = useMutation({
		mutationFn: () => scanPatientDuplicates(therapistId),
		onError: (error: CustomError) => {
			showAlert({ message: error.message, severity: 'error' });
		},
	});

	useEffect(() => {
		if (therapistId) {
			scanMutation.mutate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [therapistId]);

	const { data: conflictsData } = useQuery({
		enabled: Boolean(therapistId),
		queryFn: () =>
			getConflicts({
				status: 'OPEN',
				therapistId,
				type: 'PATIENT_DUPLICATE',
			}),
		queryKey: ['conflicts', therapistId, 'PATIENT_DUPLICATE', 'OPEN'],
	});

	const duplicatePatientIds = useMemo(() => {
		const ids = new Set<string>();
		for (const conflict of conflictsData?.conflicts ?? []) {
			const metadata = conflict.metadata as IPatientDuplicateConflictMetadata;
			for (const candidate of metadata.candidatePatients ?? []) {
				ids.add(candidate._id);
			}
		}
		return ids;
	}, [conflictsData]);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isPatientsLoading,
	} = useInfiniteQuery({
		enabled: Boolean(therapistId),
		queryKey: [
			'patientsList',
			therapistId,
			debouncedSearch,
			sortField,
			sortDirection,
			statusFilter,
		],
		queryFn: ({ pageParam }) =>
			getPatients(therapistId, {
				page: pageParam,
				limit: PATIENTS_PAGE_SIZE,
				q: debouncedSearch || undefined,
				sort: sortField,
				dir: sortDirection,
				status: statusFilter,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page * lastPage.limit < lastPage.total
				? lastPage.page + 1
				: undefined,
		staleTime: 1000 * 60,
	});

	// Server already paginates, searches and sorts — just flatten + map for display.
	const filteredPatients = useMemo(
		() =>
			(data?.pages ?? [])
				.flatMap((pageResult) => pageResult.patients)
				.map((patient) => mapPatientToListItem(patient)),
		[data]
	);

	const totalPatients = data?.pages?.[0]?.total ?? 0;

	const openPatientProfile = (patientId: string): void => {
		navigate(`/${locale}/${PATIENTS}/${patientId}`);
	};

	return {
		duplicatePatientIds,
		fetchNextPage,
		filteredPatients,
		hasNextPage,
		hasPatients: totalPatients > 0,
		isDesktopTable: !isSmallerThanTablet,
		isFetchingNextPage,
		isLoading: isUserDetailsLoading || isPatientsLoading,
		openPatientProfile,
		searchQuery,
		setSearchQuery,
		setSortDirection,
		setSortField,
		setStatusFilter,
		sortDirection,
		sortField,
		statusFilter,
		totalPatients,
	};
};
