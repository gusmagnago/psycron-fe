import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { PATIENTS } from '@psycron/pages/urls';

import { CancellationRecoveryDetailPanel } from './components/CancellationRecoveryDetailPanel';
import { CancellationRecoveryFiltersDrawer } from './components/CancellationRecoveryFiltersDrawer';
import { CancellationRecoverySidebar } from './components/CancellationRecoverySidebar';
import { useCancellationRecoveryPageState } from './hooks/useCancellationRecoveryPageState';
import { RecoveryLayout } from './CancellationRecoveryPage.styles';

export const CancellationRecoveryPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { locale } = useParams<{ locale: string }>();
	const {
		filteredRows,
		filters,
		isFiltersDrawerOpen,
		isLoading,
		isReopening,
		openFiltersDrawer,
		closeFiltersDrawer,
		reopenRow,
		selectedRow,
		selectedSlotId,
		selectRow,
		stats,
	} = useCancellationRecoveryPageState({ t });

	return (
		<PageLayout
			isLoading={isLoading}
			subTitle={t('availability.cancellation-recovery.subtitle')}
			title={t('availability.cancellation-recovery.title')}
		>
			<RecoveryLayout>
				<CancellationRecoverySidebar
					activeFilterCount={filters.activeFilterCount}
					isFiltersDrawerOpen={isFiltersDrawerOpen}
					onOpenFilters={openFiltersDrawer}
					onSelectRow={selectRow}
					rows={filteredRows}
					selectedSlotId={selectedSlotId}
					stats={stats}
				/>
				<CancellationRecoveryDetailPanel
					isReopening={isReopening}
					onOpenPatient={(patientId) =>
						navigate(`/${locale}/${PATIENTS}/${patientId}`)
					}
					onRebook={(patientId, slotId) =>
						navigate(
							`/${locale}/${PATIENTS}/${patientId}?session=${slotId}&mode=reschedule`
						)
					}
					onReopen={reopenRow}
					row={selectedRow}
				/>
			</RecoveryLayout>
			<CancellationRecoveryFiltersDrawer
				controls={filters}
				isOpen={isFiltersDrawerOpen}
				onClose={closeFiltersDrawer}
			/>
		</PageLayout>
	);
};
