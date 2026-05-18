import { formatDistanceToNow, parseISO } from 'date-fns';
import type { Variants } from 'framer-motion';
import type { TFunction } from 'i18next';

import type { RecentPatient } from './RecentPatientsWidget.types';

export const rowVariants: Variants = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.05, duration: 0.22, ease: 'easeOut' },
	}),
};

export const getActivityLabel = (patient: RecentPatient, t: TFunction): string => {
	const activity = t(
		`page.dashboard.widgets.recent-patients.activity.${patient.lastActivityType}`
	);
	if (!patient.lastActivityAt) return activity;
	return `${activity} · ${formatDistanceToNow(parseISO(patient.lastActivityAt), {
		addSuffix: true,
	})}`;
};
