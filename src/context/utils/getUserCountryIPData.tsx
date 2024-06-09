import { IP_GEO_KEY, IP_GEO_URL } from '@psycron/utils/variables';

import type { CountryDataFull } from '../CountryContext.types';

export const getUserCountryIPData = async (): Promise<CountryDataFull | null> => {
	try {
		const response = await fetch(`${IP_GEO_URL}?apiKey=${IP_GEO_KEY}`);
		const data = await response.json();
		return {
			ip: data.ip,
			countryCode2: data.country_code2,
			countryCode3: data.country_code3,
			countryName: data.country_name,
			callingCode: data.calling_code,
			languages: data.languages,
			countryFlag: data.country_flag,
			countryEmoji: data.country_emoji,
			currency: data.currency,
			timeZone: data.time_zone,
		};
	} catch (error) {
		return null;
	}
};
