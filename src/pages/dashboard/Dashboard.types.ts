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
	heightDelta?: number;
	id: DashboardTileId;
	order: number;
	visible: boolean;
}

export type DashboardLayoutState = DashboardTile[];
