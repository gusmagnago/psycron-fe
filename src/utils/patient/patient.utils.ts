import type {
	IPatient,
	IPatientBilling,
	ISlotAddress,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';
import type { TFunction } from 'i18next';

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

export const formatPatientBillingAmount = (
	billing: IPatientBilling | null | undefined,
	locale: string,
	fallback?: string
): string | undefined => {
	const price =
		billing?.model === 'monthly' ? billing?.monthlyPrice : billing?.sessionPrice;

	if (typeof price?.amount !== 'number' || !price.currency) {
		return fallback;
	}

	try {
		return new Intl.NumberFormat(locale, {
			currency: price.currency,
			style: 'currency',
		}).format(price.amount);
	} catch {
		return `${price.amount} ${price.currency}`;
	}
};

export interface PatientBillingViewModel {
	amountLabel?: string;
	categoryLabel: string;
	isConfigured: boolean;
	modelLabel: string;
	summaryPrimary: string;
	summarySecondary?: string;
}

const getPatientBillingCategoryKey = (
	category: IPatientBilling['category']
): 'pro-bono' | 'social' | 'standard' =>
	category === 'pro_bono' ? 'pro-bono' : category;

export const getPatientBillingViewModel = (
	billing: IPatientBilling | null | undefined,
	locale: string,
	t: TFunction
): PatientBillingViewModel => {
	const emptyLabel = t('patients.list.billing.none');

	if (!billing) {
		return {
			categoryLabel: emptyLabel,
			isConfigured: false,
			modelLabel: emptyLabel,
			summaryPrimary: emptyLabel,
		};
	}

	const amountLabel = formatPatientBillingAmount(billing, locale, emptyLabel);
	const modelLabel = t(
		billing.model === 'monthly'
			? 'patients.profile.billing.models.monthly'
			: 'patients.profile.billing.models.per-session'
	);
	const categoryLabel = t(
		`patients.profile.billing.categories.${getPatientBillingCategoryKey(
			billing.category
		)}`
	);
	const modelSuffix = t(
		billing.model === 'monthly'
			? 'patients.list.billing.monthly-short'
			: 'patients.list.billing.per-session-short'
	);

	if (billing.category === 'standard') {
		return {
			amountLabel,
			categoryLabel,
			isConfigured: true,
			modelLabel,
			summaryPrimary:
				amountLabel && amountLabel !== emptyLabel
					? `${amountLabel} ${modelSuffix}`
					: categoryLabel,
		};
	}

	return {
		amountLabel,
		categoryLabel,
		isConfigured: true,
		modelLabel,
		summaryPrimary: categoryLabel,
		summarySecondary:
			billing.category === 'social' && amountLabel && amountLabel !== emptyLabel
				? `${amountLabel} ${modelSuffix}`
				: undefined,
	};
};
