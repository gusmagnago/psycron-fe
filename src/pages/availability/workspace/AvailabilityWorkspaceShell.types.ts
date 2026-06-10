import type { ReactNode } from 'react';

export type AvailabilityWorkspaceContentMode = 'calendar' | 'page';
export type AvailabilityWorkspacePanelSide = 'left' | 'right';

export interface AvailabilityWorkspaceShellProps {
	actions?: ReactNode;
	children: ReactNode;
	contentMode?: AvailabilityWorkspaceContentMode;
	footer?: ReactNode;
	isLoading?: boolean;
	leftPanel: ReactNode;
	rightPanel: ReactNode;
	subtitle?: string;
	title: string;
	viewbar?: ReactNode;
}
