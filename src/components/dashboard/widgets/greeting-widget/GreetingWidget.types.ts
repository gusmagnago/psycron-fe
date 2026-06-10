import type { JupiterInsight } from '@psycron/components/dashboard/widgets/jupiter-insights-widget/JupiterInsightsWidget.types';
import type { TimeOfDayBand } from '@psycron/hooks/useTimeOfDay';

export interface GreetingJupiterPanelProps {
	insights: JupiterInsight[];
	isLoading?: boolean;
}

export interface GreetingWidgetProps {
	band: TimeOfDayBand;
	insights: JupiterInsight[];
	isLoading?: boolean;
	name: string;
	sessionCount?: number;
}
