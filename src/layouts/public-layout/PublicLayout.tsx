import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { AnimatedBackground } from '@psycron/components/animated-background/AnimatedBackground';
import { Header } from '@psycron/components/header/Header';
import { Link } from '@psycron/components/link/Link';
import { Text } from '@psycron/components/text/Text';
import { SEOProvider } from '@psycron/context/seo/SEOContext';

import {
	FooterWrapper,
	PublicLayoutContent,
	PublicLayoutWrapper,
} from './PublicLayout.styles';

export const PublicLayout = () => {
	const { t } = useTranslation();

	const commonSEO = {
		title: t('page.landing.seo.title'),
		description: t('page.landing.seo.description'),
		canonicalUrl: window.location.href,
		ogTitle: t('page.landing.seo.ogTitle'),
		ogDescription: t('page.landing.seo.ogDescription'),
		ogUrl: window.location.href,
		ogType: 'website',
	};

	return (
		<SEOProvider seo={commonSEO}>
			<PublicLayoutWrapper>
				<Header />
				<PublicLayoutContent>
					<Outlet />
					<AnimatedBackground />
				</PublicLayoutContent>
			</PublicLayoutWrapper>
			<FooterWrapper>
				<Box>
					<Text mb={3} id='about'>
						Would you like to get in touch?
						<Link to='https://www.linkedin.com/in/gustavo-magnago/'>
							Find me here
						</Link>
					</Text>
					<Text variant='caption' mb={5}>
						Illustrations by
						<Link
							to='https://icons8.com/illustrations/author/zD2oqC8lLBBA'
							target='_blank'
							rel='noreferrer'
						>
							Icons 8
						</Link>
						from
						<Link
							to='https://icons8.com/illustrations'
							target='_blank'
							rel='noreferrer'
						>
							Ouch!
						</Link>
					</Text>
				</Box>
			</FooterWrapper>
		</SEOProvider>
	);
};
