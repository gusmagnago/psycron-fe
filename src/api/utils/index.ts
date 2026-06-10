import apiClient from '@psycron/api/axios-instance';
import type {
	IClinicAddress,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

import type { CurrentWeatherResponse } from './index.types';

type WeatherLocationParams =
	| {
			lat: number;
			lng: number;
	  }
	| {
			address: IClinicAddress;
	  };

export const getCurrentWeather = async (
	location: WeatherLocationParams
): Promise<CurrentWeatherResponse> => {
	const params =
		'address' in location
			? {
					city: location.address.city,
					country: location.address.country,
					postcode: location.address.postcode,
					street: location.address.street,
			  }
			: {
					lat: location.lat,
					lng: location.lng,
			  };

	const response = await apiClient.get<CurrentWeatherResponse>(
		'/utils/weather/current',
		{
			params,
		}
	);

	return response.data;
};
