import type { ReactNode } from 'react';

export type AvailabilityStatusTone = 'default' | 'google' | 'success' | 'warn';

export interface AvailabilityStatusItem {
	badge: string;
	description: string;
	icon: ReactNode;
	id: string;
	title: string;
	tone: AvailabilityStatusTone;
}

export interface AvailabilityStatusStripProps {
	items: AvailabilityStatusItem[];
	title: string;
}
