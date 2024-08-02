import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

import { H1, H6, H6Wrapper, Heading, HeroWrapper, Image } from './Hero.styles';
import type { IHero } from './Hero.types';

export const Hero = ({ headingText, imgSrc, helperText, c2Action }: IHero) => {
	const headingRef = useRef<HTMLDivElement | null>(null);

	const isInView = useInView(headingRef);

	const controls = useAnimation();

	useEffect(() => {
		if (isInView) {
			controls.start('visible');
		} else {
			controls.start('hidden');
		}
	}, [isInView, controls]);

	const inital = { opacity: 0, scale: 0.5 };

	const variants = {
		hidden: { opacity: 0, scale: 0.5 },
		visible: { opacity: 1, scale: 1 },
	};

	const transition = {
		duration: 0.3,
		ease: [0, 0.71, 0.2, 1.01],
		scale: {
			type: 'spring',
			damping: 5,
			stiffness: 100,
			restDelta: 0.001,
		},
	};

	return (
		<HeroWrapper>
			<Heading ref={headingRef}>
				<motion.div
					initial={inital}
					animate={controls}
					variants={variants}
					transition={transition}
				>
					<H1 variant='h1'>{headingText}</H1>
				</motion.div>
				<motion.div
					initial={inital}
					animate={controls}
					variants={variants}
					transition={transition}
				>
					<Image src={imgSrc} alt='hero-image' loading='lazy' />
				</motion.div>
			</Heading>
			<H6Wrapper>
				<H6 variant='h6'>{helperText}</H6>
			</H6Wrapper>
			{c2Action}
		</HeroWrapper>
	);
};
