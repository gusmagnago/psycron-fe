import type { ReactNode } from 'react';

export interface BentoTileHeaderChromeProps {
	headerActions?: ReactNode;
	icon?: ReactNode;
	infoButton?: ReactNode;
	title?: ReactNode;
	titleId?: string;
}
