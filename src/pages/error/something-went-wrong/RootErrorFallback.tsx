import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ChevronLeft } from '@psycron/components/icons/chevron/ChevronLeft';
import { Text } from '@psycron/components/text/Text';

import {
	BackHomeLink,
	ContentBox,
	ContentWrapper,
	ImgWrapper,
	StyledFstImage,
	StyledPageSub,
	StyledPageTitle,
	StyledSecondImage,
	TextWrapper,
} from './RootErrorFallback.styles';

export const RootErrorFallback = () => {
	const { t } = useTranslation();

	useEffect(() => {
		const previousPath = document.referrer;
		const currentPath = location.pathname;

		ReactGA.event({
			category: 'Navigation',
			action: 'Page Not Found',
			label: `From: ${previousPath} to: ${currentPath}`,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<Box height={'100%'}>
			<ContentBox>
				<ContentWrapper>
					<ImgWrapper>
						<StyledFstImage src='/images/error/error-char1.png' />
						<StyledSecondImage src='/images/error/error-cat2.png' />
					</ImgWrapper>
					<TextWrapper>
						<StyledPageTitle as='h1'>
							{t('page.not-found.title')}
						</StyledPageTitle>
						<StyledPageSub as='h5'>
							{t('page.not-found.sub-title')}
						</StyledPageSub>
						<Text variant='subtitle2'> {t('page.not-found.note')}</Text>
						<Box pt={10}>
							<BackHomeLink href='/'>
								<ChevronLeft />
								{t('components.link.navigate.back')}
							</BackHomeLink>
						</Box>
					</TextWrapper>
				</ContentWrapper>
			</ContentBox>
		</Box>
	);
};
