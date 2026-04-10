import { useCallback, useEffect, useMemo, useState } from 'react';
import { getConflicts, updateConflict } from '@psycron/api/user/conflicts';
import type {
	ConflictStatus,
	ConflictType,
} from '@psycron/api/user/conflicts/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface UpdateConflictInput {
	actionTaken?: string;
	conflictId: string;
	status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
}

interface UseConflictsPageStateParams {
	t: (key: string) => string;
}

export const useConflictsPageState = ({
	t,
}: UseConflictsPageStateParams) => {
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
		mutationFn: ({ actionTaken, conflictId, status }: UpdateConflictInput) =>
			updateConflict({ actionTaken, conflictId, status, therapistId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['conflicts', therapistId] });
			queryClient.invalidateQueries({
				queryKey: ['conflictCount', therapistId],
			});
		},
		onError: () => {
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
