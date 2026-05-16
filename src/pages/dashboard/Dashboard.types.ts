export type DashboardTileId =
	| 'jupiter-insights'
	| 'pending-tasks'
	| 'quick-actions'
	| 'recent-patients'
	| 'billing-readiness'
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
