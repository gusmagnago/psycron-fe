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

export type PatientListStatusFilter = 'all' | 'active' | 'inactive';
export type PatientListSort =
	| 'name-asc'
	| 'last-appointment-desc'
	| 'total-sessions-desc';

export interface PatientListItem extends IPatient {
	fullName: string;
	isActive: boolean;
	lastAppointmentDate: string | null;
	preferredContactType: IPatient['preferredContact'] extends infer T
		? T extends { type?: infer U }
			? U
			: never
		: never;
	searchableText: string;
	totalSessions: number;
}

const sortItems = (
	items: PatientListItem[],
	sortBy: PatientListSort
): PatientListItem[] => {
	switch (sortBy) {
		case 'last-appointment-desc':
			return [...items].sort((a, b) => {
				if (!a.lastAppointmentDate && !b.lastAppointmentDate) return 0;
				if (!a.lastAppointmentDate) return 1;
				if (!b.lastAppointmentDate) return -1;
				return (
					new Date(b.lastAppointmentDate).getTime() -
					new Date(a.lastAppointmentDate).getTime()
				);
			});
		case 'total-sessions-desc':
			return [...items].sort((a, b) => b.totalSessions - a.totalSessions);
		case 'name-asc':
		default:
			return [...items].sort((a, b) => a.fullName.localeCompare(b.fullName));
	}
};

const getLastAppointmentDate = (patient: IPatient): string | null => {
	const allAppointments = (patient.sessionDates ?? []).flatMap((sessionDate) =>
		(sessionDate.slots ?? []).map((slot) =>
			new Date(`${String(sessionDate.date).slice(0, 10)}T${slot.startTime}:00`)
		)
	);

	if (!allAppointments.length) return null;

	return allAppointments
		.sort((a, b) => b.getTime() - a.getTime())[0]
		.toISOString();
};

const getIsActive = (patient: IPatient): boolean => {
	const now = new Date().getTime();

	return (patient.sessionDates ?? []).some((sessionDate) =>
		(sessionDate.slots ?? []).some((slot) => {
			const startsAt = new Date(
				`${String(sessionDate.date).slice(0, 10)}T${slot.startTime}:00`
			).getTime();

			return startsAt >= now;
		})
	);
};

const mapPatientToListItem = (patient: IPatient): PatientListItem => {
	const fullName = [patient.firstName, patient.lastName].filter(Boolean).join(' ');
	const searchableText = [
		fullName,
		patient.contacts?.email,
		patient.contacts?.phone,
		patient.contacts?.whatsapp,
	].filter(Boolean)
		.join(' ')
		.toLowerCase();

	return {
		...patient,
		fullName,
		isActive: getIsActive(patient),
		lastAppointmentDate: getLastAppointmentDate(patient),
		preferredContactType: patient.preferredContact?.type,
		searchableText,
		totalSessions: (patient.sessionDates ?? []).reduce(
			(total, sessionDate) => total + (sessionDate.slots?.length ?? 0),
			0
		),
	};
};

export const usePatientListPageState = () => {
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const { isSmallerThanTablet } = useViewport();
	const { isUserDetailsLoading, therapistId, userDetails } = useUserDetails();

	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<PatientListSort>('name-asc');
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
			const metadata =
				conflict.metadata as IPatientDuplicateConflictMetadata;
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

		return sortItems(nextItems, sortBy);
	}, [patients, searchQuery, sortBy, statusFilter]);

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
		setSortBy,
		setStatusFilter,
		sortBy,
		statusFilter,
	};
};
