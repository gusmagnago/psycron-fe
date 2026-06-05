import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import useViewport from '@psycron/hooks/useViewport';
import i18n from '@psycron/i18n';
import { LOGOUT } from '@psycron/pages/urls';

import { MenuItem } from './components/item/MenuItem';
import type { IMenuItems } from './Menu.types';

export const Menu = ({
	items,
	isFooterIcon,
	closeMenu,
	isFullList,
}: IMenuItems) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	const { isMobile, isTablet } = useViewport();

	// Strip the locale segment so the remaining path can be matched against a
	// menu item's route (e.g. "/en/action-center" -> "action-center").
	const currentPath = location.pathname.split('/').filter(Boolean).slice(1).join('/');

	const isItemActive = (path?: string) =>
		!!path &&
		path !== LOGOUT &&
		(currentPath === path || currentPath.startsWith(`${path}/`));

	const handleClick = (path?: string, onClick?: () => void) => {
		if (path?.includes(LOGOUT)) {
			logout();
			return;
		}
		// Action-only items (e.g. external help link) carry an onClick and no
		// route — run it on every viewport instead of trying to navigate.
		if (onClick && !path) {
			onClick();
			closeMenu?.();
			return;
		}
		if (onClick && !(isMobile || isTablet)) {
			onClick();
			return;
		}
		if (path) {
			navigate(`/${i18n.language}/${path}`, { replace: true });
		}
		closeMenu?.();
	};

	return (
		<>
			{items?.map(
				(
					{
						badgeCount,
						comingSoon,
						icon,
						name,
						path,
						onClick,
						component,
						disabled,
						hoverIcon,
					},
					index
				) => {
					return (
						<Box
							key={`menu-${name}-${index}`}
							onClick={() => !disabled && handleClick(path, onClick)}
						>
							{component ? (
								<Box key={`component-${name}-${index}`}>{component}</Box>
							) : (
								<>
									<MenuItem
										badgeCount={badgeCount}
										comingSoon={comingSoon}
										key={`item-${name}-${index}`}
										icon={icon}
										name={name}
										path={path}
										isActive={isItemActive(path)}
										isFooterIcon={isFooterIcon}
										isFullList={isFullList}
										disabled={disabled}
										hoverIcon={hoverIcon}
									/>
									{isFullList ? (
										<>{index < items.length - 1 && <Divider />}</>
									) : null}
								</>
							)}
						</Box>
					);
				}
			)}
		</>
	);
};
