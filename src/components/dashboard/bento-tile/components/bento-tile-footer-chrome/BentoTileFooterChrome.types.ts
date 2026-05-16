import type { ReactNode } from 'react';

export interface BentoTileFooterChromeProps {
	actions?: ReactNode;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	onExpand: () => void;
	readMoreLabel: string;
}
