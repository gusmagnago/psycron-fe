import type {
	ConflictType,
	IConflict,
	IPatientDuplicateConflictMetadata,
} from '@psycron/api/user/conflicts/index.types';
import { getPatientFullName } from '@psycron/utils/patient/patient.utils';

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

const getCandidateNames = (
	metadata: IPatientDuplicateConflictMetadata,
	t: (key: string) => string
): string => {
	const names = metadata.candidatePatients
		.map((patient) => getPatientFullName(patient))
		.filter(Boolean);

	if (!names.length) return t('conflicts.detail.not-provided');
	if (names.length === 1) return names[0];
	if (names.length === 2) {
		return `${names[0]} ${t('conflicts.patient-duplicate.and')} ${names[1]}`;
	}

	return `${names.slice(0, -1).join(', ')} ${t('conflicts.patient-duplicate.and')} ${names[names.length - 1]}`;
};

const getPatientDuplicateSummary = (
	metadata: IPatientDuplicateConflictMetadata,
	t: (key: string, params?: Record<string, string>) => string
) => {
	const phone = metadata.contacts?.phone;
	const email = metadata.contacts?.email;
	const candidates = getCandidateNames(metadata, t as (key: string) => string);

	if (phone && email) {
		return t('conflicts.patient-duplicate.summary.phone-and-email', {
			candidates,
			email,
			phone,
		});
	}

	if (phone) {
		return t('conflicts.patient-duplicate.summary.phone-only', {
			candidates,
			phone,
		});
	}

	if (email) {
		return t('conflicts.patient-duplicate.summary.email-only', {
			candidates,
			email,
		});
	}

	return t('conflicts.patient-duplicate.summary.generic', {
		candidates,
	});
};

export const getConflictDisplayCopy = (
	conflict: IConflict,
	t: (key: string, params?: Record<string, string>) => string
) => {
	if (conflict.type !== 'PATIENT_DUPLICATE') {
		return {
			description: conflict.description,
			title: conflict.title,
		};
	}

	return {
		description: getPatientDuplicateSummary(
			conflict.metadata as IPatientDuplicateConflictMetadata,
			t
		),
		title: t('conflicts.patient-duplicate.title'),
	};
};

export const getPatientDuplicateMatchLabel = (
	metadata: IPatientDuplicateConflictMetadata,
	t: (key: string, params?: Record<string, string>) => string
) => {
	const phone = metadata.contacts?.phone;
	const email = metadata.contacts?.email;

	if (phone && email) {
		return t('conflicts.patient-duplicate.match.phone-and-email', {
			email,
			phone,
		});
	}

	if (phone) {
		return t('conflicts.patient-duplicate.match.phone-only', {
			phone,
		});
	}

	if (email) {
		return t('conflicts.patient-duplicate.match.email-only', {
			email,
		});
	}

	return t('conflicts.patient-duplicate.match.generic');
};
