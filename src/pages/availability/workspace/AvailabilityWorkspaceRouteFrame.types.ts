import type { ReactNode } from 'react';

export interface AvailabilityWorkspaceRouteFrameProps {
	children: ReactNode;
	isLoading?: boolean;
	subtitle?: string;
	title: string;
}
