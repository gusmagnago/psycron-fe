import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '@psycron/api/user';
import { EDITUSERPATH } from '@psycron/pages/urls';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../auth/UserAuthenticationContext';
import type { ITherapist } from '../auth/UserAuthenticationContext.types';

import type {
	UserDetailsContextType,
	UserDetailsProviderProps,
} from './UserDetailsContext.types';

export const UserDetailsContext = createContext<
	UserDetailsContextType | undefined
>(undefined);

export const UserDetailsProvider = ({ children }: UserDetailsProviderProps) => {
	const [isUserDetailsVisible, setIsUserDetailsVisible] =
		useState<boolean>(false);

	const navigate = useNavigate();

	const { user } = useAuth();

	const toggleUserDetails = () => {
		setIsUserDetailsVisible((prev) => !prev);
	};

	const handleClickEditUser = (id: string) => {
		navigate(`${EDITUSERPATH}/${id}`);
		toggleUserDetails();
	};

	const handleClickEditSession = (userId: string, session: string) => {
		navigate(`${EDITUSERPATH}/${userId}/${session}`);
		toggleUserDetails();
	};

	return (
		<UserDetailsContext.Provider
			value={{
				isUserDetailsVisible,
				toggleUserDetails,
				handleClickEditUser,
				handleClickEditSession,
				user,
			}}
		>
			{children}
		</UserDetailsContext.Provider>
	);
};

export const useUserDetails = (passedUserId?: string) => {
	const context = useContext(UserDetailsContext);
	if (!context) {
		throw new Error('useUserDetails must be used within a UserDetailsProvider');
	}

	const { user } = context;
	const userId = passedUserId || user?._id;

	const {
		data: userDetails,
		isLoading: isUserDetailsLoading,
		isSuccess: isUserDetailsSucces,
	} = useQuery<ITherapist>({
		queryKey: ['userDetails', userId],
		queryFn: () => getUserById(userId),
		enabled: !!userId,
	});

	return {
		...context,
		userDetails,
		isUserDetailsLoading,
		isUserDetailsSucces,
	};
};
