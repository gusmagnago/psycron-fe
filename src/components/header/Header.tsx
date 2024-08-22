import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { Localization } from '@psycron/components/localization/Localization';
import { Text } from '@psycron/components/text/Text';
import useViewport from '@psycron/hooks/useViewport';
import { HOMEPAGE, SIGNIN } from '@psycron/pages/urls';

import { BrandLink, BrandWrapper, HeaderWrapper } from './Header.styles';
import type { IHeaderProps } from './Header.types';

export const Header = ({ hideLinks = false }: IHeaderProps) => {
	const { t } = useTranslation();

	const location = useLocation();

	const notShowLinks = hideLinks || location.pathname.includes('unsubscribe');
	const { isMobile } = useViewport();

	const links = [
		{
			name: t('components.header.benefits'),
			to: '#benefits',
		},
		{
			name: t('components.header.join'),
			to: '#join-now',
		},
		{
			name: t('components.header.contact'),
			to: '#contact',
		},
		{
			name: t('components.form.signin.title'),
			to: SIGNIN,
		},
	];

	return (
		<HeaderWrapper>
			<BrandWrapper>
				<BrandLink href={HOMEPAGE} aria-label='Go to homepage'>
					<img
						src='/images/og-image.png'
						width={'auto'}
						height={'100%'}
						alt='Psycron logo'
					/>
				</BrandLink>
			</BrandWrapper>
			<Box display='flex' alignItems='center'>
				{!notShowLinks && !isMobile ? (
					<>
						{links.map(({ to, name }, id) => (
							<Text isFirstUpper key={`header-link-${name}-${id}`}>
								<Link to={to} isHeader>
									{name}
								</Link>
							</Text>
						))}
					</>
				) : null}
				<Localization />
			</Box>
		</HeaderWrapper>
	);
};
