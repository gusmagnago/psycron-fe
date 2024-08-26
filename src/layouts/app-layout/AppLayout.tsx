import type { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import { Navbar } from '@psycron/components/navbar/Navbar';
import { UserDetailsCard } from '@psycron/components/user/components/user-details-card/UserDetailsCard';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import useViewport from '@psycron/hooks/useViewport';
import { SIGNIN } from '@psycron/pages/urls';

import { Content, LayoutWrapper } from './AppLayout.styles';

export const AppLayout: FC = () => {
	const { isMobile, isTablet } = useViewport();
	const { isAuthenticated } = useAuth();

	const location = useLocation();

	const { isUserDetailsVisible, userDetails } = useUserDetails();

	const mockUserDetailsCardProps = {
		plan: {
			name: 'Premium',
			status: 'paid',
		},
	};

	if (!isAuthenticated) {
		return <Navigate to={SIGNIN} replace state={{ from: location }} />;
	}

	return (
		<LayoutWrapper>
			<Box>
				<Navbar />
			</Box>
			<Box>
				<Divider
					orientation={isMobile || isTablet ? 'horizontal' : 'vertical'}
				/>
			</Box>
			<Content>
				<Outlet />
				{isUserDetailsVisible && (
					<UserDetailsCard
						plan={mockUserDetailsCardProps.plan}
						user={userDetails}
					/>
				)}
			</Content>
		</LayoutWrapper>
	);
};
