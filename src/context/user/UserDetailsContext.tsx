import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export interface UserBoxContextType {
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

	const toggleUserDetails = () => {
		setIsUserDetailsVisible((prev) => !prev);
	};

	return (
		<UserDetailsContext.Provider
			value={{ isUserDetailsVisible, toggleUserDetails }}
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
