import { useMemo } from 'react';
import type { DashboardBillingReadiness } from '@psycron/api/dashboard/index.types';
import { getPatientById } from '@psycron/api/patient';
import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { isPatientBillingConfigured } from '@psycron/utils/patient/patient.utils';
import { useQueries } from '@tanstack/react-query';

export interface UseDashboardBillingReadinessReturn {
	billingReadiness: DashboardBillingReadiness;
	isLoading: boolean;
}

const EMPTY_BILLING_READINESS: DashboardBillingReadiness = {
	configuredCount: 0,
	missingCount: 0,
	percentage: 0,
	status: 'empty',
	totalCount: 0,
};

const isActivePatient = (patient: IPatient): boolean =>
	patient.status !== 'ARCHIVED' && patient.status !== 'MERGED';

const getBillingStatus = (
	configuredCount: number,
	totalCount: number
): DashboardBillingReadiness['status'] => {
	if (totalCount === 0) return 'empty';
	return configuredCount === totalCount ? 'ready' : 'partial';
};

const calculateBillingReadiness = (
	patients: IPatient[]
): DashboardBillingReadiness => {
	const activePatients = patients.filter(isActivePatient);
	const totalCount = activePatients.length;
	const configuredCount = activePatients.filter((patient) =>
		isPatientBillingConfigured(patient.billing)
	).length;
	const missingCount = totalCount - configuredCount;
	const percentage =
		totalCount > 0 ? Math.round((configuredCount / totalCount) * 100) : 0;

	return {
		configuredCount,
		missingCount,
		percentage,
		status: getBillingStatus(configuredCount, totalCount),
		totalCount,
	};
};

export const useDashboardBillingReadiness = (
	fallback?: DashboardBillingReadiness
): UseDashboardBillingReadinessReturn => {
	const { isUserDetailsLoading, therapistId, userDetails } = useUserDetails();
	const patientIds = useMemo(
		() => [...new Set(userDetails?.patients ?? [])],
		[userDetails?.patients]
	);

	const patientQueries = useQueries({
		queries: patientIds.map((patientId) => ({
			enabled: Boolean(therapistId && patientId),
			queryFn: () => getPatientById(therapistId, patientId),
			queryKey: ['patientListItem', therapistId, patientId],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const isLoading =
		isUserDetailsLoading || patientQueries.some((query) => query.isLoading);

	const billingReadiness = useMemo(() => {
		const patients = patientQueries
			.map((query) => query.data)
			.filter((patient): patient is IPatient => Boolean(patient));

		if (isLoading || patients.length !== patientIds.length) {
			return fallback ?? EMPTY_BILLING_READINESS;
		}

		return calculateBillingReadiness(patients);
	}, [fallback, isLoading, patientIds.length, patientQueries]);

	return { billingReadiness, isLoading };
};
