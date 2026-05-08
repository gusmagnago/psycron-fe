import type { ReactNode } from 'react';

export interface QuickAction {
	ariaLabel: string;
	badge?: number;
	icon: ReactNode;
	id: string;
	label: string;
	onClick: () => void;
}

export interface QuickActionsWidgetProps {
	actions: QuickAction[];
}
