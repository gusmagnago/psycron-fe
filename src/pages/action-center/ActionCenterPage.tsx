import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionTabs } from '@psycron/components/section-tabs';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
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
		<PageLayout
			subTitle={t('action-center.subtitle')}
			title={t('action-center.title')}
		>
			<SectionTabs
				ariaLabel={t('action-center.tabs.aria-label')}
				items={ACTION_CENTER_TABS.map((tab) => ({
					label: t(`action-center.tabs.${tab}`),
					value: tab,
				}))}
				onChange={(value) => setActiveTab(value as ActionCenterTab)}
				value={activeTab}
			/>
			{activeTab === 'conflicts' ? (
				<ConflictsPanelContent />
			) : (
				<CancellationRecoveryPanelContent />
			)}
		</PageLayout>
	);
};
