import { Trans, useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { AnimatedBackground } from '@psycron/components/animated-background/AnimatedBackground';
import { Header } from '@psycron/components/header/Header';
import { Link } from '@psycron/components/link/Link';
import { Text } from '@psycron/components/text/Text';

import {
	FooterContent,
	FooterWrapper,
	PublicLayoutContent,
	PublicLayoutWrapper,
	StyledFooterTex,
} from './PublicLayout.styles';

export const PublicLayout = () => {
	const { t } = useTranslation();

	return (
		<>
			<PublicLayoutWrapper>
				<Header />
				<PublicLayoutContent>
					<Outlet />
				</PublicLayoutContent>
			</PublicLayoutWrapper>
			<FooterWrapper as='footer'>
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
					<Text variant='caption' display='flex'>
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
			<AnimatedBackground />
		</>
	);
};
