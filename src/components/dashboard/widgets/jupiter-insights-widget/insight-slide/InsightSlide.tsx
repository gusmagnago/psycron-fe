import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

export const InsightSlide = ({
	current,
	direction,
	idx,
}: InsightSlideProps) => (
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
			{(current.actionLabel || current.secondaryActionLabel) && (
				<SlideActions>
					{current.actionLabel && current.onAction && (
						<SlidePrimaryAction
							small
							aria-label={current.actionLabel}
							onClick={() => {
								capture(PostHogEvent.JupiterInsightActionClicked, {
									insight_index: idx,
									insight_type: current.insightType,
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
			)}
		</SlideRoot>
	</AnimatePresence>
);
