import type { ReactNode } from 'react';

export interface IJupiterTip {
	actionLabel?: string;
	ariaLabel?: string;
	fullWidth?: boolean;
	onAction?: () => void;
	onDismiss?: () => void;
	text: ReactNode;
	title: string;
}
