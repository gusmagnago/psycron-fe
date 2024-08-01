import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { TextAnimated } from '@psycron/components/text/text-animated/TextAnimated';
import useViewport from '@psycron/hooks/useViewport';
import { useInView } from 'framer-motion';

import { ScrollReveal } from './scroll-reveal/ScrollReveal';
import { StyledText, ValuesSection } from './Values.styles';

export const Values = () => {
	const { t } = useTranslation();

	const textRef = useRef<HTMLSpanElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	const { isMobile } = useViewport();

	const scrollingSectionRef = useRef<HTMLDivElement | null>(null);

	const isTextInView = useInView(textRef);

	const isScrollingSectionInView = useInView(scrollingSectionRef);

	useEffect(() => {
		if (isTextInView && imgRef.current) {
			const { offsetTop, naturalHeight } = imgRef.current;
			const scrollPosition = offsetTop + naturalHeight * (isMobile ? 2.5 : 2);

			if (scrollPosition) {
				window.scrollTo({
					top: scrollPosition,
					behavior: 'smooth',
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTextInView]);

	useEffect(() => {
		if (isMobile && isScrollingSectionInView && scrollingSectionRef.current) {
			const { offsetHeight } = scrollingSectionRef.current;

			const scrollPosition = offsetHeight * 2;

			if (scrollPosition) {
				window.scrollTo({
					top: scrollPosition,
					behavior: 'smooth',
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isScrollingSectionInView]);

	return (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			position='relative'
			my={5}
		>
			<ValuesSection ref={scrollingSectionRef}>
				<ScrollReveal />
			</ValuesSection>
			<ValuesSection maxWidth={700} alignItems='center'>
				<TextAnimated
					text={t('page.landing.values.text-focus')}
					// eslint-disable-next-line react/no-children-prop
					children={(wordText) => (
						<StyledText variant='h2' ref={textRef}>
							{wordText}
						</StyledText>
					)}
				/>
				<img
					src='/images/img-hero5.png'
					alt='value-section2'
					width={300}
					ref={imgRef}
				/>
			</ValuesSection>
		</Box>
	);
};
