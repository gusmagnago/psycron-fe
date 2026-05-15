import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import type { JupiterInsight } from '../JupiterInsightsWidget.types';

import {
	SlideActions,
	SlidePrimaryAction,
	SlideRoot,
	SlideSecondaryAction,
	SlideText,
} from './InsightSlide.styles';
import type { InsightSlideProps } from './InsightSlide.types';

const slideVariants = {
	center: { opacity: 1, x: 0 },
	enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
	exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
};

interface InsightActionsProps {
	current: JupiterInsight;
	idx: number;
}

export const InsightActions = ({ current, idx }: InsightActionsProps) =>
	current.actionLabel || current.secondaryActionLabel ? (
		<SlideActions>
			{current.actionLabel && current.onAction && (
				<SlidePrimaryAction
					small
					aria-label={current.actionLabel}
					onClick={() => {
						capture(PostHogEvent.JupiterInsightActionClicked, {
							action_target: current.actionTarget,
							insight_index: idx,
							insight_type: current.insightType,
							source: current.source,
						});
						current.onAction?.();
					}}
					tertiary
					variant='contained'
				>
					{current.actionLabel}
					<ArrowRight size={13} />
				</SlidePrimaryAction>
			)}
			{current.secondaryActionLabel && current.onSecondaryAction && (
				<SlideSecondaryAction
					small
					aria-label={current.secondaryActionLabel}
					onClick={current.onSecondaryAction}
				>
					{current.secondaryActionLabel}
				</SlideSecondaryAction>
			)}
		</SlideActions>
	) : null;

export const InsightSlide = ({ current, direction }: InsightSlideProps) => (
	<AnimatePresence custom={direction} initial={false} mode='wait'>
		<SlideRoot
			animate='center'
			custom={direction}
			exit='exit'
			initial='enter'
			key={current.id}
			transition={{ duration: 0.28, ease: 'easeInOut' }}
			variants={slideVariants}
		>
			<SlideText>{current.text}</SlideText>
		</SlideRoot>
	</AnimatePresence>
);
