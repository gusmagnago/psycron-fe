import { type KeyboardEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Wallet } from '@psycron/components/icons';
import { RangeGroup } from '@psycron/components/range-group/RangeGroup';

import {
	RevenueAmount,
	RevenueDataState,
	RevenueEmpty,
	RevenueEmptyBody,
	RevenueEmptyButton,
	RevenueEmptyIcon,
	RevenueEmptyIconGlyph,
	RevenueEmptyTitle,
	RevenueRoot,
	RevenueSkeleton,
	RevenueSubline,
} from './RevenueWidget.styles';
import type { RevenueWidgetProps } from './RevenueWidget.types';
import { formatRevenueCurrency } from './RevenueWidget.utils';

const REVENUE_WIDGET_ID_PREFIX = 'dashboard-revenue-widget';

export const RevenueWidget = ({
	colSpan,
	estimate,
	isLoading,
	onClick,
	weekEstimate,
}: RevenueWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { i18n, t } = useTranslation();
	const [range, setRange] = useState<'month' | 'week'>('month');
	const isWeekRange = range === 'week';
	const displayAmount = isWeekRange
		? (weekEstimate?.amount ?? 0)
		: (estimate?.amount ?? 0);
	const completedCount = isWeekRange
		? (weekEstimate?.completedSessionCount ?? 0)
		: (estimate?.completedSessionCount ?? 0);
	const hasMonthRevenueData =
		(estimate?.amount ?? 0) > 0 || (estimate?.completedSessionCount ?? 0) > 0;
	const hasWeekRevenueData =
		(weekEstimate?.amount ?? 0) > 0 ||
		(weekEstimate?.completedSessionCount ?? 0) > 0;
	const hasRevenueData = isWeekRange
		? hasWeekRevenueData
		: hasMonthRevenueData;
	const isRangeDisabled = !hasMonthRevenueData && !hasWeekRevenueData;

	const headerActions = useMemo(
		() => (
			<RangeGroup<'month' | 'week'>
				ariaLabel={t('page.dashboard.widgets.revenue.range-aria-label')}
				disabled={isRangeDisabled}
				idPrefix={`${REVENUE_WIDGET_ID_PREFIX}-range`}
				size='small'
				onChange={setRange}
				options={[
					{
						ariaLabel: t('page.dashboard.widgets.revenue.view-week'),
						label: t('page.dashboard.widgets.revenue.view-week'),
						value: 'week',
					},
					{
						ariaLabel: t('page.dashboard.widgets.revenue.view-month'),
						label: t('page.dashboard.widgets.revenue.view-month'),
						value: 'month',
					},
				]}
				value={range}
				/>
		),
		[isRangeDisabled, range, t]
	);

	const title =
		!hasMonthRevenueData && !hasWeekRevenueData
			? t('page.dashboard.widgets.revenue.title')
			: estimate && !isWeekRange
			? t('page.dashboard.widgets.revenue.title-with-month', {
					month: estimate.monthLabel,
				})
			: t(
					isWeekRange
						? 'page.dashboard.widgets.revenue.title-week'
						: 'page.dashboard.widgets.revenue.title'
				);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (!onClick) return;
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClick();
			}
		},
		[onClick]
	);

	const body = isLoading ? (
		<RevenueRoot
			aria-labelledby={`${REVENUE_WIDGET_ID_PREFIX}-title`}
			data-testid={`${REVENUE_WIDGET_ID_PREFIX}-loading`}
			id={`${REVENUE_WIDGET_ID_PREFIX}-loading`}
		>
			<RevenueSkeleton height={52} variant='rectangular' width='68%' />
			<RevenueSkeleton height={16} variant='rectangular' width='100%' />
			<RevenueSkeleton height={16} variant='rectangular' width='82%' />
		</RevenueRoot>
	) : !hasRevenueData ? (
		<RevenueRoot
			aria-labelledby={`${REVENUE_WIDGET_ID_PREFIX}-title`}
			data-testid={`${REVENUE_WIDGET_ID_PREFIX}-empty`}
			id={`${REVENUE_WIDGET_ID_PREFIX}-empty`}
		>
			<RevenueEmpty
				aria-labelledby={`${REVENUE_WIDGET_ID_PREFIX}-empty-title`}
				data-testid={`${REVENUE_WIDGET_ID_PREFIX}-empty-shell`}
				id={`${REVENUE_WIDGET_ID_PREFIX}-empty-shell`}
			>
				<RevenueEmptyIcon
					aria-hidden='true'
					data-testid={`${REVENUE_WIDGET_ID_PREFIX}-empty-icon`}
					id={`${REVENUE_WIDGET_ID_PREFIX}-empty-icon`}
				>
					<RevenueEmptyIconGlyph>
						<Wallet />
					</RevenueEmptyIconGlyph>
				</RevenueEmptyIcon>
				<RevenueEmptyTitle
					data-testid={`${REVENUE_WIDGET_ID_PREFIX}-empty-title`}
					id={`${REVENUE_WIDGET_ID_PREFIX}-empty-title`}
				>
					{t('page.dashboard.widgets.revenue.empty-title')}
				</RevenueEmptyTitle>
				<RevenueEmptyBody
					data-testid={`${REVENUE_WIDGET_ID_PREFIX}-empty-body`}
					id={`${REVENUE_WIDGET_ID_PREFIX}-empty-body`}
				>
					{t('page.dashboard.widgets.revenue.empty-body')}
				</RevenueEmptyBody>
				<RevenueEmptyButton
					data-testid={`${REVENUE_WIDGET_ID_PREFIX}-empty-action`}
					id={`${REVENUE_WIDGET_ID_PREFIX}-empty-action`}
					onClick={onClick}
					small
					tertiary
					type='button'
				>
					{t('page.dashboard.widgets.revenue.empty-action')}
				</RevenueEmptyButton>
			</RevenueEmpty>
		</RevenueRoot>
	) : (
		<RevenueRoot
			aria-labelledby={`${REVENUE_WIDGET_ID_PREFIX}-title`}
			data-testid={`${REVENUE_WIDGET_ID_PREFIX}-root`}
			id={`${REVENUE_WIDGET_ID_PREFIX}-root`}
			isInteractive={Boolean(onClick)}
			isWide={isWide}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role={onClick ? 'button' : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<RevenueDataState
				data-testid={`${REVENUE_WIDGET_ID_PREFIX}-data`}
				id={`${REVENUE_WIDGET_ID_PREFIX}-data`}
			>
				<RevenueAmount
					data-testid={`${REVENUE_WIDGET_ID_PREFIX}-amount`}
					id={`${REVENUE_WIDGET_ID_PREFIX}-amount`}
				>
					{formatRevenueCurrency(
						displayAmount,
						estimate.currency,
						i18n.language
					)}
				</RevenueAmount>
				<RevenueSubline
					data-testid={`${REVENUE_WIDGET_ID_PREFIX}-subline`}
					id={`${REVENUE_WIDGET_ID_PREFIX}-subline`}
				>
					{t('page.dashboard.widgets.revenue.sessions-billed', {
						count: completedCount,
					})}
				</RevenueSubline>
			</RevenueDataState>
		</RevenueRoot>
	);

	return (
		<WidgetLayout
			body={body}
			headerActions={headerActions}
			titleId={`${REVENUE_WIDGET_ID_PREFIX}-title`}
			title={title}
		/>
	);
};
