import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

import type { PendingTaskType } from './PendingTasksWidget.types';

export const getPendingTaskTone = (
	type: PendingTaskType
): DashboardAccentTone => {
	switch (type) {
		case 'cancellation-followups':
			return 'today';
		case 'missing-billing':
			return 'warning';
		case 'missing-contact':
			return 'info';
		case 'reminder-delivery':
			return 'danger';
		case 'setup-availability':
			return 'brand';
	}
};
