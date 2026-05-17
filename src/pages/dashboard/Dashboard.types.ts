export type DashboardTileId =
	| 'billing-readiness'
	| 'jupiter-insights'
	| 'pending-tasks'
	| 'quick-actions'
	| 'recent-patients'
	| 'schedule'
	| 'session-analytics';

export type DashboardTileOrientation = 'column' | 'row';

export interface DashboardTile {
	heightDelta?: number;
	id: DashboardTileId;
	order: number;
	orientation?: DashboardTileOrientation;
	visible: boolean;
}

export type DashboardLayoutState = DashboardTile[];
