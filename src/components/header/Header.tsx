/* eslint-disable indent */
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Link } from '@psycron/components/link/Link';
import { Localization } from '@psycron/components/localization/Localization';
import { Text } from '@psycron/components/text/Text';
import useViewport from '@psycron/hooks/useViewport';
import { HOMEPAGE, SIGNIN, SIGNUP } from '@psycron/pages/urls';

import { Button } from '../button/Button';

import { BrandLink, BrandWrapper, HeaderWrapper } from './Header.styles';
import type { IHeaderProps } from './Header.types';

export const Header = ({ hideLinks = false }: IHeaderProps) => {
	const { t } = useTranslation();

	const location = useLocation();
	const navigate = useNavigate();

	const notShowLinks = hideLinks || location.pathname.includes('unsubscribe');
	const { isMobile } = useViewport();

	const isSignInPage = location.pathname.includes(SIGNIN);

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
		isSignInPage
			? {
					name: t('components.form.signup.title'),
					to: SIGNUP,
				}
			: {
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
						{links.map(({ to, name }, id) => {
							if (to.includes('sign')) {
								return (
									<Box key={`header-link-${name}-${id}`} pl={1}>
										<Button onClick={() => navigate(to)}>{name}</Button>
									</Box>
								);
							} else {
								return (
									<Text isFirstUpper key={`header-link-${name}-${id}`}>
										<Link to={to} isHeader>
											{name}
										</Link>
									</Text>
								);
							}
						})}
					</>
				) : null}
				<Localization />
			</Box>
		</HeaderWrapper>
	);
};
