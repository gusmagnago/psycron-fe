export type DashboardTileId =
	| 'billing-readiness'
	| 'jupiter-insights'
	| 'pending-tasks'
	| 'quick-actions'
	| 'recent-patients'
	| 'schedule'
	| 'session-analytics';

export interface DashboardTile {
	heightDelta?: number;
	id: DashboardTileId;
	order: number;
	visible: boolean;
}

export type DashboardLayoutState = DashboardTile[];
