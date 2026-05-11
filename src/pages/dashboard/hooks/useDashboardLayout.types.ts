import type {
	DashboardDragState,
	DashboardLayoutState,
	DashboardTileId,
} from '../Dashboard.types';

export interface UseDashboardLayoutReturn {
	dragState: DashboardDragState;
	isCustomizing: boolean;
	layout: DashboardLayoutState;
	onDragEnd: () => void;
	onDragOver: (overId: DashboardTileId) => void;
	onDragStart: (id: DashboardTileId) => void;
	resetLayout: () => void;
	setCustomizing: (value: boolean) => void;
	toggleVisibility: (id: DashboardTileId) => void;
}
