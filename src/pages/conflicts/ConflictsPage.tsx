import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { ChevronLeft, ChevronRight } from '@psycron/components/icons';
import {
	QueueEmptyState,
	QueueSidebarHeader,
} from '@psycron/components/queue-detail';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { getDateLocale } from '@psycron/utils/date/date.utils';
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
	FiltersToggleButton,
	FiltersToggleContent,
	FiltersToggleSubtitle,
	FiltersToggleTitle,
} from './ConflictsPage.styles';
import {
	getConflictDisplayCopy,
	getConflictStatusLabel,
	getConflictTypeLabel,
} from './ConflictsPage.utils';

export const ConflictsPage = () => {
	const { i18n, t } = useTranslation();
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const {
		conflicts,
		handleUpdateConflict,
		isUpdating,

		selectedConflict,
		selectedConflictId,
		setSelectedConflictId,
		setStatusFilter,
		setTypeFilter,
		statusFilter,
		typeFilter,
	} = useConflictsPageState({ t });

	const dateLocale = getDateLocale(i18n.language);
	const activeFilterCount = useMemo(
		() => [statusFilter ? 1 : 0, typeFilter ? 1 : 0].reduce((sum, count) => sum + count, 0),
		[statusFilter, typeFilter]
	);

	return (
		<PageLayout title={t('conflicts.title')} subTitle={t('conflicts.subtitle')}>
			<ConflictsLayout>
				<ConflictsSidebar>
					<QueueSidebarHeader
						count={conflicts.length}
						subtitle={t('conflicts.queue.subtitle')}
						title={t('conflicts.queue.title')}
					/>

					<FiltersSection>
						<FiltersToggleButton
							aria-controls='conflicts-filters-drawer'
							aria-expanded={isFiltersDrawerOpen}
							aria-haspopup='dialog'
							onClick={() => setIsFiltersDrawerOpen(true)}
							type='button'
						>
							<FiltersToggleContent>
								<FiltersToggleTitle>
									{t('conflicts.filters.title')}
								</FiltersToggleTitle>
								<FiltersToggleSubtitle>
									{activeFilterCount > 0
										? t('conflicts.filters.summary-active', {
												count: activeFilterCount,
											})
										: t('conflicts.filters.summary-default')}
								</FiltersToggleSubtitle>
							</FiltersToggleContent>
							{isFiltersDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
						</FiltersToggleButton>
					</FiltersSection>

					<ConflictList>
						{conflicts.length ? conflicts.map((conflict) => {
							const displayCopy = getConflictDisplayCopy(conflict, t);

							return (
								<ConflictCard
									isSelected={conflict._id === selectedConflictId}
									key={conflict._id}
									onClick={() => setSelectedConflictId(conflict._id)}
									tone='info'
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
									<ConflictTitle>{displayCopy.title}</ConflictTitle>
									<ConflictDescription>
										{displayCopy.description}
									</ConflictDescription>
									<ConflictCardDate>
										{format(new Date(conflict.createdAt), 'PPP', {
											locale: dateLocale,
										})}
									</ConflictCardDate>
									</ConflictCard>
								);
						}) : <QueueEmptyState message={t('conflicts.empty')} />}
					</ConflictList>
				</ConflictsSidebar>

				<ConflictDetail
					conflict={selectedConflict}
					isUpdating={isUpdating}
					onUpdateConflict={handleUpdateConflict}
				/>
			</ConflictsLayout>
			{isFiltersDrawerOpen ? (
				<Drawer
					ariaLabel={t('conflicts.filters.title')}
					headerExtra={
						<FiltersToggleSubtitle>
							{activeFilterCount > 0
								? t('conflicts.filters.summary-active', {
										count: activeFilterCount,
									})
								: t('conflicts.filters.summary-default')}
						</FiltersToggleSubtitle>
					}
					onClose={() => setIsFiltersDrawerOpen(false)}
					title={t('conflicts.filters.title')}
				>
					<FiltersSection id='conflicts-filters-drawer'>
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
				</Drawer>
			) : null}
		</PageLayout>
	);
};
