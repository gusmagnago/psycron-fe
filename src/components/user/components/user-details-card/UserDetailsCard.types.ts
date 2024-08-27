import type { ReactNode } from 'react';
import type { ITherapist } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export interface IUserDetailsCardProps {
	plan: {
		name: string;
		status: string;
	};
	user: ITherapist;
}

export interface IUserItem {
	icon: ReactNode;
	name: string;
	value: ReactNode;
}
