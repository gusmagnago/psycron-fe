import { useNavigate } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import useViewport from '@psycron/hooks/useViewport';

import { MenuItem } from './components/item/MenuItem';
import type { IMenuItems } from './Menu.types';

export const Menu = ({ items, isFooterIcon, closeMenu }: IMenuItems) => {
	const { isMobile, isTablet } = useViewport();
	const navigate = useNavigate();

	const handleClick = (path: string) => {
		navigate(path);
		closeMenu?.();
	};

	return (
		<>
			{items?.map(({ icon, name, path }, index) => (
				<Box key={index} onClick={() => handleClick(path)}>
					<MenuItem
						key={index}
						icon={icon}
						name={name}
						path={path}
						isFooterIcon={isFooterIcon}
					/>
					{isMobile || isTablet ? (
						<>{index < items.length - 1 && <Divider />}</>
					) : null}
				</Box>
			))}
		</>
	);
};
