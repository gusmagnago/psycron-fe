export type InsightTier = 'active' | 'growing' | 'onboarding';

export type InsightType =
	| 'busy-day-pattern'
	| 'low-week-volume'
	| 'missed-rebooking'
	| 'no-patients-yet'
	| 'patient-milestone'
	| 'session-count-today'
	| 'setup-availability'
	| 'week-cancellations'
	| 'whatsapp-reminders-off';

export interface JupiterInsight {
	actionLabel?: string;
	category?: string;
	dismissible?: boolean;
	id: string;
	insightType?: InsightType;
	onAction?: () => void;
	onSecondaryAction?: () => void;
	secondaryActionLabel?: string;
	text: string;
	tier?: InsightTier;
	title?: string;
}

export interface JupiterInsightsWidgetProps {
	insights: JupiterInsight[];
	isLoading?: boolean;
}
