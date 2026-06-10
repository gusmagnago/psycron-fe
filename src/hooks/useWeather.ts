import { useEffect, useState } from 'react';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent, type PostHogEventProps } from '@psycron/analytics/posthog/types';
import { getCurrentWeather } from '@psycron/api/utils';
import type { WeatherProvider } from '@psycron/api/utils/index.types';
import type { WeatherType } from '@psycron/components/dashboard/lummi-hero/LummiHero.types';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import type { IClinicAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type WeatherStatus = 'fallback' | 'loading' | 'ready';

type WeatherResolvedProps =
	PostHogEventProps[PostHogEvent.DashboardWeatherResolved];

interface WeatherState {
	description?: string;
	iconBaseUri?: string;
	provider: WeatherProvider;
	status: WeatherStatus;
	temperatureCelsius?: number;
	type: WeatherType;
}

const DEFAULT_WEATHER: WeatherState = {
	provider: 'fallback',
	status: 'fallback',
	type: 'clear',
};

const hasClinicAddress = (address?: IClinicAddress): address is IClinicAddress => {
	if (!address) return false;

	return Boolean(
		address.street.trim() ||
			address.city.trim() ||
			address.postcode.trim() ||
			address.country.trim()
	);
};

export const useWeather = (): WeatherState => {
	const { user } = useAuth();
	const [weather, setWeather] = useState<WeatherState>({
		...DEFAULT_WEATHER,
		status: 'loading',
	});

	useEffect(() => {
		let isActive = true;
		const clinicAddress = user?.clinicAddress;

		const applyWeather = (
			nextWeather: WeatherState,
			eventPayload: WeatherResolvedProps
		): void => {
			if (!isActive) return;
			setWeather(nextWeather);
			capture(PostHogEvent.DashboardWeatherResolved, eventPayload);
		};

		const applyFallback = (source: WeatherResolvedProps['source']): void => {
			applyWeather(DEFAULT_WEATHER, {
				provider: 'fallback',
				source,
				status: 'fallback',
				weather_type: 'clear',
			});
		};

		const resolveWeather = async (): Promise<void> => {
			// Weather is resolved only from the therapist's saved clinic address.
			// We never trigger navigator.geolocation here: an unsolicited browser
			// location prompt on dashboard load erodes trust. Address-less therapists
			// fall back to default weather until an explicit "use my location"
			// affordance exists (review FE #101, finding 9).
			if (!hasClinicAddress(clinicAddress)) {
				applyFallback('no-clinic-address');
				return;
			}

			try {
				const data = await getCurrentWeather({
					address: clinicAddress,
				});

				const nextWeather = {
					description: data.description,
					iconBaseUri: data.iconBaseUri,
					provider: data.provider,
					status: data.provider === 'fallback' ? 'fallback' : 'ready',
					temperatureCelsius: data.temperatureCelsius,
					type: data.type,
				} satisfies WeatherState;

				applyWeather(nextWeather, {
					provider: data.provider,
					source: 'clinic-address',
					status: nextWeather.status,
					weather_type: data.type,
				});
			} catch {
				applyFallback('request-failed');
			}
		};

		void resolveWeather();

		return () => {
			isActive = false;
		};
	}, [user?.clinicAddress]);

	return weather;
};
