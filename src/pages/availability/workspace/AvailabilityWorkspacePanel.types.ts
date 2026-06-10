import type { ReactNode, RefObject } from 'react';

import type { AvailabilityWorkspacePanelSide } from './AvailabilityWorkspaceShell.types';

export interface AvailabilityWorkspacePanelProps {
	ariaLabel: string;
	children: ReactNode;
	closeLabel: string;
	id: string;
	isOpen: boolean;
	onClose: () => void;
	panelRef: RefObject<HTMLElement>;
	side: AvailabilityWorkspacePanelSide;
	subtitle?: string;
	testId: string;
	title: string;
}
