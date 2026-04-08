import type { IDrawerDetail } from '../../AvailabilityWeekDrawer.types';

export interface ISlotBlockedBodyProps {
	blockReason?: string;
	blockedAt?: string;
	details: IDrawerDetail[];
}
