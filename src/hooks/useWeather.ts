import { useEffect, useState } from 'react';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { getCurrentWeather } from '@psycron/api/utils';
import type { WeatherProvider } from '@psycron/api/utils/index.types';
import type { WeatherType } from '@psycron/components/dashboard/lummi-hero/LummiHero.types';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import type { IClinicAddress } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type WeatherStatus = 'fallback' | 'loading' | 'ready';

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
			eventPayload: {
				provider: WeatherProvider;
				source: string;
				status: WeatherStatus;
				weather_type: WeatherType;
			}
		): void => {
			if (!isActive) return;
			setWeather(nextWeather);
			capture(PostHogEvent.DashboardWeatherResolved, eventPayload);
		};

		const resolveFromGeolocation = (): void => {
			if (!navigator.geolocation) {
				applyWeather(DEFAULT_WEATHER, {
					provider: 'fallback',
					source: 'geolocation-unavailable',
					status: 'fallback',
					weather_type: 'clear',
				});
				return;
			}

			navigator.geolocation.getCurrentPosition(
				async ({ coords }) => {
					try {
						const data = await getCurrentWeather({
							lat: coords.latitude,
							lng: coords.longitude,
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
							source: 'browser-geolocation',
							status: nextWeather.status,
							weather_type: data.type,
						});
					} catch {
						applyWeather(DEFAULT_WEATHER, {
							provider: 'fallback',
							source: 'request-failed',
							status: 'fallback',
							weather_type: 'clear',
						});
					}
				},
				() => {
					applyWeather(DEFAULT_WEATHER, {
						provider: 'fallback',
						source: 'geolocation-denied',
						status: 'fallback',
						weather_type: 'clear',
					});
				},
				{ maximumAge: 5 * 60 * 1000, timeout: 5000 }
			);
		};

		const resolveWeather = async (): Promise<void> => {
			if (hasClinicAddress(clinicAddress)) {
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
					return;
				} catch {
					resolveFromGeolocation();
					return;
				}
			}

			resolveFromGeolocation();
		};

		void resolveWeather();

		return () => {
			isActive = false;
		};
	}, [user?.clinicAddress]);

	return weather;
};
