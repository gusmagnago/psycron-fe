import type { ConflictType } from '@psycron/api/user/conflicts/index.types';

export const getConflictTypeLabel = (
	type: ConflictType,
	t: (key: string) => string
) =>
	type === 'PATIENT_DUPLICATE'
		? t('conflicts.types.patient-duplicate')
		: t('conflicts.types.slot-replication');

export const getConflictStatusLabel = (
	status: 'OPEN' | 'RESOLVED' | 'DISMISSED',
	t: (key: string) => string
) => {
	if (status === 'RESOLVED') return t('conflicts.status.resolved');
	if (status === 'DISMISSED') return t('conflicts.status.dismissed');

	return t('conflicts.status.open');
};
