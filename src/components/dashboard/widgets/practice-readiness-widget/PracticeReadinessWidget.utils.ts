import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

import type {
	ReadinessSegmentId,
	ReadinessStatus,
} from './PracticeReadinessWidget.types';

// Contacts-first weighting: contact details and availability unlock reminders
// and online booking, so they count for more than billing readiness.
export const READINESS_WEIGHTS: Record<ReadinessSegmentId, number> = {
	availability: 0.35,
	billing: 0.25,
	contacts: 0.4,
};

// Priority order used to pick the single next action (contacts first).
export const READINESS_PRIORITY: ReadinessSegmentId[] = [
	'contacts',
	'availability',
	'billing',
];

export const getWeightedReadiness = (
	percentages: Record<ReadinessSegmentId, number>
): number =>
	Math.round(
		READINESS_PRIORITY.reduce(
			(sum, id) => sum + percentages[id] * READINESS_WEIGHTS[id],
			0
		)
	);

export const getReadinessStatus = (overall: number): ReadinessStatus => {
	if (overall >= 100) return 'ready';
	if (overall > 0) return 'partial';
	return 'empty';
};

export const getPrimarySegment = (
	percentages: Record<ReadinessSegmentId, number>
): ReadinessSegmentId | null => {
	const incomplete = READINESS_PRIORITY.filter((id) => percentages[id] < 100);
	if (incomplete.length === 0) return null;
	// Among the incomplete segments, the highest-weighted one wins.
	return incomplete.reduce((best, id) =>
		READINESS_WEIGHTS[id] > READINESS_WEIGHTS[best] ? id : best
	);
};

export const getSegmentTone = (percentage: number): DashboardAccentTone => {
	if (percentage >= 100) return 'success';
	if (percentage > 0) return 'warning';
	return 'danger';
};
