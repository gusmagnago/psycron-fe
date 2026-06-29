import type { ReactNode } from 'react';

export type AvailabilityWorkspaceContentMode = 'calendar' | 'chat' | 'page';

export interface AvailabilityWorkspaceShellHandle {
	openPanel: () => void;
}

export interface AvailabilityWorkspaceShellProps {
	actions?: ReactNode;
	children: ReactNode;
	contentMode?: AvailabilityWorkspaceContentMode;
	footer?: ReactNode;
	isLoading?: boolean;
	onPanelOpenChange?: (isOpen: boolean) => void;
	panel: ReactNode;
	subtitle?: string;
	title: string;
	viewbar?: ReactNode;
}
