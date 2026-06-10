import type { ReactNode, RefObject } from 'react';

export interface AvailabilityWorkspacePanelProps {
	ariaLabel: string;
	children: ReactNode;
	closeLabel: string;
	id: string;
	isOpen: boolean;
	onClose: () => void;
	panelRef: RefObject<HTMLElement>;
	testId: string;
	title: string;
}
