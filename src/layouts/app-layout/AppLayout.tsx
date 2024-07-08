import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import { Navbar } from '@psycron/components/navbar/Navbar';
import { UserDetailsCard } from '@psycron/components/user/components/user-details-card/UserDetailsCard';
import { useUserDetails } from '@psycron/context/user/UserDetailsContext';
import useViewport from '@psycron/hooks/useViewport';

import { Content, LayoutWrapper } from './AppLayout.styles';

export const AppLayout: FC = () => {
	const { isMobile, isTablet } = useViewport();
	const { isUserDetailsVisible } = useUserDetails();

	const mockUserDetailsCardProps = {
		plan: {
			name: 'Premium',
			status: 'paid',
		},
		user: {
			contacts: {
				address: {
					address: '123 Main St, Apt 4B',
					administrativeArea: 'California',
					city: 'Los Angeles',
					country: 'USA',
					moreInfo: 'Near the big park',
					postalCode: '90001',
					route: 'Main St',
					streetNumber: '123',
					sublocality: 'Downtown',
				},
				phone: '+1 234 567 8901',
			},
			email: 'john.doe@example.com',
			firstName: 'John',
			image: 'https://via.placeholder.com/150',
			lastName: 'Doe',
			pass: 'securepassword123',
			patients: [0, 1, 2, 3, 4, 5, 6],
		},
	};

	return (
		<LayoutWrapper>
			<Box>
				<Navbar />
			</Box>
			<Box>
				<Divider
					orientation={
						isMobile || isTablet ? 'horizontal' : 'vertical'
					}
				/>
			</Box>
			<Content>
				<Outlet />
				{isUserDetailsVisible && (
					<UserDetailsCard
						plan={mockUserDetailsCardProps.plan}
						user={mockUserDetailsCardProps.user}
					/>
				)}
			</Content>
		</LayoutWrapper>
	);
};
