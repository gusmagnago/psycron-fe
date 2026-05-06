import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	FEATURE_PAGE_COLORS,
	FeaturePageLayout,
} from '@psycron/components/feature-page-layout';
import { CancellationRecoveryPanelContent } from '@psycron/pages/availability/cancellation-recovery/CancellationRecoveryPage';
import { ConflictsPanelContent } from '@psycron/pages/conflicts/ConflictsPage';

import type {
	ActionCenterPageProps,
	ActionCenterTab,
} from './ActionCenterPage.types';

const ACTION_CENTER_TABS = ['conflicts', 'recovery'] as const;

export const ActionCenterPage = ({
	initialTab = 'conflicts',
}: ActionCenterPageProps) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<ActionCenterTab>(initialTab);

	return (
		<FeaturePageLayout
			colors={FEATURE_PAGE_COLORS.action}
			subTitle={t('action-center.subtitle')}
			tabs={{
				ariaLabel: t('action-center.tabs.aria-label'),
				items: ACTION_CENTER_TABS.map((tab) => ({
					label: t(`action-center.tabs.${tab}`),
					value: tab,
				})),
				onChange: (value) => setActiveTab(value as ActionCenterTab),
				value: activeTab,
			}}
			title={t('action-center.title')}
		>
			{activeTab === 'conflicts' ? (
				<ConflictsPanelContent />
			) : (
				<CancellationRecoveryPanelContent />
			)}
		</FeaturePageLayout>
	);
};
