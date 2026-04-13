import type {
	IPatientDuplicateConflictMetadata,
	PatientMergeField,
} from '@psycron/api/user/conflicts/index.types';
import type { IPatient } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export const PATIENT_DUPLICATE_MERGE_FIELDS = [
	'firstName',
	'lastName',
	'contacts.email',
	'contacts.phone',
	'contacts.whatsapp',
	'preferredContact',
	'timeZone',
	'address',
] as const satisfies PatientMergeField[];

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

export const getPatientName = (patient?: IPatient | null): string =>
	[patient?.firstName, patient?.lastName].filter(Boolean).join(' ');

const formatAddress = (patient?: IPatient | null): string | undefined => {
	const address = patient?.address;
	if (!address) return undefined;

	return [address.street, address.city, address.postcode, address.country]
		.filter(Boolean)
		.join(', ');
};

const formatPreferredContact = (
	patient?: IPatient | null
): string | undefined => {
	const preferredContact = patient?.preferredContact;
	if (!preferredContact?.type) return undefined;

	return [preferredContact.type, preferredContact.value].filter(Boolean).join(': ');
};

export const getPatientMergeFieldValue = (
	field: PatientMergeField,
	patient?: IPatient | null
): string | undefined => {
	switch (field) {
		case 'address':
			return formatAddress(patient);
		case 'contacts.email':
			return patient?.contacts?.email;
		case 'contacts.phone':
			return patient?.contacts?.phone;
		case 'contacts.whatsapp':
			return patient?.contacts?.whatsapp;
		case 'firstName':
			return patient?.firstName;
		case 'lastName':
			return patient?.lastName;
		case 'preferredContact':
			return formatPreferredContact(patient);
		case 'timeZone':
			return patient?.timeZone;
		default:
			return undefined;
	}
};
