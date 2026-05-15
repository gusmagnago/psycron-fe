import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { Jupiter } from '@psycron/components/icons';

import { InsightActions, InsightSlide } from './insight-slide/InsightSlide';
import { useInsightCarousel } from './JupiterInsightsWidget.hooks';
import {
	CarouselRoot,
	CarouselViewport,
	Dot,
	DotsRow,
	EmptyState,
	ExpandedInsightContent,
	ExpandedInsightText,
	JupiterBadgeRow,
	JupiterCategory,
	JupiterDot,
	JupiterSubtitle,
	LoadingWrapper,
	RoundedSkeleton,
} from './JupiterInsightsWidget.styles';
import type { JupiterInsightsWidgetProps } from './JupiterInsightsWidget.types';

export const JupiterInsightsWidget = ({
	insights,
	isLoading,
}: JupiterInsightsWidgetProps) => {
	const { t } = useTranslation();
	const { direction, goTo, idx, onTouchEnd, onTouchStart } = useInsightCarousel(
		insights.length
	);
	const hasInsights = !isLoading && insights.length > 0;
	const current = hasInsights ? insights[idx] : undefined;

	const footer = useMemo(
		() =>
			hasInsights ? (
				<DotsRow>
					{insights.map((ins, i) => (
						<Dot
							aria-label={`Insight ${i + 1}`}
							isActive={i === idx}
							key={ins.id}
							onClick={() => goTo(i, i > idx ? 1 : -1)}
							role='button'
							tabIndex={0}
						/>
					))}
				</DotsRow>
			) : undefined,
		[goTo, hasInsights, idx, insights]
	);

	const actions = useMemo(
		() => (current ? <InsightActions current={current} idx={idx} /> : undefined),
		[current, idx]
	);

	const title = useMemo(
		() =>
			current ? (
				<JupiterBadgeRow>
					<JupiterCategory>
						<JupiterDot />
						Júpiter ·{' '}
						{current.category ??
							t('page.dashboard.widgets.jupiter-insights.default-category')}
					</JupiterCategory>
					<JupiterSubtitle>
						{t('page.dashboard.widgets.jupiter-insights.subtitle')}
					</JupiterSubtitle>
				</JupiterBadgeRow>
			) : undefined,
		[current, t]
	);

	const expandedContent = useMemo(
		() =>
			current ? (
				<ExpandedInsightContent>
					<ExpandedInsightText>{current.text}</ExpandedInsightText>
					<InsightActions current={current} idx={idx} />
				</ExpandedInsightContent>
			) : undefined,
		[current, idx]
	);

	useBentoTileChrome({
		actions,
		expandedContent,
		footer,
		icon: hasInsights ? <Jupiter aria-hidden='true' /> : undefined,
		title,
	});

	if (isLoading) {
		return (
			<LoadingWrapper>
				<Skeleton height={20} width='50%' />
				<RoundedSkeleton height={80} variant='rectangular' />
				<RoundedSkeleton height={36} width='70%' variant='rectangular' />
			</LoadingWrapper>
		);
	}

	if (insights.length === 0) {
		return (
			<EmptyState>
				{t('page.dashboard.widgets.jupiter-insights.empty')}
			</EmptyState>
		);
	}

	return (
		<CarouselRoot>
			<CarouselViewport
				aria-label={t('page.dashboard.widgets.jupiter-insights.aria-label')}
				aria-live='polite'
				onTouchEnd={onTouchEnd}
				onTouchStart={onTouchStart}
				role='region'
			>
				<InsightSlide current={current} direction={direction} idx={idx} />
			</CarouselViewport>
		</CarouselRoot>
	);
};
