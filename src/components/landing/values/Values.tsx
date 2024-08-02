import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { TextAnimated } from '@psycron/components/text/text-animated/TextAnimated';

import { ScrollReveal } from './scroll-reveal/ScrollReveal';
import { StyledText, ValuesSection } from './Values.styles';

export const Values = () => {
	const { t } = useTranslation();

	return (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			position='relative'
			my={5}
		>
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
		</Box>
	);
};
