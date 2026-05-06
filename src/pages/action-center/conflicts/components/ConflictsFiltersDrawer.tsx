import { useTranslation } from 'react-i18next';
import {
	QueueFilterChip,
	QueueFiltersDrawer,
	QueueFiltersLabel,
	QueueFiltersRow,
	QueueFiltersSection,
} from '@psycron/components/queue-panel';

import type { ConflictsFiltersDrawerProps } from './ConflictsFiltersDrawer.types';

export const ConflictsFiltersDrawer = ({
	activeFilterCount,
	isOpen,
	onClose,
	onSetStatusFilter,
	onSetTypeFilter,
	statusFilter,
	typeFilter,
}: ConflictsFiltersDrawerProps) => {
	const { t } = useTranslation();

	return (
		<QueueFiltersDrawer
			activeFilterCount={activeFilterCount}
			ariaLabel={t('conflicts.filters.title')}
			isOpen={isOpen}
			onClose={onClose}
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
						onClick={() => onSetStatusFilter('OPEN')}
						type='button'
					>
						{t('conflicts.filters.open')}
					</QueueFilterChip>
					<QueueFilterChip
						isActive={!statusFilter}
						onClick={() => onSetStatusFilter(undefined)}
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
						onClick={() => onSetTypeFilter(undefined)}
						type='button'
					>
						{t('conflicts.filters.all-types')}
					</QueueFilterChip>
					<QueueFilterChip
						isActive={typeFilter === 'PATIENT_DUPLICATE'}
						onClick={() => onSetTypeFilter('PATIENT_DUPLICATE')}
						type='button'
					>
						{t('conflicts.types.patient-duplicate')}
					</QueueFilterChip>
					<QueueFilterChip
						isActive={typeFilter === 'SLOT_REPLICATION'}
						onClick={() => onSetTypeFilter('SLOT_REPLICATION')}
						type='button'
					>
						{t('conflicts.types.slot-replication')}
					</QueueFilterChip>
				</QueueFiltersRow>
			</QueueFiltersSection>
		</QueueFiltersDrawer>
	);
};
