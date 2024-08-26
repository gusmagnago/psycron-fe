import type { ReactElement, ReactNode } from 'react';

export interface IMenuItem {
	closeMenu?: () => void;
	component?: ReactNode;
	icon: ReactElement;
	isFooterIcon?: boolean;
	isFullList?: boolean;
	name: string;
	onClick?: () => void;
	path?: string;
}
