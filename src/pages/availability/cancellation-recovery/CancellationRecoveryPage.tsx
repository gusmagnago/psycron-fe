import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { Button } from '@psycron/components/button/Button';
import {
	FEATURE_PAGE_COLORS,
	FeaturePageLayout,
	FeaturePageQueue,
} from '@psycron/components/feature-page-layout';
import {
	QueueDetailEyebrow,
	QueueEmptyState,
	QueueFiltersTrigger,
	QueueList,
	QueueSelectableCardMetaRow,
	QueueSidebarHeader,
	QueueStats,
} from '@psycron/components/queue-panel';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { DOMAIN, PATIENTS } from '@psycron/pages/urls';
import { useQueryClient } from '@tanstack/react-query';

import { SessionDrawer } from '../../patients/patient-details/session-drawer/SessionDrawer';
import type { PatientSessionRow } from '../../patients/PatientsPage.types';

import { CancellationRecoveryDetailPanel } from './components/CancellationRecoveryDetailPanel';
import { CancellationRecoveryFiltersDrawer } from './components/CancellationRecoveryFiltersDrawer';
import { useCancellationRecoveryPageState } from './hooks/useCancellationRecoveryPageState';
import {
	RecoveryCard,
	RecoveryCardBody,
	RecoveryCardTitle,
	RecoveryStatePill,
	SidebarBulkAction,
} from './CancellationRecoveryPage.styles';
import type {
	CancellationRecoveryRow,
	CancellationRecoveryState,
} from './CancellationRecoveryPage.types';
import {
	formatRecoveryDateTime,
	getCancelledByLabelKey,
	getDeliveryModeLabelKey,
	getRecoveryRowTitle,
	getRecoveryStateLabelKey,
} from './CancellationRecoveryPage.utils';

const getCardTone = (
	state: CancellationRecoveryState
): 'success' | 'info' | 'neutral' | 'warning' | 'error' => {
	if (state === 'reopened') return 'success';
	if (state === 'followed_up') return 'info';
	if (state === 'rebooked') return 'info';
	if (state === 'archived') return 'neutral';
	if (state === 'overdue') return 'warning';
	return 'error';
};

export const CancellationRecoveryPanelContent = () => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const therapistId = useTherapistId();
	const { locale } = useParams<{ locale: string }>();
	const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
	const [isQueueExpanded, setIsQueueExpanded] = useState(false);
	const [rebookRow, setRebookRow] = useState<CancellationRecoveryRow | null>(
		null
	);

	const openPatientProfile = (patientId: string): void => {
		navigate(`/${locale}/${PATIENTS}/${patientId}`);
	};

	const {
		filteredRows,
		filters,
		isArchiving,
		isArchivingAll,
		isFiltersDrawerOpen,
		isReopening,
		archiveAllRows,
		archiveRow,
		archivableRowsCount,
		openFiltersDrawer,
		closeFiltersDrawer,
		reopenRow,
		selectedRow,
		selectedSlotId,
		selectRow,
		stats,
	} = useCancellationRecoveryPageState({ t });

	const rebookSession = useMemo<PatientSessionRow | null>(() => {
		if (!rebookRow) return null;

		const startsAt = new Date(
			`${rebookRow.date.slice(0, 10)}T${rebookRow.startTime}:00`
		);

		return {
			availabilityDayId: rebookRow.availabilityDayId,
			canceledAt: rebookRow.canceledAt,
			customReason: rebookRow.customReason,
			date: rebookRow.date,
			followedUpAt: rebookRow.followedUpAt,
			followedUpBy: rebookRow.followedUpBy,
			isCancelled: true,
			isPast: rebookRow.recoveryState === 'overdue',
			reasonCode: rebookRow.reasonCode,
			rebookedAppointmentId: rebookRow.rebookedAppointmentId,
			recoveryStatus: rebookRow.recoveryStatus,
			reopenedAt: rebookRow.reopenedAt,
			slot: {
				_id: rebookRow.slotId,
				deliveryMode: rebookRow.deliveryMode,
				endTime: rebookRow.endTime,
				startTime: rebookRow.startTime,
				status: rebookRow.slotStatus,
			},
			startsAt,
			triggeredBy: rebookRow.triggeredBy,
		};
	}, [rebookRow]);

	const closeRebookDrawer = (): void => setRebookRow(null);
	const handleRebookSuccess = (): void => {
		closeRebookDrawer();
		queryClient.invalidateQueries({ queryKey: ['cancellationRecovery'] });
	};

	const queueSummary = (
		<>
			<QueueSidebarHeader
				count={filteredRows.length}
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
		</>
	);

	const queueControls = (
		<>
			<QueueFiltersTrigger
				activeFilterCount={filters.activeFilterCount}
				controlsId='cancellation-recovery-filters-drawer'
				isOpen={isFiltersDrawerOpen}
				onOpen={openFiltersDrawer}
				summaryActive={t(
					'availability.cancellation-recovery.filters.summary-active',
					{ count: filters.activeFilterCount }
				)}
				summaryDefault={t(
					'availability.cancellation-recovery.filters.summary-default'
				)}
				title={t('availability.cancellation-recovery.filters.title')}
			/>
			{archivableRowsCount > 0 ? (
				<SidebarBulkAction>
					<Button
						disabled={isArchivingAll}
						fullWidth
						loading={isArchivingAll}
						onClick={archiveAllRows}
						secondary
					>
						{t('availability.cancellation-recovery.actions.archive-all', {
							count: archivableRowsCount,
						})}
					</Button>
				</SidebarBulkAction>
			) : null}
		</>
	);

	const queueList = (
		<QueueList>
			{filteredRows.length ? (
				filteredRows.map((row) => (
					<RecoveryCard
						isSelected={row.slotId === selectedSlotId}
						key={row.slotId}
						onClick={() => {
							selectRow(row.slotId);
							setIsMobileDetailOpen(true);
						}}
						state={row.recoveryState}
						tone={getCardTone(row.recoveryState)}
						type='button'
					>
						<QueueSelectableCardMetaRow>
							<QueueDetailEyebrow>
								{formatRecoveryDateTime(row, i18n.language)}
							</QueueDetailEyebrow>
							<RecoveryStatePill state={row.recoveryState}>
								{t(getRecoveryStateLabelKey(row.recoveryState))}
							</RecoveryStatePill>
						</QueueSelectableCardMetaRow>
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
		</QueueList>
	);

	return (
		<>
			<FeaturePageQueue
				accessibility={{
					detailLabel: t(
						'availability.cancellation-recovery.accessibility.detail'
					),
					queueLabel: t(
						'availability.cancellation-recovery.accessibility.queue'
					),
				}}
				analytics={{
					onEvent: ({ properties }) => {
						capture(PostHogEvent.FeaturePageQueueExpansionChanged, {
							is_expanded: properties.isExpanded,
							surface: properties.surface,
						});
					},
					surface: 'cancellation-recovery',
				}}
				detailTitle={
					selectedRow
						? getRecoveryRowTitle(selectedRow) ||
							t('availability.cancellation-recovery.unknown-patient')
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
				<CancellationRecoveryDetailPanel
					isArchiving={isArchiving}
					isReopening={isReopening}
					onArchive={archiveRow}
					onOpenPatient={openPatientProfile}
					onRebook={setRebookRow}
					onReopen={reopenRow}
					row={selectedRow}
				/>
			</FeaturePageQueue>
			<CancellationRecoveryFiltersDrawer
				controls={filters}
				isOpen={isFiltersDrawerOpen}
				onClose={closeFiltersDrawer}
			/>
			{rebookRow?.patientId && rebookSession ? (
				<SessionDrawer
					initialMode='reschedule'
					onClose={closeRebookDrawer}
					onRescheduleSuccess={handleRebookSuccess}
					patientId={rebookRow.patientId}
					patientName={rebookRow.patientName || rebookRow.cancelledPatientName || ''}
					publicSessionsLink={`${DOMAIN}/${locale}/${rebookRow.patientId}/appointments`}
					session={rebookSession}
					therapistId={therapistId}
				/>
			) : null}
		</>
	);
};

export const CancellationRecoveryPage = () => {
	const { t } = useTranslation();

	return (
		<FeaturePageLayout
			colors={FEATURE_PAGE_COLORS.action}
			subTitle={t('availability.cancellation-recovery.subtitle')}
			title={t('availability.cancellation-recovery.title')}
		>
			<CancellationRecoveryPanelContent />
		</FeaturePageLayout>
	);
};
