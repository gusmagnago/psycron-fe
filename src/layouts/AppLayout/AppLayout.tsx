import { Box, Divider } from '@mui/material';
import { Navbar } from '@psycron/components/navbar/Navbar';
import useViewport from '@psycron/hooks/useViewport';

import { Content, LayoutWraper } from './AppLayout.styles';
import type { IAppLayout } from './AppLayout.types';

export const AppLayout = ({ children }: IAppLayout) => {
	const { isMobile, isTablet } = useViewport();

	return (
		<>
			<LayoutWraper>
				<Box>
					<Navbar />
				</Box>
				<Box>
					<Divider
						orientation={isMobile || isTablet ? 'horizontal' : 'vertical'}
					/>
				</Box>
				<Box height={'100%'} width={'100%'}>
					<Content>{children}</Content>
				</Box>
			</LayoutWraper>
		</>
	);
};
