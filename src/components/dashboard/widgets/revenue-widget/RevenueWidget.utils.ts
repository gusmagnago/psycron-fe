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

export const getRevenueDeltaTone = (
	deltaPercent: number | null | undefined
): 'neutral' | 'success' | 'warning' => {
	if (deltaPercent === undefined || deltaPercent === null || deltaPercent === 0) {
		return 'neutral';
	}
	return deltaPercent > 0 ? 'success' : 'warning';
};

export const formatRevenueDelta = (
	deltaPercent: number | null | undefined
): string | undefined => {
	if (deltaPercent === undefined || deltaPercent === null) return undefined;
	const sign = deltaPercent > 0 ? '+' : '';
	return `${sign}${deltaPercent}%`;
};
