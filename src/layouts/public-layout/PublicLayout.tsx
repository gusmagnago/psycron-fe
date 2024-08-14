import { Trans, useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { AnimatedBackground } from '@psycron/components/animated-background/AnimatedBackground';
import { Header } from '@psycron/components/header/Header';
import { Link } from '@psycron/components/link/Link';
import { Text } from '@psycron/components/text/Text';
import { SEOProvider } from '@psycron/context/seo/SEOContext';

import {
	FooterContent,
	FooterWrapper,
	PublicLayoutContent,
	PublicLayoutWrapper,
	StyledFooterTex,
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
				<FooterContent>
					<StyledFooterTex id='contact'>
						<Trans
							i18nKey={t('components.footer.contact')}
							components={{
								a: (
									<Link to='mailto:contact@psycron.app'>
										{t('components.footer.find-me')}
									</Link>
								),
							}}
						/>
					</StyledFooterTex>
					<Text variant='caption' mb={5} display='flex'>
						<Trans
							i18nKey={t('components.footer.credit.illustration')}
							components={{
								owner: (
									<Link to='https://icons8.com/illustrations/author/zD2oqC8lLBBA'>
										Icons 8
									</Link>
								),
								page: <Link to='https://icons8.com/illustrations'>Ouch!</Link>,
							}}
						/>
					</Text>
				</FooterContent>
			</FooterWrapper>
		</SEOProvider>
	);
};
