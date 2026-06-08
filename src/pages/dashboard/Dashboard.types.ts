export type DashboardTileId =
	| 'action-center'
	| 'billing-readiness'
	| 'glance'
	| 'greeting'
	| 'notifications'
	| 'pending-tasks'
	| 'quick-actions'
	| 'recent-patients'
	| 'revenue'
	| 'schedule'
	| 'session-analytics';

export type DashboardTileOrientation = 'column' | 'row';

export interface DashboardTile {
	colDelta?: number;
	heightDelta?: number;
	id: DashboardTileId;
	order: number;
	orientation?: DashboardTileOrientation;
	visible: boolean;
}

export type DashboardLayoutState = DashboardTile[];

export type TileSpan = {
	col: number;
	minCol?: number;
	minRow?: number;
	row: number;
};
