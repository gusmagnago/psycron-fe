export const formatRevenueCurrency = (
	amount: number,
	currency: string,
	locale: string
): string => {
	try {
		return new Intl.NumberFormat(locale, {
			currency,
			maximumFractionDigits: 0,
			style: 'currency',
		}).format(amount);
	} catch {
		return `${amount.toLocaleString(locale)} ${currency}`;
	}
};
