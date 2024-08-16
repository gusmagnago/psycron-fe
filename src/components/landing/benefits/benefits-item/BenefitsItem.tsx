import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { MotionValue } from 'framer-motion';
import { motion, useScroll, useTransform } from 'framer-motion';

import {
	BenefitsItems,
	StyledAnimatedBox,
	StyledBox,
	StyledDescription,
	StyledImgWrapper,
	StyledMotionDescription,
	StyledTitle,
} from './BenefitsItem.styles';
import type { IParallaxBenefitItemProps } from './BenefitsItem.types';

export const ParallaxBenefitItem = ({
	img,
	imgAlt,
	justify,
	i18Nkey,
}: IParallaxBenefitItemProps) => {
	const { t } = useTranslation();

	const imgWrapperRef = useRef<HTMLDivElement | null>(null);
	const titleRef = useRef<HTMLDivElement | null>(null);
	const textRef = useRef<HTMLDivElement | null>(null);

	const { scrollYProgress } = useScroll({ target: imgWrapperRef });

	const useParallax = (value: MotionValue<number>, distance: number) => {
		return useTransform(value, [0, 1], [-distance, distance]);
	};

	const imgWrapperY = useParallax(scrollYProgress, 50);

	const titleY = useParallax(scrollYProgress, 30);

	const textY = useParallax(scrollYProgress, 30);

	return (
		<BenefitsItems justify={justify} id='benefits'>
			<StyledAnimatedBox ref={imgWrapperRef} style={{ y: imgWrapperY }}>
				<StyledImgWrapper>
					<img
						src={img}
						alt={imgAlt}
						width={'auto'}
						height={'100%'}
						loading='lazy'
					/>
				</StyledImgWrapper>
			</StyledAnimatedBox>
			<StyledBox justify={justify}>
				<motion.div ref={titleRef} style={{ y: titleY }}>
					<StyledTitle
						justify={justify}
						textAlign={justify.includes('end') ? 'right' : 'left'}
					>
						{t(`page.landing.benefits.${i18Nkey}.name`)}
					</StyledTitle>
				</motion.div>
				<StyledMotionDescription ref={textRef} y={textY}>
					<StyledDescription
						textAlign={justify.includes('end') ? 'right' : 'left'}
					>
						{t(`page.landing.benefits.${i18Nkey}.description`)}
					</StyledDescription>
				</StyledMotionDescription>
			</StyledBox>
		</BenefitsItems>
	);
};
