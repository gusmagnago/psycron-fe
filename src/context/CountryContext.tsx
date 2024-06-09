import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { getUserCountryIPData } from './utils/getUserCountryIPData';
import type {
	CountryDataFull,
	CountryDataSimple,
	UserGeoLocationContextType,
} from './CountryContext.types';

const DEFAULT_COUNTRY_DATA_SIMPLE: CountryDataSimple = {
	countryEmoji: './psycron-icon.svg',
	callingCode: null,
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
