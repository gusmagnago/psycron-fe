import type { IWeekSlot } from './AvailabilityWeekPage.mock';

export interface IAvailabilityWeekDrawerProps {
	onClose: () => void;
	slot: IWeekSlot;
}
