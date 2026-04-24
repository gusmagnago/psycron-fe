import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { getAvailabilityCalendar } from '@psycron/api/user';
import { editSlotStatus } from '@psycron/api/user/availability';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { ChevronLeft, ChevronRight } from '@psycron/components/icons';
import {
	QueueEmptyState,
	QueueSidebarHeader,
	QueueStats,
} from '@psycron/components/queue-detail';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { PATIENTS } from '@psycron/pages/urls';
import {
	capitalizeDateLabel,
	formatLocalizedDate,
	getDateLocale,
} from '@psycron/utils/date/date.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

import {
	ActionsRow,
	DetailCard,
	DetailEyebrow,
	DetailGrid,
	DetailHeader,
	DetailLabel,
	DetailPanel,
	DetailSubtitle,
	DetailTitle,
	DetailTitleRow,
	DetailValue,
	FilterChip,
	FiltersContent,
	FiltersLabel,
	FiltersRow,
	FiltersSection,
	FiltersToggleButton,
	FiltersToggleContent,
	FiltersToggleSubtitle,
	FiltersToggleTitle,
	RecoveryCard,
	RecoveryCardBody,
	RecoveryCardMeta,
	RecoveryCardTitle,
	RecoveryLayout,
	RecoveryList,
	RecoverySidebar,
	RecoveryStatePill,
} from './CancellationRecoveryPage.styles';
import type {
	CancellationRecoveryDeliveryModeFilter,
	CancellationRecoveryFilters,
	CancellationRecoveryPeriodFilter,
	CancellationRecoveryRow,
	CancellationRecoveryWhoCancelledFilter,
} from './CancellationRecoveryPage.types';
import {
	buildCancellationRecoveryRows,
	filterCancellationRecoveryRows,
	findRecoveryRowBySlotId,
	formatRecoverySearchRange,
	getCancellationReasonOptions,
	getCancelledByLabelKey,
	getDeliveryModeLabelKey,
	getRecoveryRowTitle,
	getRecoveryStateLabelKey,
	getRecoveryStats,
	isReopenAvailable,
} from './CancellationRecoveryPage.utils';

const DEFAULT_FILTERS: CancellationRecoveryFilters = {
	cancelledBy: 'all',
	deliveryMode: 'all',
	patientQuery: '',
	period: 'all',
	reasonCode: 'all',
};

export const CancellationRecoveryPage = () => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const therapistId = useTherapistId();
	const { showAlert } = useAlert();
	const queryClient = useQueryClient();

	const [filters, setFilters] =
		useState<CancellationRecoveryFilters>(DEFAULT_FILTERS);
	const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
	const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

	const dateLocale = getDateLocale(i18n.language);
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
	});

	const rows = useMemo(
		() => buildCancellationRecoveryRows({ dates: data?.dates }),
		[data?.dates]
	);
	const filteredRows = useMemo(
		() => filterCancellationRecoveryRows(rows, filters),
		[filters, rows]
	);
	const reasonOptions = useMemo(
		() => getCancellationReasonOptions(rows),
		[rows]
	);
	const stats = useMemo(() => getRecoveryStats(rows), [rows]);
	const activeFilterCount = useMemo(
		() =>
			[
				filters.patientQuery.trim() ? 1 : 0,
				filters.period !== 'all' ? 1 : 0,
				filters.cancelledBy !== 'all' ? 1 : 0,
				filters.reasonCode !== 'all' ? 1 : 0,
				filters.deliveryMode !== 'all' ? 1 : 0,
			].reduce((sum, count) => sum + count, 0),
		[filters]
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
		},
	});

	const setPeriod = (period: CancellationRecoveryPeriodFilter) =>
		setFilters((current) => ({ ...current, period }));
	const setCancelledBy = (
		cancelledBy: CancellationRecoveryWhoCancelledFilter
	) => setFilters((current) => ({ ...current, cancelledBy }));
	const setDeliveryMode = (
		deliveryMode: CancellationRecoveryDeliveryModeFilter
	) => setFilters((current) => ({ ...current, deliveryMode }));

	const renderDateTime = (row: CancellationRecoveryRow) =>
		`${capitalizeDateLabel(
			format(parseISO(row.date), 'EEEE, MMM d', { locale: dateLocale })
		)} · ${row.startTime} - ${row.endTime}`;

	return (
		<PageLayout
			isLoading={isLoading}
			subTitle={t('availability.cancellation-recovery.subtitle')}
			title={t('availability.cancellation-recovery.title')}
		>
			<RecoveryLayout>
				<RecoverySidebar>
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

					<FiltersSection>
						<FiltersToggleButton
							aria-controls='cancellation-recovery-filters-drawer'
							aria-expanded={isFiltersDrawerOpen}
							aria-haspopup='dialog'
							onClick={() => setIsFiltersDrawerOpen(true)}
							type='button'
						>
							<FiltersToggleContent>
								<FiltersToggleTitle>
									{t('availability.cancellation-recovery.filters.title')}
								</FiltersToggleTitle>
								<FiltersToggleSubtitle>
									{activeFilterCount > 0
										? t(
												'availability.cancellation-recovery.filters.summary-active',
												{
													count: activeFilterCount,
												}
											)
										: t(
												'availability.cancellation-recovery.filters.summary-default'
											)}
								</FiltersToggleSubtitle>
							</FiltersToggleContent>
							{isFiltersDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
						</FiltersToggleButton>
					</FiltersSection>

					<RecoveryList>
						{filteredRows.length ? (
							filteredRows.map((row) => (
								<RecoveryCard
									isSelected={row.slotId === selectedSlotId}
									key={row.slotId}
									onClick={() => setSelectedSlotId(row.slotId)}
									state={row.recoveryState}
									tone={
										row.recoveryState === 'reopened' ? 'success' : 'error'
									}
									type='button'
								>
									<RecoveryCardMeta>
										<DetailEyebrow>{renderDateTime(row)}</DetailEyebrow>
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

				<DetailPanel>
					{selectedRow ? (
						<>
							<DetailHeader>
								<DetailEyebrow>
									{t('availability.cancellation-recovery.detail.eyebrow')}
								</DetailEyebrow>
								<DetailTitleRow>
									<DetailTitle>
										{getRecoveryRowTitle(selectedRow) ||
											t('availability.cancellation-recovery.unknown-patient')}
									</DetailTitle>
									<RecoveryStatePill state={selectedRow.recoveryState}>
										{t(getRecoveryStateLabelKey(selectedRow.recoveryState))}
									</RecoveryStatePill>
								</DetailTitleRow>
								<DetailSubtitle>{renderDateTime(selectedRow)}</DetailSubtitle>
							</DetailHeader>

							<DetailGrid>
								<DetailCard>
									<DetailLabel>
										{t(
											'availability.cancellation-recovery.detail.cancelled-at'
										)}
									</DetailLabel>
									<DetailValue>
										{formatLocalizedDate(
											selectedRow.canceledAt,
											t('patients.list.not-available'),
											i18n.language,
											'PPP p'
										)}
									</DetailValue>
								</DetailCard>
								<DetailCard>
									<DetailLabel>
										{t(
											'availability.cancellation-recovery.detail.cancelled-by'
										)}
									</DetailLabel>
									<DetailValue>
										{t(getCancelledByLabelKey(selectedRow.triggeredBy))}
									</DetailValue>
								</DetailCard>
								<DetailCard>
									<DetailLabel>
										{t('availability.cancellation-recovery.detail.reason')}
									</DetailLabel>
									<DetailValue>
										{selectedRow.reasonCode
											? t(
													`globals.cancellation-reason.${selectedRow.reasonCode}`
												)
											: t(
													'availability.cancellation-recovery.detail.not-provided'
												)}
										{selectedRow.customReason
											? ` · ${selectedRow.customReason}`
											: ''}
									</DetailValue>
								</DetailCard>
								<DetailCard>
									<DetailLabel>
										{t('availability.cancellation-recovery.detail.delivery')}
									</DetailLabel>
									<DetailValue>
										{t(getDeliveryModeLabelKey(selectedRow.deliveryMode))}
									</DetailValue>
								</DetailCard>
								<DetailCard>
									<DetailLabel>
										{t('availability.cancellation-recovery.detail.patient')}
									</DetailLabel>
									<DetailValue>
										{selectedRow.patientName ||
											selectedRow.cancelledPatientName ||
											t('availability.cancellation-recovery.unknown-patient')}
									</DetailValue>
								</DetailCard>
								<DetailCard>
									<DetailLabel>
										{t(
											'availability.cancellation-recovery.detail.recovery-state'
										)}
									</DetailLabel>
									<DetailValue>
										{t(getRecoveryStateLabelKey(selectedRow.recoveryState))}
										{selectedRow.reopenedAt
											? ` · ${formatLocalizedDate(
													selectedRow.reopenedAt,
													'',
													i18n.language,
													'PPP p'
												)}`
											: ''}
									</DetailValue>
								</DetailCard>
							</DetailGrid>

							<ActionsRow>
								<Button
									disabled={!selectedRow.patientId}
									onClick={() => {
										if (!selectedRow.patientId) return;

										navigate(
											`${PATIENTS}/${selectedRow.patientId}?session=${selectedRow.slotId}&mode=reschedule`
										);
									}}
								>
									{t('availability.cancellation-recovery.actions.rebook')}
								</Button>
								<Button
									disabled={!selectedRow.patientId}
									onClick={() => {
										if (!selectedRow.patientId) return;

										navigate(`${PATIENTS}/${selectedRow.patientId}`);
									}}
									secondary
								>
									{t('availability.cancellation-recovery.actions.open-patient')}
								</Button>
								<Button
									disabled={
										!isReopenAvailable(selectedRow) || reopenMutation.isPending
									}
									loading={reopenMutation.isPending}
									onClick={() => reopenMutation.mutate(selectedRow)}
									secondary
								>
									{t('availability.cancellation-recovery.actions.reopen')}
								</Button>
							</ActionsRow>
						</>
					) : (
						<QueueEmptyState
							message={t('availability.cancellation-recovery.empty-selection')}
						/>
					)}
				</DetailPanel>
			</RecoveryLayout>
			{isFiltersDrawerOpen ? (
				<Drawer
					ariaLabel={t('availability.cancellation-recovery.filters.title')}
					headerExtra={
						<FiltersToggleSubtitle>
							{activeFilterCount > 0
								? t(
										'availability.cancellation-recovery.filters.summary-active',
										{
											count: activeFilterCount,
										}
									)
								: t(
										'availability.cancellation-recovery.filters.summary-default'
									)}
						</FiltersToggleSubtitle>
					}
					onClose={() => setIsFiltersDrawerOpen(false)}
					title={t('availability.cancellation-recovery.filters.title')}
				>
					<FiltersContent id='cancellation-recovery-filters-drawer'>
						<FiltersSection>
							<FiltersLabel>
								{t('availability.cancellation-recovery.filters.patient')}
							</FiltersLabel>
							<TextField
								fullWidth
								onChange={(event) =>
									setFilters((current) => ({
										...current,
										patientQuery: event.target.value,
									}))
								}
								placeholder={t(
									'availability.cancellation-recovery.filters.patient-placeholder'
								)}
								size='small'
								value={filters.patientQuery}
							/>
						</FiltersSection>

						<FiltersSection>
							<FiltersLabel>
								{t('availability.cancellation-recovery.filters.period')}
							</FiltersLabel>
							<FiltersRow>
								{(
									[
										'all',
										'upcoming',
										'past',
									] as CancellationRecoveryPeriodFilter[]
								).map((period) => (
									<FilterChip
										isActive={filters.period === period}
										key={period}
										onClick={() => setPeriod(period)}
										type='button'
									>
										{t(
											`availability.cancellation-recovery.filters.period-options.${period}`
										)}
									</FilterChip>
								))}
							</FiltersRow>
						</FiltersSection>

						<FiltersSection>
							<FiltersLabel>
								{t('availability.cancellation-recovery.filters.cancelled-by')}
							</FiltersLabel>
							<FiltersRow>
								{(
									[
										'all',
										'patient',
										'therapist',
										'unknown',
									] as CancellationRecoveryWhoCancelledFilter[]
								).map((cancelledBy) => (
									<FilterChip
										isActive={filters.cancelledBy === cancelledBy}
										key={cancelledBy}
										onClick={() => setCancelledBy(cancelledBy)}
										type='button'
									>
										{t(
											`availability.cancellation-recovery.filters.cancelled-by-options.${cancelledBy}`
										)}
									</FilterChip>
								))}
							</FiltersRow>
						</FiltersSection>

						<FiltersSection>
							<FiltersLabel>
								{t('availability.cancellation-recovery.filters.reason')}
							</FiltersLabel>
							<FiltersRow>
								<FilterChip
									isActive={filters.reasonCode === 'all'}
									onClick={() =>
										setFilters((current) => ({
											...current,
											reasonCode: 'all',
										}))
									}
									type='button'
								>
									{t('availability.cancellation-recovery.filters.reason-all')}
								</FilterChip>
								{reasonOptions.map((reason) => (
									<FilterChip
										isActive={filters.reasonCode === reason.value}
										key={reason.value}
										onClick={() =>
											setFilters((current) => ({
												...current,
												reasonCode: reason.value,
											}))
										}
										type='button'
									>
										{t(reason.labelKey)}
									</FilterChip>
								))}
							</FiltersRow>
						</FiltersSection>

						<FiltersSection>
							<FiltersLabel>
								{t('availability.cancellation-recovery.filters.delivery')}
							</FiltersLabel>
							<FiltersRow>
								{(
									[
										'all',
										'online',
										'in-person',
										'unknown',
									] as CancellationRecoveryDeliveryModeFilter[]
								).map((deliveryMode) => (
									<FilterChip
										isActive={filters.deliveryMode === deliveryMode}
										key={deliveryMode}
										onClick={() => setDeliveryMode(deliveryMode)}
										type='button'
									>
										{t(
											`availability.cancellation-recovery.filters.delivery-options.${deliveryMode}`
										)}
									</FilterChip>
								))}
							</FiltersRow>
						</FiltersSection>
					</FiltersContent>
				</Drawer>
			) : null}
		</PageLayout>
	);
};
