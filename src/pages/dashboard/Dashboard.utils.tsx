import type {
	DashboardActionTarget,
	DashboardQuickActionId,
} from '@psycron/api/dashboard/index.types';
import {
	AddPatient,
	AlarmClockMinus,
	Available,
	Bell,
	CalendarRange,
	Patients,
	Settings,
} from '@psycron/components/icons';
import {
	ACTIONCENTER,
	ADDPATIENT,
	AVAILABILITYRECOVERY,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK_BASE,
	AVAILABILITYWIZARD,
	CONFLICTS,
	NOTIFICATIONS,
	PATIENTS,
} from '@psycron/pages/urls';

import type { DashboardTileId, TileSpan } from './Dashboard.types';

export const TILE_DESKTOP: Record<DashboardTileId, TileSpan> = {
	'action-center': { col: 6, row: 4 },
	glance: { col: 5, minRow: 4, row: 4 },
	greeting: { col: 7, minRow: 4, row: 4 },
	'recent-patients': { col: 6, row: 2 },
	revenue: { col: 3, row: 2 },
	schedule: { col: 12, row: 4 },
	'practice-readiness': { col: 6, row: 2 },
	'session-analytics': { col: 12, row: 3 },
};

export const TILE_TABLET: Record<DashboardTileId, TileSpan> = {
	'action-center': { col: 6, row: 4 },
	glance: { col: 6, minRow: 4, row: 4 },
	greeting: { col: 6, minRow: 4, row: 4 },
	'recent-patients': { col: 3, row: 2 },
	revenue: { col: 3, row: 2 },
	schedule: { col: 6, row: 4 },
	'practice-readiness': { col: 3, row: 2 },
	'session-analytics': { col: 6, row: 2 },
};

export const MIN_TILE_ROW_SPAN = 1;
export const MAX_TILE_ROW_SPAN = 6;
export const COL_RESIZE_STEP = 3;
export const MAX_TILE_COL_SPAN = 12;
export const MAX_TILE_COL_SPAN_BY_ID: Partial<Record<DashboardTileId, number>> = {
	greeting: 7,
};
export const MAX_TILE_ROW_SPAN_BY_ID: Partial<Record<DashboardTileId, number>> = {
	greeting: 4,
};

export const TILE_MIN_HEIGHT: Record<DashboardTileId, number> = {
	'action-center': 220,
	glance: 480,
	greeting: 480,
	'recent-patients': 260,
	revenue: 220,
	schedule: 400,
	'practice-readiness': 180,
	'session-analytics': 220,
};

export const getFixedTileSpan = (id: DashboardTileId): TileSpan => TILE_DESKTOP[id];

export const getTargetNav = (
	target: DashboardActionTarget
): { state?: Record<string, unknown>; to: string } => {
	switch (target.type) {
		case 'add-patient':
			return { to: `../${ADDPATIENT}` };
		case 'action-center':
			if (target.tab === 'recovery')
				return { to: `../${AVAILABILITYRECOVERY}` };
			if (target.tab === 'conflicts') return { to: `../${CONFLICTS}` };
			return { to: `../${ACTIONCENTER}` };
		case 'availability-settings':
			return { to: `../${AVAILABILITYSETTINGS}` };
		case 'availability-week':
			return {
				to: target.date
					? `../${AVAILABILITYWEEK_BASE}/${target.date}`
					: `../${AVAILABILITYWEEK_BASE}`,
			};
		case 'availability-wizard':
			return { to: `../${AVAILABILITYWIZARD}` };
		case 'notifications':
			return { state: { status: target.status }, to: `../${NOTIFICATIONS}` };
		case 'notification-settings':
			return { state: { openSettings: true }, to: `../${NOTIFICATIONS}` };
		case 'patients':
			return { to: `../${PATIENTS}` };
	}
};

export const getQuickActionIcon = (
	id: DashboardQuickActionId
): React.ReactElement => {
	switch (id) {
		case 'add-patient':
			return <AddPatient />;
		case 'availability-settings':
			return <Available />;
		case 'fix-reminders':
			return <Bell />;
		case 'follow-up-cancellations':
			return <AlarmClockMinus />;
		case 'patients':
			return <Patients />;
		case 'setup-availability':
			return <Settings />;
		case 'view-week':
			return <CalendarRange />;
	}
};
