import { useTranslation } from 'react-i18next';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';

import {
	ActionCenterBreakdown,
	ActionCenterBreakdownItem,
	ActionCenterEmpty,
	ActionCenterItemButton,
	ActionCenterItemCard,
	ActionCenterItemList,
	ActionCenterItemMeta,
	ActionCenterItemText,
	ActionCenterItemTitle,
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
	onItemClick,
	summary,
}: ActionCenterWidgetProps) => {
	const { t } = useTranslation();
	const total = summary?.total ?? 0;
	const items = summary?.items ?? [];

	const body =
		isLoading || !summary ? (
			<ActionCenterRoot>
				<ActionCenterSkeleton height={72} variant='rectangular' />
				<ActionCenterSkeleton height={36} variant='rectangular' />
			</ActionCenterRoot>
		) : total === 0 ? (
			<ActionCenterRoot>
				<ActionCenterEmpty>
					{t('page.dashboard.widgets.action-center.empty')}
				</ActionCenterEmpty>
			</ActionCenterRoot>
		) : (
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
				<ActionCenterItemList>
					{items.slice(0, 3).map((item) => (
						<ActionCenterItemCard key={item.type} tone={item.tone}>
							<ActionCenterItemText>
								<ActionCenterItemTitle>{t(item.labelKey)}</ActionCenterItemTitle>
								<ActionCenterItemMeta>
									{t('page.dashboard.widgets.action-center.item-count', {
										count: item.count,
									})}
								</ActionCenterItemMeta>
							</ActionCenterItemText>
							<ActionCenterItemButton
								aria-label={t(
									'page.dashboard.widgets.action-center.action-aria',
									{
										item: t(item.labelKey),
									}
								)}
								onClick={() => onItemClick?.(item)}
								tone={item.tone}
								type='button'
							>
								{t(`page.dashboard.widgets.action-center.actions.${item.type}`)}
							</ActionCenterItemButton>
						</ActionCenterItemCard>
					))}
				</ActionCenterItemList>
			</ActionCenterRoot>
		);

	return (
		<WidgetLayout
			body={body}
			title={t('page.dashboard.widgets.action-center.title')}
		/>
	);
};
