import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { getConflicts, updateConflict } from '@psycron/api/user/conflicts';
import type {
	ConflictStatus,
	ConflictType,
	IConflict,
} from '@psycron/api/user/conflicts/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { ConflictDetail } from './components/conflict-detail/ConflictDetail';
import { mockedConflicts } from './ConflictsPage.mocks';
import {
	ConflictCard,
	ConflictCardDate,
	ConflictCardMetaRow,
	ConflictDescription,
	ConflictList,
	ConflictsLayout,
	ConflictsSidebar,
	ConflictStatusPill,
	ConflictTitle,
	ConflictTypeLabel,
	FilterChip,
	FiltersLabel,
	FiltersRow,
	FiltersSection,
	MockModeNotice,
	MockModeText,
	SidebarCount,
	SidebarEyebrow,
	SidebarHeader,
	SidebarSubtitle,
	SidebarTitle,
	SidebarTitleRow,
} from './ConflictsPage.styles';
import {
	getConflictStatusLabel,
	getConflictTypeLabel,
} from './ConflictsPage.utils';

export const ConflictsPage = () => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const therapistId = useTherapistId();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();
	const explicitMockMode = searchParams.get('debugConflicts') === 'mock';
	const forceLiveMode = searchParams.get('debugConflicts') === 'live';

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
		enabled: Boolean(therapistId) && !explicitMockMode,
	});

	const useMockConflicts =
		import.meta.env.DEV &&
		(explicitMockMode ||
			(!forceLiveMode && !isLoading && (data?.conflicts?.length ?? 0) === 0));

	const conflicts = useMemo(() => {
		const sourceConflicts = useMockConflicts
			? mockedConflicts
			: (data?.conflicts ?? []);

		return sourceConflicts.filter((conflict: IConflict) => {
			const matchesStatus = !statusFilter || conflict.status === statusFilter;
			const matchesType = !typeFilter || conflict.type === typeFilter;

			return matchesStatus && matchesType;
		});
	}, [data?.conflicts, statusFilter, typeFilter, useMockConflicts]);

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
		mutationFn: ({
			actionTaken,
			conflictId,
			status,
		}: {
			actionTaken?: string;
			conflictId: string;
			status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
		}) => updateConflict({ actionTaken, conflictId, status, therapistId }),
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
		(input: {
			actionTaken?: string;
			conflictId: string;
			status: Extract<ConflictStatus, 'DISMISSED' | 'RESOLVED'>;
		}) => {
			if (useMockConflicts) {
				return;
			}

			updateConflictMutation.mutate(input);
		},
		[updateConflictMutation, useMockConflicts]
	);

	return (
		<PageLayout
			title={t('conflicts.title')}
			subTitle={
				useMockConflicts
					? `${t('conflicts.subtitle')} ${t('conflicts.mock-mode')}`
					: t('conflicts.subtitle')
			}
			isLoading={!useMockConflicts && isLoading}
		>
			<ConflictsLayout>
				<ConflictsSidebar>
					<SidebarHeader>
						<SidebarEyebrow>{t('conflicts.queue.eyebrow')}</SidebarEyebrow>
						<SidebarTitleRow>
							<SidebarTitle>{t('conflicts.queue.title')}</SidebarTitle>
							<SidebarCount>{conflicts.length}</SidebarCount>
						</SidebarTitleRow>
						<SidebarSubtitle>{t('conflicts.queue.subtitle')}</SidebarSubtitle>
					</SidebarHeader>

					{useMockConflicts ? (
						<MockModeNotice>
							<MockModeText>{t('conflicts.mock-notice')}</MockModeText>
						</MockModeNotice>
					) : null}

					<FiltersSection>
						<FiltersLabel>{t('conflicts.filters.status')}</FiltersLabel>
						<FiltersRow>
							<FilterChip
								isActive={statusFilter === 'OPEN'}
								onClick={() => setStatusFilter('OPEN')}
								type='button'
							>
								{t('conflicts.filters.open')}
							</FilterChip>
							<FilterChip
								isActive={!statusFilter}
								onClick={() => setStatusFilter(undefined)}
								type='button'
							>
								{t('conflicts.filters.all-statuses')}
							</FilterChip>
						</FiltersRow>
					</FiltersSection>

					<FiltersSection>
						<FiltersLabel>{t('conflicts.filters.type')}</FiltersLabel>
						<FiltersRow>
							<FilterChip
								isActive={!typeFilter}
								onClick={() => setTypeFilter(undefined)}
								type='button'
							>
								{t('conflicts.filters.all-types')}
							</FilterChip>
							<FilterChip
								isActive={typeFilter === 'PATIENT_DUPLICATE'}
								onClick={() => setTypeFilter('PATIENT_DUPLICATE')}
								type='button'
							>
								{t('conflicts.types.patient-duplicate')}
							</FilterChip>
							<FilterChip
								isActive={typeFilter === 'SLOT_REPLICATION'}
								onClick={() => setTypeFilter('SLOT_REPLICATION')}
								type='button'
							>
								{t('conflicts.types.slot-replication')}
							</FilterChip>
						</FiltersRow>
					</FiltersSection>

					<ConflictList>
						{conflicts.map((conflict) => (
							<ConflictCard
								isSelected={conflict._id === selectedConflictId}
								key={conflict._id}
								onClick={() => setSelectedConflictId(conflict._id)}
								type='button'
							>
								<ConflictCardMetaRow>
									<ConflictTypeLabel>
										{getConflictTypeLabel(conflict.type, t)}
									</ConflictTypeLabel>
									<ConflictStatusPill>
										{getConflictStatusLabel(conflict.status, t)}
									</ConflictStatusPill>
								</ConflictCardMetaRow>
								<ConflictTitle>{conflict.title}</ConflictTitle>
								<ConflictDescription>
									{conflict.description}
								</ConflictDescription>
								<ConflictCardDate>
									{format(new Date(conflict.createdAt), 'PPP')}
								</ConflictCardDate>
							</ConflictCard>
						))}
					</ConflictList>
				</ConflictsSidebar>

				<ConflictDetail
					conflict={selectedConflict}
					isUpdating={updateConflictMutation.isPending}
					onUpdateConflict={handleUpdateConflict}
				/>
			</ConflictsLayout>
		</PageLayout>
	);
};
