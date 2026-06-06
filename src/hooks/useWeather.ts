import { useEffect, useState } from 'react';
import type { WeatherType } from '@psycron/components/dashboard/lummi-hero/LummiHero.types';

// WMO weather codes → our three display states
// 0–1: clear sky / mainly clear
// 2–3, 45, 48: partly/overcast, fog
// 51+: drizzle, rain, showers, thunderstorm, snow
const toWeatherType = (code: number): WeatherType => {
	if (code <= 1) return 'clear';
	if (code <= 3 || code === 45 || code === 48) return 'cloudy';
	return 'rain';
};

interface OpenMeteoResponse {
	current_weather: {
		weathercode: number;
	};
}

export const useWeather = (): WeatherType => {
	const [weather, setWeather] = useState<WeatherType>('clear');

	useEffect(() => {
		if (!navigator.geolocation) return;

		navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				try {
					const res = await fetch(
						`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`
					);
					if (!res.ok) return;
					const data: OpenMeteoResponse = await res.json();
					setWeather(toWeatherType(data.current_weather.weathercode));
				} catch {
					// network failure — keep default 'clear'
				}
			},
			() => {
				// geolocation denied — keep default 'clear'
			},
			{ maximumAge: 5 * 60 * 1000, timeout: 5000 }
		);
	}, []);

	return weather;
};
