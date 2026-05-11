import type { DashboardLayoutState, DashboardTileId } from '../Dashboard.types';

export interface UseDashboardLayoutReturn {
	isCustomizing: boolean;
	layout: DashboardLayoutState;
	reorderLayout: (activeId: DashboardTileId, overId: DashboardTileId) => void;
	resetLayout: () => void;
	setCustomizing: (value: boolean) => void;
	toggleVisibility: (id: DashboardTileId) => void;
}
