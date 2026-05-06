import { useEffect, useMemo, useState } from 'react';
import { getPatientById } from '@psycron/api/patient';
import { getAvailabilityCalendar } from '@psycron/api/user';
import {
	editSlotStatus,
	updateCancellationRecoveryStatus,
} from '@psycron/api/user/availability';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

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
	isRecoveryStateResolved,
} from '../CancellationRecoveryPage.utils';

import { useCancellationRecoveryFilters } from './useCancellationRecoveryFilters';

export const useCancellationRecoveryPageState = ({
	t,
}: UseCancellationRecoveryPageStateParams) => {
	const therapistId = useTherapistId();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const [locallyArchivedSlotIds, setLocallyArchivedSlotIds] = useState(
		() => new Set<string>()
	);
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

	const rawRows = useMemo(
		() => buildCancellationRecoveryRows({ dates: data?.dates }),
		[data?.dates]
	);

	const patientIdsToEnrich = useMemo(() => {
		const seen = new Set<string>();
		rawRows.forEach((row) => {
			if (row.patientId && !row.patientName) seen.add(row.patientId);
		});
		return [...seen];
	}, [rawRows]);

	const enrichmentQueries = useQueries({
		queries: patientIdsToEnrich.map((patientId) => ({
			enabled: Boolean(therapistId && patientId),
			queryFn: () => getPatientById(therapistId ?? '', patientId),
			queryKey: ['patientListItem', therapistId, patientId],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const enrichedNameMap = useMemo(() => {
		const map = new Map<string, string>();
		enrichmentQueries.forEach((q) => {
			if (q.data) {
				const name = `${q.data.firstName} ${q.data.lastName}`.trim();
				if (name) map.set(q.data._id, name);
			}
		});
		return map;
	}, [enrichmentQueries]);

	const rows = useMemo(
		() =>
			rawRows.map((row) => {
				const enrichedName =
					row.patientId && !row.patientName
						? (enrichedNameMap.get(row.patientId) ?? '')
						: row.patientName;
				const base =
					enrichedName !== row.patientName
						? { ...row, patientName: enrichedName }
						: row;
				return locallyArchivedSlotIds.has(row.slotId)
					? {
							...base,
							recoveryState: 'archived' as const,
							recoveryStatus: 'ARCHIVED' as const,
						}
					: base;
			}),
		[enrichedNameMap, locallyArchivedSlotIds, rawRows]
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
	const stats = useMemo(() => getRecoveryStats(filteredRows), [filteredRows]);
	const archivableRows = useMemo(
		() =>
			filteredRows.filter((row) => !isRecoveryStateResolved(row.recoveryState)),
		[filteredRows]
	);
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
			queryClient.invalidateQueries({
				queryKey: ['patientListItem'],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails'],
			});
		},
	});

	const archiveMutation = useMutation({
		mutationFn: (row: CancellationRecoveryRow) =>
			updateCancellationRecoveryStatus({
				recoveryStatus: 'ARCHIVED',
				slotId: row.slotId,
				therapistId: therapistId ?? '',
			}),
		onError: () => {
			showAlert({
				message: t('availability.cancellation-recovery.actions.archive-error'),
				severity: 'error',
			});
		},
		onSuccess: (_data, row) => {
			setLocallyArchivedSlotIds((current) => new Set(current).add(row.slotId));
			showAlert({
				message: t('availability.cancellation-recovery.actions.archive-success'),
				severity: 'success',
			});
			queryClient.invalidateQueries({
				queryKey: ['cancellationRecovery', therapistId],
			});
			queryClient.invalidateQueries({
				queryKey: ['therapistAvailability'],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientListItem'],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails'],
			});
		},
	});

	const archiveAllMutation = useMutation({
		mutationFn: (rowsToArchive: CancellationRecoveryRow[]) =>
			Promise.all(
				rowsToArchive.map((row) =>
					updateCancellationRecoveryStatus({
						recoveryStatus: 'ARCHIVED',
						slotId: row.slotId,
						therapistId: therapistId ?? '',
					})
				)
			),
		onError: () => {
			showAlert({
				message: t('availability.cancellation-recovery.actions.archive-all-error'),
				severity: 'error',
			});
		},
		onSuccess: (_data, rowsToArchive) => {
			setLocallyArchivedSlotIds((current) => {
				const next = new Set(current);
				rowsToArchive.forEach((row) => next.add(row.slotId));
				return next;
			});
			showAlert({
				message: t('availability.cancellation-recovery.actions.archive-all-success', {
					count: rowsToArchive.length,
				}),
				severity: 'success',
			});
			queryClient.invalidateQueries({
				queryKey: ['cancellationRecovery', therapistId],
			});
			queryClient.invalidateQueries({
				queryKey: ['therapistAvailability'],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientListItem'],
			});
			queryClient.invalidateQueries({
				queryKey: ['patientDetails'],
			});
		},
	});

	return {
		archiveAllRows: () => archiveAllMutation.mutate(archivableRows),
		archiveRow: (row: CancellationRecoveryRow) => archiveMutation.mutate(row),
		archivableRowsCount: archivableRows.length,
		filteredRows,
		filters,
		isFiltersDrawerOpen,
		isArchiving: archiveMutation.isPending,
		isArchivingAll: archiveAllMutation.isPending,
		isLoading,
		isReopening: reopenMutation.isPending,
		openFiltersDrawer: () => setIsFiltersDrawerOpen(true),
		closeFiltersDrawer: () => setIsFiltersDrawerOpen(false),
		reopenRow: (row: CancellationRecoveryRow) => reopenMutation.mutate(row),
		selectedRow,
		selectedSlotId,
		clearSelection: () => setSelectedSlotId(null),
		selectRow: (slotId: string) => setSelectedSlotId(slotId),
		stats,
	};
};
