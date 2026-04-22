import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientById } from '@psycron/api/patient';
import {
	getConflicts,
	scanPatientDuplicates,
} from '@psycron/api/user/conflicts';
import type { IPatientDuplicateConflictMetadata } from '@psycron/api/user/conflicts/index.types';
import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import useViewport from '@psycron/hooks/useViewport';
import { PATIENTS } from '@psycron/pages/urls';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';

import type {
	PatientListSortDirection,
	PatientListSortField,
	PatientListStatusFilter,
} from '../PatientsPage.types';
import {
	getPatientListSortDefaultDirection,
	mapPatientToListItem,
	sortPatientListItems,
} from '../PatientsPage.utils';

export const usePatientListPageState = () => {
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const { isSmallerThanTablet } = useViewport();
	const { isUserDetailsLoading, therapistId, userDetails } = useUserDetails();

	const [searchQuery, setSearchQuery] = useState('');
	const [sortDirection, setSortDirection] = useState<PatientListSortDirection>(
		getPatientListSortDefaultDirection('name')
	);
	const [sortField, setSortField] = useState<PatientListSortField>('name');
	const [statusFilter, setStatusFilter] =
		useState<PatientListStatusFilter>('all');

	const patientIds = [...new Set(userDetails?.patients ?? [])];

	const scanMutation = useMutation({
		mutationFn: () => scanPatientDuplicates(therapistId),
	});

	useEffect(() => {
		if (therapistId && patientIds.length > 0) {
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

	const patientQueries = useQueries({
		queries: patientIds.map((patientId) => ({
			enabled: Boolean(therapistId && patientId),
			queryFn: () => getPatientById(therapistId, patientId),
			queryKey: ['patientListItem', therapistId, patientId],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const patients = useMemo(
		() =>
			patientQueries
				.map((query) => query.data)
				.filter((patient): patient is IPatient => Boolean(patient))
				.map((patient) => mapPatientToListItem(patient)),
		[patientQueries]
	);

	const filteredPatients = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		const nextItems = patients.filter((patient) => {
			const matchesSearch = !normalizedQuery
				? true
				: patient.searchableText.includes(normalizedQuery);
			const matchesStatus =
				statusFilter === 'all'
					? true
					: statusFilter === 'active'
						? patient.isActive
						: !patient.isActive;

			return matchesSearch && matchesStatus;
		});

		return sortPatientListItems(nextItems, sortField, sortDirection);
	}, [patients, searchQuery, sortDirection, sortField, statusFilter]);

	const openPatientProfile = (patientId: string): void => {
		navigate(`/${locale}/${PATIENTS}/${patientId}`);
	};

	return {
		duplicatePatientIds,
		filteredPatients,
		hasPatients: patients.length > 0,
		isDesktopTable: !isSmallerThanTablet,
		isLoading:
			isUserDetailsLoading || patientQueries.some((query) => query.isLoading),
		openPatientProfile,
		searchQuery,
		setSearchQuery,
		setSortDirection,
		setSortField,
		setStatusFilter,
		sortDirection,
		sortField,
		statusFilter,
	};
};
