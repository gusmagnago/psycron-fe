import { useTranslation } from 'react-i18next';
import { QueueFiltersDrawer } from '@psycron/components/queue-panel';

import type { CancellationRecoveryFiltersDrawerProps } from '../CancellationRecoveryPage.types';

import { CancellationRecoveryFilters } from './CancellationRecoveryFilters';

export const CancellationRecoveryFiltersDrawer = ({
	controls,
	isOpen,
	onClose,
}: CancellationRecoveryFiltersDrawerProps) => {
	const { t } = useTranslation();

	if (!isOpen) return null;

	return (
		<QueueFiltersDrawer
			activeFilterCount={controls.activeFilterCount}
			ariaLabel={t('availability.cancellation-recovery.filters.title')}
			isOpen={isOpen}
			onClose={onClose}
			summaryActive={t('availability.cancellation-recovery.filters.summary-active', {
				count: controls.activeFilterCount,
			})}
			summaryDefault={t('availability.cancellation-recovery.filters.summary-default')}
			title={t('availability.cancellation-recovery.filters.title')}
		>
			<CancellationRecoveryFilters controls={controls} />
		</QueueFiltersDrawer>
	);
};
