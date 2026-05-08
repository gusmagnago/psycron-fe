export type DashboardTileId =
	| 'active-patients'
	| 'jupiter-insights'
	| 'pending-tasks'
	| 'quick-actions'
	| 'recent-patients'
	| 'revenue-mtd'
	| 'schedule'
	| 'this-week'
	| 'weekly-chart';

export interface DashboardTile {
	id: DashboardTileId;
	order: number;
	visible: boolean;
}

export type DashboardLayoutState = DashboardTile[];

export interface DashboardDragState {
	draggingId: DashboardTileId | null;
	overId: DashboardTileId | null;
}
