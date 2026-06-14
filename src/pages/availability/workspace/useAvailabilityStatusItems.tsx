import { useTranslation } from 'react-i18next';
import {
	CheckSuccess,
	Google,
	TriangleAlert,
} from '@psycron/components/icons';
import { useConflictCount } from '@psycron/hooks/useConflictCount';

import type { AvailabilityStatusItem } from './AvailabilityStatusStrip.types';

interface UseAvailabilityStatusItemsParams {
	// Real count of bookable slots for the viewed week. When provided, the
	// "bookable" row reflects it; otherwise it falls back to the setup state.
	availableSlots?: number;
	googleConnected: boolean;
	// Whether an availability config exists — used for the bookable row on
	// pages without per-week slot data (settings, generate).
	hasAvailability?: boolean;
}

/**
 * Single source for the availability readiness status strip, shared by the week
 * page and the settings/generate route frame. Conflicts are wired to the live
 * open-conflict count so the strip never shows stale or placeholder data.
 */
export const useAvailabilityStatusItems = ({
	availableSlots,
	googleConnected,
	hasAvailability = false,
}: UseAvailabilityStatusItemsParams): AvailabilityStatusItem[] => {
	const { t } = useTranslation();
	const { count: conflictCount } = useConflictCount();

	const hasSlotData = availableSlots !== undefined;
	const isBookable = hasSlotData ? availableSlots > 0 : hasAvailability;
	const hasConflicts = conflictCount > 0;

	const bookableItem: AvailabilityStatusItem = hasSlotData
		? {
				badge: String(availableSlots),
				description: isBookable
					? t('availability.workspace.status-bookable-ready')
					: t('availability.workspace.status-bookable-empty'),
				icon: <CheckSuccess />,
				id: 'bookable',
				title: t('availability.workspace.status-bookable-title', {
					count: availableSlots,
				}),
				tone: isBookable ? 'success' : 'warn',
			}
		: {
				badge: hasAvailability
					? t('availability.workspace.badge-on')
					: t('availability.workspace.badge-off'),
				description: hasAvailability
					? t('availability.workspace.status-setup-ready')
					: t('availability.workspace.status-setup-empty'),
				icon: <CheckSuccess />,
				id: 'bookable',
				title: t('availability.workspace.status-setup-title'),
				tone: hasAvailability ? 'success' : 'warn',
			};

	return [
		bookableItem,
		{
			badge: String(conflictCount),
			description: hasConflicts
				? t('availability.workspace.status-conflicts-attention')
				: t('availability.workspace.status-conflicts-clear'),
			icon: <TriangleAlert />,
			id: 'conflicts',
			title: t('availability.workspace.status-conflicts-title', {
				count: conflictCount,
			}),
			tone: hasConflicts ? 'warn' : 'success',
		},
		{
			badge: googleConnected
				? t('availability.workspace.badge-live')
				: t('availability.workspace.badge-off'),
			description: googleConnected
				? t('availability.workspace.status-google-connected-desc')
				: t('availability.workspace.status-google-disconnected-desc'),
			icon: <Google />,
			id: 'google',
			title: googleConnected
				? t('availability.workspace.status-google-connected')
				: t('availability.workspace.status-google-disconnected'),
			tone: 'google',
		},
	];
};
