import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusChip } from '@psycron/components/dashboard/status-chip/StatusChip';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';

import {
	RevenueDetailGrid,
	RevenueDetailLabel,
	RevenueDetailRow,
	RevenueDetailValue,
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
}: RevenueWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { i18n, t } = useTranslation();

	const headerActions = useMemo(
		() => (
			<StatusChip tone='neutral'>
				{t('page.dashboard.widgets.revenue.estimate-chip')}
			</StatusChip>
		),
		[t]
	);

	const title = estimate
		? t('page.dashboard.widgets.revenue.title-with-month', {
				month: estimate.monthLabel,
			})
		: t('page.dashboard.widgets.revenue.title');

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
							estimate.amount,
							estimate.currency,
							i18n.language
						)}
					</RevenueValue>
					{delta ? (
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
								count: estimate.completedSessionCount,
							})}
						</RevenueDetailValue>
					</RevenueDetailRow>
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
