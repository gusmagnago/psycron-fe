import { useTranslation } from 'react-i18next';
import {
	FEATURE_PAGE_COLORS,
	FeaturePageLayout,
} from '@psycron/components/feature-page-layout';

import { CancellationRecoveryPanelContent } from './CancellationRecoveryPanelContent';

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
