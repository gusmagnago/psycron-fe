import { useTranslation } from 'react-i18next';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { TriangleAlert } from '@psycron/components/icons';

import {
	ActionCenterEmpty,
	ActionCenterEmptyBody,
	ActionCenterEmptyIcon,
	ActionCenterEmptyTitle,
	ActionCenterHeaderChip,
	ActionCenterItemButton,
	ActionCenterItemCard,
	ActionCenterItemList,
	ActionCenterItemMeta,
	ActionCenterItemText,
	ActionCenterItemTitle,
	ActionCenterItemTone,
	ActionCenterRoot,
	ActionCenterSkeleton,
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
				<ActionCenterSkeleton height={84} variant='rectangular' />
				<ActionCenterSkeleton height={72} variant='rectangular' />
				<ActionCenterSkeleton height={72} variant='rectangular' />
			</ActionCenterRoot>
		) : total === 0 ? (
			<ActionCenterRoot>
				<ActionCenterEmpty>
					<ActionCenterEmptyIcon>
						<TriangleAlert />
					</ActionCenterEmptyIcon>
					<ActionCenterEmptyTitle>
						{t('page.dashboard.widgets.action-center.empty-heading')}
					</ActionCenterEmptyTitle>
					<ActionCenterEmptyBody>
						{t('page.dashboard.widgets.action-center.empty')}
					</ActionCenterEmptyBody>
				</ActionCenterEmpty>
			</ActionCenterRoot>
		) : (
			<ActionCenterRoot>
				<ActionCenterItemList>
					{items.slice(0, 3).map((item) => (
						<ActionCenterItemCard key={item.type} tone={item.tone}>
							<ActionCenterItemTone tone={item.tone} />
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
			headerActions={
				!isLoading && summary ? (
					<ActionCenterHeaderChip>
						{total > 0
							? t('page.dashboard.widgets.action-center.header-count', {
									count: total,
								})
							: t('page.dashboard.widgets.action-center.header-empty')}
					</ActionCenterHeaderChip>
				) : undefined
			}
			body={body}
			title={t('page.dashboard.widgets.action-center.title')}
		/>
	);
};
