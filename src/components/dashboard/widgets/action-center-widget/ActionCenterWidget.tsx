import { useTranslation } from 'react-i18next';
import { IconBox } from '@psycron/components/dashboard/icon-box/IconBox';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { TriangleAlert } from '@psycron/components/icons';

import {
	ActionCenterEmpty,
	ActionCenterEmptyBody,
	ActionCenterEmptyIcon,
	ActionCenterEmptyTitle,
	ActionCenterHeaderChip,
	ActionCenterList,
	ActionCenterRoot,
	ActionCenterRowAction,
	ActionCenterRowButton,
	ActionCenterRowChevron,
	ActionCenterRowMeta,
	ActionCenterRowText,
	ActionCenterRowTitle,
	ActionCenterSkeleton,
} from './ActionCenterWidget.styles';
import type { ActionCenterWidgetProps } from './ActionCenterWidget.types';

export const ActionCenterWidget = ({
	isLoading,
	items = [],
	summary,
}: ActionCenterWidgetProps) => {
	const { t } = useTranslation();
	const total = summary?.total ?? 0;

	const body =
		isLoading || !summary ? (
			<ActionCenterRoot
				data-testid='dashboard-action-center-root'
				id='dashboard-action-center-root'
			>
				<ActionCenterSkeleton
					data-testid='dashboard-action-center-skeleton-1'
					height={84}
					variant='rectangular'
				/>
				<ActionCenterSkeleton
					data-testid='dashboard-action-center-skeleton-2'
					height={72}
					variant='rectangular'
				/>
				<ActionCenterSkeleton
					data-testid='dashboard-action-center-skeleton-3'
					height={72}
					variant='rectangular'
				/>
			</ActionCenterRoot>
		) : (
			<ActionCenterRoot
				data-testid='dashboard-action-center-root'
				id='dashboard-action-center-root'
			>
				{total === 0 ? (
					<ActionCenterEmpty
						data-testid='dashboard-action-center-empty'
						id='dashboard-action-center-empty'
					>
						<ActionCenterEmptyIcon
							data-testid='dashboard-action-center-empty-icon'
							id='dashboard-action-center-empty-icon'
						>
							<TriangleAlert />
						</ActionCenterEmptyIcon>
						<ActionCenterEmptyTitle
							data-testid='dashboard-action-center-empty-title'
							id='dashboard-action-center-empty-title'
						>
							{t('page.dashboard.widgets.action-center.empty-heading')}
						</ActionCenterEmptyTitle>
						<ActionCenterEmptyBody
							data-testid='dashboard-action-center-empty-body'
							id='dashboard-action-center-empty-body'
						>
							{t('page.dashboard.widgets.action-center.empty')}
						</ActionCenterEmptyBody>
					</ActionCenterEmpty>
				) : items.length > 0 ? (
					<ActionCenterList
						data-testid='dashboard-action-center-rows'
						id='dashboard-action-center-rows'
					>
						{items.map((item) => (
							<ActionCenterRowButton
								aria-label={item.ariaLabel}
								id={`action-center-row-${item.id}`}
								data-testid={`dashboard-action-center-row-${item.id}`}
								key={item.id}
								onClick={item.onClick}
								type='button'
								variant={item.variant}
							>
								<IconBox
									data-testid={`dashboard-action-center-row-icon-${item.id}`}
									id={`dashboard-action-center-row-icon-${item.id}`}
									size={36}
									tone={item.tone}
								>
									{item.icon}
								</IconBox>
								<ActionCenterRowText
									data-testid={`dashboard-action-center-row-text-${item.id}`}
									id={`dashboard-action-center-row-text-${item.id}`}
								>
									<ActionCenterRowTitle
										data-testid={`dashboard-action-center-row-title-${item.id}`}
										id={`dashboard-action-center-row-title-${item.id}`}
									>
										{item.label}
									</ActionCenterRowTitle>
									{item.meta ? (
										<ActionCenterRowMeta
											data-testid={`dashboard-action-center-row-meta-${item.id}`}
											id={`dashboard-action-center-row-meta-${item.id}`}
										>
											{item.meta}
										</ActionCenterRowMeta>
									) : null}
								</ActionCenterRowText>
								<ActionCenterRowAction
									data-testid={`dashboard-action-center-row-action-${item.id}`}
									id={`dashboard-action-center-row-action-${item.id}`}
									variant={item.variant}
								>
									{item.actionLabel}
								</ActionCenterRowAction>
								<ActionCenterRowChevron
									data-testid={`dashboard-action-center-row-chevron-${item.id}`}
									id={`dashboard-action-center-row-chevron-${item.id}`}
								/>
							</ActionCenterRowButton>
							))}
					</ActionCenterList>
				) : null}
			</ActionCenterRoot>
		);

	return (
		<WidgetLayout
			headerActions={
				!isLoading && summary ? (
					<ActionCenterHeaderChip
						data-testid='dashboard-action-center-header-chip'
						id='dashboard-action-center-header-chip'
					>
						{total > 0
							? t('page.dashboard.widgets.action-center.count-chip', {
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
