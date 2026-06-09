import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusChip } from '@psycron/components/dashboard/status-chip/StatusChip';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { RangeGroup } from '@psycron/components/range-group/RangeGroup';

import {
	RevenueDetailGrid,
	RevenueDetailLabel,
	RevenueDetailRow,
	RevenueDetailValue,
	RevenueEmpty,
	RevenueEmptyBody,
	RevenueEmptyIcon,
	RevenueEmptyTitle,
	RevenueRoot,
	RevenueSkeleton,
	RevenueValue,
	RevenueValueRow,
} from './RevenueWidget.styles';
import type { RevenueWidgetProps } from './RevenueWidget.types';
import {
	formatRevenueCurrency,
	formatRevenueDelta,
	getRevenueDeltaTone,
} from './RevenueWidget.utils';

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
		? (weekEstimate?.completedCount ?? 0)
		: (estimate?.completedSessionCount ?? 0);
	const cancelledCount = weekEstimate?.cancelledCount ?? 0;
	const upcomingCount = weekEstimate?.upcomingCount ?? 0;
	const hasRevenueData = displayAmount > 0 || completedCount > 0;

	const headerActions = useMemo(
		() => (
			<RangeGroup<'month' | 'week'>
				ariaLabel={t('page.dashboard.widgets.revenue.range-aria-label')}
				idPrefix='dashboard-revenue-range'
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
		[range, t]
	);

	const title = estimate && !isWeekRange
		? t('page.dashboard.widgets.revenue.title-with-month', {
				month: estimate.monthLabel,
			})
		: t(
				isWeekRange
					? 'page.dashboard.widgets.revenue.title-week'
					: 'page.dashboard.widgets.revenue.title'
			);

	const delta = formatRevenueDelta(estimate?.deltaPercent);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (!onClick) return;
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClick();
			}
		},
		[onClick]
	);

	const body =
		isLoading || !estimate ? (
			<RevenueRoot>
				<RevenueSkeleton height={52} variant='rectangular' width='70%' />
				<RevenueSkeleton height={16} variant='rectangular' width='100%' />
				<RevenueSkeleton height={16} variant='rectangular' width='82%' />
			</RevenueRoot>
		) : !hasRevenueData ? (
			<RevenueEmpty>
				<RevenueEmptyIcon>{estimate.currency}</RevenueEmptyIcon>
				<RevenueEmptyTitle>
					{t('page.dashboard.widgets.revenue.empty-title')}
				</RevenueEmptyTitle>
				<RevenueEmptyBody>
					{t('page.dashboard.widgets.revenue.empty-body')}
				</RevenueEmptyBody>
			</RevenueEmpty>
		) : (
			<RevenueRoot
				isInteractive={Boolean(onClick)}
				isWide={isWide}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				role={onClick ? 'button' : undefined}
				tabIndex={onClick ? 0 : undefined}
			>
				<RevenueValueRow>
					<RevenueValue>
						{formatRevenueCurrency(
							displayAmount,
							estimate.currency,
							i18n.language
						)}
					</RevenueValue>
					<StatusChip tone='neutral'>
						{t('page.dashboard.widgets.revenue.estimate-chip')}
					</StatusChip>
					{!isWeekRange && delta ? (
						<StatusChip tone={getRevenueDeltaTone(estimate.deltaPercent)}>
							{delta}
						</StatusChip>
					) : null}
				</RevenueValueRow>

				<RevenueDetailGrid>
					<RevenueDetailRow>
						<RevenueDetailLabel>
							{t('page.dashboard.widgets.revenue.completed')}
						</RevenueDetailLabel>
						<RevenueDetailValue>
							{t('page.dashboard.widgets.revenue.sessions', {
								count: completedCount,
							})}
						</RevenueDetailValue>
					</RevenueDetailRow>
					{isWeekRange ? (
						<RevenueDetailRow>
							<RevenueDetailLabel>
								{t('page.dashboard.widgets.revenue.week-pipeline')}
							</RevenueDetailLabel>
							<RevenueDetailValue>
								{t('page.dashboard.widgets.revenue.week-pipeline-value', {
									cancelled: cancelledCount,
									upcoming: upcomingCount,
								})}
							</RevenueDetailValue>
						</RevenueDetailRow>
					) : null}
					<RevenueDetailRow>
						<RevenueDetailLabel>
							{t('page.dashboard.widgets.revenue.configured')}
						</RevenueDetailLabel>
						<RevenueDetailValue>
							{t('page.dashboard.widgets.revenue.patients-ready', {
								configured: estimate.configuredBillingCount,
								missing: estimate.missingBillingCount,
							})}
						</RevenueDetailValue>
					</RevenueDetailRow>
				</RevenueDetailGrid>
			</RevenueRoot>
		);

	return (
		<WidgetLayout
			body={body}
			headerActions={headerActions}
			title={title}
		/>
	);
};
