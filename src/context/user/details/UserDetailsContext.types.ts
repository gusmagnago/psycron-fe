import type { ReactNode } from 'react';

import type { ITherapist } from '../auth/UserAuthenticationContext.types';

export interface UserDetailsContextType {
	handleClickEditSession: (userId: string, session: string) => void;
	handleClickEditUser: (path: string) => void;
	isUserDetailsVisible: boolean;
	toggleUserDetails: () => void;
	user?: ITherapist;
}

export interface UserDetailsProviderProps {
	children: ReactNode;
}
