import { useTranslation } from 'react-i18next';
import { TextAnimated } from '@psycron/components/text/text-animated/TextAnimated';

import { ScrollReveal } from './scroll-reveal/ScrollReveal';
import { StyledText, ValuesSection, ValuesWrapper } from './Values.styles';

export const Values = () => {
	const { t } = useTranslation();

	return (
		<ValuesWrapper>
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
				<img src='/images/img-hero5.png' alt='value-section2' width={300} />
			</ValuesSection>
		</ValuesWrapper>
	);
};
