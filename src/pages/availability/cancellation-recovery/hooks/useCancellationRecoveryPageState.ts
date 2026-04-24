import { useEffect, useMemo, useState } from 'react';
import { getAvailabilityCalendar } from '@psycron/api/user';
import { editSlotStatus } from '@psycron/api/user/availability';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
	CancellationRecoveryRow,
	UseCancellationRecoveryPageStateParams,
} from '../CancellationRecoveryPage.types';
import {
	buildCancellationRecoveryRows,
	filterCancellationRecoveryRows,
	findRecoveryRowBySlotId,
	formatRecoverySearchRange,
	getCancellationReasonOptions,
	getRecoveryStats,
} from '../CancellationRecoveryPage.utils';

import { useCancellationRecoveryFilters } from './useCancellationRecoveryFilters';

export const useCancellationRecoveryPageState = ({
	t,
}: UseCancellationRecoveryPageStateParams) => {
	const therapistId = useTherapistId();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

	const searchRange = useMemo(() => formatRecoverySearchRange(new Date()), []);

	const { data, isLoading } = useQuery({
		queryKey: [
			'cancellationRecovery',
			therapistId,
			searchRange.from,
			searchRange.to,
		],
		queryFn: () =>
			getAvailabilityCalendar(therapistId ?? '', {
				from: searchRange.from,
				to: searchRange.to,
			}),
		enabled: Boolean(therapistId),
		gcTime: 1000 * 60 * 30,
		refetchOnMount: false,
		staleTime: 1000 * 60 * 5,
	});

	const rows = useMemo(
		() => buildCancellationRecoveryRows({ dates: data?.dates }),
		[data?.dates]
	);
	const reasonOptions = useMemo(
		() => getCancellationReasonOptions(rows),
		[rows]
	);
	const filters = useCancellationRecoveryFilters(reasonOptions);
	const filteredRows = useMemo(
		() => filterCancellationRecoveryRows(rows, filters.filters),
		[filters.filters, rows]
	);
	const stats = useMemo(() => getRecoveryStats(rows), [rows]);
	const selectedRow = useMemo(
		() => findRecoveryRowBySlotId(filteredRows, selectedSlotId),
		[filteredRows, selectedSlotId]
	);

	useEffect(() => {
		if (!filteredRows.length) {
			setSelectedSlotId(null);
			return;
		}

		if (
			!selectedSlotId ||
			!filteredRows.some((row) => row.slotId === selectedSlotId)
		) {
			setSelectedSlotId(filteredRows[0].slotId);
		}
	}, [filteredRows, selectedSlotId]);

	useEffect(() => {
		if (!isFiltersDrawerOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsFiltersDrawerOpen(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isFiltersDrawerOpen]);

	const reopenMutation = useMutation({
		mutationFn: (row: CancellationRecoveryRow) =>
			editSlotStatus({
				availabilityDayId: row.availabilityDayId ?? '',
				data: {
					newStatus: StatusEnum.AVAILABLE,
					startTime: row.startTime,
				},
				slotId: row.slotId,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.cancellation-recovery.actions.reopen-error'),
				severity: 'error',
			});
		},
		onSuccess: () => {
			showAlert({
				message: t('availability.cancellation-recovery.actions.reopen-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({
				queryKey: ['cancellationRecovery', therapistId],
			});
			queryClient.invalidateQueries({
				queryKey: ['therapistAvailability'],
			});
		},
	});

	return {
		filteredRows,
		filters,
		isFiltersDrawerOpen,
		isLoading,
		isReopening: reopenMutation.isPending,
		openFiltersDrawer: () => setIsFiltersDrawerOpen(true),
		closeFiltersDrawer: () => setIsFiltersDrawerOpen(false),
		reopenRow: (row: CancellationRecoveryRow) => reopenMutation.mutate(row),
		selectedRow,
		selectedSlotId,
		selectRow: (slotId: string) => setSelectedSlotId(slotId),
		stats,
	};
};
