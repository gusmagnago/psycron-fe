import type { ReactNode } from 'react';

import type { IWeekSlot } from '../AvailabilityWeekPage.mock';

export interface IAvailabilityWeekDrawerProps {
	onClose: () => void;
	slot: IWeekSlot;
}

export interface IDrawerDetail {
	icon: ReactNode;
	key: string;
	label: string;
	sub?: string;
	value: string;
}
