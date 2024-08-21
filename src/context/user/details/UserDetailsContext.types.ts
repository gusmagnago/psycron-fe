import type { ITherapist } from '../auth/UserAuthenticationContext.types';

export interface UserBoxContextType {
	handleClickEditUser: (path: string) => void;
	isUserDetailsVisible: boolean;
	toggleUserDetails: () => void;
	user?: ITherapist;
}
