import type {
	IPatient,
	IPatientBilling,
	IPreferredContact,
	ISlotAddress,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type {
	PatientEditFormValues,
	PatientEditPayload,
} from './PatientEditForm.types';

const trimOrUndefined = (value?: string): string | undefined => {
	const trimmed = value?.trim();
	return trimmed || undefined;
};

const hasAddressValue = (address?: ISlotAddress | null): boolean =>
	Boolean(
		address &&
			(address.street?.trim() ||
				address.city?.trim() ||
				address.postcode?.trim() ||
				address.country?.trim())
	);

const DEFAULT_BILLING: PatientEditFormValues['billing'] = {
	category: 'standard',
	model: 'per_session',
	monthlyPrice: {
		amount: '',
		currency: 'EUR',
	},
	sessionPrice: {
		amount: '',
		currency: 'EUR',
	},
};

const normalizeBilling = (
	billing?: IPatientBilling | null
): PatientEditFormValues['billing'] => ({
	category: billing?.category ?? DEFAULT_BILLING.category,
	model: billing?.model ?? DEFAULT_BILLING.model,
	monthlyPrice: {
		amount: billing?.monthlyPrice?.amount ?? '',
		currency:
			billing?.monthlyPrice?.currency ?? DEFAULT_BILLING.monthlyPrice.currency,
	},
	sessionPrice: {
		amount: billing?.sessionPrice?.amount ?? '',
		currency:
			billing?.sessionPrice?.currency ?? DEFAULT_BILLING.sessionPrice.currency,
	},
});

export const mapPatientToEditFormValues = (
	patient: IPatient
): PatientEditFormValues => {
	const whatsapp = patient.contacts?.whatsapp ?? '';
	const phone = patient.contacts?.phone ?? '';

	return {
		address: patient.address ?? {
			city: '',
			country: '',
			postcode: '',
			street: '',
		},
		countryCode: '',
		email: patient.contacts?.email ?? '',
		firstName: patient.firstName ?? '',
		hasWhatsApp: Boolean(whatsapp),
		isPhoneWpp: Boolean(whatsapp && phone && whatsapp === phone),
		lastName: patient.lastName ?? '',
		phone,
		billing: normalizeBilling(patient.billing),
		preferredContact: patient.preferredContact ?? undefined,
		timeZone: patient.timeZone ?? '',
		whatsapp,
	};
};

const getPreferredContact = (
	values: PatientEditFormValues,
	whatsapp?: string
): IPreferredContact | undefined => {
	const type = values.preferredContact?.type;
	if (!type) return undefined;

	if (type === 'phone') {
		const phone = trimOrUndefined(values.phone);
		return phone ? { type, value: phone } : undefined;
	}

	if (type === 'whatsapp') {
		return whatsapp ? { type, value: whatsapp } : undefined;
	}

	const value = trimOrUndefined(values.preferredContact?.value);
	return value ? { type, value } : undefined;
};

export const mapPatientEditFormToPayload = (
	values: PatientEditFormValues
): PatientEditPayload => {
	const phone = trimOrUndefined(values.phone);
	const whatsapp = values.hasWhatsApp
		? values.isPhoneWpp
			? phone
			: trimOrUndefined(values.whatsapp)
		: '';
	const address = hasAddressValue(values.address)
		? {
				city: trimOrUndefined(values.address?.city) ?? '',
				country: trimOrUndefined(values.address?.country) ?? '',
				postcode: trimOrUndefined(values.address?.postcode) ?? '',
				street: trimOrUndefined(values.address?.street) ?? '',
			}
		: null;
	const billing = {
		category: values.billing.category,
		model: values.billing.model,
		monthlyPrice:
			values.billing.model === 'monthly'
				? {
						amount: Number(values.billing.monthlyPrice.amount ?? 0),
						currency: values.billing.monthlyPrice.currency.trim().toUpperCase(),
					}
				: null,
		sessionPrice:
			values.billing.model === 'per_session'
				? {
						amount: Number(values.billing.sessionPrice.amount ?? 0),
						currency: values.billing.sessionPrice.currency.trim().toUpperCase(),
					}
				: null,
	};

	return {
		address,
		billing,
		email: trimOrUndefined(values.email),
		firstName: values.firstName.trim(),
		lastName: values.lastName.trim(),
		phone: phone ?? '',
		preferredContact: getPreferredContact(values, whatsapp) ?? null,
		timeZone: trimOrUndefined(values.timeZone),
		whatsapp: whatsapp ?? '',
	};
};
