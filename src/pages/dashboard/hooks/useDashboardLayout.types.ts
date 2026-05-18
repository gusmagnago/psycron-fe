import type {
	DashboardLayoutState,
	DashboardTileId,
	DashboardTileOrientation,
} from '../Dashboard.types';

export interface UseDashboardLayoutReturn {
	isCustomizing: boolean;
	layout: DashboardLayoutState;
	organizeLayout: () => void;
	reorderLayout: (activeId: DashboardTileId, overId: DashboardTileId) => void;
	resetLayout: () => void;
	resizeTile: (id: DashboardTileId, delta: number) => void;
	resizeTileWidth: (id: DashboardTileId, delta: number) => void;
	setCustomizing: (value: boolean) => void;
	toggleTileOrientation: (
		id: DashboardTileId,
		currentOrientation?: DashboardTileOrientation
	) => void;
	toggleVisibility: (id: DashboardTileId) => void;
}
