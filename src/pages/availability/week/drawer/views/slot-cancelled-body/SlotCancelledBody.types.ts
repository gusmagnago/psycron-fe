import type { IDrawerDetail } from '../../AvailabilityWeekDrawer.types';

export interface ISlotCancelledBodyProps {
	canceledAt?: string;
	customReason?: string;
	details: IDrawerDetail[];
	reasonCode?: number;
}
