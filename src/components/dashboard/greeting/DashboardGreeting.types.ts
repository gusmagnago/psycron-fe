import type { TimeOfDayBand } from '@psycron/hooks/useTimeOfDay';

import type { LummiHeroImageConfig } from '../lummi-hero/LummiHero.types';

export interface DashboardGreetingProps {
	band: TimeOfDayBand;
	imageConfig?: LummiHeroImageConfig;
	name: string;
}
