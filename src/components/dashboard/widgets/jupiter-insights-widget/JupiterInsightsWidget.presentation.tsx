import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
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
	JupiterSubtitle,
	LoadingWrapper,
	RoundedSkeleton,
} from './JupiterInsightsWidget.styles';
import type { JupiterInsight } from './JupiterInsightsWidget.types';

interface UseJupiterInsightsPresentationInput {
	compact?: boolean;
	insights: JupiterInsight[];
	isLoading?: boolean;
}

interface JupiterInsightsPresentation {
	actions?: ReactNode;
	body: ReactNode;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	icon?: ReactNode;
	title?: ReactNode;
}

export const useJupiterInsightsPresentation = ({
	compact,
	insights,
	isLoading,
}: UseJupiterInsightsPresentationInput): JupiterInsightsPresentation => {
	const { t } = useTranslation();
	const { direction, goTo, idx, onTouchEnd, onTouchStart } = useInsightCarousel(
		insights.length
	);
	const hasInsights = !isLoading && insights.length > 0;
	const current = hasInsights ? insights[idx] : undefined;
	const icon = useMemo(
		() => (hasInsights ? <Jupiter aria-hidden='true' /> : undefined),
		[hasInsights]
	);

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
						Júpiter ·{' '}
						{current.category ??
							t('page.dashboard.widgets.jupiter-insights.default-category')}
					</JupiterCategory>
					{!compact && (
						<JupiterSubtitle>
							{t('page.dashboard.widgets.jupiter-insights.subtitle')}
						</JupiterSubtitle>
					)}
				</JupiterBadgeRow>
			) : undefined,
		[compact, current, t]
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

	const body = isLoading ? (
		<LoadingWrapper>
			<Skeleton height={20} width='50%' />
			<RoundedSkeleton height={80} variant='rectangular' />
			<RoundedSkeleton height={36} width='70%' variant='rectangular' />
		</LoadingWrapper>
	) : insights.length === 0 ? (
		<EmptyState>
			{t('page.dashboard.widgets.jupiter-insights.empty')}
		</EmptyState>
	) : (
		<CarouselRoot>
			<CarouselViewport
				aria-live='polite'
				onTouchEnd={onTouchEnd}
				onTouchStart={onTouchStart}
			>
				<InsightSlide current={current} direction={direction} idx={idx} />
			</CarouselViewport>
		</CarouselRoot>
	);

	return {
		actions,
		body,
		expandedContent,
		footer,
		icon,
		title,
	};
};
