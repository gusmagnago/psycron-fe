export type InsightTier = 'active' | 'growing' | 'onboarding';

export type InsightType =
	| 'billing-readiness'
	| 'blocked-admin-time'
	| 'busy-day-pattern'
	| 'dashboard-summary'
	| 'low-week-volume'
	| 'missed-rebooking'
	| 'no-patients-yet'
	| 'patient-milestone'
	| 'reminder-delivery-risk'
	| 'session-count-today'
	| 'setup-availability'
	| 'week-cancellations'
	| 'whatsapp-reminders-off';

export type InsightSource = 'ai' | 'cache' | 'fallback';

export interface JupiterInsight {
	actionLabel?: string;
	actionTarget?: string;
	category?: string;
	dismissible?: boolean;
	id: string;
	insightType?: InsightType;
	onAction?: () => void;
	onSecondaryAction?: () => void;
	secondaryActionLabel?: string;
	source?: InsightSource;
	text: string;
	tier?: InsightTier;
	title?: string;
}

export interface JupiterInsightsWidgetProps {
	compact?: boolean;
	insights: JupiterInsight[];
	isLoading?: boolean;
}
