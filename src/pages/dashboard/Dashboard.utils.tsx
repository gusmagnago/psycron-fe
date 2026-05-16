import type { DashboardActionTarget, DashboardQuickActionId } from '@psycron/api/dashboard/index.types';
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
	ADDPATIENT,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK_BASE,
	AVAILABILITYWIZARD,
	NOTIFICATIONS,
	PATIENTS,
} from '@psycron/pages/urls';

import type { DashboardTileId } from './Dashboard.types';

// Desktop (12-col): each row band must sum to 12.
// Rows 1-2: schedule(5) + jupiter(7) = 12
// Rows 3-4: schedule(5) + quick-actions(4) + billing-readiness(3) = 12
// Rows 5-6: session-analytics(12) = 12
// Rows 7-8: pending-tasks(3) + recent-patients(4) = 7 (left-aligned, no forced fill)
export const TILE_DESKTOP: Record<DashboardTileId, { col: number; row: number }> = {
	'billing-readiness': { col: 3, row: 2 },
	'jupiter-insights': { col: 7, row: 2 },
	'pending-tasks': { col: 3, row: 2 },
	'quick-actions': { col: 4, row: 2 },
	'recent-patients': { col: 4, row: 2 },
	schedule: { col: 5, row: 4 },
	'session-analytics': { col: 12, row: 2 },
};

// Tablet (6-col): each row band must sum to 6.
// Row 1: schedule(6)
// Row 2: jupiter(6)
// Row 3: quick-actions(3) + billing-readiness(3) = 6
// Row 4: session-analytics(6) = 6
// Row 5: pending-tasks(3) + recent-patients(3) = 6
export const TILE_TABLET: Record<DashboardTileId, { col: number; row: number }> = {
	'billing-readiness': { col: 3, row: 2 },
	'jupiter-insights': { col: 6, row: 2 },
	'pending-tasks': { col: 3, row: 2 },
	'quick-actions': { col: 3, row: 2 },
	'recent-patients': { col: 3, row: 2 },
	schedule: { col: 6, row: 2 },
	'session-analytics': { col: 6, row: 2 },
};

export const MIN_TILE_ROW_SPAN = 1;
export const MAX_TILE_ROW_SPAN = 6;

export const TILE_MIN_HEIGHT: Record<DashboardTileId, number> = {
	'billing-readiness': 180,
	'jupiter-insights': 240,
	'pending-tasks': 200,
	'quick-actions': 260,
	'recent-patients': 260,
	schedule: 400,
	'session-analytics': 220,
};

export const getTargetNav = (
	target: DashboardActionTarget
): { state?: Record<string, unknown>; to: string } => {
	switch (target.type) {
		case 'add-patient':
			return { to: `../${ADDPATIENT}` };
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
		case 'notification-settings':
			return { state: { openSettings: true }, to: `../${NOTIFICATIONS}` };
		case 'patients':
			return { to: `../${PATIENTS}` };
	}
};

export const getQuickActionIcon = (id: DashboardQuickActionId): React.ReactElement => {
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
