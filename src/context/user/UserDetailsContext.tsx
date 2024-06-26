import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserBoxContextType {
  handleClickEditUser: (path: string) => void;
  isUserDetailsVisible: boolean;
  toggleUserDetails: () => void;
}

export const UserDetailsContext = createContext<UserBoxContextType | undefined>(
	undefined
);

export const UserDetailsProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isUserDetailsVisible, setIsUserDetailsVisible] =
    useState<boolean>(false);

	const navigate = useNavigate();

	const toggleUserDetails = () => {
		setIsUserDetailsVisible((prev) => !prev);
	};

	const handleClickEditUser = (path: string) => {
		navigate(`edit-user${path}`);
		toggleUserDetails();
	};

	return (
		<UserDetailsContext.Provider
			value={{ isUserDetailsVisible, toggleUserDetails, handleClickEditUser }}
		>
			{children}
		</UserDetailsContext.Provider>
	);
};

export const useUserDetails = () => {
	const context = useContext(UserDetailsContext);
	if (!context) {
		throw new Error('useUserDetails must be used within a UserDetailsProvider');
	}
	return context;
};
