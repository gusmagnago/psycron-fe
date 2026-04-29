import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { DOMAIN, PATIENTS } from '@psycron/pages/urls';
import { useQueryClient } from '@tanstack/react-query';

import { SessionDrawer } from '../../patients/patient-details/session-drawer/SessionDrawer';
import type { PatientSessionRow } from '../../patients/PatientsPage.types';

import { CancellationRecoveryDetailPanel } from './components/CancellationRecoveryDetailPanel';
import { CancellationRecoveryFiltersDrawer } from './components/CancellationRecoveryFiltersDrawer';
import { CancellationRecoverySidebar } from './components/CancellationRecoverySidebar';
import { useCancellationRecoveryPageState } from './hooks/useCancellationRecoveryPageState';
import { RecoveryLayout } from './CancellationRecoveryPage.styles';
import type { CancellationRecoveryRow } from './CancellationRecoveryPage.types';

export const CancellationRecoveryPanelContent = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const therapistId = useTherapistId();
	const { locale } = useParams<{ locale: string }>();
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

	return (
		<>
			<RecoveryLayout>
				<CancellationRecoverySidebar
					activeFilterCount={filters.activeFilterCount}
					archivableRowsCount={archivableRowsCount}
					isArchivingAll={isArchivingAll}
					isFiltersDrawerOpen={isFiltersDrawerOpen}
					onArchiveAll={archiveAllRows}
					onOpenFilters={openFiltersDrawer}
					onSelectRow={selectRow}
					rows={filteredRows}
					selectedSlotId={selectedSlotId}
					stats={stats}
				/>
				<CancellationRecoveryDetailPanel
					isArchiving={isArchiving}
					isReopening={isReopening}
					onArchive={archiveRow}
					onOpenPatient={openPatientProfile}
					onRebook={setRebookRow}
					onReopen={reopenRow}
					row={selectedRow}
				/>
			</RecoveryLayout>
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
		<PageLayout
			subTitle={t('availability.cancellation-recovery.subtitle')}
			title={t('availability.cancellation-recovery.title')}
		>
			<CancellationRecoveryPanelContent />
		</PageLayout>
	);
};
