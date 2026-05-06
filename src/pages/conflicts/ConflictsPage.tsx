import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import {
	FEATURE_PAGE_COLORS,
	FeaturePageLayout,
	FeaturePageQueue,
} from '@psycron/components/feature-page-layout';
import {
	QueueEmptyState,
	QueueFilterChip,
	QueueFiltersDrawer,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
	QueueFiltersTrigger,
	QueueList,
	QueueSelectableCard,
	QueueSelectableCardMetaRow,
	QueueSidebarHeader,
} from '@psycron/components/queue-panel';
import { getDateLocale } from '@psycron/utils/date/date.utils';
import { format } from 'date-fns';

import { ConflictDetail } from './components/conflict-detail/ConflictDetail';
import { useConflictsPageState } from './hooks/useConflictsPageState';
import {
	ConflictCardDate,
	ConflictDescription,
	ConflictStatusPill,
	ConflictTitle,
	ConflictTypeLabel,
} from './ConflictsPage.styles';
import {
	getConflictDisplayCopy,
	getConflictStatusLabel,
	getConflictTypeLabel,
} from './ConflictsPage.utils';

export const ConflictsPanelContent = () => {
	const { i18n, t } = useTranslation();
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
	const [isQueueExpanded, setIsQueueExpanded] = useState(false);
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
	const activeFilterCount = (statusFilter ? 1 : 0) + (typeFilter ? 1 : 0);

	const queueSummary = (
		<QueueSidebarHeader
			count={conflicts.length}
			subtitle={t('conflicts.queue.subtitle')}
			title={t('conflicts.queue.title')}
		/>
	);

	const queueControls = (
		<QueueFiltersTrigger
			activeFilterCount={activeFilterCount}
			controlsId='conflicts-filters-drawer'
			isOpen={isFiltersDrawerOpen}
			onOpen={() => setIsFiltersDrawerOpen(true)}
			summaryActive={t('conflicts.filters.summary-active', {
				count: activeFilterCount,
			})}
			summaryDefault={t('conflicts.filters.summary-default')}
			title={t('conflicts.filters.title')}
		/>
	);

	const queueList = (
		<QueueList>
			{conflicts.length ? (
				conflicts.map((conflict) => {
					const displayCopy = getConflictDisplayCopy(conflict, t);

					return (
						<QueueSelectableCard
							isSelected={conflict._id === selectedConflictId}
							key={conflict._id}
							onClick={() => {
							setSelectedConflictId(conflict._id);
							setIsMobileDetailOpen(true);
						}}
							tone='info'
							type='button'
						>
							<QueueSelectableCardMetaRow>
								<ConflictTypeLabel>
									{getConflictTypeLabel(conflict.type, t)}
								</ConflictTypeLabel>
								<ConflictStatusPill>
									{getConflictStatusLabel(conflict.status, t)}
								</ConflictStatusPill>
							</QueueSelectableCardMetaRow>
							<ConflictTitle>{displayCopy.title}</ConflictTitle>
							<ConflictDescription>
								{displayCopy.description}
							</ConflictDescription>
							<ConflictCardDate>
								{format(new Date(conflict.createdAt), 'PPP', {
									locale: dateLocale,
								})}
							</ConflictCardDate>
						</QueueSelectableCard>
					);
				})
			) : (
				<QueueEmptyState message={t('conflicts.empty')} />
			)}
		</QueueList>
	);

	return (
		<>
			<FeaturePageQueue
				accessibility={{
					detailLabel: t('conflicts.accessibility.detail'),
					queueLabel: t('conflicts.accessibility.queue'),
				}}
				analytics={{
					onEvent: ({ properties }) => {
						capture(PostHogEvent.FeaturePageQueueExpansionChanged, {
							is_expanded: properties.isExpanded,
							surface: properties.surface,
						});
					},
					surface: 'conflicts',
				}}
				detailTitle={
					selectedConflict
						? getConflictDisplayCopy(selectedConflict, t).title
						: ''
				}
				isDetailOpen={isMobileDetailOpen}
				isQueueExpanded={isQueueExpanded}
				onDetailClose={() => setIsMobileDetailOpen(false)}
				onQueueExpandedChange={setIsQueueExpanded}
				queueControls={queueControls}
				queueList={queueList}
				queueSummary={queueSummary}
			>
				<ConflictDetail
					conflict={selectedConflict}
					isUpdating={isUpdating}
					onUpdateConflict={handleUpdateConflict}
				/>
			</FeaturePageQueue>
			<QueueFiltersDrawer
				activeFilterCount={activeFilterCount}
				ariaLabel={t('conflicts.filters.title')}
				isOpen={isFiltersDrawerOpen}
				onClose={() => setIsFiltersDrawerOpen(false)}
				summaryActive={t('conflicts.filters.summary-active', {
					count: activeFilterCount,
				})}
				summaryDefault={t('conflicts.filters.summary-default')}
				title={t('conflicts.filters.title')}
			>
				<QueueFiltersSection id='conflicts-filters-drawer'>
					<QueueFiltersLabel>{t('conflicts.filters.status')}</QueueFiltersLabel>
					<QueueFiltersRow>
						<QueueFilterChip
							isActive={statusFilter === 'OPEN'}
							onClick={() => setStatusFilter('OPEN')}
							type='button'
						>
							{t('conflicts.filters.open')}
						</QueueFilterChip>
						<QueueFilterChip
							isActive={!statusFilter}
							onClick={() => setStatusFilter(undefined)}
							type='button'
						>
							{t('conflicts.filters.all-statuses')}
						</QueueFilterChip>
					</QueueFiltersRow>
				</QueueFiltersSection>

				<QueueFiltersSection>
					<QueueFiltersLabel>{t('conflicts.filters.type')}</QueueFiltersLabel>
					<QueueFiltersRow>
						<QueueFilterChip
							isActive={!typeFilter}
							onClick={() => setTypeFilter(undefined)}
							type='button'
						>
							{t('conflicts.filters.all-types')}
						</QueueFilterChip>
						<QueueFilterChip
							isActive={typeFilter === 'PATIENT_DUPLICATE'}
							onClick={() => setTypeFilter('PATIENT_DUPLICATE')}
							type='button'
						>
							{t('conflicts.types.patient-duplicate')}
						</QueueFilterChip>
						<QueueFilterChip
							isActive={typeFilter === 'SLOT_REPLICATION'}
							onClick={() => setTypeFilter('SLOT_REPLICATION')}
							type='button'
						>
							{t('conflicts.types.slot-replication')}
						</QueueFilterChip>
					</QueueFiltersRow>
				</QueueFiltersSection>
			</QueueFiltersDrawer>
		</>
	);
};

export const ConflictsPage = () => {
	const { t } = useTranslation();

	return (
		<FeaturePageLayout
			colors={FEATURE_PAGE_COLORS.action}
			subTitle={t('conflicts.subtitle')}
			title={t('conflicts.title')}
		>
			<ConflictsPanelContent />
		</FeaturePageLayout>
	);
};
