import { Box, Typography } from '@mui/material';
import useViewport from '@psycron/hooks/useViewport';

import { MobileMenuItem, StyledMenuItem } from './MenuItem.styles';
import type { IMenuItem } from './MenuItem.types';

export const MenuItem = ({ icon, name, isFooterIcon }: IMenuItem) => {
	const { isMobile, isTablet } = useViewport();

	return (
		<>
			{isMobile || isTablet ? (
				<MobileMenuItem  p={isFooterIcon ? 1 : 4}>
					<Box>{icon}</Box>
					<Box px={isFooterIcon ? 1 : 3}>
						<Typography variant='subtitle1' textTransform='capitalize'>
							{name}
						</Typography>
					</Box>
				</MobileMenuItem>
			) : (
				<StyledMenuItem
					title={name}
					placement='right'
					isFooterIcon={isFooterIcon}
				>
					{icon}
				</StyledMenuItem>
			)}
		</>
	);
};
