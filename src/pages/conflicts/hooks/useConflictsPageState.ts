import { useCallback, useEffect, useMemo, useState } from 'react';
import { getConflicts, updateConflict } from '@psycron/api/user/conflicts';
import type {
	ConflictStatus,
	ConflictType,
	IConflict,
} from '@psycron/api/user/conflicts/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
	UpdateConflictInput,
	UseConflictsPageStateParams,
} from './useConflictsPageState.types';

export const useConflictsPageState = ({ t }: UseConflictsPageStateParams) => {
	const therapistId = useTherapistId();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [statusFilter, setStatusFilter] = useState<ConflictStatus | undefined>(
		'OPEN'
	);
	const [typeFilter, setTypeFilter] = useState<ConflictType | undefined>();
	const [selectedConflictId, setSelectedConflictId] = useState<string | null>(
		null
	);

	const { data, isLoading } = useQuery({
		queryKey: ['conflicts', therapistId, statusFilter, typeFilter],
		queryFn: () =>
			getConflicts({ status: statusFilter, therapistId, type: typeFilter }),
		enabled: Boolean(therapistId),
	});

	const conflicts = useMemo(() => {
		return (data?.conflicts ?? []).filter((conflict) => {
			const matchesStatus = !statusFilter || conflict.status === statusFilter;
			const matchesType = !typeFilter || conflict.type === typeFilter;

			return matchesStatus && matchesType;
		});
	}, [data?.conflicts, statusFilter, typeFilter]);

	useEffect(() => {
		if (!conflicts.length) {
			setSelectedConflictId(null);
			return;
		}

		if (
			!selectedConflictId ||
			!conflicts.some((item) => item._id === selectedConflictId)
		) {
			setSelectedConflictId(conflicts[0]._id);
		}
	}, [conflicts, selectedConflictId]);

	const selectedConflict = useMemo(
		() => conflicts.find((item) => item._id === selectedConflictId) ?? null,
		[conflicts, selectedConflictId]
	);

	const updateConflictMutation = useMutation({
		mutationFn: (input: UpdateConflictInput) =>
			updateConflict({ ...input, therapistId }),
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: ['conflicts', therapistId] });
			await queryClient.cancelQueries({
				queryKey: ['conflictCount', therapistId],
			});

			const previousConflictQueries = queryClient.getQueriesData<{
				conflicts: IConflict[];
			}>({
				queryKey: ['conflicts', therapistId],
			});
			const previousCount = queryClient.getQueryData<{ count: number }>([
				'conflictCount',
				therapistId,
			]);

			queryClient.setQueriesData<{ conflicts: IConflict[] }>(
				{ queryKey: ['conflicts', therapistId] },
				(old) => {
					if (!old) return old;

					return {
						...old,
						conflicts: old.conflicts.map((conflict) =>
							conflict._id === input.conflictId
								? {
										...conflict,
										actionTaken: input.actionTaken ?? null,
										resolutionDetails:
											input.actionTaken === 'MERGE_PATIENTS'
												? {
														fieldSelections: input.fieldSelections ?? {},
														primaryPatientId: input.primaryPatientId,
														secondaryPatientId: input.secondaryPatientId,
													}
												: null,
										resolvedAt: new Date().toISOString(),
										status: input.status,
									}
								: conflict
						),
					};
				}
			);

			queryClient.setQueryData<{ count: number }>(
				['conflictCount', therapistId],
				(old) => {
					if (!old) return old;
					return {
						count: Math.max(old.count - 1, 0),
					};
				}
			);

			return { previousConflictQueries, previousCount };
		},
		onSuccess: ({ conflict }, input) => {
			queryClient.setQueriesData<{ conflicts: IConflict[] }>(
				{ queryKey: ['conflicts', therapistId] },
				(old) => {
					if (!old) return old;

					return {
						...old,
						conflicts: old.conflicts.map((item) =>
							item._id === conflict._id ? conflict : item
						),
					};
				}
			);

			queryClient.invalidateQueries({
				queryKey: ['conflicts', therapistId],
				refetchType: 'active',
			});
			queryClient.invalidateQueries({
				queryKey: ['conflictCount', therapistId],
				refetchType: 'active',
			});

			if (input.actionTaken === 'MERGE_PATIENTS') {
				queryClient.invalidateQueries({
					queryKey: ['userDetails', therapistId],
					refetchType: 'active',
				});

				if (input.primaryPatientId) {
					queryClient.invalidateQueries({
						queryKey: ['patientListItem', therapistId, input.primaryPatientId],
						refetchType: 'active',
					});
				}

				if (input.secondaryPatientId) {
					queryClient.removeQueries({
						queryKey: ['patientListItem', therapistId, input.secondaryPatientId],
					});
					queryClient.removeQueries({
						queryKey: [
							'conflictCandidatePatient',
							therapistId,
							input.secondaryPatientId,
						],
					});
				}
			}
		},
		onError: (_error, _variables, context) => {
			context?.previousConflictQueries?.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
			if (context?.previousCount) {
				queryClient.setQueryData(
					['conflictCount', therapistId],
					context.previousCount
				);
			}
			showAlert({
				message: t('conflicts.actions.error'),
				severity: 'error',
			});
		},
	});

	const handleUpdateConflict = useCallback(
		(input: UpdateConflictInput) => {
			updateConflictMutation.mutate(input);
		},
		[updateConflictMutation]
	);

	return {
		conflicts,
		handleUpdateConflict,
		isLoading,
		isUpdating: updateConflictMutation.isPending,
		selectedConflict,
		selectedConflictId,
		setSelectedConflictId,
		setStatusFilter,
		setTypeFilter,
		statusFilter,
		typeFilter,
	};
};
