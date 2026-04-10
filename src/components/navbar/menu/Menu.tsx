import { useNavigate } from 'react-router-dom';
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
	const { logout } = useAuth();

	const { isMobile, isTablet } = useViewport();

	const handleClick = (path?: string, onClick?: () => void) => {
		if (path?.includes(LOGOUT)) {
			logout();
		} else {
			if (onClick && !(isMobile || isTablet)) {
				onClick();
			} else {
				if (path) {
					navigate(`/${i18n.language}/${path}`, { replace: true });
				}
				closeMenu?.();
			}
		}
	};

	return (
		<>
			{items?.map(
				(
					{
						badgeCount,
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
										key={`item-${name}-${index}`}
										icon={icon}
										name={name}
										path={path}
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
