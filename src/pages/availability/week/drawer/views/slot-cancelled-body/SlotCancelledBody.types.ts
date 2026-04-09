import type { ISlotSessionSectionProps } from '../slot-session-section/SlotSessionSection.types';

export interface ISlotCancelledBodyProps {
	canceledAt?: string;
	customReason?: string;
	reasonCode?: number;
	sessionDetails: ISlotSessionSectionProps;
}
