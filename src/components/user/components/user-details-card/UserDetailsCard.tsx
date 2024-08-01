import { useRef } from 'react';
import { useUserDetails } from '@psycron/context/user/UserDetailsContext';
import useClickOutside from '@psycron/hooks/useClickoutside';

import { UserDetails } from '../user-details/UserDetails';

import { UserDetailsCardWrapper } from './UserDetailsCard.styles';
import type { IUserDetailsCardProps } from './UserDetailsCard.types';

export const UserDetailsCard = ({ plan, user }: IUserDetailsCardProps) => {
	const userDetailsCardRef = useRef<HTMLDivElement | null>(null);
	const { toggleUserDetails, isUserDetailsVisible } = useUserDetails();

	useClickOutside(userDetailsCardRef, toggleUserDetails);

	return (
		<>
			<UserDetailsCardWrapper
				ref={userDetailsCardRef}
				isVisible={isUserDetailsVisible}
			>
				<UserDetails user={user} plan={plan} />
			</UserDetailsCardWrapper>
		</>
	);
};
