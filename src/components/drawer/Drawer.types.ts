import type { ReactNode } from 'react';

export interface IDrawer {
	ariaLabel: string;
	children: ReactNode;
	onClose: () => void;
}
