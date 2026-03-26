import type { ReactNode } from 'react';

export interface IDrawer {
	actions?: ReactNode;
	ariaLabel: string;
	children?: ReactNode;
	headerExtra?: ReactNode;
	onClose: () => void;
	title: ReactNode;
}
