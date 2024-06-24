import { useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import useClickOutside from '@psycron/hooks/useClickoutside';
import useViewport from '@psycron/hooks/useViewport';

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
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { isMobile, isTablet } = useViewport();

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	useClickOutside(dropdownRef, () => setIsMenuOpen(false));

	const handleMenuClick = () => {
		setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
	};


	const menuItems = [
		{ name: 'dashboard', icon: <DashboardIcon />, path: '/dashboard' },
		{ name: 'user settings', icon: <UserSettings />, path: '/user' },
		{ name: 'patients', icon: <PatientList />, path: '/patients' },
		{ name: 'billing manager', icon: <Payment />, path: '/payments' },
		{ name: 'appointments manager', icon: <Calendar />, path: '/appointments' },
	];

	const footerItems = [
		{ name: 'change language', icon: <Language />, path: '/change-language' },
		{ name: 'help center', icon: <Help />, path: '/help-center' },
		{ name: 'logout', icon: <Logout />, path: '/logout' },
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
								/>
							</Box>
							<MobileNavbarFooter>
								<Menu
									items={footerItems}
									closeMenu={() => setIsMenuOpen(false)}
									isFooterIcon
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
