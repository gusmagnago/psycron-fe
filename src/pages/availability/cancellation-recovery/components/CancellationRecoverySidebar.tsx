import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import {
	QueueEmptyState,
	QueueFiltersTrigger,
	QueueSidebarHeader,
	QueueStats,
} from '@psycron/components/queue-panel';

import {
	DetailEyebrow,
	RecoveryCard,
	RecoveryCardBody,
	RecoveryCardMeta,
	RecoveryCardTitle,
	RecoveryList,
	RecoverySidebar,
	RecoveryStatePill,
	SidebarBulkAction,
} from '../CancellationRecoveryPage.styles';
import type { CancellationRecoverySidebarProps } from '../CancellationRecoveryPage.types';
import {
	formatRecoveryDateTime,
	getCancelledByLabelKey,
	getDeliveryModeLabelKey,
	getRecoveryRowTitle,
	getRecoveryStateLabelKey,
} from '../CancellationRecoveryPage.utils';

export const CancellationRecoverySidebar = ({
	activeFilterCount,
	archivableRowsCount,
	isArchivingAll,
	isFiltersDrawerOpen,
	onArchiveAll,
	onOpenFilters,
	onSelectRow,
	rows,
	selectedSlotId,
	stats,
}: CancellationRecoverySidebarProps) => {
	const { i18n, t } = useTranslation();
	const hasRowsToResolve = archivableRowsCount > 0;
	const getCardTone = (state: CancellationRecoverySidebarProps['rows'][number]['recoveryState']) => {
		if (state === 'reopened') return 'success';
		if (state === 'followed_up') return 'info';
		if (state === 'rebooked') return 'info';
		if (state === 'archived') return 'neutral';
		if (state === 'overdue') return 'warning';
		return 'error';
	};

	return (
		<RecoverySidebar>
			<QueueSidebarHeader
				count={rows.length}
				subtitle={t('availability.cancellation-recovery.queue.subtitle')}
				title={t('availability.cancellation-recovery.queue.title')}
			/>

			<QueueStats
				items={[
					{
						label: t('availability.cancellation-recovery.stats.total'),
						value: stats.total,
					},
					{
						label: t(
							'availability.cancellation-recovery.stats.pending-follow-up'
						),
						value: stats.pendingFollowUp,
					},
					{
						label: t('availability.cancellation-recovery.stats.reopened'),
						value: stats.reopened,
					},
				]}
			/>

			<QueueFiltersTrigger
				activeFilterCount={activeFilterCount}
				controlsId='cancellation-recovery-filters-drawer'
				isOpen={isFiltersDrawerOpen}
				onOpen={onOpenFilters}
				summaryActive={t(
					'availability.cancellation-recovery.filters.summary-active',
					{
						count: activeFilterCount,
					}
				)}
				summaryDefault={t(
					'availability.cancellation-recovery.filters.summary-default'
				)}
				title={t('availability.cancellation-recovery.filters.title')}
			/>

			{hasRowsToResolve ? (
				<SidebarBulkAction>
					<Button
						disabled={isArchivingAll}
						fullWidth
						loading={isArchivingAll}
						onClick={onArchiveAll}
						secondary
					>
						{t('availability.cancellation-recovery.actions.archive-all', {
							count: archivableRowsCount,
						})}
					</Button>
				</SidebarBulkAction>
			) : null}

			<RecoveryList>
				{rows.length ? (
					rows.map((row) => (
						<RecoveryCard
							isSelected={row.slotId === selectedSlotId}
							key={row.slotId}
							onClick={() => onSelectRow(row.slotId)}
							state={row.recoveryState}
							tone={getCardTone(row.recoveryState)}
							type='button'
						>
							<RecoveryCardMeta>
								<DetailEyebrow>
									{formatRecoveryDateTime(row, i18n.language)}
								</DetailEyebrow>
								<RecoveryStatePill state={row.recoveryState}>
									{t(getRecoveryStateLabelKey(row.recoveryState))}
								</RecoveryStatePill>
							</RecoveryCardMeta>
							<RecoveryCardTitle>
								{getRecoveryRowTitle(row) ||
									t('availability.cancellation-recovery.unknown-patient')}
							</RecoveryCardTitle>
							<RecoveryCardBody>
								{t(getCancelledByLabelKey(row.triggeredBy))}
								{' · '}
								{t(getDeliveryModeLabelKey(row.deliveryMode))}
							</RecoveryCardBody>
						</RecoveryCard>
					))
				) : (
					<QueueEmptyState
						message={t('availability.cancellation-recovery.empty')}
					/>
				)}
			</RecoveryList>
		</RecoverySidebar>
	);
};
