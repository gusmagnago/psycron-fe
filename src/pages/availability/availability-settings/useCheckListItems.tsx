import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';

import type { ChecklistItem, DrawerKey } from './AvailabilitySettings.types';

export const useChecklistItems = (
	availability: IAvailabilityRecord,
	openDrawer: (key: DrawerKey) => void
): ChecklistItem[] => {
	const { t } = useTranslation();

	return useMemo(
		() => [
			{
				descKey: 'jupiter.post-publish.checklist-working-hours-desc',
				id: 'working-hours',
				isConfigured:
					availability.workingDays.length > 0 && !!availability.timeRange,
				isDisabled: false,
				isRecommended: false,
				titleKey: 'jupiter.post-publish.checklist-working-hours',
			},
			{
				descKey: 'jupiter.post-publish.checklist-session-type-desc',
				id: 'session-type',
				isConfigured: !!availability.sessionType,
				isDisabled: false,
				isRecommended: false,
				titleKey: 'jupiter.post-publish.checklist-session-type',
			},
			{
				descKey: 'jupiter.post-publish.checklist-duration-desc',
				id: 'session-duration',
				isConfigured: !!availability.sessionDuration,
				isDisabled: false,
				isRecommended: false,
				titleKey: 'jupiter.post-publish.checklist-duration',
			},
			{
				descKey: 'jupiter.post-publish.checklist-timezone-desc',
				id: 'timezone',
				isConfigured: !!availability.timezone,
				isDisabled: false,
				isRecommended: false,
				titleKey: 'jupiter.post-publish.checklist-timezone',
			},
			{
				descKey: 'jupiter.post-publish.checklist-buffer-desc',
				id: 'buffer-time',
				isConfigured:
					availability.bufferTimeMinutes != null &&
					availability.bufferTimeMinutes > 0,
				isDisabled: false,
				isRecommended: true,
				onConfigure: () => openDrawer('buffer-time'),
				titleKey: 'jupiter.post-publish.checklist-buffer',
			},
			{
				descKey: 'jupiter.post-publish.checklist-cancel-desc',
				id: 'cancellation-policy',
				isConfigured: false,
				isDisabled: true,
				isRecommended: false,
				titleKey: 'jupiter.post-publish.checklist-cancel-policy',
			},
			{
				descKey: 'jupiter.post-publish.checklist-calendar-desc',
				id: 'google-calendar',
				isConfigured: !!availability.googleCalendarConnected,
				isDisabled: true,
				isRecommended: false,
				titleKey: 'jupiter.post-publish.checklist-calendar-sync',
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			availability.workingDays.length,
			availability.timeRange,
			availability.sessionType,
			availability.sessionDuration,
			availability.timezone,
			availability.bufferTimeMinutes,
			availability.googleCalendarConnected,
			openDrawer,
			t,
		]
	);
};
