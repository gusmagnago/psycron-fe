import type { AvailabilitySourceItem } from './AvailabilitySourceList.types';
import type { AvailabilityStatusItem } from './AvailabilityStatusStrip.types';

export interface AvailabilityControlsPanelProps {
	activeDate: Date;
	jupiterDescription: string;
	jupiterLabel: string;
	jupiterSuggestion: string;
	jupiterToggleLabel: string;
	sourceItems: AvailabilitySourceItem[];
	sourcesTitle: string;
	statusItems: AvailabilityStatusItem[];
	statusTitle: string;
}
