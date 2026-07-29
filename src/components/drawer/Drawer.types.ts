import type { ReactNode } from 'react';

export interface IDrawer {
	actions?: ReactNode;
	ariaLabel: string;
	backdropId?: string;
	backdropTestId?: string;
	children?: ReactNode;
	closeButtonId?: string;
	closeButtonTestId?: string;
	contentId?: string;
	contentTestId?: string;
	'data-testid'?: string;
	headerExtra?: ReactNode;
	id?: string;
	onClose: () => void;
	title: ReactNode;
}
