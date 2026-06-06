import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { StatusChip } from '@psycron/components/dashboard/status-chip/StatusChip';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Payment } from '@psycron/components/icons';
import { DonutProgressGlass } from '@psycron/components/progress/donut/DonutProgressGlass';
import { useCountUp } from '@psycron/hooks/useCountUp';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

import {
	BillingContent,
	BillingCopy,
	BillingProgressStage,
	BillingRoot,
	BillingSubLabel,
	BillingTeaser,
	BillingTeaserIconWrap,
	BillingTeaserSubText,
	BillingTeaserTitle,
} from './BillingReadinessWidget.styles';
import type {
	BillingReadinessWidgetProps,
	BillingStatus,
} from './BillingReadinessWidget.types';

const getBillingStatusTone = (status: BillingStatus): DashboardAccentTone => {
	switch (status) {
		case 'ready':
			return 'success';
		case 'partial':
			return 'warning';
		case 'empty':
			return 'danger';
	}
};

export const BillingReadinessWidget = ({
	colSpan,
	configuredCount,
	isLoading,
	missingCount,
	onClick,
	percentage,
	status,
	totalCount,
}: BillingReadinessWidgetProps) => {
	const isWide = (colSpan ?? 0) >= 6;
	const { t } = useTranslation();
	const animatedValue = useCountUp({ end: percentage });

	const headerActions = useMemo(
		() => (
			<>
				{status !== 'empty' && (
					<StatusChip tone={getBillingStatusTone(status)}>
						{t(`page.dashboard.widgets.billing-readiness.status-chip.${status}`)}
					</StatusChip>
				)}
			</>
		),
		[status, t]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClick();
			}
		},
		[onClick]
	);

	const body = isLoading ? (
		<BillingRoot>
			<Skeleton height={44} width='55%' />
			<Skeleton height={16} width='60%' />
			<Skeleton height={4} width='100%' />
		</BillingRoot>
	) : status === 'empty' ? (
		<BillingRoot
			isInteractive
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role='button'
			tabIndex={0}
		>
			<BillingTeaser>
				<BillingTeaserIconWrap>
					<Payment />
				</BillingTeaserIconWrap>
				<BillingTeaserTitle>
					{t('page.dashboard.widgets.billing-readiness.teaser.title')}
				</BillingTeaserTitle>
				<BillingTeaserSubText>
					{t('page.dashboard.widgets.billing-readiness.teaser.subtitle')}
				</BillingTeaserSubText>
				<BillingTeaserSubText>
					{t('page.dashboard.widgets.billing-readiness.teaser.coming-soon')}
				</BillingTeaserSubText>
			</BillingTeaser>
		</BillingRoot>
	) : (
		<BillingRoot
			isInteractive
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role='button'
			tabIndex={0}
		>
			<BillingContent isWide={isWide}>
				<BillingProgressStage>
					<DonutProgressGlass
						label={`${animatedValue.toLocaleString()}%`}
						meta={t('page.dashboard.widgets.billing-readiness.donut-meta', {
							configured: configuredCount,
							total: totalCount,
						})}
						size={128}
						stroke={12}
						value={percentage}
					/>
				</BillingProgressStage>

				<BillingCopy>
					<BillingSubLabel>
						{t(`page.dashboard.widgets.billing-readiness.status.${status}`, {
							configured: configuredCount,
							missing: missingCount,
							total: totalCount,
						})}
					</BillingSubLabel>
				</BillingCopy>
			</BillingContent>
		</BillingRoot>
	);

	return (
		<WidgetLayout
			body={body}
			headerActions={headerActions}
			title={t('page.dashboard.widgets.billing-readiness.label')}
		/>
	);
};
