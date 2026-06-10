import type { WeatherType } from '@psycron/components/dashboard/lummi-hero/LummiHero.types';

export type WeatherProvider = 'fallback' | 'google-weather' | 'open-meteo';

export interface CurrentWeatherResponse {
	description?: string;
	iconBaseUri?: string;
	provider: WeatherProvider;
	temperatureCelsius?: number;
	type: WeatherType;
}
