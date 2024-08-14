import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { Localization } from '@psycron/components/localization/Localization';
import { Text } from '@psycron/components/text/Text';
import useViewport from '@psycron/hooks/useViewport';
import { HOMEPAGE } from '@psycron/pages/urls';
import { scrollToSection } from '@psycron/utils/variables';

import { BrandLink, BrandWrapper, HeaderWrapper } from './Header.styles';
import type { IHeaderProps } from './Header.types';

export const Header = ({ hideLinks = false }: IHeaderProps) => {
	const { t } = useTranslation();

	const location = useLocation();

	const notShowLinks = hideLinks || location.pathname.includes('unsubscribe');
	const { isMobile } = useViewport();

	return (
		<HeaderWrapper>
			<BrandWrapper>
				<BrandLink href={HOMEPAGE}>
					{/* <Brand /> */}
					<img src='/images/og-image.png' width={'auto'} height={'100%'} />
				</BrandLink>
			</BrandWrapper>
			<Box display='flex' alignItems='center'>
				{!notShowLinks && !isMobile ? (
					<>
						<Text isFirstUpper>
							<Link to='#' isHeader onClick={() => scrollToSection('benefits')}>
								{t('components.header.benefits')}
							</Link>
						</Text>
						<Text isFirstUpper>
							<Link to='#' isHeader onClick={() => scrollToSection('join-now')}>
								{t('components.header.join')}
							</Link>
						</Text>
						<Text isFirstUpper>
							<Link to='#' isHeader onClick={() => scrollToSection('contact')}>
								{t('components.header.contact')}
							</Link>
						</Text>
					</>
				) : null}
				<Localization />
			</Box>
		</HeaderWrapper>
	);
};
