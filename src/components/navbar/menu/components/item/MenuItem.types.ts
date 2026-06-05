import type { ReactNode } from 'react';

export interface IMenuItem {
	badgeCount?: number;
	closeMenu?: () => void;
	comingSoon?: boolean;
	component?: ReactNode;
	disabled?: boolean;
	hoverIcon?: ReactNode;
	icon?: ReactNode;
	isActive?: boolean;
	isFooterIcon?: boolean;
	isFullList?: boolean;
	name: string;
	onClick?: () => void;
	path?: string;
}
