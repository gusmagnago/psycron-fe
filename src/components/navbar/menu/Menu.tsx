import { useNavigate } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import useViewport from '@psycron/hooks/useViewport';

import { MenuItem } from './components/item/MenuItem';
import type { IMenuItems } from './Menu.types';

export const Menu = ({
	items,
	isFooterIcon,
	closeMenu,
	isFullList,
}: IMenuItems) => {
	const navigate = useNavigate();

	const { isMobile, isTablet } = useViewport();

	const handleClick = (path: string, onClick?: () => void) => {
		if (onClick && !(isMobile || isTablet)) {
			onClick();
		} else {
			navigate(path);
			closeMenu?.();
		}
	};

	return (
		<>
			{items?.map(({ icon, name, path, onClick }, index) => (
				<Box key={index} onClick={() => handleClick(path, onClick)}>
					<MenuItem
						key={index}
						icon={icon}
						name={name}
						path={path}
						isFooterIcon={isFooterIcon}
						isFullList={isFullList}
					/>
					{isFullList ? <>{index < items.length - 1 && <Divider />}</> : null}
				</Box>
			))}
		</>
	);
};
