import type { ReactNode } from 'react';

import type { AvailabilityStatusTone } from './AvailabilityStatusStrip.types';

export interface AvailabilitySourceItem {
	badge: string;
	description: string;
	icon: ReactNode;
	id: string;
	title: string;
	tone: AvailabilityStatusTone;
}

export interface AvailabilitySourceListProps {
	items: AvailabilitySourceItem[];
	title: string;
}
