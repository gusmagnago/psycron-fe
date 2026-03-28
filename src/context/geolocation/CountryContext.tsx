import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { getCountryFromTimezone } from '../utils/getCountryFromTimezone';
import { getUserCountryIPData } from '../utils/getUserCountryIPData';

import type {
	CountryDataFull,
	CountryDataSimple,
	UserGeoLocationContextType,
} from './CountryContext.types';

const DEFAULT_COUNTRY_DATA_SIMPLE: CountryDataSimple = {
	countryEmoji: './psycron-icon.svg',
	callingCode: null,
	countryCode2: null,
};

export const UserGeoLocationContext = createContext<UserGeoLocationContextType>(
	{
		countryData: DEFAULT_COUNTRY_DATA_SIMPLE,
	}
);

export const UserGeoLocationProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [countryData, setCountryData] = useState<
		CountryDataFull | CountryDataSimple
	>(DEFAULT_COUNTRY_DATA_SIMPLE);

	useEffect(() => {
		const fetchUserIPData = async () => {
			const userIPData = await getUserCountryIPData();

			if (userIPData) {
				setCountryData(userIPData);
			} else {
				const countryCode2 = getCountryFromTimezone();
				if (countryCode2) {
					setCountryData({ ...DEFAULT_COUNTRY_DATA_SIMPLE, countryCode2 });
				}
			}
		};

		fetchUserIPData();
	}, []);

	return (
		<UserGeoLocationContext.Provider value={{ countryData }}>
			{children}
		</UserGeoLocationContext.Provider>
	);
};

export const useUserGeolocation = (): UserGeoLocationContextType => {
	const context = useContext(UserGeoLocationContext);
	if (context === undefined) {
		throw new Error('useCountry must be within a CountryProvider');
	}
	return context;
};
