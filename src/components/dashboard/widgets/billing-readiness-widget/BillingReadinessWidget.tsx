import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { Payment } from '@psycron/components/icons';
import { DonutProgressGlass } from '@psycron/components/progress/donut/DonutProgressGlass';
import { useCountUp } from '@psycron/hooks/useCountUp';

import {
	BillingContent,
	BillingCopy,
	BillingDetails,
	BillingRoot,
	BillingSubLabel,
	BillingTeaser,
	BillingTeaserIconWrap,
	BillingTeaserSubText,
	BillingTeaserTitle,
	StatusChip,
} from './BillingReadinessWidget.styles';
import type { BillingReadinessWidgetProps } from './BillingReadinessWidget.types';

export const BillingReadinessWidget = ({
	configuredCount,
	isLoading,
	missingCount,
	onClick,
	percentage,
	status,
	totalCount,
}: BillingReadinessWidgetProps) => {
	const { t } = useTranslation();
	const animatedValue = useCountUp({ end: percentage });

	const headerActions = useMemo(
		() =>
			status !== 'empty' ? (
				<StatusChip status={status}>
					{t(`page.dashboard.widgets.billing-readiness.status-chip.${status}`)}
				</StatusChip>
			) : undefined,
		[status, t]
	);

	useBentoTileChrome({
		headerActions,
		title: t('page.dashboard.widgets.billing-readiness.label'),
	});

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClick();
			}
		},
		[onClick]
	);

	if (isLoading) {
		return (
			<BillingRoot>
				<Skeleton height={44} width='55%' />
				<Skeleton height={16} width='60%' />
				<Skeleton height={4} width='100%' />
			</BillingRoot>
		);
	}

	if (status === 'empty') {
		return (
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
		);
	}

	return (
		<BillingRoot
			isInteractive
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role='button'
			tabIndex={0}
		>
			<BillingContent>
				<DonutProgressGlass
					label={`${animatedValue.toLocaleString()}%`}
					meta={t('page.dashboard.widgets.billing-readiness.donut-meta', {
						configured: configuredCount,
						total: totalCount,
					})}
					value={percentage}
				/>

				<BillingCopy>
					<BillingSubLabel>
						{t(`page.dashboard.widgets.billing-readiness.status.${status}`, {
							configured: configuredCount,
							missing: missingCount,
							total: totalCount,
						})}
					</BillingSubLabel>

					<BillingDetails>
						{t('page.dashboard.widgets.billing-readiness.details', {
							configured: configuredCount,
							missing: missingCount,
							total: totalCount,
						})}
					</BillingDetails>
				</BillingCopy>
			</BillingContent>
		</BillingRoot>
	);
};
