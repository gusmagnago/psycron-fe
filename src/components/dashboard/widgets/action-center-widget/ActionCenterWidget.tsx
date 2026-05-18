import { useTranslation } from 'react-i18next';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';

import {
	ActionCenterBreakdown,
	ActionCenterBreakdownItem,
	ActionCenterEmpty,
	ActionCenterRoot,
	ActionCenterSkeleton,
	ActionCenterSummaryBody,
	ActionCenterSummaryCount,
	ActionCenterSummaryPanel,
	ActionCenterSummaryText,
	ActionCenterSummaryTitle,
} from './ActionCenterWidget.styles';
import type { ActionCenterWidgetProps } from './ActionCenterWidget.types';

export const ActionCenterWidget = ({
	isLoading,
	summary,
}: ActionCenterWidgetProps) => {
	const { t } = useTranslation();
	const total = summary?.total ?? 0;
	const items = summary?.items ?? [];

	useBentoTileChrome({
		actions: '',
		title: t('page.dashboard.widgets.action-center.title'),
	});

	if (isLoading || !summary) {
		return (
			<ActionCenterRoot>
				<ActionCenterSkeleton height={72} variant='rectangular' />
				<ActionCenterSkeleton height={36} variant='rectangular' />
			</ActionCenterRoot>
		);
	}

	if (total === 0) {
		return (
			<ActionCenterRoot>
				<ActionCenterEmpty>
					{t('page.dashboard.widgets.action-center.empty')}
				</ActionCenterEmpty>
			</ActionCenterRoot>
		);
	}

	return (
		<ActionCenterRoot>
			<ActionCenterSummaryPanel>
				<ActionCenterSummaryCount>{total}</ActionCenterSummaryCount>
				<ActionCenterSummaryText>
					<ActionCenterSummaryTitle>
						{t('page.dashboard.widgets.action-center.summary-title', {
							count: total,
						})}
					</ActionCenterSummaryTitle>
					<ActionCenterSummaryBody>
						{t('page.dashboard.widgets.action-center.summary-body')}
					</ActionCenterSummaryBody>
				</ActionCenterSummaryText>
			</ActionCenterSummaryPanel>
			<ActionCenterBreakdown
				aria-label={t('page.dashboard.widgets.action-center.breakdown-label')}
			>
				{items.map((item) => (
					<ActionCenterBreakdownItem key={item.type} tone={item.tone}>
						<span>{t(item.labelKey)}</span>
						<strong>{item.count}</strong>
					</ActionCenterBreakdownItem>
				))}
			</ActionCenterBreakdown>
		</ActionCenterRoot>
	);
};
