import type {
	IPatient,
	ISlotAddress,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

type PatientNameParts = Partial<Pick<IPatient, 'firstName' | 'lastName'>>;

export const getPatientFullName = (patient?: PatientNameParts | null): string =>
	[patient?.firstName, patient?.lastName].filter(Boolean).join(' ').trim();

export const formatPatientAddress = (
	address: ISlotAddress | null | undefined,
	fallback?: string
): string | undefined => {
	if (!address) return fallback;

	const value = [
		address.street,
		address.city,
		address.postcode,
		address.country,
	]
		.filter(Boolean)
		.join(', ');

	return value || fallback;
};
