import { useRef, useState } from 'react';
import { IconButton } from '@mui/material';
import useClickOutside from '@psycron/hooks/useClickoutside';
import useViewport from '@psycron/hooks/useViewport';

import { Menu as MenuIcon } from '../icons';
import { LogoColor } from '../icons/brand/LogoColor';

import { Menu } from './menu/Menu';
import {
	ColoredLogo,
	DesktopkMenuWrapper,
	FloatingMobileNavbar,
	MobileMenuWrapper,
	MobileNavbarFooter,
	MobileNavbarMenu,
	MobileNavbarWrapper,
	NavbarFooterIcons,
	NavbarWrapper,
} from './Navbar.styles';
import type { NavbarProps } from './Navbar.types';

export const Navbar = ({ items, footerItems }: NavbarProps) => {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { isMobile, isTablet } = useViewport();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	useClickOutside(dropdownRef, () => setIsMenuOpen(false));

	const handleMenuClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
	};

	return (
		<>
			{isMobile || isTablet ? (
				<>
					<MobileNavbarWrapper
						data-testid='app-navbar-mobile'
						id='app-navbar-mobile'
					>
						<ColoredLogo
							data-testid='app-navbar-logo'
							id='app-navbar-logo'
						>
							<LogoColor />
						</ColoredLogo>
						<MobileNavbarMenu
							data-testid='app-navbar-mobile-menu-toggle'
							id='app-navbar-mobile-menu-toggle'
						>
							<IconButton onMouseDown={handleMenuClick}>
								<MenuIcon />
							</IconButton>
						</MobileNavbarMenu>
					</MobileNavbarWrapper>
					{isMenuOpen && (
						<FloatingMobileNavbar
							data-testid='app-navbar-mobile-dropdown'
							id='app-navbar-mobile-dropdown'
							ref={dropdownRef}
						>
							<MobileMenuWrapper
								data-testid='app-navbar-mobile-menu-list'
								id='app-navbar-mobile-menu-list'
							>
								<Menu
									items={items}
									closeMenu={() => setIsMenuOpen(false)}
									isFullList
								/>
							</MobileMenuWrapper>
							<MobileNavbarFooter
								data-testid='app-navbar-mobile-footer'
								id='app-navbar-mobile-footer'
							>
								<Menu
									items={footerItems}
									closeMenu={() => setIsMenuOpen(false)}
									isFooterIcon
									isFullList
								/>
							</MobileNavbarFooter>
						</FloatingMobileNavbar>
					)}
				</>
			) : (
				<NavbarWrapper
					data-testid='app-navbar-rail'
					id='app-navbar-rail'
				>
					<ColoredLogo
						data-testid='app-navbar-logo'
						id='app-navbar-logo'
					>
						<LogoColor />
					</ColoredLogo>
					<DesktopkMenuWrapper
						data-testid='app-navbar-menu'
						id='app-navbar-menu'
					>
						<Menu items={items} />
					</DesktopkMenuWrapper>
					<NavbarFooterIcons
						data-testid='app-navbar-footer-icons'
						id='app-navbar-footer-icons'
					>
						<Menu items={footerItems} isFooterIcon />
					</NavbarFooterIcons>
				</NavbarWrapper>
			)}
		</>
	);
};
