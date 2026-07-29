import type { ReactNode } from 'react';
import type { To } from 'react-router-dom';

export interface IPageLayout {
	actions?: ReactNode;
	backButton?: boolean;
	backTo?: To;
	children: ReactNode;
	idPrefix?: string;
	isLoading?: boolean;
	link?: string;
	linkName?: string;
	subTitle?: string;
	title?: string;
}
