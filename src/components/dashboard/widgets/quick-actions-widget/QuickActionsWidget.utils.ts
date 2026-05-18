import type { DashboardQuickActionId } from '@psycron/api/dashboard/index.types';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

export const getActionTone = (id: DashboardQuickActionId): DashboardAccentTone => {
	switch (id) {
	case 'add-patient':
		return 'success';
	case 'availability-settings':
		return 'brand';
	case 'fix-reminders':
		return 'warning';
	case 'follow-up-cancellations':
		return 'today';
	case 'patients':
		return 'info';
	case 'setup-availability':
		return 'brand';
	case 'view-week':
		return 'info';
	}
};
