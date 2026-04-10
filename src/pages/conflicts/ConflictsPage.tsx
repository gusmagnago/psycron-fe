import { useTranslation } from 'react-i18next';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { format } from 'date-fns';

import { ConflictDetail } from './components/conflict-detail/ConflictDetail';
import { useConflictsPageState } from './hooks/useConflictsPageState';
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
	const {
		conflicts,
		handleUpdateConflict,
		isLoading,
		isUpdating,
		selectedConflict,
		selectedConflictId,
		setSelectedConflictId,
		setStatusFilter,
		setTypeFilter,
		statusFilter,
		typeFilter,
	} = useConflictsPageState({ t });

	return (
		<PageLayout
			title={t('conflicts.title')}
			subTitle={t('conflicts.subtitle')}
			isLoading={isLoading}
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
					isUpdating={isUpdating}
					onUpdateConflict={handleUpdateConflict}
				/>
			</ConflictsLayout>
		</PageLayout>
	);
};
