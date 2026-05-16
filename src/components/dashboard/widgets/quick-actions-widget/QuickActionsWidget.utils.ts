import type { DashboardQuickActionId } from '@psycron/api/dashboard/index.types';
import { palette } from '@psycron/theme/palette/palette.theme';

import type { ActionAccent } from './QuickActionsWidget.types';

export const getActionAccent = (id: DashboardQuickActionId): ActionAccent => {
	switch (id) {
		case 'add-patient':
			return { bg: palette.success.surface.light, fg: palette.success.dark };
		case 'availability-settings':
			return { bg: palette.tertiary.surface.light, fg: palette.tertiary.dark };
		case 'fix-reminders':
			return { bg: palette.alert.surface.light, fg: palette.alert.dark };
		case 'follow-up-cancellations':
			return { bg: palette.info.surface.light, fg: palette.info.dark };
		case 'patients':
			return { bg: palette.secondary.surface.light, fg: palette.secondary.dark };
		case 'setup-availability':
			return { bg: palette.tertiary.surface.light, fg: palette.tertiary.dark };
		case 'view-week':
			return { bg: palette.primary.surface.light, fg: palette.primary.dark };
	}
};
