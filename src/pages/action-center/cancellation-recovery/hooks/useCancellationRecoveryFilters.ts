import { useMemo, useState } from 'react';

import type {
	CancellationReasonOption,
	CancellationRecoveryDeliveryModeFilter,
	CancellationRecoveryFilters,
	CancellationRecoveryPeriodFilter,
	CancellationRecoveryStatusFilter,
	CancellationRecoveryWhoCancelledFilter,
	UseCancellationRecoveryFiltersResult,
} from '../CancellationRecoveryPage.types';

const DEFAULT_FILTERS: CancellationRecoveryFilters = {
	cancelledBy: 'all',
	deliveryMode: 'all',
	patientQuery: '',
	period: 'all',
	reasonCode: 'all',
	status: 'needs_action',
};

export const useCancellationRecoveryFilters = (
	reasonOptions: CancellationReasonOption[]
): UseCancellationRecoveryFiltersResult => {
	const [filters, setFilters] =
		useState<CancellationRecoveryFilters>(DEFAULT_FILTERS);

	const activeFilterCount = useMemo(
		() =>
			[
				filters.patientQuery.trim() ? 1 : 0,
				filters.period !== 'all' ? 1 : 0,
				filters.cancelledBy !== 'all' ? 1 : 0,
				filters.reasonCode !== 'all' ? 1 : 0,
				filters.deliveryMode !== 'all' ? 1 : 0,
				filters.status !== 'needs_action' ? 1 : 0,
			].reduce((sum, count) => sum + count, 0),
		[filters]
	);

	const setPatientQuery = (patientQuery: string) =>
		setFilters((current) => ({ ...current, patientQuery }));

	const setPeriod = (period: CancellationRecoveryPeriodFilter) =>
		setFilters((current) => ({ ...current, period }));

	const setCancelledBy = (
		cancelledBy: CancellationRecoveryWhoCancelledFilter
	) => setFilters((current) => ({ ...current, cancelledBy }));

	const setReasonCode = (reasonCode: string) =>
		setFilters((current) => ({ ...current, reasonCode }));

	const setStatus = (status: CancellationRecoveryStatusFilter) =>
		setFilters((current) => ({ ...current, status }));

	const setDeliveryMode = (
		deliveryMode: CancellationRecoveryDeliveryModeFilter
	) => setFilters((current) => ({ ...current, deliveryMode }));

	return {
		activeFilterCount,
		filters,
		reasonOptions,
		setCancelledBy,
		setDeliveryMode,
		setPatientQuery,
		setPeriod,
		setReasonCode,
		setStatus,
	};
};
