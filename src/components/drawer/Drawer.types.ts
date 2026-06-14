import type { ReactNode } from 'react';

export interface IDrawer {
	actions?: ReactNode;
	ariaLabel: string;
	children?: ReactNode;
	headerExtra?: ReactNode;
	id?: string;
	onClose: () => void;
	title: ReactNode;
}
