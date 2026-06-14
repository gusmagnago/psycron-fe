import type { ISlotSessionSectionProps } from '../slot-session-section/SlotSessionSection.types';

export interface ISlotBusyBodyProps {
	// The Google event title for this busy block, when one is present. Personal
	// commitments often carry no title (free/busy only), so this is optional.
	commitmentTitle?: string | null;
	sessionDetails: ISlotSessionSectionProps;
}
