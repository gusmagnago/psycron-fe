import type { ReactNode } from 'react';

export interface ISignLayout {
	children: ReactNode;
	isReset?: boolean;
	isSignin?: boolean;
}
