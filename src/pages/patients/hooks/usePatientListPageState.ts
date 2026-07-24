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
	keepPreviousData,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import type {
	PatientListSortDirection,
	PatientListSortField,
	PatientListStatusFilter,
	PatientWorkspaceQueue,
} from '../PatientsPage.types';
import {
	getPatientListSortDefaultDirection,
	mapPatientToWorkspaceRow,
} from '../PatientsPage.utils';

const PATIENTS_PAGE_SIZE = 20;
const PATIENT_QUEUE_STORAGE_KEY = '_psy_pq';
const PATIENT_WORKSPACE_QUEUES = [
	'all',
	'billing',
	'contact',
	'duplicate',
	'needs-attention',
	'recovery',
] as const satisfies readonly PatientWorkspaceQueue[];

const isPatientWorkspaceQueue = (
	value: string
): value is PatientWorkspaceQueue =>
	PATIENT_WORKSPACE_QUEUES.some((queue) => queue === value);

const getInitialPatientQueue = (): PatientWorkspaceQueue => {
	try {
		const storedQueue = localStorage.getItem(PATIENT_QUEUE_STORAGE_KEY);
		return storedQueue && isPatientWorkspaceQueue(storedQueue)
			? storedQueue
			: 'needs-attention';
	} catch {
		return 'needs-attention';
	}
};

export const usePatientListPageState = () => {
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const { isSmallerThanTablet } = useViewport();
	const { isUserDetailsLoading, therapistId } = useUserDetails();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [queue, setQueue] =
		useState<PatientWorkspaceQueue>(getInitialPatientQueue);
	const [sortDirection, setSortDirection] = useState<PatientListSortDirection>(
		getPatientListSortDefaultDirection('name')
	);
	const [sortField, setSortField] = useState<PatientListSortField>('name');
	const [statusFilter, setStatusFilter] =
		useState<PatientListStatusFilter>('all');

	useEffect(() => {
		try {
			localStorage.setItem(PATIENT_QUEUE_STORAGE_KEY, queue);
		} catch {
			// The queue remains functional when storage is unavailable.
		}
	}, [queue]);

	// Debounce the search box so we don't fire a request per keystroke.
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	const scanMutation = useMutation({
		mutationFn: () => scanPatientDuplicates(therapistId),
		// The scan may open, refresh, or auto-dismiss duplicate conflicts. Refetch
		// both conflict detail and the authoritative workspace membership/counts.
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['conflicts'] });
			queryClient.invalidateQueries({
				queryKey: ['patientsList', therapistId],
			});
		},
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
		isFetching: isPatientsFetching,
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
			queue,
		],
		queryFn: ({ pageParam }) =>
			getPatients(therapistId, {
				page: pageParam,
				limit: PATIENTS_PAGE_SIZE,
				q: debouncedSearch || undefined,
				sort: sortField,
				dir: sortDirection,
				status: statusFilter,
				queue: queue === 'all' ? undefined : queue,
			}),
		initialPageParam: 1,
		placeholderData: keepPreviousData,
		getNextPageParam: (lastPage) =>
			lastPage.page * lastPage.limit < lastPage.total
				? lastPage.page + 1
				: undefined,
		staleTime: 1000 * 60,
	});

	// Server already paginates, searches and sorts — just flatten + map for display.
	const filteredPatients = useMemo(
		() =>
			(data?.pages ?? []).flatMap((pageResult) =>
				pageResult.patients.map((patient, patientIndex) =>
					mapPatientToWorkspaceRow(patient, {
						isPossibleDuplicate: duplicatePatientIds.has(patient._id),
						uiRowKey: `page-${pageResult.page}-row-${patientIndex + 1}`,
					})
				)
			),
		[data, duplicatePatientIds]
	);

	const totalPatients = data?.pages?.[0]?.total ?? 0;
	const workspaceSummary = data?.pages?.[0]?.workspaceSummary;

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
		isLoading: isUserDetailsLoading || (isPatientsLoading && !data),
		isRefreshingResults:
			isPatientsFetching && !isPatientsLoading && !isFetchingNextPage,
		openPatientProfile,
		searchQuery,
		queue,
		setQueue,
		setSearchQuery,
		setSortDirection,
		setSortField,
		setStatusFilter,
		sortDirection,
		sortField,
		statusFilter,
		totalPatients,
		workspaceSummary,
	};
};
