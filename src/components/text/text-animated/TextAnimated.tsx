import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

import { StyledMotionDiv, StyledMotionSpan } from './TextAnimated.styles';
import type { ITextAnimated } from './TextAnimated.types';

export const TextAnimated = ({ text, children }: ITextAnimated) => {
	const textRef = useRef<HTMLDivElement | null>(null);
	const controls = useAnimation();
	const isInView = useInView(textRef);

	useEffect(() => {
		if (isInView) {
			controls.start('visible');
		} else {
			controls.start('hidden');
		}
	}, [isInView, controls]);

	const sentence = {
		hidden: { opacity: 1 },
		visible: {
			opacity: 1,
			transition: {
				delay: 0.5,
				staggerChildren: 0.08,
			},
		},
	};

	const word = {
		hidden: { opacity: 0, y: '100%' },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				ease: 'easeOut',
				duration: 0.5,
			},
		},
	};

	return (
		<StyledMotionDiv
			ref={textRef}
			initial='hidden'
			animate={controls}
			variants={sentence}
		>
			{text.split(' ').map((wordText, index) => (
				<StyledMotionSpan key={index} variants={word}>
					{children(wordText)}
				</StyledMotionSpan>
			))}
		</StyledMotionDiv>
	);
};
