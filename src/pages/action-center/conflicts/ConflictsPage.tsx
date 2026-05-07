import { useTranslation } from 'react-i18next';
import {
	FEATURE_PAGE_COLORS,
	FeaturePageLayout,
} from '@psycron/components/feature-page-layout';

import { ConflictsPanelContent } from './ConflictsPanelContent';

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
