import type { ReactNode } from 'react';

export type QueueCardTone = 'error' | 'info' | 'neutral' | 'success' | 'warning';

export interface QueueEmptyStateProps {
	children?: ReactNode;
	message: ReactNode;
}

export interface QueueFiltersDrawerProps {
	activeFilterCount: number;
	ariaLabel: string;
	children: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	summaryActive: ReactNode;
	summaryDefault: ReactNode;
	title: ReactNode;
}

export interface QueueFiltersTriggerProps {
	activeFilterCount: number;
	controlsId: string;
	isOpen: boolean;
	onOpen: () => void;
	summaryActive: ReactNode;
	summaryDefault: ReactNode;
	title: ReactNode;
}

export interface QueueSidebarHeaderProps {
	count?: ReactNode;
	subtitle?: ReactNode;
	title: ReactNode;
}

export interface QueueStatItem {
	label: ReactNode;
	value: ReactNode;
}

export interface QueueStatsProps {
	items: QueueStatItem[];
}
