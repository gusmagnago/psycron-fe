import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { useInView as RIUseInView } from 'react-intersection-observer';
import { TextAnimated } from '@psycron/components/text/text-animated/TextAnimated';

import { ScrollReveal } from './scroll-reveal/ScrollReveal';
import { StyledText, ValuesSection, ValuesWrapper } from './Values.styles';

export const Values = () => {
	const { t } = useTranslation();

	const { ref: valuesRef, inView: valuesInView } = RIUseInView({
		threshold: 0.5,
	});

	useEffect(() => {
		if (valuesInView) {
			ReactGA.event({
				category: 'Section',
				action: 'View Section',
				label: 'Values Section',
			});
		}
	}, [valuesInView]);

	return (
		<ValuesWrapper as='section' ref={valuesRef}>
			<ValuesSection>
				<ScrollReveal />
			</ValuesSection>
			<ValuesSection maxWidth={700} alignItems='center'>
				<TextAnimated
					text={t('page.landing.values.text-focus')}
					// eslint-disable-next-line react/no-children-prop
					children={(wordText) => (
						<StyledText variant='h2'>{wordText}</StyledText>
					)}
				/>
				<img
					src='/images/img-hero5.png'
					alt='3D illustration of two hands giving a high five, with one wearing a smartwatch.'
					width={300}
				/>
			</ValuesSection>
		</ValuesWrapper>
	);
};
