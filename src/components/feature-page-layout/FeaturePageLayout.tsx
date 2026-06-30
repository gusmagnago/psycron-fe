import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@psycron/components/button/Button';
import { Drawer } from '@psycron/components/drawer/Drawer';
import { ChevronDown, ChevronUp } from '@psycron/components/icons';
import { SectionTabs } from '@psycron/components/section-tabs';
import useViewport from '@psycron/hooks/useViewport';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';

import {
	FeaturePageQueueContent,
	FeaturePageQueueDetailWrapper,
	FeaturePageQueueGrid,
	FeaturePageQueueSidebar,
	FeaturePageQueueToggleWrapper,
	FeaturePageRoot,
} from './FeaturePageLayout.styles';
import type {
	FeaturePageLayoutProps,
	FeaturePageQueueProps,
} from './FeaturePageLayout.types';

export const FeaturePageLayout = <Value extends string = string>({
	ariaLabel,
	children,
	colors,
	isLoading,
	subTitle,
	tabs,
	title,
}: FeaturePageLayoutProps<Value>) => (
	<PageLayout isLoading={isLoading} subTitle={subTitle} title={title}>
		<FeaturePageRoot aria-label={ariaLabel} colors={colors}>
			{tabs ? (
				<SectionTabs
					ariaLabel={tabs.ariaLabel}
					items={tabs.items}
					onChange={tabs.onChange}
					value={tabs.value}
				/>
			) : null}
			{children}
		</FeaturePageRoot>
	</PageLayout>
);

export const FeaturePageQueue = ({
	accessibility,
	analytics,
	children,
	detailTitle,
	isDetailOpen,
	isQueueExpanded,
	onDetailClose,
	onQueueExpandedChange,
	queueControls,
	queueList,
	queueSummary,
}: FeaturePageQueueProps) => {
	const { t } = useTranslation();
	const { isSmallerThanTablet } = useViewport();
	const queueContentId = useId();
	const toggleLabel = isQueueExpanded
		? t('common.layout.collapse-queue')
		: t('common.layout.expand-queue');

	const toggleQueueExpansion = (): void => {
		const nextValue = !isQueueExpanded;
		onQueueExpandedChange(nextValue);
		analytics?.onEvent?.({
			name: 'feature_page_queue_expansion_changed',
			properties: {
				isExpanded: nextValue,
				surface: analytics.surface,
			},
		});
	};

	return (
		<>
			<FeaturePageQueueGrid isExpanded={isQueueExpanded}>
				<FeaturePageQueueSidebar
					aria-label={accessibility.queueLabel}
					data-testid={accessibility.queueTestId}
					id={accessibility.queueTestId}
				>
					{queueSummary}
					<FeaturePageQueueToggleWrapper>
						<Button
							aria-controls={queueContentId}
							aria-expanded={isQueueExpanded}
							aria-label={toggleLabel}
							onClick={toggleQueueExpansion}
							secondary
							small
						>
							{isQueueExpanded ? <ChevronUp /> : <ChevronDown />}
							{toggleLabel}
						</Button>
					</FeaturePageQueueToggleWrapper>
					<FeaturePageQueueContent
						id={queueContentId}
						isExpanded={isQueueExpanded}
					>
						{queueControls}
						{queueList}
					</FeaturePageQueueContent>
				</FeaturePageQueueSidebar>

				{!isSmallerThanTablet && (
					<FeaturePageQueueDetailWrapper
						aria-label={accessibility.detailLabel}
						data-testid={accessibility.detailTestId}
						id={accessibility.detailTestId}
						isHidden={isQueueExpanded}
					>
						{children}
					</FeaturePageQueueDetailWrapper>
				)}
			</FeaturePageQueueGrid>

			{isSmallerThanTablet && isDetailOpen && onDetailClose ? (
				<Drawer
					ariaLabel={accessibility.detailLabel}
					onClose={onDetailClose}
					title={detailTitle ?? ''}
				>
					{children}
				</Drawer>
			) : null}
		</>
	);
};
