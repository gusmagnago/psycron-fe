import type { ReactNode } from 'react';

import type { AvailabilityWorkspaceContentMode } from './AvailabilityWorkspaceShell.types';

export interface AvailabilityWorkspaceRouteFrameProps {
	children: ReactNode;
	contentMode?: AvailabilityWorkspaceContentMode;
	isLoading?: boolean;
	subtitle?: string;
	title: string;
}
