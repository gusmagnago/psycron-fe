import type { ReactNode } from 'react';

export interface WidgetLayoutProps {
	actions?: ReactNode;
	body: ReactNode;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	headerActions?: ReactNode;
	icon?: ReactNode;
	title?: ReactNode;
	titleId?: string;
}
