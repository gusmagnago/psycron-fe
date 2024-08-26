import type { ReactNode } from 'react';

import type { ITherapist } from '../auth/UserAuthenticationContext.types';

export interface UserDetailsContextType {
	handleClickEditUser: (path: string) => void;
	isUserDetailsVisible: boolean;
	toggleUserDetails: () => void;
	user?: ITherapist;
}

export interface UserDetailsProviderProps {
	children: ReactNode;
}
