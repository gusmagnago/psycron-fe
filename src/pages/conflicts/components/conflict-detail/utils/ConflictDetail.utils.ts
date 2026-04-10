import type { IPatientDuplicateConflictMetadata } from '@psycron/api/user/conflicts/index.types';
import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export const getIncomingPatientName = (
	metadata: IPatientDuplicateConflictMetadata
) =>
	[metadata.incomingPatient?.firstName, metadata.incomingPatient?.lastName]
		.filter(Boolean)
		.join(' ')
		.trim();

export const getCandidatePatientNames = (
	metadata: IPatientDuplicateConflictMetadata
) =>
	metadata.candidatePatients
		.map((patient) => [patient.firstName, patient.lastName].filter(Boolean).join(' '))
		.filter(Boolean);

export const getConflictingDetails = (
	metadata: IPatientDuplicateConflictMetadata,
	t: (key: string) => string
) =>
	[
		metadata.contacts?.phone ? `${t('globals.phone')}: ${metadata.contacts.phone}` : null,
		metadata.contacts?.email ? `${t('globals.email')}: ${metadata.contacts.email}` : null,
	].filter(Boolean);

export const getPrimaryCandidate = (patients: IPatient[]) => patients[0] ?? null;

export const getExtraCandidates = (patients: IPatient[]) => patients.slice(1);
