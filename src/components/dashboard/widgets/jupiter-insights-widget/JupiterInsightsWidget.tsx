import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { Jupiter } from '@psycron/components/icons';

import { InsightSlide } from './insight-slide/InsightSlide';
import { useInsightCarousel } from './JupiterInsightsWidget.hooks';
import {
	CarouselFooter,
	CarouselRoot,
	CarouselViewport,
	Dot,
	DotsRow,
	EmptyState,
	JupiterBadgeRow,
	JupiterCategory,
	JupiterDot,
	JupiterHeader,
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

	const current = insights[idx];

	return (
		<CarouselRoot>
			<JupiterHeader>
				<Jupiter aria-hidden='true' />
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
			</JupiterHeader>

			<CarouselViewport
				aria-label={t('page.dashboard.widgets.jupiter-insights.aria-label')}
				aria-live='polite'
				onTouchEnd={onTouchEnd}
				onTouchStart={onTouchStart}
				role='region'
			>
				<InsightSlide current={current} direction={direction} idx={idx} />
			</CarouselViewport>

			<CarouselFooter>
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
			</CarouselFooter>
		</CarouselRoot>
	);
};
