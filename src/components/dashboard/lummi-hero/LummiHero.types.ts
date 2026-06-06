import type { TimeOfDayBand } from '@psycron/hooks/useTimeOfDay';

export type WeatherType = 'clear' | 'cloudy' | 'rain';

export interface LummiHeroImageConfig {
	afternoon?: string;
	evening?: string;
	morning?: string;
}

export interface LummiHeroProps {
	band: TimeOfDayBand;
	imageConfig?: LummiHeroImageConfig;
	size?: number;
	weather?: WeatherType;
}
