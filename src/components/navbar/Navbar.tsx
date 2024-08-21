import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton } from '@mui/material';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import useClickOutside from '@psycron/hooks/useClickoutside';
import useViewport from '@psycron/hooks/useViewport';
import { LOGOUT } from '@psycron/pages/urls';

import {
	Calendar,
	DashboardIcon,
	Help,
	Language,
	Logout,
	Menu as MenuIcon,
	PatientList,
	Payment,
	UserSettings,
} from '../icons';
import { LogoColor } from '../icons/brand/LogoColor';

import { Menu } from './menu/Menu';
import {
	ColoredLogo,
	FloatingMobileNavbar,
	MobileNavbarFooter,
	MobileNavbarMenu,
	MobileNavbarWrapper,
	NavbarFooterIcons,
	NavbarWrapper,
} from './Navbar.styles';

export const Navbar = () => {
	const { t } = useTranslation();

	const dropdownRef = useRef<HTMLDivElement>(null);
	const { isMobile, isTablet } = useViewport();

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const { toggleUserDetails } = useUserDetails();

	useClickOutside(dropdownRef, () => setIsMenuOpen(false));

	const handleMenuClick = () => {
		setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
	};

	const menuItems = [
		{
			name: t('components.navbar.dashboard'),
			icon: <DashboardIcon />,
			path: '/dashboard',
		},
		{
			name: t('components.navbar.user-settings'),
			icon: <UserSettings />,
			path: '/user',
			onClick: toggleUserDetails,
		},
		{
			name: t('globals.patients'),
			icon: <PatientList />,
			path: '/patients',
		},
		{
			name: t('globals.billing-manager'),
			icon: <Payment />,
			path: '/payments',
		},
		{
			name: t('globals.appointments-manager'),
			icon: <Calendar />,
			path: '/appointments',
		},
	];

	const footerItems = [
		{
			name: t('globals.change-language'),
			icon: <Language />,
			path: '/change-language',
		},
		{ name: t('globals.help'), icon: <Help />, path: '/help-center' },
		{ name: t('globals.logout'), icon: <Logout />, path: LOGOUT },
	];

	return (
		<>
			{isMobile || isTablet ? (
				<>
					<MobileNavbarWrapper>
						<ColoredLogo>
							<LogoColor />
						</ColoredLogo>
						<MobileNavbarMenu>
							<IconButton onClick={handleMenuClick}>
								<MenuIcon />
							</IconButton>
						</MobileNavbarMenu>
					</MobileNavbarWrapper>
					{isMenuOpen ? (
						<FloatingMobileNavbar ref={dropdownRef}>
							<Box>
								<Menu
									items={menuItems}
									closeMenu={() => setIsMenuOpen(false)}
									isFullList
								/>
							</Box>
							<MobileNavbarFooter>
								<Menu
									items={footerItems}
									closeMenu={() => setIsMenuOpen(false)}
									isFooterIcon
									isFullList
								/>
							</MobileNavbarFooter>
						</FloatingMobileNavbar>
					) : null}
				</>
			) : (
				<NavbarWrapper>
					<ColoredLogo>
						<LogoColor />
					</ColoredLogo>
					<Box>
						<Menu items={menuItems} isFooterIcon />
					</Box>
					<NavbarFooterIcons>
						<Menu items={footerItems} />
					</NavbarFooterIcons>
				</NavbarWrapper>
			)}
		</>
	);
};
