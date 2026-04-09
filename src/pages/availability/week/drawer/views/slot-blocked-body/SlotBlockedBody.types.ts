import type { ISlotSessionSectionProps } from '../slot-session-section/SlotSessionSection.types';

export interface ISlotBlockedBodyProps {
	blockReason?: string;
	blockedAt?: string;
	sessionDetails: ISlotSessionSectionProps;
}
