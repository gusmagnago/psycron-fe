import type { AvailabilityStatusItem } from './AvailabilityStatusStrip.types';

export interface AvailabilityReadinessPanelProps {
	activeDate: Date;
	checklistTitle: string;
	googleChecklistLabel: string;
	hasGoogleConnected: boolean;
	hasSlots: boolean;
	jupiterDescription: string;
	jupiterLabel: string;
	jupiterSuggestion: string;
	jupiterToggleLabel: string;
	slotChecklistLabel: string;
	statusItems: AvailabilityStatusItem[];
	statusTitle: string;
}
