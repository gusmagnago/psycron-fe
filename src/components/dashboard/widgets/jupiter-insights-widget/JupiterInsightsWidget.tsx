import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { Jupiter } from '@psycron/components/icons';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Mic, X } from 'lucide-react';

import {
	CarouselFooter,
	CarouselNav,
	CarouselRoot,
	CarouselSlide,
	CarouselViewport,
	Dot,
	DotsRow,
	InsightActions,
	InsightText,
	JupiterBadgeRow,
	JupiterCategory,
	JupiterDot,
	JupiterHeader,
	JupiterSubtitle,
	MicButton,
	NavButton,
	PrimaryAction,
	SecondaryAction,
} from './JupiterInsightsWidget.styles';
import type { JupiterInsightsWidgetProps } from './JupiterInsightsWidget.types';

const AUTOPLAY_MS = 7_000;

const slideVariants = {
	enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
	center: { opacity: 1, x: 0 },
	exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
};

export const JupiterInsightsWidget = ({
	insights,
	isLoading,
}: JupiterInsightsWidgetProps) => {
	const { t } = useTranslation();
	const [active, setActive] = useState(0);
	const [direction, setDirection] = useState(1);
	const [dismissed, setDismissed] = useState<Set<string>>(new Set());
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const touchStartX = useRef<number>(0);

	const visible = insights.filter((ins) => !dismissed.has(ins.id));
	const total = visible.length;
	const idx = total > 0 ? active % total : 0;

	const goTo = useCallback(
		(next: number, dir: number) => {
			setDirection(dir);
			setActive(((next % total) + total) % total);
		},
		[total]
	);

	const advance = useCallback(() => goTo(idx + 1, 1), [goTo, idx]);

	useEffect(() => {
		if (total === 0) return;
		timerRef.current = setTimeout(advance, AUTOPLAY_MS);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [advance, total, idx]);

	const dismiss = useCallback((insightId: string, insightIdx: number) => {
		capture(PostHogEvent.JupiterInsightDismissed, { insight_index: insightIdx });
		setDismissed((prev) => new Set([...prev, insightId]));
		setActive(0);
	}, []);

	const onTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		const delta = e.changedTouches[0].clientX - touchStartX.current;
		if (Math.abs(delta) > 40) goTo(delta < 0 ? idx + 1 : idx - 1, delta < 0 ? 1 : -1);
	};

	if (isLoading) {
		return (
			<Box display='flex' flexDirection='column' gap={1.5}>
				<Skeleton height={20} width='50%' />
				<Skeleton height={80} variant='rectangular' sx={{ borderRadius: 2 }} />
				<Skeleton height={36} width='70%' variant='rectangular' sx={{ borderRadius: 99 }} />
			</Box>
		);
	}

	if (total === 0) {
		return (
			<Box sx={{ opacity: 0.6, textAlign: 'center', py: 3, fontSize: 14 }}>
				{t('page.dashboard.widgets.jupiter-insights.empty')}
			</Box>
		);
	}

	const current = visible[idx];

	return (
		<CarouselRoot>
			<JupiterHeader>
				<Jupiter aria-hidden='true' />
				<JupiterBadgeRow>
					<JupiterCategory>
						<JupiterDot />
						Júpiter · {current.category ?? t('page.dashboard.widgets.jupiter-insights.default-category')}
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
				<AnimatePresence custom={direction} initial={false} mode='wait'>
					<CarouselSlide
						animate='center'
						custom={direction}
						exit='exit'
						initial='enter'
						key={current.id}
						transition={{ duration: 0.28, ease: 'easeInOut' }}
						variants={slideVariants}
					>
						<InsightText>{current.text}</InsightText>
					</CarouselSlide>
				</AnimatePresence>
			</CarouselViewport>

			{(current.actionLabel || current.secondaryActionLabel) && (
				<InsightActions>
					{current.actionLabel && current.onAction && (
						<PrimaryAction
							aria-label={current.actionLabel}
							onClick={() => {
								capture(PostHogEvent.JupiterInsightActionClicked, { insight_index: idx });
								current.onAction?.();
							}}
						>
							{current.actionLabel}
							<ArrowRight size={13} />
						</PrimaryAction>
					)}
					{current.secondaryActionLabel && current.onSecondaryAction && (
						<SecondaryAction
							aria-label={current.secondaryActionLabel}
							onClick={current.onSecondaryAction}
						>
							{current.secondaryActionLabel}
						</SecondaryAction>
					)}
					<MicButton aria-label={t('page.dashboard.widgets.jupiter-insights.mic')}>
						<Mic size={14} />
					</MicButton>
				</InsightActions>
			)}

			<CarouselFooter>
				<DotsRow>
					{visible.map((ins, i) => (
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
				<CarouselNav>
					<NavButton aria-label={t('globals.previous')} onClick={() => goTo(idx - 1, -1)}>
						<ChevronLeft size={13} />
					</NavButton>
					<NavButton aria-label={t('globals.next')} onClick={() => goTo(idx + 1, 1)}>
						<ChevronRight size={13} />
					</NavButton>
					<NavButton
						aria-label={t('page.dashboard.widgets.jupiter-insights.dismiss')}
						onClick={() => dismiss(current.id, idx)}
					>
						<X size={13} />
					</NavButton>
				</CarouselNav>
			</CarouselFooter>
		</CarouselRoot>
	);
};
